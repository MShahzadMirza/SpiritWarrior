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

    // Camera
    const camera = new BABYLON.FollowCamera(
        'warriorCamera',
        new BABYLON.Vector3(0, 5, -8),
        scene,
    );

    camera.radius = 8;
    camera.heightOffset = 4;
    camera.rotationOffset = 180;
    camera.cameraAcceleration = 0.05;
    camera.maxCameraSpeed = 20;

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

    // Camera follows warrior
    camera.lockedTarget = warrior;

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
        if (keys['w']) {
            warrior.position.z += speed;
        }

        if (keys['s']) {
            warrior.position.z -= speed;
        }

        if (keys['a']) {
            warrior.position.x -= speed;
        }

        if (keys['d']) {
            warrior.position.x += speed;
        }

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

        const distance = BABYLON.Vector3.Distance(
            warrior.position,
            crystal.position,
        );

        if (distance < 1 && !crystalCollected) {
            crystalCollected = true;

            spiritEnergy += 10;

            energyText.innerText = spiritEnergy;

            crystal.dispose();
        }
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
