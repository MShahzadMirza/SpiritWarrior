// ======================================================
// Spirit Warrior
// Main Game
// ======================================================

const canvas = document.getElementById("gameCanvas");
const engine = new BABYLON.Engine(canvas, true);

function createGame() {

    const scene = new BABYLON.Scene(engine);

    // World
    createWorld(scene);

    // Create Camera
    const camera = createCamera(scene);
    createPlayer(scene, camera);
    setupInput();

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
    // PLAYER PHYSICS
    //==================================================

    let velocityY = 0;
    let jumping = false;

    //==================================================
    // GAME LOOP
    //==================================================

    scene.onBeforeRenderObservable.add(() => {

        if (!warrior) return;

        updateMovement(camera);

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

const scene = createGame();

engine.runRenderLoop(() => {
    scene.render();
});

window.addEventListener("resize", () => {
    engine.resize();
});