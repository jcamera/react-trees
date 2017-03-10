

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
    this.length = 10;
    this.angleInc = Math.PI / 6;
  }

  drawForward() {
    this.turtle.posX += Math.cos(this.turtle.angle) * this.length;
    this.turtle.posY += Math.sin(this.turtle.angle) * this.length;
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
  }

  draw(lstring) {
    this.lstring = lstring;

    this.reset();
    this.ctx.beginPath();
    this.ctx.moveTo(this.turtle.posX, this.turtle.posY);

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

    this.ctx.stroke();
  }
}

export default DrawingTurtle2D;
