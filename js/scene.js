'use strict'

class Scene {
    constructor() {}

    cameraViewUp(relation = 10) {
        this.camera.rotation.x += Math.PI * CONFIG.CAMERA_LOOK_AT_RELATION * relation;
    }

    cameraViewDown(relation = 10) {
        this.camera.rotation.x -= Math.PI * CONFIG.CAMERA_LOOK_AT_RELATION * relation;
    }

    cameraViewRight(relation = 10) {
        this.camera.rotation.y -= Math.PI * CONFIG.CAMERA_LOOK_AT_RELATION * relation;
    }

    cameraViewLeft(relation = 10) {
        this.camera.rotation.y += Math.PI * CONFIG.CAMERA_LOOK_AT_RELATION * relation;
    }

    cameraRotateRight(relation = 10) {
        this.camera.rotation.z += Math.PI * CONFIG.CAMERA_LOOK_AT_RELATION * relation;
    }

    cameraRotateLeft(relation = 10) {
        this.camera.rotation.z -= Math.PI * CONFIG.CAMERA_LOOK_AT_RELATION * relation;
    }

    cameraForwards() {
        this.camera.position.x -= Math.sin(this.camera.rotation.y) * CONFIG.MOUSE_SCROLL_RELATION;
        this.camera.position.y += Math.sin(this.camera.rotation.x) * CONFIG.MOUSE_SCROLL_RELATION;
        this.camera.position.z -= Math.cos(this.camera.rotation.x) * Math.cos(this.camera.rotation.y) * CONFIG.MOUSE_SCROLL_RELATION;
    }

    cameraBackwards() {
        this.camera.position.x += Math.sin(this.camera.rotation.y) * CONFIG.MOUSE_SCROLL_RELATION;
        this.camera.position.y -= Math.sin(this.camera.rotation.x) * CONFIG.MOUSE_SCROLL_RELATION;
        this.camera.position.z += Math.cos(this.camera.rotation.x) * Math.cos(this.camera.rotation.y) * CONFIG.MOUSE_SCROLL_RELATION;
    }

    cameraToUp(relation = 10) {
        // only if i need to
    }

    cameraToDown(relation = 10) {
        // only if i need to
    }

    cameraToRight(relation = 10) {
        // only if i need to
    }

    cameraToLeft(relation = 10) {
        // only if i need to
    }

    init(canvas) {
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer({
            canvas: canvas
        });
        this.raycaster = new THREE.Raycaster();

        this.width = 0;
        this.height = 0;

        this.running = false;

        return this;
    }

    resize(width, height) {
        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(width, height);
    }

    setCameraMode(mode = CONFIG.CAMERA.MODE.GOD) {
        switch (mode) {
            case CONFIG.CAMERA.MODE.GOD:
                this.camera.position.set(0, 0, this.height);
                this.camera.lookAt(new THREE.Vector3(0, 0, 0));
                break;
            case CONFIG.CAMERA.MODE.PERSPECTIVE:
                this.camera.position.set(0, -this.height, this.height / 2);
                this.camera.lookAt(new THREE.Vector3(0, 0, 0));
                break;
        }

        this.cameraForwards();
        this.cameraBackwards();

        return this;
    }

    animate() {
        this.renderer.render(this.scene, this.camera);
    }

    setPlane(width, height) {
        this.width = width;
        this.height = height;

        let geometry = new THREE.PlaneGeometry(
            this.width,
            this.height,
            this.width,
            this.height
        );

        let materials = [
            new THREE.MeshBasicMaterial({
                color: 0x000000
            }),
            new THREE.MeshBasicMaterial({
                color: 0xffffff
            })
        ];

        for (let i = 0; i < this.height; i++) {
            for (let j = 0; j < this.width; j++) {
                let index = (i * this.width + j) * 2;
                geometry.faces[index].materialIndex = geometry.faces[index + 1].materialIndex = (i + j) % 2;
            }
        }

        let self = this;

        this.plane = new THREE.Mesh(geometry, materials);
        this.plane.name = "ground";
        this.plane.clickListener = function (point) {
            // the left top box is the coord 0, 0
            // x -> column y -> row
            point.x += this.geometry.parameters.width / 2;
            point.y *= -1;
            point.y += this.geometry.parameters.height / 2;
            point.x = point.x | 0;
            point.y = point.y | 0;

            self.addObject(point.y, point.x);
        };

        this.scene.add(this.plane);

        return this;
    }

    addObject(i, j, name = String(CONFIG.ICON.STATE)) {
        if (name != CONFIG.ICON.NONE) {

            let object = new THREE.Mesh(
                meshFactory.getGeometry(name),
                meshFactory.getMaterial(name)
            );
            object.name = name;

            object.position.set(
                -this.plane.geometry.parameters.width / 2 + 0.5,
                this.plane.geometry.parameters.height / 2 - 0.5,
                0.5
            );

            object.position.x += j;
            object.position.y -= i;

            let self = this;

            object.clickListener = function (point) {
                this.name = CONFIG.ICON.STATE;

                if (this.name != CONFIG.ICON.NONE) {
                    this.material = meshFactory.getMaterial(this.name);
                } else {
                    self.scene.remove(this);
                }
            };
            object.planePosition = new Coordinate(i, j);

            this.scene.add(object);
        }

        return this;
    }

    resetScene() {
        while (this.scene.children.length > 0) {
            this.scene.remove(this.scene.children[0]);
        }
        return this;
    }

    run() {
        let data = {
            avatars: [],
            blocks: [],
            routes: []
        }

        let snake = [];

        this.scene.children.forEach(object => {
            switch (object.name) {
                case CONFIG.ICON.AVATAR:
                    data.avatars.push(object.planePosition);
                    break;
                case CONFIG.ICON.BLOCK:
                    data.blocks.push(object.planePosition);
                    break;
                case CONFIG.ICON.FLAG:
                    data.routes.push(object.planePosition);
                    break;
                case "snakeBody":
                    snake.push(object);
                    break;
            }
        });

        snake.forEach(element => {
            this.scene.remove(element);
        });

        let terrain = new Terrain(this.width, this.height);
        terrain.setData(data);
        terrain.prepare();
        let movements = terrain.movement();

        console.log(movements);

        let count = 0;
        let interval = setInterval(() => {
            if (count < movements.length) {
                this.addObject(movements[count].i, movements[count].j, "snakeBody");
                count++;
            } else {
                clearInterval(interval);
            }
        }, 1000);
    }

    stop() {}

    canvasClickedOn(coord) {

        let mouse = new THREE.Vector2(coord.i, coord.j);

        this.raycaster.setFromCamera(mouse, this.camera);
        let intersects = this.raycaster.intersectObjects(this.scene.children);

        if (intersects.length > 0) {
            intersects[0].object.clickListener(intersects[0].point);
        }
    }
}