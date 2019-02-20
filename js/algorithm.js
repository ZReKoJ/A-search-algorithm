'use strict'

class Coordinate {
    constructor(i, j) {
        this.i = i;
        this.j = j;
    }

    isEqual(that) {
        return this.i == that.i && this.j == that.j;
    }

    distanceTo(that) {
        return Math.sqrt(
            ((this.i - that.i) * (this.i - that.i)) +
            ((this.j - that.j) * (this.j - that.j))
        )
    }

    toString() {
        return String("[" + this.i + ", " + this.j + "]")
    }

    range(from, to) {
        return (
            from.i <= this.i &&
            this.i <= to.i &&
            from.j <= this.j &&
            this.j <= to.j
        );
    }

    surrounding() {
        return [
            new Coordinate(this.i - 1, this.j + 1),
            new Coordinate(this.i, this.j + 1),
            new Coordinate(this.i + 1, this.j + 1),
            new Coordinate(this.i + 1, this.j),
            new Coordinate(this.i + 1, this.j - 1),
            new Coordinate(this.i, this.j - 1),
            new Coordinate(this.i - 1, this.j - 1),
            new Coordinate(this.i - 1, this.j)
        ]
    }
}

class Node {
    constructor(coord) {
        this.coord = coord;

        this.parentNode = undefined;
        this.childrenNodes = [];
        this.goalNode = undefined;

        this.g = 0;
        this.h = undefined;
        this.f = undefined;
    }

    addParent(parent) {
        if (parent) {
            this.parentNode = parent;
            this.parentNode.addChild(this);
            this.g = Number(this.coord.distanceTo(this.parentNode.coord) + this.parentNode.g);
        } else {
            this.g = 0;
        }
        return this;
    }

    removeParent() {
        if (this.parentNode) {
            this.parentNode.removeChild(this);
            this.parentNode = undefined;
            this.g = 0;
        }
        return this;
    }

    addChild(child) {
        this.childrenNodes.push(child);
    }

    removeChild(child) {
        let index = this.childrenNodes.findIndex(element => element.isEqual(child));
        if (index > -1) {
            this.childrenNodes.splice(index, 1);
        }
    }

    goal(coord) {
        if (coord) {
            this.goalNode = coord;
        }
        if (this.goalNode) {
            this.h = Number(this.coord.distanceTo(this.goalNode));
            this.f = Number(this.g + this.h);
        }
        return this;
    }

    update() {
        this.addParent(this.parentNode);
        this.goal(this.goalNode);
        this.childrenNodes.forEach(child => {
            child.update();
        });
    }

    isEqual(that) {
        return this.coord.isEqual(that.coord);
    }

    isLessThan(that) {
        if (this.f && that.f) {
            return this.f < that.f;
        } else {
            throw new Error(messages.error.undefined);
        }
    }

    toString() {
        return this.coord.toString() + "{" + this.g + ", " + this.h + ", " + this.f + "}";
    }

    surrounding() {
        return this.coord.surrounding().map(coord => new Node(coord));
    }
}

class Terrain {
    constructor(height, width) {
        this.VALUES = Object.freeze({
            BLOCK: -2,
            AVATAR: -1,
            EMPTY: 0
        });

        this.init(height, width);
    }

    init(height, width) {
        this.width = width;
        this.height = height;
        this.map = createArray(height, width).map(row => row.fill(this.VALUES.EMPTY));

        this.avatar = undefined;
        this.routes = [];
        this.blocks = [];

        this.open = [];
        this.closed = [];
    }

    updateMap() {
        if (!this.avatar) {
            throw new Error(messages.error.noAvatarSet);
        }

        this.map.map(row => row.fill(this.VALUES.EMPTY));
        this.map[this.avatar.i][this.avatar.j] = this.VALUES.AVATAR;
        this.routes.forEach((coord, index) => {
            this.map[coord.i][coord.j] = index + 1;
        });
        this.blocks.forEach(block => {
            this.map[block.i][block.j] = this.VALUES.BLOCK;
        });
    }

    remove(i, j) {
        let coord = new Coordinate(i, j);
        this.blocks = this.blocks.filter(block => !coord.isEqual(block));
        this.routes = this.routes.filter(route => !coord.isEqual(route));
        this.closed = this.closed.filter(closed => !(new Coordinate(coord).isEqual(closed)));
        if (this.avatar && coord.isEqual(this.avatar)) {
            this.avatar = undefined;
        }
    }

    addBlock(i, j) {
        if (0 <= i && i < this.height && 0 <= j && j < this.width) {
            let coord = new Coordinate(i, j);
            let index = this.blocks.findIndex(block => coord.isEqual(block));
            if (index == -1) {
                this.blocks.push(coord);
            }
            let node = new Node(coord);
            index = this.closed.findIndex(closed => node.isEqual(closed));
            if (index == -1) {
                this.closed.push(node);
            }
        }
    }

    addRoute(i, j) {
        if (0 <= i && i < this.height && 0 <= j && j < this.width) {
            this.routes.push(new Coordinate(i, j));
        }
    }

    setAvatar(i, j) {
        let coord = undefined;
        if (0 <= i && i < this.height && 0 <= j && j < this.width) {
            coord = this.avatar;
            this.avatar = new Coordinate(i, j);
            this.open = [new Node(this.avatar).addParent()];
        }
        return coord;
    }

    prepare() {
        if (this.routes.length > 0) {
            this.open.forEach(open => {
                open.goal(this.routes[0])
            });
            this.open.sort((a, b) => a.isLessThan(b) ? -1 : 1);
        }
    }

    movement() {
        if (this.routes.length < 1) {
            throw new Error(messages.error.noGoalsSet);
        }

        let solution = [this.avatar];

        while (this.routes.length > 0) {
            let node = this.open.splice(0, 1)[0];
            this.closed.push(node);
            this.avatar = node.coord;
            if (node.h > 0) {
                let surroundings = node.surrounding()
                    // in range
                    .filter(
                        element => element.coord.range(
                            new Coordinate(0, 0),
                            new Coordinate(this.height - 1, this.width - 1)
                        )
                    )
                    // not int closed list
                    .filter(
                        element => this.closed.findIndex(closed => element.isEqual(closed)) == -1
                    );
                surroundings.forEach(element => {
                    element.addParent(node).goal(this.routes[0]);
                    let index = this.open.findIndex(open => element.isEqual(open));
                    if (index > -1) {
                        if (element.isLessThan(this.open[index])) {
                            this.open[index]
                                .removeParent()
                                .addParent(node)
                                .goal(this.routes[0])
                                .update();
                            this.open = this.open.sort((a, b) => a.isLessThan(b) ? -1 : 1);
                        }
                    } else {
                        index = this.open.findIndex(open => element.isLessThan(open))
                        if (index > -1) {
                            this.open.splice(index, 0, element);
                        } else {
                            this.open.push(element);
                        }
                    }
                });
            } else {
                let route = [];
                while (node.parentNode) {
                    node = node.parentNode;
                    route.unshift(node.coord);
                }
                solution = solution.concat(route);
                this.routes.splice(0, 1);
                if (this.routes.length > 0) {
                    this.open = [
                        new Node(this.avatar)
                        .addParent()
                        .goal(this.routes[0])
                    ];
                    this.closed = this.blocks.map(block => new Node(block));
                }
            }
        }

        //this.updateMap();
        //this.print();

        return solution;
    }

    print() {
        console.log(
            this.map.map(row =>
                "|" + row.map(data => {
                    switch (data) {
                        case this.VALUES.EMPTY:
                            return " ";
                        case this.VALUES.BLOCK:
                            return "X";
                        case this.VALUES.AVATAR:
                            return "A";
                        default:
                            return data;
                    }
                }).join("|") + "|"
            ).join("\n") +
            "\n" +
            "avatar : " + ((this.avatar) ? this.avatar.toString() : "") + "\n" +
            "blocks : " + this.blocks.map(block => block.toString()).join(", ") + "\n" +
            "routes : " + this.routes.map(route => route.toString()).join(", ") + "\n" +
            "\n" +
            "open   : " + this.open.map(open => "\n" + open.toString()).join(", ") + "\n" +
            "closed  : " + this.closed.map(closed => "\n" + closed.toString()).join(", ") + "\n"
        );
    }
}