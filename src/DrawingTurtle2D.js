

class DrawingTurtle2D {
  constructor() {
    this.canvas = document.getElementById("mainCanvas");

    this.startX = this.canvas.width/2;
    this.startY = this.canvas.height/2;

    this.turtle = {
      posX: this.startX,
      posY: this.startY,
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

  drawForward(arg) {
    this.turtle.posX += Math.cos(this.turtle.angle) * this.lineLength;
    this.turtle.posY += Math.sin(this.turtle.angle) * this.lineLength;
    if (arg !== 'nodraw')
      this.ctx.lineTo(this.turtle.posX, this.turtle.posY);

  }

  turnLeft() {
    this.turtle.angle -= this.angleInc;
  }

  turnRight() {
    this.turtle.angle += this.angleInc;
  }

  reset() {
    //this.turtle.posX = this.canvas.width/2;
    //this.turtle.posY = this.canvas.height/2;
    this.turtle.posX = this.startX;
    this.turtle.posY = this.startY;
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

  getDrawingExtent(lstring) {
    this.lstring = lstring;

    this.reset();

    var extent = {
      minX: this.turtle.posX,
      maxX: this.turtle.posX,
      minY: this.turtle.posY,
      maxY: this.turtle.posY
    };

    for (var i=0; i<this.lstring.length; i++) {
      var thisChar = this.lstring[i];
      if (thisChar in this.commandMap) {
        if (thisChar === 'f') {
          this.drawForward('nodraw');
          var posX = this.turtle.posX;
          var posY = this.turtle.posY;
          if (posX < extent.minX)
            extent.minX = posX;
          if (posX > extent.maxX)
            extent.maxX = posX;
          if (posY < extent.minY)
            extent.minY = posY;
          if (posY > extent.maxY)
            extent.maxY = posY;
        }
        else
          this.commandMap[thisChar].apply(this);
      }
    }
    return extent;
  }

  distanceToObject(lstring, destX, destY) {
    this.lstring = lstring;

    this.reset();

    var minDistance = this.canvas.width;

    for (var i=0; i<this.lstring.length; i++) {
      var thisChar = this.lstring[i];
      if (thisChar in this.commandMap) {
        if (thisChar === 'f') {
          this.drawForward('nodraw');
          var posX = this.turtle.posX;
          var posY = this.turtle.posY;
          var dist = this.getDistance(posX, posY, destX, destY);
          if (dist < minDistance)
            minDistance = dist;
        }
        else
          this.commandMap[thisChar].apply(this);
      }
    }
    return minDistance;
  }

  getDistance(x1, y1, x2, y2) {
    var xdiff = x1-x2;
    var ydiff = y1-y2;
    return Math.sqrt(xdiff*xdiff + ydiff*ydiff);
  }

  getStartPos() {
    return { x: this.startX, y: this.startY};
  }

  setStartPos(x, y) {
    this.startX = x;
    this.startY = y;
  }

  moveUp() {
    this.startY -= 10;
  }
  moveDown() {
    this.startY += 10;
  }
  moveLeft() {
    this.startX -= 10;
  }
  moveRight() {
    this.startX += 10;
  }
}

export default DrawingTurtle2D;
