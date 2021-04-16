// drawing ttf fonts with opentype.js and p5js commands.
// note that this ONLY works with ttf fonts, which provide
// the shapes of counters (i.e., the hole in 'O') in
// counter-clockwise order. I use this in the code below
// with the beginContour()/endContour() functions in p5js
// to draw the shapes accordingly.
var colourslider;
var sizeslider;
var textinput;
var text2input;
let font;
let fontData;
let belbotto;
let button;

// groups a list of opentype.js vector commands by contour
function groupByContour(cmds) {
  contours = [];
  current = [];
  for (let cmd of cmds) {
    current.push(cmd);
    if (cmd.type == 'Z') {
      contours.push(current);
      current = [];
    }
  }
  return contours;
}

// determines if a list of commands specify a path in clockwise
// or counter-clockwise order
function counterclockwise(cmds) {
  let sum = 0;
  for (let i = 0; i < cmds.length - 2; i++) {
    let a = cmds[i];
    let b = cmds[i+1];
    if (!(a.hasOwnProperty('x') && b.hasOwnProperty('x'))) {
      continue;
    }
    sum += (b.x - a.x) * (b.y + a.y);
  }
  return sum < 0;
}

// draws contours grouped by groupByContour(). uses clockwise()
// to determine if this contour should be a p5js shape or a p5js
// contour (i.e., cutout of a shape)
function drawContours(contours) {
  let inShape = false;
  for (let i = 0; i < contours.length; i++) {
    if (counterclockwise(contours[i])) {
      if (inShape) {
        endShape(CLOSE);
      }
      beginShape();
      inShape = true;
      drawContour(contours[i]);
    }
    else {
      beginContour();
      drawContour(contours[i]);
      endContour();
    }
  }
  if (inShape) {
    endShape(CLOSE);
  }
}

// draws an individual contour
function drawContour(cmds) {
  for (let i = 0; i < cmds.length; i++) {
    cmd = cmds[i];
    switch (cmd.type) {
      case 'M':
      case 'Z':
        break;
      case 'L':
        vertex(cmd.x, cmd.y);
        break;
      case 'C':
        bezierVertex(
          cmd.x1, cmd.y1, cmd.x2, cmd.y2, cmd.x, cmd.y);
        break;
      case 'Q':
        quadraticVertex(cmd.x1, cmd.y1, cmd.x, cmd.y);
        break;
		}    
  }
}

function preload() {
  fontData = loadBytes('Roboto-Black.ttf');
}

let path;
let path2;

function setup() {
  createCanvas(1200, 700);
  colorMode(HSB, 100);
  background (250, 0, 0, 150);
  font = opentype.parse(fontData.bytes.buffer);
  belbotto = loadFont('Belbott0.ttf');
  colourslider = createSlider(0, 255,150);
  colourslider.position(10, 40);
  sizeslider = createSlider(20, 110, 80);
  sizeslider.position(10, 10);
  button = createButton('click');
  button.position(50, 70);
  button.mousePressed(changeBG);
  text2input = createInput();
  text2input.position(320, 40);
  textinput = createInput ();
  textinput.position(320, 10);
  textinput.input(txtInputEvent);
  path = font.getPath("hello",200, 0, 60);
  path2 = font.getPath("you can play with type here",200, 0, 60);
  path3 =font.getPath("enjoy!", 200, 0, 60);
}

// applies a transformation to the x/y coordinates of each opentypejs
// command you pass to it, according to the callback, which will be
// given the x/y coordinates as parameters and should return an array
// in the form of [x, y]
function commandTransform(cmds, callback) {
  let transformed = [];
	for (let cmd of cmds) {
    let newCmd = {type: cmd.type}
    for (let pair of [['x', 'y'], ['x1', 'y1'], ['x2', 'y2']]) {
      if (cmd.hasOwnProperty(pair[0]) && cmd.hasOwnProperty(pair[1])) {
        let result = callback(cmd[pair[0]], cmd[pair[1]]);
        newCmd[pair[0]] = result[0];
        newCmd[pair[1]] = result[1];
      }
    }
    transformed.push(newCmd);
  }
  return transformed;
}

function changeBG() {
  let val = random(255);
  background(val);

}

function draw() {
  //background(250, 0, 0, 150);
  fill(colourslider.value(), colourslider.value(),colourslider.value());
  textFont(belbotto);
  text(text2input.value(), 300, 650);
  textSize(sizeslider.value());
  stroke(128);
  push(20);
  translate(80, 155);
  drawContours(
    groupByContour(
      commandTransform(path.commands, function(x, y) {
        let newX = x + sin((x*0.20) + (frameCount*0.11));
        let newY = y + cos((y*0.35) + (frameCount*0.17));
        return [newX, newY];
      })
    )
  );
  pop();
  
  push();
  translate(65, 550);
  drawContours(
    groupByContour(
      commandTransform(path3.commands, function(x, y) {
        let newX, newY;
        newX = x;
        if (y < map(sin(frameCount*0.04), -1, 1, 0, -100)) {
          newY = y - 50;
        }
        else {
          newY = y;
        }
        return [newX, newY];
      })
    )
  );
  pop();
  
  push();
  translate(25, 350);
  drawContours(
    groupByContour(
      commandTransform(path2.commands, function(x, y) {
        let newX, newY;
        newY = y;
        newX = x * map(cos(map(x, 0, 550, 0, HALF_PI)), -1, 1, 1,
          map(cos(frameCount*0.07), -1, 1, 0.1, 2));
        return [newX, newY];
      })
    )
  );
  pop();
 
  
}

function txtInputEvent(){
  path2 = font.getPath(this.value(), 200, 0, 60);
    
}
