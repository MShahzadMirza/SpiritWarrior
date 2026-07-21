// ======================================================
// WORLD
// ======================================================

function createWorld(scene) {

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

}