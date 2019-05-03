const MAIN_MOUSE_BUTTON = 0;

function prepareContext(canvasElement) {
  const dpr = window.devicePixelRatio || 2;
  const rect = canvasElement.getBoundingClientRect();
  canvasElement.width = rect.width * dpr;
  canvasElement.height = rect.height * dpr;
 
  let context = canvasElement.getContext("2d");
	context.scale(dpr, dpr);

  return context;
}

function ChangeBackground(){
	document.getElementById("myCanvas").style.background = 'repeating-linear-gradient( 0deg, rgb(158, 158, 104), rgb(158, 158, 104) 5px, lightgoldenrodyellow  5px,lightgoldenrodyellow 75px)';
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

//TOUCH LISTENER
theCanvas.addEventListener("touchstart", startT, false);
theCanvas.addEventListener("touchend", endT, false);
theCanvas.addEventListener("touchmove", moveT, false);

//MOUSE LISTENER
theCanvas.addEventListener("mousedown", start);
theCanvas.addEventListener("mouseup", end);
theCanvas.addEventListener("mousemove", move, false);

// clearButton.addEventListener("click", event => {
//   clearCanvas(theContext);
// });

 
// function clearCanvas(context) {
//   context.clearRect(0, 0, context.canvas.width, context.canvas.height);  
// }

// MOUSE EVENTS
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

//TOUCH EVENTS
function startT(event) {
	// event.preventDefault();

	shouldDraw = true;
	
	setLineProperties(theContext);

	theContext.beginPath();

	let elementRect = event.target.getBoundingClientRect();
	theContext.moveTo(event.touches[0].clientX - elementRect.left, event.touches[0].clientY - elementRect.top);

	console.log(PenType(mode));
}

function endT(event) {
  if (event.touches.length == 1) {
		// event.preventDefault();
    shouldDraw = false;
  }
}

function moveT(event) {
  if (shouldDraw) {
		// event.preventDefault();

    let elementRect = event.target.getBoundingClientRect();
    theContext.lineTo(event.touches[0].clientX - elementRect.left, event.touches[0].clientY - elementRect.top);
		theContext.stroke()
  }
}

//SAVING FUNCTION
// var button = document.getElementById('save');
// button.addEventListener('click', function (e) {
//     var dataURL = canvas.toDataURL('image/png');
//     button.href = dataURL;
// });