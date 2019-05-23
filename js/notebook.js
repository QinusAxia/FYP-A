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
	if (event.touches.length == 1){
		event.preventDefault();
	}

	shouldDraw = true;
	
	setLineProperties(theContext);

	theContext.beginPath();

	let elementRect = event.target.getBoundingClientRect();
	theContext.moveTo(event.touches[0].clientX - elementRect.left, event.touches[0].clientY - elementRect.top);

	console.log(PenType(mode));
}

function endT(event) {
  if (!event.touches.length) {
    shouldDraw = false;
  }
}

function moveT(event) {
  if (shouldDraw) {
		if (event.touches.length == 1){
			event.preventDefault();
		}
		
    let elementRect = event.target.getBoundingClientRect();
    theContext.lineTo(event.touches[0].clientX - elementRect.left, event.touches[0].clientY - elementRect.top);
		theContext.stroke()
  }
}

//SAVING FUNCTION
// var button = document.getElementById('save');
// button.addEventListener('click', function (e) {
// 	var cv = document.getElementById('myCanvas')
// 	button.href = cv.toDataURL("image/png");
// 	button.download = "Painting.png"
// }, false);

//LOADING FUNCTION
// function loadImage() {
// 	var input, file, fr, img;

// 	if (typeof window.FileReader !== 'function') {
// 			write("The file API isn't supported on this browser yet.");
// 			return;
// 	}

// 	input = document.getElementById('imgfile');
// 	if (!input) {
// 			write("Um, couldn't find the imgfile element.");
// 	}
// 	else if (!input.files) {
// 			write("This browser doesn't seem to support the `files` property of file inputs.");
// 	}
// 	else if (!input.files[0]) {
// 			write("Please select a file before clicking 'Load'");
// 	}
// 	else {
// 			file = input.files[0];
// 			fr = new FileReader();
// 			fr.onload = createImage;
// 			fr.readAsDataURL(file);
// 	}

// 	function createImage() {
// 			img = new Image();
// 			img.onload = imageLoaded;
// 			img.src = fr.result;
// 	}

// 	function imageLoaded() {
// 			var canvas = document.getElementById("myCanvas")
// 			canvas.width = img.width;
// 			canvas.height = img.height;
// 			var ctx = canvas.getContext("2d");
// 			ctx.drawImage(img,0,0);
// 			alert(canvas.toDataURL("image/png"));
// 	}

// 	function write(msg) {
// 			console.log(msg);
// 	}
// }

//Create

//IndexedDb
let db;
let dbVersion1 = 1;
var dbVersion;
var version;
let dbReady = false;
let dbOpen = false;
var currentNotebook;
var currentPage;
var currentNotebookMaximumPage;
var firstObject;
var dataIncurrentNotebook;

document.addEventListener('DOMContentLoaded', () => {
    console.log('dom content loaded');

    document.querySelector('#save').addEventListener('click', doFile);
    // //    document.querySelector('#testImageBtn').addEventListener('click', doImageTestWithRecordToLoad);
    // //    document.querySelector('#recordToLoad').addEventListener('select', doImageTestWithOption, false);
    document.querySelector('#nextPage').addEventListener('click', doImageTestWithNextBtn);
    document.querySelector('#previousPage').addEventListener('click', doImageTestWithPreviousBtn);
    document.querySelector('#btnNewNotebook').addEventListener('click', createNotebook);

    // document.querySelector('#delNotebook').addEventListener('click', function () {
    //     deleteNotebook(currentNotebook);
    // });
    // document.querySelector('#delPage').addEventListener('click', function () {
    //     deletePage(currentPage);
    // });
    // //    document.querySelector('#btnEditNotebook').addEventListener('click', editNotebook);
    initDb();
});

function initDb() {
	let request = indexedDB.open('notebook');

	request.onerror = function (e) {
			console.error('Unable to open database.');
	}

	request.onsuccess = function (e) {
			db = e.target.result;
			console.log('db opened');
			console.log(parseInt(db.version));
			dbOpen = true;

			var trans = db.transaction(db.objectStoreNames);
			let addReq = trans.objectStore(db.objectStoreNames[0]);
			//db.objectStoreNames.length
			console.log(addReq.name);

			//create Notebook button
			for (var i = 0; i < db.objectStoreNames.length; i++) {
					var element = document.createElement("button");
					element.id = db.objectStoreNames[i];
					element.value = db.objectStoreNames[i];
					element.addEventListener("click", function () {
							selectNotebook(this.id);
					});
					element.style = "display: block; width: 100%;";
					element.className = "btn btn-outline-secondary btn-lg";
					element.appendChild(document.createTextNode(db.objectStoreNames[i]));
					var page = document.getElementById("notebookSelection");
					page.appendChild(element);
					console.log(element);
			}

			// addReq.onsuccess = function(){
			// 	var cv = document.getElementById('myCanvas');

			// 	let bits = cv.toDataURL("image/png");
			// 	let ob = {
			// 			created: new Date(),
			// 			data: bits
			// 	};

			// 	let trans2 = db.transaction([currentNotebook], 'readwrite');
			// 	let addReq2 = trans2.objectStore(currentNotebook).add(ob);

			// 	addReq2.onerror = function (e) {
			// 			console.log('error storing data');
			// 			console.error(e);
			// 	}
			// }
	}
}

function doFile(e) {
	console.log('change event fired for input field');
	var img = new Image();
	// let file = e.target.files[0];
	// var reader = new FileReader();
	// 				// reader.readAsDataURL(file);
	// reader.readAsBinaryString(file);

	var cv = document.getElementById('myCanvas');

	let bits = cv.toDataURL("image/png");
	let ob = {
			created: new Date(),
			data: bits
	};

	let trans = db.transaction([currentNotebook], 'readwrite');
	let addReq = trans.objectStore(currentNotebook).add(ob);

	addReq.onerror = function (e) {
			console.log('error storing data');
			console.error(e);
	}
	
	// //Save page when choosen
	// var cv = document.getElementById('myCanvas');
	// let bits = cv.toDataURL("image/png");
	
	// let ob = {
	// 		created: new Date(),
	// 		data: bits
	// };
	
	// let trans = db.transaction([currentNotebook], 'readwrite');
	// var req2 = trans.objectStore(currentNotebook);
	// var getAllKeysRequest = req2.getAllKeys();

	// if (trans.objectStore(currentNotebook).get(getAllKeysRequest.result[currentPage]) != null){
	// 	let key = trans.objectStore(currentNotebook).get(getAllKeysRequest.result[currentPage]);
	// 	key.onsuccess = function() {
	// 			let _key = key.result;
	// 			ob.id = _key;
		
	// 			let editReq = trans.objectStore(currentNotebook).put(ob, key);
	// 			editReq.onerror = function (e) {
	// 					console.log('error storing data');
	// 					console.error(e);
	// 			}
	// 	}
	// }

	trans.oncomplete = function (e) {
			let canvas = document.querySelector('#myCanvas');
			let trans = db.transaction([currentNotebook], 'readonly');
			var req2 = trans.objectStore(currentNotebook);
			var getAllKeysRequest = req2.getAllKeys();
			getAllKeysRequest.onsuccess = function () {
					console.log(getAllKeysRequest.result);
					var countRequest = req2.count();
					countRequest.onsuccess = function () {
							if (countRequest.result != 0) {
									currentPage = countRequest.result - 1;
									let req = trans.objectStore(currentNotebook).get(getAllKeysRequest.result[currentPage]);
									document.getElementById("page").textContent = "Page " + (currentPage + 1);
									req.onsuccess = function (e) {
											let record = e.target.result;
											if (record != undefined) {
													console.log('get success', record);

													img.src = 'data:image/png;base64,' + btoa(record.data);
													img.onload = imageLoaded;
													
													function imageLoaded() {
														const dpr = window.devicePixelRatio || 2;
															canvas.width = img.width * dpr;
															canvas.height = img.height * dpr;
															var ctx = canvas.getContext("2d");
															ctx.drawImage(img,0,0);
													}
											} else {
													// image.src = "";
											}

											document.getElementById("save").value = "";
									}
							} else {
									img.src = "";
									console("hhehehe");
							}
					}
			}
			console.log('data stored');
			alert("data stored");
	}
	// }
}

function createNotebook() {
	let NotebookName = document.getElementById("newNotebookName").value;

    if (NotebookName) {
        if (dbOpen) {
            db.close();
            console.log("db closed in before createnotebook");
        }

        var request = indexedDB.open('notebook');
        console.log("db open for first request")
        console.log(dbVersion);
        request.onsuccess = function (e) {
            var database = e.target.result;
            var version = parseInt(database.version);

            database.close();
            console.log("dbclose on firstrequest")
            var secondRequest = indexedDB.open('notebook', version + 1);
            dbVersion = version + 1;
            console.log("db open for secondrequest")
            console.log(dbVersion);

            secondRequest.onupgradeneeded = function (e) {
                var database = e.target.result;
                var objectStore = database.createObjectStore(NotebookName, {
                    keyPath: 'id',
                    autoIncrement: true
                });
                //create btn after adding new Notebook
                var element = document.createElement("button");
                element.id = NotebookName;
                element.style = "display: block; width: 100%;";
                element.appendChild(document.createTextNode(NotebookName));
                var page = document.getElementById("notebookSelection");
                page.appendChild(element);
                console.log(element);


            };
            secondRequest.onsuccess = function (e) {
                dbVersion = parseInt(database.version);
                e.target.result.close();
                console.log("db closed in second request");
                dbOpen = false;
                document.getElementById("newNotebookName").value = "";
                document.location.reload();
            }

            //        initDb();
        }
    }
}

function selectNotebook(id) {
	currentNotebook = id;
	document.getElementById("title").textContent = "Title: " + currentNotebook;
	var img = new Image();
	let canvas = document.querySelector('#myCanvas');
	let trans = db.transaction([currentNotebook], 'readonly');
	var req2 = trans.objectStore(currentNotebook);
	var getAllKeysRequest = req2.getAllKeys();
	getAllKeysRequest.onsuccess = function () {
		console.log(getAllKeysRequest.result);
		var countRequest = req2.count();
		countRequest.onsuccess = function () {
				if (countRequest.result != 0) {
						currentPage = countRequest.result - 1;
						document.getElementById("nextPage").innerHTML = "Add"
						let req = trans.objectStore(currentNotebook).get(getAllKeysRequest.result[currentPage]);
						document.getElementById("page").textContent = "Page " + (currentPage + 1);
						req.onsuccess = function (e) {
								let record = e.target.result;
								if (record != undefined) {
										console.log('get success', record);

										img.src = record.data;
										img.onload = imageLoaded;
										
										function imageLoaded() {
												const dpr = window.devicePixelRatio || 2;
												canvas.width = img.width * dpr;
												canvas.height = img.height * dpr;
												var ctx = canvas.getContext("2d");
												ctx.drawImage(img,0,0);
										}
								} else {
										// image.src = "";
								}

								document.getElementById("save").value = "";
						}
				} else {
						img.src = "";
						console.log("hhehehe");
				}
		}
}
	//create Notebook button
}


function doImageTestWithNextBtn() {
	console.log('doImageTest');
	var img = new Image();
	let canvas = document.querySelector('#myCanvas');
	var transaction = db.transaction([currentNotebook], 'readonly');
	var req2 = transaction.objectStore(currentNotebook);
	var getAllKeysRequest = req2.getAllKeys();

	//Find page thing
	getAllKeysRequest.onsuccess = function () {
			console.log("allkey:" + getAllKeysRequest.result);
			console.log("currentkey: " + getAllKeysRequest.result[currentPage]);

				// //Save page when choosen
				// var cv = document.getElementById('myCanvas');
				// let bits = cv.toDataURL("image/png");
				
				// let ob = {
				// 		created: new Date(),
				// 		data: bits
				// };
				
				// let trans = db.transaction([currentNotebook], 'readwrite');
				
				// let key = trans.objectStore(currentNotebook).get(getAllKeysRequest.result[currentPage]);
				// key.onsuccess = function() {
				// 		let _key = key.result;
				// 		ob.id = _key;
				
				// 		let editReq = trans.objectStore(currentNotebook).put(ob, key);
				// 		editReq.onerror = function (e) {
				// 				console.log('error storing data');
				// 				console.error(e);
				// 		}
				// }

			var countRequest = req2.count();
			countRequest.onsuccess = function () {
					if (countRequest.result != 0) {
							if (currentPage < countRequest.result - 1) {
									currentPage += 1;
									console.log(currentPage);
							}
							if(currentPage == countRequest.result - 1){
									document.getElementById("nextPage").innerHTML = "Add";
									console.log("current1 = " + currentPage);
							}
							
							let req = transaction.objectStore(currentNotebook).get(getAllKeysRequest.result[currentPage]);
							document.getElementById("page").textContent = "Page " + (currentPage + 1);

							req.onsuccess = function (e) {
									let record = e.target.result;
									if (record != undefined) {
											console.log('get success' , record);

											//Load image
											img.src = record.data;
											img.onload = imageLoaded;
											
											function imageLoaded() {
													const dpr = window.devicePixelRatio || 2;
													canvas.width = img.width * dpr;
													canvas.height = img.height * dpr;
													var ctx = canvas.getContext("2d");
													ctx.drawImage(img,0,0);
											}

									} else {
											img.src = "";
									}
							}
					} else {
							image.src = "";
					}
			}
	}
}

function doImageTestWithPreviousBtn() {
	console.log('doImageTest');
	var img = new Image();
	let canvas = document.querySelector('#myCanvas');
	var transaction = db.transaction([currentNotebook], 'readonly');
	var objectStore = transaction.objectStore(currentNotebook);
	var req2 = transaction.objectStore(currentNotebook);
	var getAllKeysRequest = req2.getAllKeys();
	getAllKeysRequest.onsuccess = function () {
			console.log(getAllKeysRequest.result);
			//        currentPage = 1;

			var countRequest = req2.count();
			countRequest.onsuccess = function () {
					if (countRequest.result != 0) {
							if (currentPage > 0) {
									currentPage -= 1;
									document.getElementById("nextPage").innerHTML = "Next"
									console.log(currentPage);
							}
							let req = transaction.objectStore(currentNotebook).get(getAllKeysRequest.result[currentPage]);
							document.getElementById("page").textContent = "Page " + (currentPage + 1);
							req.onsuccess = function (e) {
									let record = e.target.result;
									if (record != undefined) {
											console.log('get success', record);
											
											img.src = record.data;
											img.onload = imageLoaded;
											
											function imageLoaded() {
													console.log(img);
													const dpr = window.devicePixelRatio || 2;
													canvas.width = img.width * dpr;
													canvas.height = img.height * dpr;
													var ctx = canvas.getContext("2d");
													ctx.drawImage(img,0,0);
											}
									} else {
											// img.src = "";
									}
							}
					} else {
							// img.src = "";
					}
			}
	}
}