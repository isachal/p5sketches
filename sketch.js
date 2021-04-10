var colourslider;
var sizeslider;
var input;
let bebas;


function setup() {
  createCanvas(800, 700);
  
  bebas = loadFont('Bebas-Regular.ttf');
  colourslider = createSlider(0, 255,150);
  colourslider.position(10, 40);
  sizeslider = createSlider(20, 110, 80);
  sizeslider.position(10, 10);
  input = createInput ()
  input.position(320, 10)
}

function draw() {
  background(250, 0, 0, 255);
  strokeWeight(12);
  textFont(bebas);
  textSize(sizeslider.value());
  fill(colourslider.value(), colourslider.value(),           colourslider.value());
  text(input.value(), 20, 300);
  
  
}