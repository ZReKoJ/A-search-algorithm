'use strict'

class ASearchAlgorithm {
    constructor(width, height) {
        this.map = createArray(width, height).map(row => row.fill(0));
    }

    print() {
        console.log(
            this.map.map(row =>
                "|" + row.map(data => {
                    switch (data) {
                        case 0: return " ";
                        default: return data;
                    }
                }).join("|") + "|"
            ).join("\n")
        );
    }
}