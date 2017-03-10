import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './index.css';

//try this
//import THREE from 'three';
import * as THREE from 'three';


//put these in state
var scene, camera, renderer;
var geometry, material, mesh;


/*
class ThreeCanvas extends React.Component {

  constructor(props) {
    super(props);

    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 10000 );
    camera.position.z = 1000;

    geometry = new THREE.BoxGeometry( 200, 200, 200 );
    material = new THREE.MeshBasicMaterial( { color: 0xff0000, wireframe: true } );

    mesh = new THREE.Mesh( geometry, material );
    scene.add( mesh );

    renderer = new THREE.WebGLRenderer();
    renderer.setSize( window.innerWidth, window.innerHeight );
  }

  render() {
    return (
      <canvas id="threeCanvas" height="600" width="600">
      </canvas>
    );
  }
}
*/

ReactDOM.render(
  <App onMakeGeometry={addRandomBox}/>,
  document.getElementById('root')
);







//init();
//animate();

function init() {

    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 10000 );
    camera.position.z = 1000;

    addRandomBox();
    addRandomBox();

    renderer = new THREE.WebGLRenderer();
    renderer.setSize( window.innerWidth, window.innerHeight );

    document.body.appendChild( renderer.domElement );

}

function addRandomBox() {
  var rand = Math.random() * 400;
  geometry = new THREE.BoxGeometry( rand, rand, rand );
  material = new THREE.MeshBasicMaterial( { color: 0xff0000, wireframe: true } );

  mesh = new THREE.Mesh( geometry, material );
  scene.add( mesh );
}

function animate() {

    requestAnimationFrame( animate );

    mesh.rotation.x += 0.01;
    mesh.rotation.y += 0.02;

    renderer.render( scene, camera );

}
