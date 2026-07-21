// ======================================================
// CAMERA
// ======================================================

function createCamera(scene) {

    const camera = new BABYLON.ArcRotateCamera(
        "camera",
        Math.PI,
        Math.PI / 3,
        8,
        new BABYLON.Vector3(0, 1, 0),
        scene
    );

    camera.attachControl(canvas, false);

    camera.lowerRadiusLimit = 4;
    camera.upperRadiusLimit = 12;
    camera.wheelDeltaPercentage = 0.01;

    // Pointer Lock
    canvas.addEventListener("click", () => {

        if (document.pointerLockElement !== canvas) {
            canvas.requestPointerLock();
        }

    });

    document.addEventListener("mousemove", (event) => {

        if (document.pointerLockElement === canvas) {

            const sensitivity = 0.002;

            camera.alpha -= event.movementX * sensitivity;
            camera.beta -= event.movementY * sensitivity;

            camera.beta = Math.max(
                0.3,
                Math.min(Math.PI / 2.2, camera.beta)
            );

        }

    });

    return camera;

}