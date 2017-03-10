import React, { Component } from 'react';
import DrawingTurtle2D from './DrawingTurtle2D';


class ControlPanel extends Component {
  constructor(props) {
    super(props);

    this.handleClick = this.handleClick.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleClickReset = this.handleClickReset.bind(this);
    this.handleLengthChange = this.handleLengthChange.bind(this);
    this.handleAngleChange = this.handleAngleChange.bind(this);

    this.drawingTurtle = new DrawingTurtle2D();

    this.state = {
      lstring: '',
      intervalId: null,
      isAnimating: false,
      isBranching: false
    }

    this.allowedSymbols = ["f", "+", "-", "[", "]"];

    this.numBranches = 0;
  }
  handleClick(e) {
    e.preventDefault();

    if (!this.state.isAnimating) {

      this.state.intervalId = setInterval(() => {
        let randVal = Math.floor(Math.random() * this.allowedSymbols.length);
        let randChar = this.allowedSymbols[randVal];
        /*if (randVal === 0)
          randChar = 'f';
        else if (randVal === 1)
          randChar = '-';
        else if (randVal === 2)
          randChar = '+';*/

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
    console.log(e.target.value);
    const name = e.target.name;
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    //this.setState({ lstring: e.target.value });
    this.setState({ [name]: value });
    this.drawingTurtle.draw(this.state.lstring);
  }

  handleLengthChange(e) {
    e.preventDefault();
    //this.props.onDraw();
    console.log(e.target.value);
    //this.setState({ lstring: e.target.value });
    this.drawingTurtle.lineLength = e.target.value;
    this.drawingTurtle.draw(this.state.lstring);
  }

  handleAngleChange(e) {
    console.log(e.target.value);
    this.drawingTurtle.angleInc = Math.PI / e.target.value;
    this.drawingTurtle.draw(this.state.lstring);
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
        <label>
          lstring:
          <textarea id="lsystemTextInput"
            name="lstring"
            value={this.state.lstring}
            onChange={this.handleChange}
            ref={ (input) => {this.textArea = input}}
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
        <label>
          branching:
          <input name="isBranching" type="checkbox"
            checked={this.state.isBranching}
            onChange={this.handleChange}/>
        </label>
        <br/>
        <button id="drawButton" onClick={this.handleClick}>Animate</button>
        <button id="resetButton" onClick={this.handleClickReset}>Reset</button>

      </form>
    );
  }
}

export default ControlPanel;
