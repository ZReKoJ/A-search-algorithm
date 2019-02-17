'use strict'

var messages = {
    error: {
        mapExceedDimensions: "The minimum value for the map is 10 and the maximum is 100",
        noAvatarSet: "Please, set an avatar before running the program",
        noTerrainSet: "Please set the map dimensions",
        noGoalsSet: "You have not set any goals yet",
        cannotChangeAvatarWhileRunning: "You cannot change the avatar while running",
        cannotRemoveObjectWhileRunning: "You cannot remove objects while running",
    },
    info: {
        uses: {
            mouse: {
                wheel: "Use your mouse wheel to zoom in and out",
                leftClick: "Use your mouse left button to add items on the map",
                rightClick: "Drag with your mouse right button to change the camera viewpoint"
            },
            keyboard: {
                arrowKeys: "Use the arrow keys to change the camera viewpoint",
                space: "Use the space key for zoom in and ctrl + space for zoom out",
            }
        },
        programStarted: "The program has started",
        programStopped: "The program is stopped"
    }
}