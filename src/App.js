import React, { Component } from 'react';
import './App.css';
import ControlPanel from './ControlPanel';
//import * as THREE from 'three';


class App extends Component {

  drawFrame() {
    //alert('parent component function!');
    this.refs.drawingPanel.drawBox();
  }

  render() {
    return (
      <div>
        <h1>Growing Images</h1>
        <ControlPanel
          onDraw={() => this.drawFrame()}
          />

      </div>
    );
  }
}

/*
//this is just a three.js experiment
class DrawingPanel extends Component {

  constructor() {
      super();

      var canvasElement = document.getElementById("mainCanvas");

      this.state = {
        scene: new THREE.Scene(),
        camera: new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 10000 ),
        renderer: new THREE.WebGLRenderer({
          canvas: canvasElement
        })
      }

      this.state.camera.position.z = 1000;
      this.state.renderer.setSize( window.innerWidth, window.innerHeight );
      this.drawBox();
      this.state.renderer.render( this.state.scene, this.state.camera );
      this.drawBox = this.drawBox.bind(this);
  }

  drawBox() {
    var rand = Math.random() * 400;
    var geometry = new THREE.BoxGeometry( rand, rand, rand );
    var material = new THREE.MeshBasicMaterial( { color: 0xff0000, wireframe: true } );
    var mesh = new THREE.Mesh( geometry, material );
    this.state.scene.add( mesh );
  }

  render() {
    return null;
  }
}
*/

export default App;
