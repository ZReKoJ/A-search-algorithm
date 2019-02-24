'use strict'

class MeshFactory {
    constructor() {
        this.geometry = {
            avatar: function () {
                return new THREE.BoxGeometry(1, 1, 1);
            },
            block: function () {
                return new THREE.BoxGeometry(1, 1, 1);
            },
            flag: function () {
                return new THREE.BoxGeometry(1, 1, 1);
            },
            snakeBody: function () {
                return new THREE.SphereGeometry(0.5, 32, 32);
            }
        };

        this.material = {
            avatar: function () {
                return new THREE.MeshBasicMaterial({
                    color: 0x00ff00
                });
            },
            block: function () {
                return new THREE.MeshBasicMaterial({
                    color: 0xffff00
                });
            },
            flag: function () {
                return new THREE.MeshBasicMaterial({
                    color: 0xff0000
                });
            },
            snakeBody: function () {
                return new THREE.MeshBasicMaterial({
                    color: 0x00fff0
                });
            }
        };
    }

    getGeometry(name) {
        return this.geometry[name]();
    }

    getMaterial(name) {
        return this.material[name]();
    }
}