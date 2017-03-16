import React, { Component } from 'react';
import DrawingTurtle2D from './DrawingTurtle2D';
import DrawingTurtle3D from './DrawingTurtle3D';
import Generator from './Generator';


class ControlPanel extends Component {
  constructor(props) {
    super(props);

    this.handleClick = this.handleClick.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleClickReset = this.handleClickReset.bind(this);
    this.handleLengthChange = this.handleLengthChange.bind(this);
    this.handleAngleChange = this.handleAngleChange.bind(this);

    this.drawingTurtle = new DrawingTurtle2D();
    this.drawingTurtle3d = null;
    this.generator = new Generator(this.drawingTurtle);

    this.state = {
      lstring: '',
      intervalId: null,
      isAnimating: false,
      isBranching: false,
      axiom: '',
      frule: '',
      xrule: '',
      iterations: 3
    }

    this.allowedSymbols = ["f", "+", "-", "[", "]"];

    this.numBranches = 0;
  }

  /*generateLString() {
    if (this.state.axiom && this.state.frule) {
      //for every iteration
      let lstring = this.state.axiom;
      for (var i=0; i<this.state.iterations; i++) {
        //for every character in the axiom
        let tempStr = '';
        for (var j=0; j<lstring.length; j++) {
          if (lstring[j] === 'f')
            tempStr += this.state.frule;
          else
            tempStr += lstring[j];
        }
        lstring = tempStr;
      }
      this.setState({ lstring: lstring });

    }
  }*/

  handleClick(e) {
    e.preventDefault();

    if (e.target.name === 'generate') {
      //this.generateLString();
      let lstring = this.generator.generateLString(this.state.axiom, this.state.frule, this.state.xrule);
      this.setState({ lstring: lstring });
      this.drawingTurtle.draw(lstring);
      return;
    }
    else if (e.target.name === 'makePopulation') {
      this.generator.makePopulation(20);
      return;
    }
    else if (e.target.name === 'makeNewGeneration') {
      this.generator.makeNewGeneration();
      var best = this.generator.getBest();
      console.log('best: ', best);
      this.setState( {
        lstring: best.lstring,
        axiom: best.axiom,
        frule: best.frule,
        xrule: best.xrule,
        stats: best.stats
      } );

      this.drawingTurtle.draw(best.lstring);
      return;
    }
    else if (e.target.name === 'animate') {
      if (!this.state.isAnimating) {

        this.state.intervalId = setInterval(() => {
          let randVal = Math.floor(Math.random() * this.allowedSymbols.length);
          let randChar = this.allowedSymbols[randVal];

          if (!this.state.isBranching && (randChar === "[" || randChar === "]"))
            return;

          if (randChar === "[")
            this.numBranches++;
          else if (randChar === "]") {
            if (this.numBranches > 0)
              this.numBranches--;
            else
              return; //no states to restore

          }
          this.setState({ lstring: this.state.lstring += randChar });
          //this.textArea.click();
          this.drawingTurtle.draw(this.state.lstring);
        },20);

        this.state.isAnimating = true;
      }
      else {
        clearInterval(this.state.intervalId);
        this.state.isAnimating = false;
      }
    }
    else if (e.target.name === 'moveUp') {
      this.drawingTurtle.moveUp();
      this.drawingTurtle.draw(this.state.lstring);
    }
    else if (e.target.name === 'moveDown') {
      this.drawingTurtle.moveDown();
      this.drawingTurtle.draw(this.state.lstring);
    }
    else if (e.target.name === 'moveLeft') {
      this.drawingTurtle.moveLeft();
      this.drawingTurtle.draw(this.state.lstring);
    }
    else if (e.target.name === 'moveRight') {
      this.drawingTurtle.moveRight();
      this.drawingTurtle.draw(this.state.lstring);
    }
    else if (e.target.name === 'make3d') {
      if (this.drawingTurtle3d === null)
        this.drawingTurtle3d = new DrawingTurtle3D();
      this.drawingTurtle3d.draw(this.state.lstring);
      this.drawingTurtle3d.animate();
    }
  }

  handleClickReset(e) {
    e.preventDefault();
    clearInterval(this.state.intervalId);
    this.setState({ lstring: '' });
    this.drawingTurtle.draw('');
  }

  handleChange(e) {
    //e.preventDefault();
    //this.props.onDraw();
    //console.log(e.target.value);
    const name = e.target.name;
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    //this.setState({ lstring: e.target.value });

    this.setState({ [name]: value });
    if (name === 'iterations') {
      this.generator.setIterations(value);
      let lstring = this.generator.generateLString(this.state.axiom, this.state.frule, this.state.xrule);
      this.setState({ lstring: lstring });
    }

/*
    if (name === 'lstring')
      this.setState({ lstring: value });
    console.log('handle change: ' + name + ' value: ' + value);
    console.log('this state: ', this.state);
    */

    //if (name !== 'axiom' && name !== 'frule' && name !== 'iterations')
    if (name === 'lstring')
      this.drawingTurtle.draw(value);
    else
      this.drawingTurtle.draw(this.state.lstring);
  }

  handleLengthChange(e) {
    e.preventDefault();
    //this.props.onDraw();
    //console.log(e.target.value);
    //this.setState({ lstring: e.target.value });
    this.drawingTurtle.lineLength = e.target.value;
    this.drawingTurtle.draw(this.state.lstring);
  }

  handleAngleChange(e) {
    //console.log(e.target.value);
    this.drawingTurtle.angleInc = Math.PI / e.target.value;
    //this.generator.setAngleInc(Math.PI / e.target.value);
    this.drawingTurtle.draw(this.state.lstring);
  }

  /*
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
  */

  render() {
    const lstringInputStyle = {
      padding: '6px 12px',
      position: 'relative',
    	margin: '0',
    	width: '100%',
    	'fontSize': '24px',
    	'lineHeight': '1.4em',
    	outline: 'none',
    	border: '1px solid #999',
    	'boxShadow': 'inset 0 -1px 5px 0 rgba(0, 0, 0, 0.2)',
    	'boxSizing': 'border-box',
    	'WebkitFontSmoothing': 'antialiased',
    	'MozFontSmoothing': 'antialiased',
    	'fontSmoothing': 'antialiased'
        };

    const controlBlockStyle = {
      border: '1px solid #999',
      borderTop: '0',
      padding: '6px',
      fontSize: '13px',
      marginBottom: '5px'
    }

    let animateButtonStyle;
    if (this.state.isAnimating)
      animateButtonStyle = {
        backgroundColor : 'rgb(192, 0, 0)'
      };
    else
      animateButtonStyle = {
        backgroundColor : 'rgb(192, 192, 192)'
      };

    let stats = this.state.stats ? Object.keys(this.state.stats).map((key) => {
      return <span className="statItem" key={key}>{key}: {this.state.stats[key]}  </span>;
    }) : null;


    return (
      <div>
        <div style={controlBlockStyle}>
          <label htmlFor="lsystemTextInput">instructions:</label>
            <input id="lsystemTextInput"
              name="lstring"
              type="text"
              value={this.state.lstring}
              onChange={this.handleChange}
              style={lstringInputStyle}
              />
          </div>
        <div style={controlBlockStyle}>
          <label htmlFor="lengthInput">line:</label>
            <input id="lengthInput" type="range" min="1" max="100"
              onChange={this.handleLengthChange}/>
          <label htmlFor="angleInput">angle:</label>
            <input id="angleInput" type="range"
              min="2"
              max="48"
              onChange={this.handleAngleChange} />
          <button name="moveUp" onClick={this.handleClick}>&#8593;</button>
          <button name="moveDown" onClick={this.handleClick}>&#8595;</button>
          <button name="moveLeft" onClick={this.handleClick}>&#8592;</button>
          <button name="moveRight" onClick={this.handleClick}>&#8594;</button>
        </div>
        <div style={controlBlockStyle}>
          <button id="drawButton" name="animate" onClick={this.handleClick}>Animate</button>
          <button id="resetButton" onClick={this.handleClickReset}>Reset</button>
          <label htmlFor="branchingCheckbox">branching:</label>
          <input name="isBranching" type="checkbox" id="branchingCheckbox"
            checked={this.state.isBranching}
            onChange={this.handleChange}/>
        </div>
        <div style={controlBlockStyle}>
          <label htmlFor="axiomInput">axiom: </label>
          <input name="axiom" type="text" id="axiomInput"
            onChange={this.handleChange} value={this.state.axiom}/>
          <label htmlFor="rulesInput">f => </label>
          <input name="frule" type="text" id="rulesInput"
            onChange={this.handleChange} value={this.state.frule}/>
          <label htmlFor="rulesInput">x => </label>
          <input name="xrule" type="text"
              onChange={this.handleChange} value={this.state.xrule}/>
          <label htmlFor="iterationsInput">iterations: </label>
          <input name="iterations" type="number" min="1" max="8" id="iterationsInput"
          onChange={this.handleChange} value={this.state.iterations}/>
          <button name="generate" onClick={this.handleClick}>Generate</button>
        </div>
        <div style={controlBlockStyle}>
        <button name="makePopulation" onClick={this.handleClick}>Initialize Population</button>
        <button name="makeNewGeneration" onClick={this.handleClick}>New Generation</button>
        <button name="make3d" onClick={this.handleClick}>Make 3d</button>
        </div>
        <div>
            <label>stats: </label> { stats }
        </div>
      </div>
    );
  }
}

export default ControlPanel;
