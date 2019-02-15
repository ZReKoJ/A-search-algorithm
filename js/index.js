'use strict'

document.addEventListener("DOMContentLoaded", () => {
    makeResizableDiv('.setting-panel');
    makeResizableDiv('.icon-panel');

    let width = Number($(".setting-panel>input[type='number'].width").val());
    let height = Number($(".setting-panel>input[type='number'].height").val());

    let scene = new Scene('.draw-panel')
        .setTerrain(new Terrain(width, height))
        .setCameraMode(CONFIG.CAMERA.MODE.GOD);

    let startButton = $(".setting-panel>button.start");
    startButton.on("click", () => {
        width = Number($(".setting-panel>input[type='number'].width").val());
        height = Number($(".setting-panel>input[type='number'].height").val());
        scene.resetScene().setTerrain(new Terrain(width, height))
            .setCameraMode(CONFIG.CAMERA.MODE.GOD);
        perspectiveButton.perspectiveMode("GOD")
    });

    let perspectiveButton = $(".setting-panel>button.perspective");
    perspectiveButton.perspectiveMode = function (mode) {
        let perspectiveKeys = Object.keys(CONFIG.CAMERA.MODE);
        let perspective = perspectiveKeys[(perspectiveKeys.indexOf(mode) + 1) % perspectiveKeys.length];
        this.text(perspective.charAt(0) + perspective.slice(1).toLowerCase() + " View");
    }
    perspectiveButton.on("click", () => {
        let buttonTitle = perspectiveButton.text().split(" ")[0].toUpperCase();
        scene.setCameraMode(CONFIG.CAMERA.MODE[buttonTitle]);
        perspectiveButton.perspectiveMode(buttonTitle);
    });

    function animate() {
        requestAnimationFrame(animate);
        scene.animate();
    }

    animate();
});