import * as THREE from "three";

export class Controller {
    constructor() {
        this.inputKeyboard = new Map(); 
        this.inputMouse = new THREE.Vector2();
        this.mouseLock = false;

        this.init();
        this.addListeners();
    }

    init() {
        this.inputKeyboard.set( 'KeyI', false ) // Interact

        .set( 'KeyW', false ) // Forward
        .set( 'KeyA', false ) // Left
        .set( 'KeyS', false ) // Back
        .set( 'KeyD', false ) // Right

        .set( 'Space', false ) // Jump
    }

    addListeners() {
        document.addEventListener( 'keydown', this.listenKeyDown );
        document.addEventListener( 'keyup', this.listenKeyUp );
    }

    clearListeners() {
        document.removeEventListener( 'keydown', this.listenKeyDown );
        document.removeEventListener( 'keyup', this.listenKeyUp );
        
        if ( !this.mouseLock ) return;
        
        document.removeEventListener( 'mousemove', this.listenMouse );
        this.mouseLock = false
    }

    lockMouse() {
        document.addEventListener( 'mousedown', () => {
            document.body.requestPointerLock();
            this.mouseLock = true;
        } );

        document.addEventListener( 'mousemove', this.listenMouse );
    }

    listenKeyDown = ( event ) => {
        if ( this.inputKeyboard.has( event.code ) )
            this.inputKeyboard.set( event.code, true );
    };
    
    listenKeyUp = ( event ) => {
        if ( this.inputKeyboard.has( event.code ) ) 
            this.inputKeyboard.set( event.code, false );
    };
    
    listenMouse = ( event ) => {
        if ( this.mouseLock && document.pointerLockElement === document.body ) {
            this.inputMouse.set(event.movementX, event.movementY);
        }
    };
}
