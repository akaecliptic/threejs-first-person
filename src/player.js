import * as THREE from "three";

import { Capsule } from "three/addons/math/Capsule.js";

import { CAMERA_DAMPING, GRAVITY } from "./config.js";
import { Controller } from "./controller.js";
import { forwardVector, sideVector } from "./utils.js";

export class Player extends Controller {

    constructor( camera, alias ) {
        super();
        
        this.alias = alias;

        this.velocity = new THREE.Vector3();
        this.direction = new THREE.Vector3();
        this.position = new THREE.Vector3(0, 0, 15);
        
        this.collider = new Capsule( new THREE.Vector3( 0, 0.35, 0 ), new THREE.Vector3( 0, 1, 0 ), 0.35 );
        this.collider.translate( this.position );

        this.cameraRef = camera;

        this.isGrounded = false;

        this.lockMouse();
    }

    alias( alias ) {
        this.alias = alias;
    }

    controls( deltaTime ) {
        const speed = deltaTime * ( this.isGrounded ? 25 : 8 );

        if ( this.inputKeyboard.get( 'KeyW' ) ) this.velocity.add( forwardVector( this.cameraRef, this.direction ).multiplyScalar( speed ) );
        if ( this.inputKeyboard.get( 'KeyS' ) ) this.velocity.add( forwardVector( this.cameraRef, this.direction ).multiplyScalar( -speed ) );
        if ( this.inputKeyboard.get( 'KeyA' ) ) this.velocity.add( sideVector( this.cameraRef, this.direction ).multiplyScalar( -speed ) );
        if ( this.inputKeyboard.get( 'KeyD' ) ) this.velocity.add( sideVector( this.cameraRef, this.direction ).multiplyScalar( speed ) );

        if( this.isGrounded  && this.inputKeyboard.get( 'Space' ) ) this.velocity.y = 5;
    }

    calculate( deltaTime ) {
        let damping = Math.exp( - 10 * deltaTime ) - 1;

        if( !this.isGrounded ) {
            this.velocity.y -= GRAVITY * deltaTime;
            damping *= .1;
        }

        this.velocity.addScaledVector( this.velocity, damping );

        const deltaPosition = this.velocity.clone().multiplyScalar( deltaTime );
        this.position.add( deltaPosition );
        this.collider.translate( deltaPosition );
    }

    collisions( world ) {
        const result = world.capsuleIntersect( this.collider );
    
        this.isGrounded = false;

        if ( result ) {
            this.isGrounded = result.normal.y > 0;

            if ( !this.isGrounded ) {
                this.velocity.addScaledVector( result.normal, - result.normal.dot( this.velocity ) );
            }

            this.collider.translate( result.normal.multiplyScalar( result.depth ) );
        }
    }

    update() {
        this.cameraRef.position.copy( this.collider.end );
    }

    lockMouse() {
        document.addEventListener( 'mousedown', () => {
            document.body.requestPointerLock();
            this.mouseLock = true;
        } );

        document.addEventListener( 'mousemove', this.listenMouse );
    }

    listenMouse = ( event ) => {
        if ( this.mouseLock && document.pointerLockElement === document.body ) {
            this.inputMouse.set(event.movementX, event.movementY);
            this.cameraRef.rotation.y -= this.inputMouse.x / CAMERA_DAMPING;
            this.cameraRef.rotation.x -= this.inputMouse.y / CAMERA_DAMPING;
        }
    };
}
