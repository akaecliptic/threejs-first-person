import * as THREE from "three";

import { FRAME_INTERVALS } from "./config.js";

// Clock
export const clock = new THREE.Clock();

var onAnimate = ( fixedDeltaTime ) => { fixedDeltaTime; };
var onRender = () => {};

// Callback setters
const setAnimationCallback = ( callback ) => {
    onAnimate = callback;
}

const setRenderCallback = ( callback ) => {
    onRender = callback;
}

// Main animation loop
const animate = () => {
    
    const fixedDeltaTime = Math.min( 0.05, clock.getDelta() ) / FRAME_INTERVALS;
    
    for( let i = 0; i < FRAME_INTERVALS; i++ ) {
        onAnimate( fixedDeltaTime );
    }

    onRender();

    requestAnimationFrame( animate );
}

export { setRenderCallback, setAnimationCallback, animate };
