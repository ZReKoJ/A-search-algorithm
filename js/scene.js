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

        this.canvas.addEventListener('wheel', (e) => {
            if (e.deltaY > 0) {
                this.camera.position.x += Math.sin(this.camera.rotation.y) * CONFIG.MOUSE_SCROLL_RELATION;
                this.camera.position.z += -Math.cos(this.camera.rotation.y) * CONFIG.MOUSE_SCROLL_RELATION;
            } else {
                this.camera.position.x -= Math.sin(this.camera.rotation.y) * CONFIG.MOUSE_SCROLL_RELATION;
                this.camera.position.z -= -Math.cos(this.camera.rotation.y) * CONFIG.MOUSE_SCROLL_RELATION;

            }
        });
        this.canvas.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            //e.stopPropagation();
        });
        this.canvas.addEventListener('mousedown', (e) => {
            CONFIG.IS_DRAGGING = true;
            switch (e.which) {
                case 1:
                    CONFIG.IS_LEFT_MOUSE_BUTTON = true;
                    break;
                case 3:
                    CONFIG.IS_RIGHT_MOUSE_BUTTON = true;
                    break;
            }
            event = e;
            e.preventDefault();
        });
        this.canvas.addEventListener('mousemove', (e) => {
            if (CONFIG.IS_DRAGGING) {
                let width = event.clientX - e.clientX;
                let height = event.clientY - e.clientY;
                if (CONFIG.IS_LEFT_MOUSE_BUTTON) {
                    if (Math.abs(width) > Math.abs(height)) {
                        this.camera.rotation.y += Math.PI * CONFIG.CAMERA_HORIZONTAL_LOOK_AT * width;
                    } else {
                        this.camera.rotation.x -= Math.PI * CONFIG.CAMERA_HORIZONTAL_LOOK_AT * height;
                    }
                }
                if (CONFIG.IS_RIGHT_MOUSE_BUTTON) {
                    if (Math.abs(width) > Math.abs(height)) {
                        this.camera.position.x -= CONFIG.OBJECT_POSITION_RELATION * width;
                    } else {
                        this.camera.position.y += CONFIG.OBJECT_POSITION_RELATION * height;
                    }
                }
                event = e;
            }
            e.preventDefault();
        });
        this.canvas.addEventListener('mouseup', (e) => {
            CONFIG.IS_DRAGGING = false;
            CONFIG.IS_LEFT_MOUSE_BUTTON = false;
            CONFIG.IS_RIGHT_MOUSE_BUTTON = false;
            e.preventDefault();
        });
        window.addEventListener('keydown', (e) => {
            switch (e.key) {
                case 'ArrowUp':
                    this.camera.position.x -= Math.sin(this.camera.rotation.y) * CONFIG.MOUSE_SCROLL_RELATION;
                    this.camera.position.z -= -Math.cos(this.camera.rotation.y) * CONFIG.MOUSE_SCROLL_RELATION;
                    break;
                case 'ArrowDown':
                    this.camera.position.x += Math.sin(this.camera.rotation.y) * CONFIG.MOUSE_SCROLL_RELATION;
                    this.camera.position.z += -Math.cos(this.camera.rotation.y) * CONFIG.MOUSE_SCROLL_RELATION;
                    break;
                case 'ArrowLeft':
                this.camera.rotation.y -= Math.PI * CONFIG.CAMERA_HORIZONTAL_LOOK_AT * 10;
                    break;
                case 'ArrowRight':
                    this.camera.rotation.y += Math.PI * CONFIG.CAMERA_HORIZONTAL_LOOK_AT * 10;
                    break;
            }
        });
    }
}