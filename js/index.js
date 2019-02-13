'use strict'

const MOUSE_SCROLL_MOVE = 0.1; 


document.addEventListener("DOMContentLoaded", () => {
    makeResizableDiv('.setting-panel');
    makeResizableDiv('.icon-panel');

    var algorithmScene = new AlgorithmScene('.draw-panel');

    function animate() {
        requestAnimationFrame(animate);
        algorithmScene.animate();
    }

    animate();
});