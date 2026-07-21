// ======================================================
// INPUT
// ======================================================

const keys = {};

function setupInput() {

    window.addEventListener("keydown", (event) => {

        const key = event.key.toLowerCase();

        keys[key] = true;

    });

    window.addEventListener("keyup", (event) => {

        keys[event.key.toLowerCase()] = false;

    });

}