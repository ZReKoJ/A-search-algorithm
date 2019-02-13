'use strict'

$(() => {
    makeResizableDiv('.setting-panel');
    makeResizableDiv('.icon-panel');
    
    var algorithmScene = new AlgorithmScene('.draw-panel');
    
    function animate() {
        requestAnimationFrame( animate );
        algorithmScene.animate();
    }

    animate();
});