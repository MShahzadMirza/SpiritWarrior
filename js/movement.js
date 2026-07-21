// ======================================================
// MOVEMENT
// ======================================================

let velocityY = 0;
let jumping = false;

function updateMovement(camera) {

    if (!warrior) return;


    //------------------------------------------
    // Jump
    //------------------------------------------

    if (keys[" "] && !jumping) {

        velocityY = 0.25;
        jumping = true;

    }

    //------------------------------------------
    // Speed
    //------------------------------------------

    let speed = keys["shift"] ? 0.15 : 0.08;

    //------------------------------------------
    // Movement Input
    //------------------------------------------

    let moveX = 0;
    let moveZ = 0;

    const isMoving =
        keys["w"] ||
        keys["a"] ||
        keys["s"] ||
        keys["d"];

    if (keys["w"]) moveZ += 1;
    if (keys["s"]) moveZ -= 1;
    if (keys["a"]) moveX -= 1;
    if (keys["d"]) moveX += 1;

    //------------------------------------------
    // Movement
    //------------------------------------------

    if (moveX !== 0 || moveZ !== 0) {

        if (keys["shift"]) {

            playAnimation("CharacterArmature|Run");

        } else {

            playAnimation("CharacterArmature|Walk");

        }

        const forward = new BABYLON.Vector3(
            Math.sin(cameraYaw),
            0,
            Math.cos(cameraYaw)
        ).normalize();

        const right = new BABYLON.Vector3(
            forward.z,
            0,
            -forward.x
        );

        const direction = forward
            .scale(moveZ)
            .add(right.scale(moveX));

        direction.normalize();

        warrior.position.addInPlace(
            direction.scale(speed)
        );

        const targetRotation = Math.atan2(
            direction.x,
            direction.z
        );

        warrior.rotation.y = BABYLON.Scalar.Lerp(
            warrior.rotation.y,
            targetRotation,
            0.18
        );

        console.log(
            "Current:", warrior.rotation.y.toFixed(2),
            "Target:", targetRotation.toFixed(2)
        );

    } else {

        playAnimation("CharacterArmature|Idle");

    }

    //------------------------------------------
    // Gravity
    //------------------------------------------

    velocityY -= 0.01;

    warrior.position.y += velocityY;

    if (warrior.position.y <= 1) {

        warrior.position.y = 1;
        velocityY = 0;
        jumping = false;

    }

}