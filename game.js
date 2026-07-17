// Spirit Warrior
// Version 0.1
// Basic 3D Prototype

const canvas = document.getElementById('gameCanvas');

const engine = new BABYLON.Engine(canvas, true);

// Create Game World
function createGame() {
    const scene = new BABYLON.Scene(engine);

    // Background
    scene.clearColor = new BABYLON.Color3(0.05, 0.05, 0.1);

    // Light
    const light = new BABYLON.HemisphericLight(
        'spiritLight',
        new BABYLON.Vector3(0, 1, 0),
        scene,
    );

    light.intensity = 1;

    // Arena
    const ground = BABYLON.MeshBuilder.CreateGround(
        'spiritArena',
        {
            width: 30,
            height: 30,
        },
        scene,
    );

    // Player (temporary warrior)
    const warrior = BABYLON.MeshBuilder.CreateCapsule(
        'Spirit Warrior',
        {
            height: 2,
            radius: 0.5,
        },
        scene,
    );

    warrior.position.y = 1;

    // Spirit Energy System

    let spiritEnergy = 0;

    const energyText = document.getElementById('energy');

    // Spirit Crystal

    const crystal = BABYLON.MeshBuilder.CreateSphere(
        'Spirit Crystal',
        {
            diameter: 0.5,
        },
        scene,
    );

    crystal.position = new BABYLON.Vector3(5, 0.5, 5);

    let crystalCollected = false;

    // Camera
    const camera = new BABYLON.ArcRotateCamera(
        'camera',
        Math.PI,
        Math.PI / 3,
        8,
        warrior.position,
        scene,
    );

    camera.attachControl(canvas, false);

    camera.lowerRadiusLimit = 4;
    camera.upperRadiusLimit = 12;

    camera.wheelDeltaPercentage = 0.01;

    // Click the canvas to lock the mouse
    canvas.addEventListener('click', () => {
        if (document.pointerLockElement !== canvas) {
            canvas.requestPointerLock();
        }
    });

    document.addEventListener('mousemove', (event) => {
        if (document.pointerLockElement === canvas) {
            const sensitivity = 0.002;

            camera.alpha -= event.movementX * sensitivity;
            camera.beta -= event.movementY * sensitivity;

            // Prevent flipping upside down
            camera.beta = Math.max(0.3, Math.min(Math.PI / 2.2, camera.beta));
        }
    });

    // Movement System
    const keys = {};

    window.addEventListener('keydown', (event) => {
        const key = event.key.toLowerCase();

        keys[key] = true;

        // Jump
        if (key === ' ' && !jumping) {
            velocityY = 0.25;
            jumping = true;
        }
    });

    window.addEventListener('keyup', (event) => {
        keys[event.key.toLowerCase()] = false;
    });

    // Player Physics
    let velocityY = 0;
    let jumping = false;

    scene.onBeforeRenderObservable.add(() => {
        let speed = 0.08;

        // Running
        if (keys['shift']) {
            speed = 0.15;
        }

        // Movement
        let moveX = 0;
        let moveZ = 0;

        if (keys['w']) moveZ += 1;
        if (keys['s']) moveZ -= 1;
        if (keys['a']) moveX -= 1;
        if (keys['d']) moveX += 1;

        if (moveX !== 0 || moveZ !== 0) {
            // Camera forward direction
            const forward = camera.getForwardRay().direction;

            forward.y = 0;
            forward.normalize();

            // Camera right direction
            const right = BABYLON.Vector3.Cross(
                BABYLON.Axis.Y,
                forward,
            ).normalize();

            // Final movement direction
            const direction = forward.scale(moveZ).add(right.scale(moveX));

            direction.normalize();

            warrior.position.addInPlace(direction.scale(speed));
            const targetRotation = Math.atan2(direction.x, direction.z);

            warrior.rotation.y = BABYLON.Scalar.Lerp(
                warrior.rotation.y,
                targetRotation,
                0.15
            );
            // Gravity
            velocityY -= 0.01;

            warrior.position.y += velocityY;

            // Ground detection
            if (warrior.position.y <= 1) {
                warrior.position.y = 1;
                velocityY = 0;
                jumping = false;
            }

            // Crystal Collection

            if (crystal.isEnabled()) {
                crystal.rotation.y += 0.05;
            }

            const distance = BABYLON.Vector3.Distance(
                warrior.position,
                crystal.position,
            );

            if (distance < 1 && !crystalCollected) {
                crystalCollected = true;

                spiritEnergy += 10;
                energyText.innerText = spiritEnergy;

                // Hide the crystal
                crystal.setEnabled(false);

                // Respawn after 5 seconds
                setTimeout(() => {
                    crystal.position.x = Math.random() * 20 - 10;
                    crystal.position.z = Math.random() * 20 - 10;
                    crystal.position.y = 0.5;

                    crystal.setEnabled(true);

                    crystalCollected = false;
                }, 5000);
            }

            camera.target.copyFrom(warrior.position);
        });

    return scene;
}

const scene = createGame();

// Game Loop
engine.runRenderLoop(() => {
    scene.render();
});

// Resize
window.addEventListener('resize', () => {
    engine.resize();
});
