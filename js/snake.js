"use strict"

class Snake {
    constructor(scene, coord) {
        this.scene = scene;
        this.snake = [];

        let head = this.newBody();

        head.name = String("snake " + this.snake.length);

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

    addBody(position) {
        let body = this.newBody();

        body.name = String("snake " + this.snake.length);

        body.position.set(
            position.x,
            position.y,
            position.z
        );
        
        this.snake.push(body);

        this.render(body);
    }

    render(cube) {
        this.scene.add(cube);
    }

    movement(coord, add = false) {
        let newPosition = this.snake[0].position,
            aux;

        newPosition.y -= coord.i;
        newPosition.x += coord.j;

        this.snake.forEach(cube => {
            aux = cube.position;
            cube.position.set(
                newPosition.x,
                newPosition.y,
                newPosition.z
            );
            newPosition = aux;
        });

        if (add) {
            this.addBody(aux);
        }
    }
}