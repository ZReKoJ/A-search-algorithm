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

class ASearch {
    constructor(map) {
        this.map = map;
    }

    movement(start, end) {
        let coord = start;

        this.open = [
            new Node(coord)
            .addParent()
            .goal(end)
        ];
        this.closed = [];

        let solution = [];

        // Getting the first node from open list
        let node = this.open.shift();

        while (node.h > 0) {
            // Move the node to the closed list
            this.closed.push(node);
            // The new position
            this.coord = node.coord;
            // Testing if we have reached the goal
            let surroundings = node.surrounding()
                // In range
                .filter(
                    element => element.coord.range(
                        new Coordinate(0, 0),
                        new Coordinate(
                            this.map.height - 1,
                            this.map.width - 1,
                        )
                    )
                )
                // Not in blocks list
                .filter(
                    element => this.map.blocks.findIndex(
                        block => block.isEqual(element.coord)
                    ) == -1
                )
                // Not in closed list
                .filter(
                    element => this.closed.findIndex(
                        closed => closed.isEqual(element)
                    ) == -1
                )
            surroundings.forEach(element => {
                element
                    .addParent(node)
                    .goal(end);
                let index = this.open.findIndex(
                    open => open.isEqual(element)
                );
                if (index > -1) {
                    if (element.isLessThan(this.open[index])) {
                        this.open[index]
                            .removeParent()
                            .addParent(node)
                            .goal(end)
                            .update();
                        this.open.sort(
                            (a, b) => a.isLessThan(b) ? -1 : 1
                        );
                    }
                } else {
                    index = this.open.findIndex(
                        open => element.isLessThan(open)
                    );
                    if (index > -1) {
                        this.open.splice(index, 0, element);
                    } else {
                        this.open.push(element);
                    }
                }
            });
            node = this.open.shift();
        }

        solution.unshift(node.coord);
        while (node.parentNode) {
            node = node.parentNode;
            solution.unshift(node.coord);
        }

        return solution;
    }
}

class Algorithm {
    constructor(data) {
        this.width = data.width;
        this.height = data.height;

        this.VALUES = Object.freeze({
            BLOCK: -2,
            AVATAR: -1,
            EMPTY: 0
        });

        this.blocks = data.blocks;
        this.routes = data.routes;
        this.avatars = data.avatars;
        this.algorithms = this.avatars.map(avatar => new ASearch(this));

        this.map = createArray(this.height, this.width).map(row => row.fill(this.VALUES.EMPTY));
    }

    run() {
        let solution = new Array(this.algorithms.length).fill([]);

        let count = 0;

        while (count < this.routes.length) {

            let routes = this.algorithms.map(
                (algorithm, index) => algorithm.movement(
                    count == 0 ? this.avatars[index] : this.routes[count - 1],
                    this.routes[count]
                )
            );

            solution.forEach((route, index) => {
                route.splice(route.length - 1, 1);
                solution[index] = route.concat(routes[index]);
            });

            count++;
        }

        console.log(solution)

        return solution;
    }

    print() {
        this.map.map(row => row.fill(this.VALUES.EMPTY));
        this.avatars.forEach((avatar, index) => {
            this.map[avatar.coord.i][avatar.coord.j] = this.VALUES.AVATAR;
        });
        this.routes.forEach((route, index) => {
            this.map[route.i][route.j] = index + 1;
        });
        this.blocks.forEach(block => {
            this.map[block.i][block.j] = this.VALUES.BLOCK;
        });

        console.log(
            this.map.map(row =>
                "|" + row.map(data => {
                    switch (data) {
                        case this.VALUES.EMPTY:
                            return "   ";
                        case this.VALUES.BLOCK:
                            return " X ";
                        case this.VALUES.AVATAR:
                            return " A ";
                        default:
                            return (Number(Math.abs(data)) < 10 ? " " : "") +
                                (Number(data)) +
                                (Number(data) < 0 ? "" : " ");
                    }
                }).join("|") + "|"
            ).join("\n") +
            "\n" +
            "avatar : " + this.blocks.map(avatar => avatar.toString()).join(", ") + "\n" +
            "blocks : " + this.blocks.map(block => block.toString()).join(", ") + "\n" +
            "routes : " + this.routes.map(route => route.toString()).join(", ") + "\n"
        );
    }
}

class Terrain {
    constructor(width, height) {
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

    setData(data) {
        this.avatar = data.avatars[0].coord;
        this.blocks = data.blocks;
        this.routes = data.routes;
        this.open = [new Node(this.avatar).addParent()];
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

        let solution = [];

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
                route.unshift(node.coord);
                while (node.parentNode) {
                    node = node.parentNode;
                    route.unshift(node.coord);
                }
                solution.splice(solution.length - 1, 1);
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