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
            }
        }
    }

    animate() {
        //this.plane.rotation.x += 0.01;
        //this.plane.rotation.y += 0.01;
        //this.plane.rotation.z += 0.01;
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

        this.canvas = this.element.querySelector('canvas');
    }

    setCameraMode(mode = CONFIG.CAMERA.MODE.GOD, distance = 10) {
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

        return this;
    }

    addPlane(width = 10, height = 10) {
        this.plane = new THREE.Mesh(
            new THREE.PlaneGeometry(10, 10, width, height),
            new THREE.MeshBasicMaterial({
                color: 0xffffff,
                wireframe: true
            }));
        this.scene.add(this.plane);

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
                                break;
                        }
                    }
                });
        });

        window.addEventListener('keyup', (e) => {
            CONFIG.KEYBOARD.VALUES[e.which] = false;
        });
    }
}