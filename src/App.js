import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

import * as THREE from 'three';


class LSystemInput extends Component {

  constructor(props) {
    super(props);
    this.state = {value: ''};

    this.handleChange = this.handleChange.bind(this);

    //this.onMakeGeometry = this.props.onMakeGeometry;
  }

  handleChange(event) {
    this.setState({value: event.target.value});
    console.log(this.state.value);
    console.log(this.props.onMakeGeometry);
    //this.props.onMakeGeometry();
  }

  render() {
    return (
      <form>
        <label>
          Axiom:
          <input type="text" value={this.state.value} onChange={this.handleChange} />
        </label>
      </form>
    );
  }
}

class DrawingTurtle2D {
  constructor() {


    //get drawing context
    this.canvas = document.getElementById("mainCanvas");

    this.turtle = {
      posX: this.canvas.width/2,
      posY: this.canvas.height/2,
      angle: Math.PI * 3 / 2
    }
    this.ctx = this.canvas.getContext('2d');

    //this.ctx.strokeStyle =
    this.lstring = "f-f+f";

    this.length = 10;

    this.angleInc = Math.PI / 6;
  }

  drawForward() {
    //this.turtle.posX -= this.length;
    //this.turtle.posY -= this.length;
    this.turtle.posX += Math.cos(this.turtle.angle) * this.length;
    this.turtle.posY += Math.sin(this.turtle.angle) * this.length;

    this.ctx.lineTo(this.turtle.posX, this.turtle.posY);
    //this.ctx.lineTo(125, 45);
    //this.ctx.lineTo(45, 125);
  }

  turnLeft() {
    this.turtle.angle -= this.angleInc;
  }

  turnRight() {
    this.turtle.angle += this.angleInc;
  }

  reset() {
    this.turtle.posX = this.canvas.width/2;
    this.turtle.posY = this.canvas.height/2;
    this.turtle.angle = Math.PI * 3 / 2;

    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  draw(lstring) {
    this.lstring = lstring;

    this.reset();

    this.ctx.beginPath();
    //this.ctx.lineTo(125, 45);
    //this.ctx.lineTo(45, 125);
    this.ctx.moveTo(this.turtle.posX, this.turtle.posY);

    //this.drawForward();

    for (var i=0; i<this.lstring.length; i++) {
      var thisChar = this.lstring[i];
      if (thisChar === 'f') {
        this.drawForward();
      }
      else if (thisChar === '+') {
        this.turnRight();
      }
      else if (thisChar === '-') {
        this.turnLeft();
      }
    }

    //this.ctx.closePath();
    this.ctx.stroke();
  }
}

class ControlPanel extends Component {
  constructor(props) {
    super(props);

    this.handleClick = this.handleClick.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleClickReset = this.handleClickReset.bind(this);

    this.drawingTurtle = new DrawingTurtle2D();

    this.state = {
      lstring: 'f+f+f',
      intervalId: null
    }
  }
  handleClick(e) {
    e.preventDefault();
    //this.props.onDraw();
    //this.drawingTurtle.draw();
    //this.setState({ lstring: this.state.lstring += 'f' });
    //this.animateDraw();

    this.state.intervalId = setInterval(() => {
      let randVal = Math.floor(Math.random() * 3);
      let randChar;
      if (randVal === 0)
        randChar = 'f';
      else if (randVal === 1)
        randChar = '-';
      else if (randVal === 2)
        randChar = '+';

      this.setState({ lstring: this.state.lstring += randChar });
      //this.textArea.click();
      this.drawingTurtle.draw(this.state.lstring);
    },10);
/*
    let that=this;
    window.setTimeout(function() {

    }, 1000);
    */
  }

  handleClickReset(e) {
    e.preventDefault();
    clearInterval(this.state.intervalId);
    this.setState({ lstring: '' });
    this.drawingTurtle.draw('');
  }

  handleChange(e) {
    e.preventDefault();
    //this.props.onDraw();
    console.log(e.target.value);
    this.setState({ lstring: e.target.value });
    this.drawingTurtle.draw(e.target.value);
  }

  animateDraw() {
    window.setTimeout(function() {
      this.drawingTurtle.draw(this.state.lstring);
      let randVal = Math.floor(Math.random() * 3);
      let randChar;
      if (randVal === 0)
        randChar = 'f';
      else if (randVal === 1)
        randChar = '-';
      else if (randVal === 2)
        randChar = '+';

      this.setState({ lstring: this.state.lstring += randChar });
      //this.textArea.change();

    }, 1000);
  }

  render() {
    const lstringInputStyle = {
      padding: '6px 12px',
      position: 'relative',
	margin: '0',
	width: '100%',
	'font-size': '24px',
	'line-height': '1.4em',
	outline: 'none',
	border: '1px solid #999',
	'box-shadow': 'inset 0 -1px 5px 0 rgba(0, 0, 0, 0.2)',
	'box-sizing': 'border-box',
	'-webkit-font-smoothing': 'antialiased',
	'-moz-font-smoothing': 'antialiased',
	'font-smoothing': 'antialiased'
    };

    return (
      <form>
      {/*}
        <label>
          axiom:
          <input type="text"/>
        </label>
        <label>
          rules:
          <input type="text"/>
          <input type="text"/>
        </label>
        <label>
          iteractions:
          <input type="text"/>
        </label>
        <label>
          output:
          <p></p>
        </label>
        */}
        <label>
          lstring:
          <textarea id="lsystemTextInput"
            value={this.state.lstring}
            onChange={this.handleChange}
            ref={ (input) => {this.textArea = input}}
            style={lstringInputStyle}
            />
        </label>
        <button id="drawButton" onClick={this.handleClick}>Draw</button>
        <button id="resetButton" onClick={this.handleClickReset}>Reset</button>
      </form>
    );
  }
}

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

      //scene = new THREE.Scene();
      //camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 10000 );
      this.state.camera.position.z = 1000;

      //addRandomBox();
      //addRandomBox();

      //renderer = new THREE.WebGLRenderer();
      this.state.renderer.setSize( window.innerWidth, window.innerHeight );

      this.drawBox();

      this.state.renderer.render( this.state.scene, this.state.camera );

      //document.body.appendChild( renderer.domElement );

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

/*
class App extends Component {

  render() {
    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>Tree Growing</h2>
        </div>
        <p className="App-intro">
          Hello
        </p>
        <LSystemInput onMakeGeometry={this.props.onMakeGeometry}/>
      </div>
    );
  }
}
*/

class App extends Component {

  drawFrame() {
    //alert('parent component function!');
    this.refs.drawingPanel.drawBox();
  }

  render() {
    return (
      <div>
        <h1>Growing Things</h1>
        <ControlPanel
          onDraw={() => this.drawFrame()}
          />

      </div>
    );
  }
}

export default App;
