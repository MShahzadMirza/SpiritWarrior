// ======================================================
// CAMERA
// ======================================================

let cameraYaw = 0;
let cameraPitch = 0;

function createCamera(scene) {

    const camera = new BABYLON.UniversalCamera(
        "camera",
        new BABYLON.Vector3(0, 3, -6),
        scene
    );

    camera.minZ = 0.1;

    camera.attachControl(canvas, false);

    camera.inputs.clear();

    canvas.addEventListener("click", () => {

        if (document.pointerLockElement !== canvas) {
            canvas.requestPointerLock();
        }

    });

    document.addEventListener("mousemove", (event) => {

        if (document.pointerLockElement !== canvas)
            return;

        const sensitivity = 0.003;

        cameraYaw += event.movementX * sensitivity;
        cameraPitch += event.movementY * sensitivity;

        cameraPitch = BABYLON.Scalar.Clamp(
            cameraPitch,
            -0.6,
            0.6
        );

    });

    return camera;

}


function updateCamera(camera) {

    if (!warrior) return;

    const distance = 6;

    const target = warrior.position.add(
        new BABYLON.Vector3(0, 1.5, 0)
    );

    const x =
        Math.sin(cameraYaw) *
        Math.cos(cameraPitch) *
        distance;

    const y =
        Math.sin(cameraPitch) *
        distance;

    const z =
        Math.cos(cameraYaw) *
        Math.cos(cameraPitch) *
        distance;

    camera.position.set(

        target.x - x,
        target.y + y,
        target.z - z

    );

    camera.setTarget(target);

}