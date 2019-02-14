'use strict'

document.addEventListener("DOMContentLoaded", () => {
    makeResizableDiv('.setting-panel');
    makeResizableDiv('.icon-panel');

    let scene = new AlgorithmScene('.draw-panel');

    let algorithm = new ASearchAlgorithm(9, 10);
    algorithm.print();

    function animate() {
        requestAnimationFrame(animate);
        scene.animate();
    }

    animate();
});