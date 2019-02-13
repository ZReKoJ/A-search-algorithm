class AlgorithmScene {
    constructor(div) {
        this.element = document.querySelector(div);

        new ResizeSensor(this.element, () => {
            this.resize();
        });

        this.init();
        this.materials();
    }

    animate() {
        this.cube.rotation.x += 0.01;
        this.cube.rotation.y += 0.01;
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
        
        this.camera.position.z = 3;
    }

    materials() {
        this.geometry = new THREE.BoxGeometry(1, 1, 1);
        this.material = new THREE.MeshBasicMaterial({
            color: 0xffffff
        });
        this.cube = new THREE.Mesh(this.geometry, this.material);
        this.scene.add(this.cube);
    }
}