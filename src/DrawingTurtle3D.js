import * as THREE from 'three';

//var OrbitControls = require('three-orbit-controls')(THREE);

class DrawingTurtle3D {
  constructor() {

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 10000 );
    this.camera.position.z = 1000;

    //this.controls = new OrbitControls(this.camera);

    this.lstring = "";
    this.lineLength = 30;
    this.angleInc = Math.PI / 6;

    //this.geometry = new THREE.BoxGeometry( 200, 200, 200 );
    //this.geometry = new THREE.CylinderGeometry( 5, 5, this.lineLength, 32 );
    //this.material = new THREE.MeshBasicMaterial( { color: 0xff0000 } );
    this.geometry = new THREE.Geometry();
    this.material = new THREE.LineBasicMaterial( { color: 0xff0000 } );

    //var mesh = new THREE.Mesh( this.geometry, this.material );
    //this.scene.add( mesh );

    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setSize( window.innerWidth, window.innerHeight );

    document.body.appendChild( this.renderer.domElement );

    this.startX = window.innerWidth/2;
    this.startY = window.innerHeight /2;

    this.turtle = {
      posX: 0,
      posY: -window.innerHeight/2,
      angle: Math.PI / 2
      //angle: 0
    }



    this.commandMap = {
      "f": this.drawForward,
      "-": this.turnLeft,
      "+": this.turnRight,
      "[": this.saveState,
      "]": this.restoreState
    }

    this.turtleStates = [];

    this.lines = [];

    //this.renderer.render( this.scene, this.camera );
    /*
    this.canvas = document.getElementById("mainCanvas");
    this.startX = this.canvas.width/2;
    this.startY = this.canvas.height/2;


    this.ctx = this.canvas.getContext('2d');

    */
  }

  drawForward(arg) {
    this.turtle.posX += Math.cos(this.turtle.angle) * this.lineLength;
    this.turtle.posY += Math.sin(this.turtle.angle) * this.lineLength;
    this.geometry.vertices.push(new THREE.Vector3(this.turtle.posX, this.turtle.posY, 0));
    //if (arg !== 'nodraw')
      //this.ctx.lineTo(this.turtle.posX, this.turtle.posY);

  }

  turnLeft() {
    this.turtle.angle += this.angleInc;
  }

  turnRight() {
    this.turtle.angle -= this.angleInc;
  }

  reset() {
    //this.turtle.posX = this.canvas.width/2;
    //this.turtle.posY = this.canvas.height/2;
    this.turtle.posX = this.startX;
    this.turtle.posY = this.startY;
    this.turtle.angle = Math.PI * 3 / 2;

    //this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.turtleStates = [];
  }

  saveState() {
    this.turtleStates.push({
      posX: this.turtle.posX,
      posY: this.turtle.posY,
      angle: this.turtle.angle
    });
    //console.log(this.turtleStates);
  }

  restoreState() {
    var turtleState = this.turtleStates.pop();
    if (turtleState) {
      this.turtle.posX = turtleState.posX;
      this.turtle.posY = turtleState.posY;
      this.turtle.angle = turtleState.angle;

      //this.lines.push(new THREE.Line( this.geometry, this.material));

      //this.ctx.moveTo(this.turtle.posX, this.turtle.posY);
    }
  }

/*
  set lineLength(x) {
    //this.lineLength = x;
  }

  set angle(x) {
    //this.angle = x;
  }
*/
  draw(lstring) {
    this.lstring = lstring;

    //this.reset();
    //this.ctx.beginPath();
    //this.ctx.moveTo(this.turtle.posX, this.turtle.posY);
    //this.geometry.vertices.push(new THREE.Vector3(0, 0, 0));

    //this.geometry.vertices.push(new THREE.Vector3(0, 100, 0));

    /*var that = this;
    this.scene.children.forEach(function(obj){
      that.scene.remove(obj);
    });*/

    //this.scene.clear();
    //reset scene
    //for (var i=0; i<this.lines.length; i++)
    //  this.scene.remove(this.lines[i]);
    this.scene = new THREE.Scene();
    this.lines = [];
    this.geometry = new THREE.Geometry();
    //this.geometry.vertices = [];
    //this.renderer.render( this.scene, this.camera );

    this.lines.push(new THREE.Line( this.geometry, this.material));

    for (var i=0; i<this.lstring.length; i++) {
      var thisChar = this.lstring[i];
      if (thisChar in this.commandMap) {
        this.commandMap[thisChar].apply(this);
      }
    }

    for (var i=0; i<this.lines.length; i++)
      this.scene.add(this.lines[i]);
    this.renderer.render( this.scene, this.camera );

    //this.ctx.stroke();
  }

  animate() {

      requestAnimationFrame( () => this.animate() );

      //this.lines[0].rotation.x += 0.01;
      this.lines[0].rotation.y += 0.005;

      this.renderer.render( this.scene, this.camera );

  }
}

export default DrawingTurtle3D;
