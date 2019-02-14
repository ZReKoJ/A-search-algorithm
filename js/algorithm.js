'use strict'

class ASearchAlgorithm {
    constructor(height, width) {
        this.VALUES = Object.freeze({
            EMPTY: 0,
            BLOCK: 1
        });

        this.init(height, width);
    }

    init(height, width) {
        this.width = width;
        this.height = height;
        this.map = createArray(height, width).map(row => row.fill(this.VALUES.EMPTY));
    }

    setBlock(i, j) {
        if (0 <= i && i < this.height && 0 <= j && j < this.width) {
            this.map[i][j] = this.VALUES.BLOCK;
        }
    }

    print() {
        setInterval(() => {
            console.log(
                this.map.map(row =>
                    "|" + row.map(data => {
                        switch (data) {
                            case this.VALUES.EMPTY: return " ";
                            case this.VALUES.BLOCK: return "X";
                            default: return data;
                        }
                    }).join("|") + "|"
                ).join("\n")
            );
        }, 1000);
    }
}