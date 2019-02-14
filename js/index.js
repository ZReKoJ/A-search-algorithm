'use strict'

document.addEventListener("DOMContentLoaded", () => {
    makeResizableDiv('.setting-panel');
    makeResizableDiv('.icon-panel');

    let width = Number($(".setting-panel>input[type='number'].width").val());
    let height = Number($(".setting-panel>input[type='number'].height").val());

    let scene = new Scene('.draw-panel')
        .setCameraMode()
        .addPlane(width, height);

    let terrain = new Terrain(width, height);
    //terrain.print();
    /*
    terrain.addRoute(1, 1)
    terrain.addRoute(1, 5)
    terrain.addRoute(5, 5)
    terrain.addRoute(5, 6)
    terrain.addBlock(6, 1)
    terrain.addBlock(7, 1)
    terrain.addBlock(6, 5)
    terrain.addBlock(6, 8)
    /**/

    $(".setting-panel>button.start").on("click", () => {
        width = Number($(".setting-panel>input[type='number'].width").val());
        height = Number($(".setting-panel>input[type='number'].height").val());
        scene.resetScene().addPlane(width, height);
        terrain.init(height, width);
        terrain.print();
    });

    function animate() {
        requestAnimationFrame(animate);
        scene.animate();
    }

    animate();
});