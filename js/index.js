'use strict'

document.addEventListener("DOMContentLoaded", () => {
    makeResizableDiv('.setting-panel');
    makeResizableDiv('.icon-panel');

    let widthButton = $(".setting-panel>input[type='number'].width");
    let heightButton = $(".setting-panel>input[type='number'].height");

    let scene = new Scene('.draw-panel')
        .setTerrain(new Terrain(Number(widthButton.val()), Number(heightButton.val())))
        .setCameraMode(CONFIG.CAMERA.MODE.GOD);

    let startButton = $(".setting-panel>button.start");
    startButton.on("click", () => {
        if (
            widthButton.attr("min") <= widthButton.val() &&
            widthButton.attr("max") >= widthButton.val() &&
            heightButton.attr("min") <= heightButton.val() &&
            heightButton.attr("max") >= heightButton.val()
        ) {
            scene.resetScene().setTerrain(new Terrain(Number(widthButton.val()), Number(heightButton.val())))
                .setCameraMode(CONFIG.CAMERA.MODE.GOD);
            perspectiveButton.perspectiveMode("GOD")
        } else {
            notifier.error(messages.error.mapExceedDimensions);
        }
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

    let runStopButton = $(".setting-panel>button.run-stop");
    let interval = undefined;
    runStopButton.on("click", () => {
        if (scene.isRunning()) {
            scene.stop();
            notifier.info(messages.info.programStopped);
            runStopButton.text("Run");
            if (interval) {
                clearInterval(interval);
            }
        }
        else {
            try {
                scene.run();
                notifier.info(messages.info.programStarted);
                runStopButton.text("Stop");
                interval = setInterval(() => {
                    try {
                        scene.run();
                        runStopButton.text("Stop");
                    } catch (err) {
                        notifier.error(err.message);
                        scene.stop();
                        runStopButton.text("Run");
                        if (interval) {
                            clearInterval(interval);
                        }
                    }
                }, 1000);
            } catch (err) {
                notifier.error(err.message);
                scene.stop();
                runStopButton.text("Run");
            }
        }
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