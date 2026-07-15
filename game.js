// Spirit Warrior
// Version 0.1
// Basic 3D Prototype


const canvas = document.getElementById("gameCanvas");

const engine = new BABYLON.Engine(canvas, true);


// Create Game World
function createGame(){

    const scene = new BABYLON.Scene(engine);


    // Background
    scene.clearColor = new BABYLON.Color3(
        0.05,
        0.05,
        0.1
    );


    // Camera
    const camera = new BABYLON.FollowCamera(
        "warriorCamera",
        new BABYLON.Vector3(0,5,-8),
        scene
    );

    camera.radius = 8;
    camera.heightOffset = 4;
    camera.rotationOffset = 180;
    camera.cameraAcceleration = 0.05;
    camera.maxCameraSpeed = 20;


    // Light
    const light = new BABYLON.HemisphericLight(
        "spiritLight",
        new BABYLON.Vector3(0,1,0),
        scene
    );

    light.intensity = 1;


    // Arena
    const ground = BABYLON.MeshBuilder.CreateGround(
        "spiritArena",
        {
            width:30,
            height:30
        },
        scene
    );


    // Player (temporary warrior)
    const warrior = BABYLON.MeshBuilder.CreateCapsule(
        "Spirit Warrior",
        {
            height:2,
            radius:0.5
        },
        scene
    );

    warrior.position.y = 1;


    // Camera follows warrior
    camera.lockedTarget = warrior;


    // Movement System
    const keys = {};


    window.addEventListener("keydown",(event)=>{
        keys[event.key.toLowerCase()] = true;
    });


    window.addEventListener("keyup",(event)=>{
        keys[event.key.toLowerCase()] = false;
    });



    scene.onBeforeRenderObservable.add(()=>{


        const speed = 0.08;


        if(keys["w"]){
            warrior.position.z += speed;
        }


        if(keys["s"]){
            warrior.position.z -= speed;
        }


        if(keys["a"]){
            warrior.position.x -= speed;
        }


        if(keys["d"]){
            warrior.position.x += speed;
        }


    });


    return scene;

}



const scene = createGame();


// Game Loop
engine.runRenderLoop(()=>{

    scene.render();

});


// Resize
window.addEventListener(
    "resize",
    ()=>{

        engine.resize();

    }
);