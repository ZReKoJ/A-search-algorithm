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
        //this.cube.rotation.x += 0.01;
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

        this.camera.position.z = 8;
    }

    materials() {
        this.geometry = new THREE.PlaneGeometry(10, 10, 1);
        this.material = new THREE.MeshBasicMaterial({
            color: 0xffff00,
            side: THREE.DoubleSide
        });
        this.cube = new THREE.Mesh(this.geometry, this.material);
        this.scene.add(this.cube);
    }

    listeners() {
        let isDragging = false;

        this.canvas.addEventListener('wheel', (e) => {
            this.camera.position.z += ((e.deltaY > 0) ? MOUSE_SCROLL_MOVE : -MOUSE_SCROLL_MOVE);
        });
        this.canvas.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            //e.stopPropagation();
        });
        this.canvas.addEventListener('mousedown', (e) => {
            isDragging = true;
            e.preventDefault();
        });
        this.canvas.addEventListener('mouseup', (e) => {
            isDragging = false;
            e.preventDefault();
        });
    }
}