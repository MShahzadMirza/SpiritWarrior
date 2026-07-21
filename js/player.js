// ======================================================
// PLAYER
// ======================================================

let warrior = null;
let animations = {};
let currentAnimation = "";

//==================================================
// CREATE PLAYER
//==================================================

function createPlayer(scene, camera) {

    BABYLON.SceneLoader.ImportMesh(
        "",
        "assets/models/",
        "warrior.glb",
        scene,
        function (meshes, particleSystems, skeletons, animationGroups) {

            console.log("Meshes:", meshes);
            console.log("Animation Groups:", animationGroups);


            meshes.forEach((mesh, i) => {
                console.log(i, mesh.name);
            });

            // Keep EXACTLY like your original project
            warrior = meshes.find(mesh => mesh.name === "__root__");
            console.log("Warrior:", warrior.name);
            console.log("Quaternion:", warrior.rotationQuaternion);

            warrior.rotationQuaternion = null;
            warrior.rotation.y = Math.PI;   // keep the model facing the correct direction if needed

            warrior.position = new BABYLON.Vector3(0, 1, 0);
            warrior.scaling = new BABYLON.Vector3(1, 1, 1);

            // Camera follows the warrior
            camera.lockedTarget = warrior;

            // Store animations
            animations = {};

            animationGroups.forEach(group => {

                animations[group.name] = group;
                group.stop();

            });

            // Start idle animation
            playAnimation("CharacterArmature|Idle");

            console.log("✅ Player Loaded");

        }
    );

}

//==================================================
// PLAY ANIMATION
//==================================================

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