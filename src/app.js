import * as THREE from "three";

import { Octree } from "three/addons/math/Octree.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

import { Player } from "./player.js";
import { setRenderCallback, setAnimationCallback, animate } from "./animator.js";

// Scene
const scene = new THREE.Scene();
scene.background = new THREE.Color( 0x88CCEE );
scene.fog = new THREE.Fog( 0x333333, 0, 100 );

// Camera
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, .1, 1000 );
camera.rotation.order = 'YXZ';

// Lights
const skyLight = new THREE.HemisphereLight( 0x4488bb, 0x002244, 0.25 );
skyLight.position.set( 2, 1, 1 );
const ambientLight = new THREE.AmbientLight( 0x333333 );

scene.add( skyLight );
scene.add( ambientLight );

// Renderer
const renderer = new THREE.WebGLRenderer( { antialias: true } );
renderer.setPixelRatio( window.devicePixelRatio );
renderer.setSize( window.innerWidth, window.innerHeight );

document.body.appendChild( renderer.domElement );

// Resize
const onWindowResize = () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight );
};

window.addEventListener( 'resize', onWindowResize );

// Dis You?
const player = new Player( camera, 'protagonist' );

// GameLoop
setAnimationCallback( ( fixedDeltaTime ) => {
    player.controls( fixedDeltaTime );
    player.calculate( fixedDeltaTime );
    player.collisions( worldTree );
    player.update( );
} );

setRenderCallback( ( ) => renderer.render( scene, camera ) );

// Level
const worldTree = new Octree();
const loader = new GLTFLoader().setPath( './models/' );

// PlaneJane
const geometry = new THREE.BoxGeometry( 19, .25, 19 );
const material = new THREE.MeshBasicMaterial( { color: 0x777777 } );
const cube = new THREE.Mesh( geometry, material );
cube.position.set( 0, 0, 0 );

// Assets
loader.load( 'map.glb', ( gltf ) => {

    gltf.scene.add( cube );
    scene.add( gltf.scene );
    worldTree.fromGraphNode( gltf.scene );

    animate();
} );
