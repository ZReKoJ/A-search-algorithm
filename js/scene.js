'use strict'

class AlgorithmScene {
    constructor(div) {
        this.element = document.querySelector(div);

        new ResizeSensor(this.element, () => {
            this.resize();
        });

        this.init();
        this.materials();
        this.listeners();

        this.cameraMovements = {
            forwards : function(camera) {
                camera.position.x -= Math.sin(camera.rotation.y) * CONFIG.MOUSE_SCROLL_RELATION;
                camera.position.z -= -Math.cos(camera.rotation.y) * CONFIG.MOUSE_SCROLL_RELATION;
            },
            backwards : function(camera) {
                camera.position.x += Math.sin(camera.rotation.y) * CONFIG.MOUSE_SCROLL_RELATION;
                camera.position.z += -Math.cos(camera.rotation.y) * CONFIG.MOUSE_SCROLL_RELATION;
            },
            toUp : function(camera, relation=10) {
                camera.position.y -= CONFIG.OBJECT_TRANSITION_RELATION * relation;
            },
            toDown : function(camera, relation=10) {
                camera.position.y += CONFIG.OBJECT_TRANSITION_RELATION * relation;
            },
            toLeft : function(camera, relation=10) {
                camera.position.x += CONFIG.OBJECT_TRANSITION_RELATION * relation;
            },
            toRight : function(camera, relation=10) {
                camera.position.x -= CONFIG.OBJECT_TRANSITION_RELATION * relation;
            },
            lookAtLeft : function(camera, relation=10) {
                camera.rotation.y -= Math.PI * CONFIG.CAMERA_LOOK_AT_RELATION * relation;
            },
            lookAtRight : function(camera, relation=10) {
                camera.rotation.y += Math.PI * CONFIG.CAMERA_LOOK_AT_RELATION * relation;
            },
            lookAtUp : function(camera, relation=10) {
                camera.rotation.x -= Math.PI * CONFIG.CAMERA_LOOK_AT_RELATION * relation;
            },
            lookAtDown : function(camera, relation=10) {
                camera.rotation.x += Math.PI * CONFIG.CAMERA_LOOK_AT_RELATION * relation;
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

        this.camera.position.set(0, 3, -10);
        this.camera.lookAt(new THREE.Vector3(0, 3, 0));
    }

    materials() {
        this.geometry = new THREE.PlaneGeometry(10, 10, 10, 10);
        this.material = new THREE.MeshBasicMaterial({
            color: 0xffffff,
            wireframe: true
        });
        this.plane = new THREE.Mesh(this.geometry, this.material);
        this.plane.rotation.x -= Math.PI / 2;
        this.scene.add(this.plane);
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
                        this.cameraMovements.lookAtRight(this.camera, width);
                    } else {
                        this.cameraMovements.lookAtUp(this.camera, height);
                    }
                }
                if (CONFIG.MOUSE.VALUES[CONFIG.MOUSE.RIGHT_BUTTON]) {
                    if (Math.abs(width) > Math.abs(height)) {
                        this.cameraMovements.toRight(this.camera, width);
                    } else {
                        this.cameraMovements.toDown(this.camera, height);
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
                        this.cameraMovements.forwards(this.camera);
                            break;
                        case 'ARROW_DOWN':
                        this.cameraMovements.backwards(this.camera);
                            break;
                        case 'ARROW_LEFT':
                        this.cameraMovements.lookAtLeft(this.camera);
                            break;
                        case 'ARROW_RIGHT':
                        this.cameraMovements.lookAtRight(this.camera);
                            break;
                    }
                }
            });
            e.preventDefault();
        });

        window.addEventListener('keyup', (e) => {
            CONFIG.KEYBOARD.VALUES[e.which] = false;
            e.preventDefault();
        });
    }
}