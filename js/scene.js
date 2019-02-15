'use strict'

class Scene {
    constructor(div) {
        this.element = document.querySelector(div);

        new ResizeSensor(this.element, () => {
            this.resize();
        });

        this.init();
        this.listeners();

        this.cameraMovements = {
            viewUp: function (camera, relation = 10) {
                camera.rotation.x += Math.PI * CONFIG.CAMERA_LOOK_AT_RELATION * relation;
            },
            viewDown: function (camera, relation = 10) {
                camera.rotation.x -= Math.PI * CONFIG.CAMERA_LOOK_AT_RELATION * relation;
            },
            viewRight: function (camera, relation = 10) {
                camera.rotation.y -= Math.PI * CONFIG.CAMERA_LOOK_AT_RELATION * relation;
            },
            viewLeft: function (camera, relation = 10) {
                camera.rotation.y += Math.PI * CONFIG.CAMERA_LOOK_AT_RELATION * relation;
            },
            rotateRight: function (camera, relation = 10) {
                camera.rotation.z += Math.PI * CONFIG.CAMERA_LOOK_AT_RELATION * relation;
            },
            rotateLeft: function (camera, relation = 10) {
                camera.rotation.z -= Math.PI * CONFIG.CAMERA_LOOK_AT_RELATION * relation;
            },
            forwards: function (camera) {
                camera.position.x -= Math.sin(camera.rotation.y) * CONFIG.MOUSE_SCROLL_RELATION;
                camera.position.y += Math.sin(camera.rotation.x) * CONFIG.MOUSE_SCROLL_RELATION;
                camera.position.z -= Math.cos(camera.rotation.x) * Math.cos(camera.rotation.y) * CONFIG.MOUSE_SCROLL_RELATION;
            },
            backwards: function (camera) {
                camera.position.x += Math.sin(camera.rotation.y) * CONFIG.MOUSE_SCROLL_RELATION;
                camera.position.y -= Math.sin(camera.rotation.x) * CONFIG.MOUSE_SCROLL_RELATION;
                camera.position.z += Math.cos(camera.rotation.x) * Math.cos(camera.rotation.y) * CONFIG.MOUSE_SCROLL_RELATION;
            },
            toUp: function (camera, relation = 10) {
                // only if i need to
            },
            toDown: function (camera, relation = 10) {
                // only if i need to
            },
            toRight: function (camera, relation = 10) {
                // only if i need to
            },
            toLeft: function (camera, relation = 10) {
                // only if i need to
            }
        }
    }

    animate() {
        this.renderer.render(this.scene, this.camera);
    }

    resize() {
        let measures = this.element.getBoundingClientRect();
        this.camera.aspect = measures.width / measures.height;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(measures.width, measures.height);
    }

    init() {
        let measures = this.element.getBoundingClientRect();

        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setSize(measures.width, measures.height);
        this.element.append(this.renderer.domElement);

        this.raycaster = new THREE.Raycaster();

        this.canvas = this.renderer.domElement;
    }

    setCameraMode(mode = CONFIG.CAMERA.MODE.GOD) {
        if (this.terrain) {
            let distance = this.terrain.height;
            switch (mode) {
                case CONFIG.CAMERA.MODE.GOD:
                    this.camera.position.set(0, 0, distance);
                    this.camera.lookAt(new THREE.Vector3(0, 0, 0));
                    break;
                case CONFIG.CAMERA.MODE.PERSPECTIVE:
                    this.camera.position.set(0, -distance, distance / 2);
                    this.camera.lookAt(new THREE.Vector3(0, 0, 0));
                    break;
            }
        } else {
            throw new Error("No terrain set");
        }

        return this;
    }

    setTerrain(terrain) {
        this.terrain = terrain;

        let geometry = new THREE.PlaneGeometry(
            this.terrain.width,
            this.terrain.height,
            this.terrain.width,
            this.terrain.height
        );

        let materials = [
            new THREE.MeshBasicMaterial({
                color: 0x000000
            }),
            new THREE.MeshBasicMaterial({
                color: 0xffffff
            })
        ];

        for (let i = 0; i < this.terrain.height; i++) {
            for (let j = 0; j < this.terrain.width; j++) {
                let index = (i * this.terrain.width + j) * 2;
                geometry.faces[index].materialIndex = geometry.faces[index + 1].materialIndex = (i + j) % 2;
            }
        }

        this.plane = new THREE.Mesh(geometry, materials);
        this.plane.name = "ground";

        this.scene.add(this.plane);

        return this;
    }

    meshClicked(name, point) {
        // the left top box is the coord 0, 0
        // x -> column y -> row
        point.x += this.terrain.width / 2;
        point.y *= -1;
        point.y += this.terrain.height / 2;
        point.x = point.x | 0;
        point.y = point.y | 0;
        this.add(point.y, point.x);
    }

    add(i, j) {
        switch (findIcon()) {
            case "block": this.addBlock(i, j); break;
        }
    }

    addBlock(i, j) {
        if (this.terrain) {

            this.terrain.addBlock(i, j);

            let cube = new THREE.Mesh(
                new THREE.BoxGeometry(1, 1, 1),
                new THREE.MeshBasicMaterial({
                    color: 0xff0000
                }));

            cube.position.set(
                -this.plane.geometry.parameters.width / 2 + 0.5,
                this.plane.geometry.parameters.height / 2 - 0.5,
                0
            );

            cube.position.x += j;
            cube.position.y -= i;

            this.scene.add(cube);
        } else {
            throw new Error("No terrain set");
        }

        return this;
    }

    resetScene() {
        while (this.scene.children.length > 0) {
            this.scene.remove(this.scene.children[0]);
        }
        return this;
    }

    listeners() {
        let event;

        this.canvas.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            //e.stopPropagation();
        });

        this.canvas.addEventListener('wheel', (e) => {
            if (e.deltaY > 0) {
                this.cameraMovements.backwards(this.camera);
            } else {
                this.cameraMovements.forwards(this.camera);
            }
        });

        this.canvas.addEventListener('click', (e) => {
            if (e.which == CONFIG.MOUSE.LEFT_BUTTON) {
                this.spaceClickListener(e);
            }
            e.preventDefault();
        });

        this.canvas.addEventListener('mousedown', (e) => {
            CONFIG.MOUSE.VALUES[CONFIG.MOUSE.DRAG] = true;
            CONFIG.MOUSE.VALUES[e.which] = true;
            event = e;
            e.preventDefault();
        });

        this.canvas.addEventListener('mousemove', (e) => {
            if (CONFIG.MOUSE.VALUES[CONFIG.MOUSE.DRAG]) {
                let width = event.clientX - e.clientX;
                let height = event.clientY - e.clientY;
                if (CONFIG.MOUSE.VALUES[CONFIG.MOUSE.LEFT_BUTTON]) {
                    this.spaceClickListener(e);
                } else if (CONFIG.MOUSE.VALUES[CONFIG.MOUSE.RIGHT_BUTTON]) {
                    if (Math.abs(width) > Math.abs(height)) {
                        this.cameraMovements.viewRight(this.camera, width);
                    } else {
                        this.cameraMovements.viewDown(this.camera, height);
                    }
                }
                event = e;
            }
            e.preventDefault();
        });

        this.canvas.addEventListener('mouseup', (e) => {
            CONFIG.MOUSE.VALUES.fill(false);
            e.preventDefault();
        });

        this.canvas.addEventListener('mouseout', (e) => {
            CONFIG.MOUSE.VALUES.fill(false);
            e.preventDefault();
        });

        window.addEventListener('keydown', (e) => {
            CONFIG.KEYBOARD.VALUES[e.which] = true;
            Object.keys(CONFIG.KEYBOARD)
                .filter(element => element != "VALUES")
                .forEach(element => {
                    if (CONFIG.KEYBOARD.VALUES[CONFIG.KEYBOARD[element]]) {
                        switch (element) {
                            case 'ARROW_UP':
                                this.cameraMovements.viewUp(this.camera);
                                break;
                            case 'ARROW_DOWN':
                                this.cameraMovements.viewDown(this.camera);
                                break;
                            case 'ARROW_LEFT':
                                this.cameraMovements.viewLeft(this.camera);
                                break;
                            case 'ARROW_RIGHT':
                                this.cameraMovements.viewRight(this.camera);
                                break;
                            case 'SPACE':
                                if (e.shiftKey) {
                                    this.cameraMovements.backwards(this.camera);
                                } else {
                                    this.cameraMovements.forwards(this.camera);
                                }
                                e.preventDefault();
                                break;
                        }
                    }
                });
        });

        window.addEventListener('keyup', (e) => {
            CONFIG.KEYBOARD.VALUES[e.which] = false;
        });
    }

    spaceClickListener(event) {

        let mouse = new THREE.Vector2();
        let rect = this.canvas.getBoundingClientRect();

        mouse.x = ((event.clientX - rect.left) / this.canvas.clientWidth) * 2 - 1;
        mouse.y = -((event.clientY - rect.top) / this.canvas.clientHeight) * 2 + 1;

        this.raycaster.setFromCamera(mouse, this.camera);
        let intersects = this.raycaster.intersectObjects([
            this.plane
        ]);

        if (intersects.length > 0) {
            this.meshClicked(intersects[0].object.name, intersects[0].point);
        }
    }
}