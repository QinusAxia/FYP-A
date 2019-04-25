const MAIN_MOUSE_BUTTON = 0;

function prepareContext(canvasElement) {
  const dpr = window.devicePixelRatio || 2;
  const rect = canvasElement.getBoundingClientRect();
  canvasElement.width = rect.width * dpr;
  canvasElement.height = rect.height * dpr;
 
  let context = canvasElement.getContext("2d");
	context.scale(dpr, dpr);
	
	// for (i = 80; i < canvasElement.height; i += 80) 
	//      {
	// 	   context.moveTo(10, i);
	// 	   context.lineTo(canvasElement.width - 10, i);
	// 	   context.stroke();
	// 	  }
    //  for (i = 10; i <400; i += 20) 
	  //    {
		//    context.moveTo(i, 0);
		//    context.lineTo(i,canvasElement.width/2);
		//    context.stroke();
		//   }

  return context;
}

function ChangeBackground(){
	document.getElementById("myCanvas").style.background = 'repeating-linear-gradient( 0deg, rgb(158, 158, 104), rgb(158, 158, 104) 5px, lightgoldenrodyellow  5px,lightgoldenrodyellow 80px)';
}

function ChangeBackground2(){
	document.getElementById("myCanvas").style.background = "lightgoldenrodyellow";
}

var pColor = 'black';
var mode = 'pen';

// PENCOLOR CONTROL
function PenColor(color) {
	switch (color.id){
		case "green":
			pColor = "green";
			break;
		case "blue":
			pColor = "blue";
			break;
		case "red":
			pColor = "red";
			break;
		case "yellow":
			pColor = "yellow";
			break;
		case "orange":
			pColor = "orange";
			break;
		case "black":
			pColor = "black";
			break;

	}

	return pColor;
}

// PEN TYPE CONTROL
function PenType(type){
	switch (type.id){
		case 'pen':
			mode = 'pen';
			pColor = 'black';
			break;
		case 'highlight':
			mode = 'highlight';
			pColor = 'yellow';
			break;
		case 'eraser':
			mode ='eraser';
	}

	return mode;
}



// PEN PROPERTY FUNCTION
function setLineProperties(context) {
	context.lineJoin = "round";
	if (mode == "highlight"){
		context.lineCap = "butt";
		context.globalCompositeOperation = "darken";
		context.lineWidth = 50;
	}else if (mode == "pen"){
		context.lineCap = "round";
		context.globalCompositeOperation = "normal";
		context.lineWidth = 8;
	}else if (mode == "eraser"){
		context.lineWidth = 50;
		context.lineCap = "round";
		context.globalCompositeOperation = "destination-out";
	}

	console.log(mode);
	console.log(context.lineCap);

	context.strokeStyle = PenColor(pColor);
	return context;
}

let clearButton = document.getElementById("clearButton");
let theCanvas = document.getElementById("myCanvas");
let theContext = prepareContext(theCanvas);
let shouldDraw = false;

theCanvas.addEventListener("mousedown", start);
theCanvas.addEventListener("mouseup", end);
theCanvas.addEventListener("mousemove", move, false);

// clearButton.addEventListener("click", event => {
//   clearCanvas(theContext);
// });

 
function clearCanvas(context) {
  context.clearRect(0, 0, context.canvas.width, context.canvas.height);  
}

function start(event) {
  if (event.button === MAIN_MOUSE_BUTTON) {
    shouldDraw = true;
		setLineProperties(theContext);

		theContext.beginPath();
	
    let elementRect = event.target.getBoundingClientRect();
		theContext.moveTo(event.clientX - elementRect.left, event.clientY - elementRect.top);

		console.log(PenType(mode));
  }
}

function end(event) {
  if (event.button === MAIN_MOUSE_BUTTON) {
    shouldDraw = false;
  }
}

function move(event) {
  if (shouldDraw) {
    let elementRect = event.target.getBoundingClientRect();
    theContext.lineTo(event.clientX - elementRect.left, event.clientY - elementRect.top);
	theContext.stroke()

  }
}