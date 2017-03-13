import React, { Component } from 'react';
import DrawingTurtle2D from './DrawingTurtle2D';
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
    this.generator = new Generator(this.drawingTurtle);

    this.state = {
      lstring: '',
      intervalId: null,
      isAnimating: false,
      isBranching: false,
      axiom: '',
      frule: '',
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
      let lstring = this.generator.generateLString(this.state.axiom, this.state.frule);
      this.setState({ lstring: lstring });
      this.drawingTurtle.draw(lstring);
      return;
    }
    if (e.target.name === 'makePopulation') {
      this.generator.makePopulation(10);
      return;
    }
    if (e.target.name === 'makeNewGeneration') {
      this.generator.makeNewGeneration();
      var best = this.generator.getBest();
      console.log('best: ', best);
      this.setState( {
        lstring: best.lstring,
        axiom: best.axiom,
        frule: best.frule
      } );
      this.drawingTurtle.draw(best.lstring);
      return;
    }

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
      let lstring = this.generator.generateLString(this.state.axiom, this.state.frule);
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
      padding: '6px'
    }

    return (
      <div>
        <label>
          instructions:
          <input id="lsystemTextInput"
            name="lstring"
            type="text"
            value={this.state.lstring}
            onChange={this.handleChange}
            style={lstringInputStyle}
            />
        </label>
        <label>
          line:
          <input id="lengthInput" type="range" min="1" max="100"
            onChange={this.handleLengthChange}/>
        </label>
        <label>
          angle:
          <input id="angleInput" type="range"
            min="2"
            max="48"
            onChange={this.handleAngleChange} />
        </label>
        <br/>
        <button id="drawButton" onClick={this.handleClick}>Animate</button>
        branching:
        <input name="isBranching" type="checkbox"
          checked={this.state.isBranching}
          onChange={this.handleChange}/>
        <button id="resetButton" onClick={this.handleClickReset}>Reset</button>
        <div style={controlBlockStyle}>
          <input name="axiom" type="text"
            onChange={this.handleChange} value={this.state.axiom}/>
          <input name="frule" type="text"
            onChange={this.handleChange} value={this.state.frule}/>
          <input name="iterations" type="number" min="1" max="20" onChange={this.handleChange}
            value={this.state.iterations}/>
          <button name="generate" onClick={this.handleClick}>Generate</button>
          <button name="makePopulation" onClick={this.handleClick}>Make Population</button>
          <button name="makeNewGeneration" onClick={this.handleClick}>New Generation</button>
        </div>
      </div>
    );
  }
}

export default ControlPanel;
