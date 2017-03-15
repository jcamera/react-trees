import DrawingTurtle2D from './DrawingTurtle2D';


class Individual {
  constructor(axiom, frule) {
    this.axiom = axiom || '';
    this.frule = frule || '';
    this.fitness = 0;
    this.lstring = '';
  }
}

class Generator {
  constructor(drawingTurtle) {
    this.population = [];
    this.maxRuleDepth = 2;
    this.maxRuleLength = 10;
    this.symbols = ['f','+','-','[',']'];
    this.numIterations = 3;
    this.bestIndividual = null;
    this.populationSize = 40;
    this.tournamentSize = 3;

    //this.drawingTurtle = new DrawingTurtle2D();
    if (drawingTurtle)
      this.drawingTurtle = drawingTurtle;
    else
      this.drawingTurtle = new DrawingTurtle2D();
  }
  //Individual

  //make initial random population
  makePopulation(size) {
    console.log("Generator - make population");

    this.populationSize = size;
    this.population = [];
    this.bestIndividual = null;

    //build randomPopulation
    for (var i=0; i<size; i++) {
      var ind = new Individual();
      //ind.axiom = this.randomRule();
      ind.axiom = 'f';
      ind.frule = this.randomRule(this.maxRuleDepth);
      console.log('rule: ', ind.frule);
      this.evaluate(ind);
      this.population.push(ind);
    }
  }

  makeNewGeneration(individual) {

    if (!individual && this.bestIndividual)
      individual = this.bestIndividual; //if no one passed in, assume the best
    else {
      console.log('no individuals - initialize population first');
      return;
    }

    //make new population starting with this individual
    var nextGeneration = [individual];
    //try without automatically including winner
    //var nextGeneration = [];

    for (var i=0; i<this.population.length; i++) {
      //try tournament selection
      var parent = this.selectParent(); //select from current population

      //and make child
      var child = this.makeChild(parent);
      this.evaluate(child);
      nextGeneration.push(child);
    }

    console.log('next generation: ', nextGeneration);
    this.population = nextGeneration;
  }

  makeChild(parent) {
    //console.log("make child from: ", parent);

    var child = new Individual(parent.axiom, parent.frule);
    //console.log("new child: ", child);

    //mutate child with probability 1 / # of chars
    var prob = 1 / (parent.axiom.length + parent.frule.length/2);
    child.frule = this.mutate(child.frule, prob);

    return child;
  }

  mutate(str, prob) {
    console.log('mutate with prob: ', prob);
    console.log('start: ', str);

    var pos = 0;
    var newstr = '';
    while (pos < str.length) {
      if (Math.random() < prob && str[pos] !== ']') {
        //change symbol at this position

        var endPos = pos+1; //end of thing we're inserting

        //if branch, then move to one past end of it
        if (str[pos] === '[') {
          var level = 1;
          while (level > 0) {
            if (endPos > str.length)
              return newstr; //couldn't find closing tag, exit
            if (str[endPos] === '[')
              level++;
            else if (str[endPos] === ']')
              level--;
            endPos++;
          }
        }

        var randIndex = Math.floor(Math.random() * 4);
        var newPart = '';
        switch (randIndex) {
          case 0:
            newPart = 'f';
            break;
          case 1:
            newPart = '+';
            break;
          case 2:
            newPart = '-';
            break;
          case 3:
            newPart = '[' + this.randomRule(1) + ']';
            break;
          default:
            break;
        }
        //newstr += this.symbols[randIndex];
        //pos++;

        //stitch together new starting
        str = str.substring(0, pos) + newPart + str.substring(endPos);
        pos += newPart.length;
      }
      else {
        newstr += str[pos];
        pos++
      }
    }
    console.log('end:', newstr);
    return newstr;
  }

  //tournament selection
  selectParent() {
    //pick random member of population
    var bestIndex = Math.floor(Math.random() * this.populationSize);
    var contender;

    for (var i=0; i<this.tournamentSize; i++) {
      //pick another random, and compete
      contender = Math.floor(Math.random() * this.populationSize);
      if (this.population[contender].fitness > this.population[bestIndex].fitness)
        bestIndex = contender;
    }

    return this.population[bestIndex];
  }

  //todo: add branching
  randomRule(maxDepth) {
    var rule = '';
    for (var i=0; i<this.maxRuleLength; i++) {
      //rand value from 0 to number of symbols + 1 for breaking early
      var randVal = Math.floor(Math.random() * (this.symbols.length+1));

      switch (randVal) {
        case 0:
          rule += 'f';
          break;
        case 1:
          rule += '+';
          break;
        case 2:
          rule += '-';
          break;
        case 3:
          //start branch if not too deep
          if (maxDepth > 1)
            rule += '[' + this.randomRule(maxDepth-1) + ']';
          break;
        case 4:
          return rule;
        default:
          break;
      }
    }
      //return rule;
/*
      if (randVal === this.symbols.length) {
        if (rule)
          return rule;
        else
          continue;
      }
      else if (this.symbols[randVal] === '[') {
        //start branch if not too deep
        if (maxDepth > 1)
          rule += '[' + this.randomRule(maxDepth-1) + ']';
      }
      else
        rule += this.symbols[randVal];
    }
    */
    return rule;
  }

  //evaluate fitness of Individual
  evaluate(individual) {
    var lstring = this.generateLString(individual.axiom, individual.frule);
    individual.lstring = lstring;
    //console.log('eval: ', lstring);


    var fitness = 0;

    //very basic fitness criteria - count f's


    var numBranches = 0; //which include an f
    for (var i=0; i<lstring.length; i++) {
      if (lstring[i] === '[') {
        i++;
        var level = 1;
        //this is to find the end of branch, stopping if 'f' found before end of branch
        while (level > 0) {
          if (i > lstring.length)
            break;
          if (lstring[i] === 'f') {
            numBranches++;
            break;
          }
          else if (lstring[i] === '[')
            level++;
          else if (lstring[i] === ']')
            level--;
          i++;
        }
      }
    }
    //fitness = numBranches;


    //get minmax from drawingTurtle
    var extent = this.drawingTurtle.getDrawingExtent(lstring);
    var startPos = this.drawingTurtle.getStartPos();
    //console.log('extent: ', extent);
    //fitness = Math.abs(extent.maxX - extent.minX) * Math.abs(extent.maxY - extent.minY);

    //check if well-balanced, horizontally

    //fitness = (extent.maxY - extent.minY)/2 * numBranches;

    fitness = extent.maxY*6 + extent.maxX-extent.minX + numBranches;

    //get distance to some point
    //fitness = 1 / this.drawingTurtle.distanceToObject(lstring, 0, 0);

    individual.fitness = fitness;
    console.log('fitness: ', fitness);

    //is it the best?
    if (!this.bestIndividual || (individual.fitness > this.bestIndividual.fitness)) {
      this.bestIndividual = individual;
      console.log('new best: ', individual);

      //add stats to best
      this.bestIndividual.stats = {
        branches: numBranches,
        height: extent.maxY - extent.minY,
        width: extent.maxX - extent.minX
      }
    }

  }

  generateLString(axiom, frule) {
    var lstring = '';
    if (axiom && frule) {
      //for every iteration
      lstring = axiom;
      for (var i=0; i<this.numIterations; i++) {
        //for every character in the axiom
        let tempStr = '';
        for (var j=0; j<lstring.length; j++) {
          if (lstring[j] === 'f')
            tempStr += frule;
          else
            tempStr += lstring[j];
        }
        lstring = tempStr;
      }

    }
    return lstring;
  }

  getBest() {
    return this.bestIndividual;
  }

  setIterations(x) {
    if (x > 0)
      this.numIterations = x;
  }

  setAngleInc(x) {
    this.angleInc = x;
  }

}

export default Generator;
