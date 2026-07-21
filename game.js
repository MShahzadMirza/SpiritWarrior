// ======================================================
// Spirit Warrior
// Version 0.3
// ======================================================

const canvas = document.getElementById("gameCanvas");
const engine = new BABYLON.Engine(canvas, true);
let warrior = null;
let animations = {};
let currentAnimation = "";

function createGame() {

    const scene = new BABYLON.Scene(engine);
    scene.clearColor = new BABYLON.Color3(0.05, 0.05, 0.1);


    //==================================================
    // LIGHT
    //==================================================

    const light = new BABYLON.HemisphericLight(
        "light",
        new BABYLON.Vector3(0, 1, 0),
        scene
    );

    light.intensity = 1;

    //==================================================
    // GROUND
    //==================================================

    BABYLON.MeshBuilder.CreateGround(
        "ground",

        {
            width: 30,
            height: 30
        },
        scene
    );

    //==================================================
    // PLAYER
    //==================================================

    BABYLON.SceneLoader.ImportMesh(
        "",
        "assets/models/",
        "warrior.glb",
        scene,
        function (meshes, particleSystems, skeletons, animationGroups) {

            console.log("Meshes:", meshes);
            console.log("Animation Groups:", animationGroups);

            warrior = meshes[0];

            console.log(meshes);

            warrior.position = new BABYLON.Vector3(0, 1, 0);

            // Scale may need adjustment later
            warrior.scaling = new BABYLON.Vector3(1, 1, 1);

            // Camera follows the player
            camera.lockedTarget = warrior;


            // Store all animations
            animations = {};

            animationGroups.forEach(group => {

                animations[group.name] = group;

                group.stop();

            });

            playAnimation("CharacterArmature|Idle");

            // Play first animation
            // if (animationGroups.length > 0) {
            //     animationGroups[0].start(true);
            // }

        }
    );

    //==================================================
    // CAMERA
    //==================================================

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

    //==================================================
    // UI
    //==================================================

    let spiritEnergy = 0;

    const energyText = document.getElementById("energy");

    //==================================================
    // CRYSTAL
    //==================================================

    const crystal = BABYLON.MeshBuilder.CreateSphere(
        "crystal",
        {
            diameter: 0.5
        },
        scene
    );

    crystal.position = new BABYLON.Vector3(5, 0.5, 5);

    let crystalCollected = false;

    //==================================================
    // INPUT
    //==================================================

    const keys = {};

    window.addEventListener("keydown", (event) => {

        const key = event.key.toLowerCase();

        keys[key] = true;

        if (key === " " && !jumping) {

            velocityY = 0.25;
            jumping = true;

        }

    });

    window.addEventListener("keyup", (event) => {

        keys[event.key.toLowerCase()] = false;

    });

    //==================================================
    // PLAYER PHYSICS
    //==================================================

    let velocityY = 0;
    let jumping = false;

    //==================================================
    // GAME LOOP
    //==================================================

    scene.onBeforeRenderObservable.add(() => {

        if (!warrior) return;


        //------------------------------------------
        // Speed
        //------------------------------------------

        let speed = keys["shift"] ? 0.15 : 0.08;

        const isMoving =
            keys["w"] ||
            keys["a"] ||
            keys["s"] ||
            keys["d"];

        //------------------------------------------
        // Movement Input
        //------------------------------------------

        let moveX = 0;
        let moveZ = 0;

        if (keys["w"]) moveZ += 1;
        if (keys["s"]) moveZ -= 1;
        if (keys["a"]) moveX -= 1;
        if (keys["d"]) moveX += 1;

        //------------------------------------------
        // Camera Relative Movement
        //------------------------------------------

        if (moveX !== 0 || moveZ !== 0) {

            if (keys["shift"]) {

                playAnimation("CharacterArmature|Run");

            } else {

                playAnimation("CharacterArmature|Walk");

            }

            const forward = camera.getForwardRay().direction;

            forward.y = 0;
            forward.normalize();

            const right = BABYLON.Vector3.Cross(
                BABYLON.Axis.Y,
                forward
            ).normalize();

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
                0.15
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

        //------------------------------------------
        // Crystal Rotation
        //------------------------------------------

        if (crystal.isEnabled()) {

            crystal.rotation.y += 0.05;

        }

        //------------------------------------------
        // Crystal Collection
        //------------------------------------------

        const distance = BABYLON.Vector3.Distance(
            warrior.position,
            crystal.position
        );

        if (distance < 1 && !crystalCollected) {

            crystalCollected = true;

            spiritEnergy += 10;

            energyText.innerText = spiritEnergy;

            crystal.setEnabled(false);

            setTimeout(() => {

                crystal.position.x = Math.random() * 20 - 10;
                crystal.position.z = Math.random() * 20 - 10;

                crystal.setEnabled(true);

                crystalCollected = false;

            }, 5000);

        }

    });

    return scene;

}

function playAnimation(name, loop = true) {

    if (currentAnimation === name) return;

    Object.values(animations).forEach(anim => {
        anim.stop();
    });

    if (animations[name]) {

        animations[name].reset();
        animations[name].start(loop);

        currentAnimation = name;

    }

}

const scene = createGame();

engine.runRenderLoop(() => {

    scene.render();

});

window.addEventListener("resize", () => {

    engine.resize();

});