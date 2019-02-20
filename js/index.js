'use strict'

document.addEventListener("DOMContentLoaded", () => {
    makeResizableDiv('.setting-panel');
    makeResizableDiv('.icon-panel');

    let widthInput = $(".setting-panel>.setting>input[type='number'].width");
    let heightInput = $(".setting-panel>.setting>input[type='number'].height");
    let mouseScrollInput = $(".setting-panel>.setting>input[type='number'].mouse-scroll");
    let cameraLookAtInput = $(".setting-panel>.setting>input[type='number'].camera-look-at");

    mouseScrollInput.on("change", (e) => {
        CONFIG.MOUSE_SCROLL_RELATION = Number(mouseScrollInput.val()) * 0.1;
    });

    cameraLookAtInput.on("change", (e) => {
        CONFIG.CAMERA_LOOK_AT_RELATION = Number(cameraLookAtInput.val()) * 0.001;
    });

    let scene = new Scene('.draw-panel')
        .setTerrain(new Terrain(Number(widthInput.val()), Number(heightInput.val())))
        .setCameraMode(CONFIG.CAMERA.MODE.GOD);

    let startButton = $(".setting-panel>.setting>button.start");
    startButton.on("click", () => {
        if (
            Number(widthInput.attr("min")) <= Number(widthInput.val()) &&
            Number(widthInput.attr("max")) >= Number(widthInput.val()) &&
            Number(heightInput.attr("min")) <= Number(heightInput.val()) &&
            Number(heightInput.attr("max")) >= Number(heightInput.val())
        ) {
            scene.resetScene().setTerrain(new Terrain(Number(widthInput.val()), Number(heightInput.val())))
                .setCameraMode(CONFIG.CAMERA.MODE.GOD);
            perspectiveButton.perspectiveMode("GOD")
        } else {
            notifier.error(messages.error.mapExceedDimensions);
        }
    });

    let perspectiveButton = $(".setting-panel>.setting>button.perspective");
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

    let runStopButton = $(".setting-panel>.setting>button.run-stop");
    let interval = undefined;
    runStopButton.on("click", () => {
        scene.run();
    });

    function animate() {
        requestAnimationFrame(animate);
        scene.animate();
    }

    animate();

    infoMessages();
});

function findIcon() {
    return $(".icon-panel>.icons input[type='radio']:checked").val()
}

function infoMessages() {
    let allInfoMessages = messages.info.uses.recursiveValues();
    setInterval(() => {
        notifier.info(allInfoMessages[
            Math.floor(Math.random() * allInfoMessages.length)
        ]);
    }, 30000);
}