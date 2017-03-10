

class DrawingTurtle2D {
  constructor() {
    this.canvas = document.getElementById("mainCanvas");

    this.turtle = {
      posX: this.canvas.width/2,
      posY: this.canvas.height/2,
      angle: Math.PI * 3 / 2
    }
    this.ctx = this.canvas.getContext('2d');
    this.lstring = "";
    this.lineLength = 10;
    this.angleInc = Math.PI / 6;

    this.commandMap = {
      "f": this.drawForward,
      "-": this.turnLeft,
      "+": this.turnRight,
      "[": this.saveState,
      "]": this.restoreState
    }

    this.turtleStates = [];
  }

  drawForward() {
    this.turtle.posX += Math.cos(this.turtle.angle) * this.lineLength;
    this.turtle.posY += Math.sin(this.turtle.angle) * this.lineLength;
    this.ctx.lineTo(this.turtle.posX, this.turtle.posY);

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

      this.ctx.moveTo(this.turtle.posX, this.turtle.posY);
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

    this.reset();
    this.ctx.beginPath();
    this.ctx.moveTo(this.turtle.posX, this.turtle.posY);

    for (var i=0; i<this.lstring.length; i++) {
      var thisChar = this.lstring[i];
      if (thisChar in this.commandMap) {
        this.commandMap[thisChar].apply(this);
      }
      /*
      if (thisChar === 'f') {
        this.drawForward();
      }
      else if (thisChar === '+') {
        this.turnRight();
      }
      else if (thisChar === '-') {
        this.turnLeft();
      }
      */
    }

    this.ctx.stroke();
  }
}

export default DrawingTurtle2D;
