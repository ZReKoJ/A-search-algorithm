'use strict'

class Coordinate {
    constructor(i, j) {
        this.i = i;
        this.j = j;
    }

    isEqual(that) {
        return this.i == that.i && this.j == that.j;
    }
}

class Terrain {
    constructor(height, width) {
        this.VALUES = Object.freeze({
            BLOCK: -1,
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
    }

    updateMap() {
        this.map.map(row => row.fill(this.VALUES.EMPTY));
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
        if (this.avatar && coord.isEqual(this.avatar)) {
            this.avatar = undefined;
        }
    }

    addBlock(i, j) {
        if (0 <= i && i < this.height && 0 <= j && j < this.width) {
            this.blocks.push(new Coordinate(i, j));
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
        }
        return coord;
    }

    movement() {
        if (!this.avatar) {
            throw new Error(messages.error.noAvatarSet);
        }
        if (this.routes.length < 1) {
            throw new Error(messages.error.noGoalsSet);
        }
        this.updateMap();
        this.print();
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
                        case this.VALUES.START:
                            return "S";
                        case this.VALUES.END:
                            return "E";
                        default:
                            return data;
                    }
                }).join("|") + "|"
            ).join("\n") +
            "\n" +
            "avatar : " + ((this.avatar) ? "[" + this.avatar.i + ", " + this.avatar.j + "]" : "") + "\n" +
            "blocks : " + this.blocks.map(block => "[" + block.i + ", " + block.j + "]").join(", ") + "\n" +
            "routes : " + this.routes.map(route => "[" + route.i + ", " + route.j + "]").join(", ") + "\n"
        );
    }
}