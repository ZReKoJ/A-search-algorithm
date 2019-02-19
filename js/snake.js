"use strict"

class Snake {
    constructor(scene, coord) {
        this.scene = scene;
        this.snake = [];

        let head = this.newBody();

        let plane = this.scene.getObjectByName("ground");

        head.position.set(
            -plane.geometry.parameters.width / 2 + 0.5,
            plane.geometry.parameters.height / 2 - 0.5,
            0.5
        );

        head.position.x += coord.j;
        head.position.y -= coord.i;

        this.snake.push(head);

        this.render(head);
    }

    newBody() {
        return new THREE.Mesh(
            new THREE.SphereGeometry(0.5, 32, 32),
            new THREE.MeshBasicMaterial({
                color: 0x00fff0
            }));
    }

    render(cube) {
        this.scene.add(cube);
    }

    movement(coord, add = false) {

        let newPosition = {
            x: this.snake[0].position.x,
            y: this.snake[0].position.y,
            z: this.snake[0].position.z
        };

        newPosition.y -= coord.i;
        newPosition.x += coord.j;

        let body;
        if (add) {
            body = this.newBody();
            this.render(body);
        } else {
            body = this.snake.splice(this.snake.length - 1, 1);
        }

        body.position.set(
            newPosition.x,
            newPosition.y,
            newPosition.z
        );

        this.snake.unshift(body);

        this.check();
    }

    destruct() {
        this.snake.forEach(body => {
            this.scene.remove(body);
        });
    }

    check(object) {
        let head = this.snake[0];
        let index = this.snake.findIndex(body => {
            return (
                head.id != body.id &&
                head.position.x == body.position.x &&
                head.position.y == body.position.y &&
                head.position.z == body.position.z
            ) || (
                object &&
                object.position.x == body.position.x &&
                object.position.y == body.position.y &&
                object.position.z == body.position.z
            );
        });
        if (index > -1) {
            if (index == 0) {
                index++;
            }
            this.snake.splice(index).forEach(body => {
                this.scene.remove(body);
            });
        }
    }
}