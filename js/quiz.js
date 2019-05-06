/*jslint white:true*/
/*global angular*/



let db;
let dbVersion1 = 1;
var dbVersion;
var version;
let dbReady = false;
let dbOpen = false;
var currentQuiz;
//var currentPage;
//var currentChapterMaximumPage;
var firstObject;
var dataInCurrentQuiz;

document.addEventListener('DOMContentLoaded', () => {
    console.log('dom content loaded');

    //    document.querySelector('#pictureTest').addEventListener('change', doFile);
    //    document.querySelector('#testImageBtn').addEventListener('click', doImageTestWithRecordToLoad);
    //    document.querySelector('#recordToLoad').addEventListener('select', doImageTestWithOption, false);
    //    document.querySelector('#nextPage').addEventListener('click', doImageTestWithNextBtn);
    //    document.querySelector('#previousPage').addEventListener('click', doImageTestWithPreviousBtn);
    document.querySelector('#btnNewQuiz').addEventListener('click', createQuiz);

    document.querySelector('#delQuiz').addEventListener('click', function () {
        deleteQuiz(currentQuiz);
    });
    //    document.querySelector('#delPage').addEventListener('click', function () {
    //        deletePage(currentPage);
    //    });
    //    document.querySelector('#btnEditChapter').addEventListener('click', editChapter);
    initDb();
});

function initDb() {

    let request = indexedDB.open('quiz');

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

        //create chapter button
        for (var i = 0; i < db.objectStoreNames.length; i++) {
            var element = document.createElement("button");
            element.id = db.objectStoreNames[i];
            element.value = db.objectStoreNames[i];
            element.addEventListener("click", function () {
                selectQuiz(this.id);
            });
            element.style = "display: block; width: 100%;";
            element.appendChild(document.createTextNode(db.objectStoreNames[i]));
            var page = document.getElementById("btn");
            page.appendChild(element);
            console.log(element);
        }

    }
}



function importQuiz(dname, arr) {
    console.log(currentQuiz);
    return new Promise(function (resolve) {
        var r = window.indexedDB.open(dname)
        r.onupgradeneeded = function () {
            var idb = r.result
            var store = idb.createObjectStore(currentQuiz, {
                keyPath: "questionid"
            })
        }
        r.onsuccess = function () {
            var idb = r.result
            let tactn = idb.transaction(currentQuiz, "readwrite")
            var store = tactn.objectStore(currentQuiz)
            for (var obj of arr) {
                store.put(obj)
            }
            resolve(idb)
        }
        r.onerror = function (e) {
            alert("Enable to access IndexedDB, " + e.target.errorCode)
        }
    })
}

//function handleFileSelect(evt) {
//	var files = evt.target.files; // FileList object
//
//	// files is a FileList of File objects. List some properties.
//	var output = [];
//	for (var i = 0, f; f = files[i]; i++) {
//		var reader = new FileReader();
//
//		// Closure to capture the file information.
//		reader.onload = (function (theFile) {
//			return function (e) {
//				console.log('e readAsText = ', e);
//				console.log('e readAsText target = ', e.target);
//				try {
//					json = JSON.parse(e.target.result);
//					alert('json global var has been set to parsed json of this file here it is unevaled = \n' + JSON.stringify(json));
//				} catch (ex) {
//					alert('ex when trying to parse json = ' + ex);
//				}
//			}
//		})(f);
//		reader.readAsText(f);
//	}
//
//}

//function doFile(e) {
//    console.log('change event fired for input field');
//    let file = e.target.files[0];
//    var reader = new FileReader();
//    //				reader.readAsDataURL(file);
//    reader.readAsBinaryString(file);
//
//    reader.onload = function (e) {
//        //alert(e.target.result);
//        let bits = e.target.result;
//        let ob = {
//            created: new Date(),
//            data: bits
//        };
//
//        let trans = db.transaction([currentQuiz], 'readwrite');
//        let addReq = trans.objectStore(currentQuiz).add(ob);
//
//        addReq.onerror = function (e) {
//            console.log('error storing data');
//            console.error(e);
//        }

//        trans.oncomplete = function (e) {
//            let image = document.querySelector('#testImage');
//            let trans = db.transaction([currentQuiz], 'readonly');
//            var req2 = trans.objectStore(currentQuiz);
//            var getAllKeysRequest = req2.getAllKeys();
////            getAllKeysRequest.onsuccess = function () {
////                console.log(getAllKeysRequest.result);
////                var countRequest = req2.count();
////                countRequest.onsuccess = function () {
////                    if (countRequest.result != 0) {
////                        currentPage = countRequest.result - 1;
////                        let req = trans.objectStore(currentQuiz).get(getAllKeysRequest.result[currentPage]);
////                        document.getElementById("page").textContent = "Page " + (currentPage + 1);
////                        req.onsuccess = function (e) {
//                            let record = e.target.result;
//                            if (record != undefined) {
//                                console.log('get success', record);
//                                image.src = 'data:image/jpeg;base64,' + btoa(record.data);
//                            } else {
//                                image.src = "";
//                            }
//
//                            document.getElementById("pictureTest").value = "";
////                        }
////                    } else {
////                        image.src = "";
////                        console("hhehehe");
////                    }
//
//                    var recordToLoad = document.getElementById("recordToLoad");
//                    if (recordToLoad.childNodes.length > 0) {
//                        recordToLoad.removeChild(recordToLoad.childNodes[0]);
//                    }
//            }

//        console.log('data stored');
//        alert("data stored");
//    }
//}


//function doImageTestWithOption(selectedPage) {
//    console.log('doImageTest');
//    let image = document.querySelector('#testImage');
//    var transaction = db.transaction([currentChapter], 'readonly');
//    var objectStore = transaction.objectStore(currentChapter);
//
//    var req2 = transaction.objectStore(currentChapter);
//    var getAllKeysRequest = req2.getAllKeys();
//    getAllKeysRequest.onsuccess = function () {
//        console.log(getAllKeysRequest.result);
//        currentPage = selectedPage - 1;
//        let req = transaction.objectStore(currentChapter).get(getAllKeysRequest.result[currentPage]);
//        document.getElementById("page").textContent = "Page " + (currentPage + 1);
//
//        req.onsuccess = function (e) {
//            let record = e.target.result;
//            if (record != undefined) {
//                console.log('get success', record);
//                image.src = 'data:image/jpeg;base64,' + btoa(record.data);
//            } else {
//                image.src = "";
//            }
//        }
//
//
//    }
//}

//function doImageTestWithNextBtn() {
//    console.log('doImageTest');
//    let image = document.querySelector('#testImage');
//    var transaction = db.transaction([currentChapter], 'readonly');
//    var objectStore = transaction.objectStore(currentChapter);
//
//    var req2 = transaction.objectStore(currentChapter);
//    var getAllKeysRequest = req2.getAllKeys();
//    getAllKeysRequest.onsuccess = function () {
//        console.log(getAllKeysRequest.result);
//        //        currentPage = 1;
//
//        var countRequest = req2.count();
//        countRequest.onsuccess = function () {
//            if (countRequest.result != 0) {
//                if (currentPage < countRequest.result - 1) {
//                    currentPage += 1;
//                    console.log(currentPage);
//                }
//                //                currentPage += 1;
//                let req = transaction.objectStore(currentChapter).get(getAllKeysRequest.result[currentPage]);
//                document.getElementById("page").textContent = "Page " + (currentPage + 1);
//
//                req.onsuccess = function (e) {
//                    let record = e.target.result;
//                    if (record != undefined) {
//                        console.log('get success', record);
//                        image.src = 'data:image/jpeg;base64,' + btoa(record.data);
//                    } else {
//                        image.src = "";
//                    }
//                }
//            } else {
//                image.src = "";
//            }
//        }
//    }
//}
//
//function doImageTestWithPreviousBtn() {
//    console.log('doImageTest');
//    let image = document.querySelector('#testImage');
//    var transaction = db.transaction([currentChapter], 'readonly');
//    var objectStore = transaction.objectStore(currentChapter);
//
//    var req2 = transaction.objectStore(currentChapter);
//    var getAllKeysRequest = req2.getAllKeys();
//    getAllKeysRequest.onsuccess = function () {
//        console.log(getAllKeysRequest.result);
//        //        currentPage = 1;
//
//        var countRequest = req2.count();
//        countRequest.onsuccess = function () {
//            if (countRequest.result != 0) {
//                if (currentPage > 0) {
//                    currentPage -= 1;
//                    console.log(currentPage);
//                }
//                //                currentPage -= 1;
//                let req = transaction.objectStore(currentChapter).get(getAllKeysRequest.result[currentPage]);
//                document.getElementById("page").textContent = "Page " + (currentPage + 1);
//                req.onsuccess = function (e) {
//                    let record = e.target.result;
//                    if (record != undefined) {
//                        console.log('get success', record);
//                        image.src = 'data:image/jpeg;base64,' + btoa(record.data);
//                    } else {
//                        image.src = "";
//                    }
//                }
//            } else {
//                image.src = "";
//            }
//        }
//    }
//}

function createQuiz() {
    let quizName = document.getElementById("newQuizName").value;

    if (quizName) {
        if (dbOpen) {
            db.close();
            console.log("db closed in before createquiz");
        }

        var request = indexedDB.open('quiz');
        console.log("db open for first request")
        console.log(dbVersion);
        request.onsuccess = function (e) {
            var database = e.target.result;
            var version = parseInt(database.version);

            database.close();
            console.log("dbclose on firstrequest")
            var secondRequest = indexedDB.open('quiz', version + 1);
            dbVersion = version + 1;
            console.log("db open for secondrequest")
            console.log(dbVersion);



            secondRequest.onupgradeneeded = function (e) {
                var database = e.target.result;
                var objectStore = database.createObjectStore(quizName, {
                    keyPath: 'id',
                    autoIncrement: true
                });
                //create btn after adding new chapter
                var element = document.createElement("button");
                element.id = quizName;
                element.style = "display: block; width: 100%;";
                element.appendChild(document.createTextNode(quizName));
                var page = document.getElementById("btn");
                page.appendChild(element);
                console.log(element);


            };
            secondRequest.onsuccess = function (e) {
                dbVersion = parseInt(database.version);
                e.target.result.close();
                console.log("db closed in second request");
                dbOpen = false;
                document.getElementById("newQuizName").value = "";
                document.location.reload();
            }

            //        initDb();
        }
    }
}


function selectQuiz(id) {
    currentQuiz = id;
    document.getElementById("quiz").textContent = currentQuiz;
    let questionshow = document.getElementById("question");
    let trans = db.transaction([currentQuiz], 'readonly');
    var req2 = trans.objectStore(currentQuiz);
    var getAllKeysRequest = req2.getAllKeys();
    
    while (questionshow.hasChildNodes()) {
      questionshow.removeChild(questionshow.firstChild);
   }
    
    getAllKeysRequest.onsuccess = function () {
        console.log(getAllKeysRequest.result);
        var countRequest = req2.count();
        countRequest.onsuccess = function () {
            if (countRequest.result != 0) {
                //                        image.src = 'data:image/jpeg;base64,' + btoa(record.data);

                //                        var inputtext = document.createElement("INPUT");
                //                        newInput.id = "text" + instance;
                //                        newInput.name = "text" + instance;
                //                        newInput.type = "text";
                //
                //                        var question = document.createElement("label");
                //                        question.value = record.questionid;
                //                        question.style = "display: block; width: 100%;";
                //                        var page = document.getElementById("question");
                //                        page.appendChild(question);
                //                        console.log(question);
                
                var questioncount = 0;

                for (i = 0; i < countRequest.result; i++) {
                    
                    let req = trans.objectStore(currentQuiz).get(getAllKeysRequest.result[i]);
                    //                currentPage = 0;
                    //                document.getElementById("page").textContent = "Page " + (currentPage + 1);
                    req.onsuccess = function (e) {
                        let record = e.target.result;
                        if (record != undefined) {
                            console.log('get success', record);
                            var question;
                            var theInput;
                            var thisQuestion = record;
                            
                            questioncount += 1;
                            console.log(questioncount);

                            //-- we get the values arrary for the question
                            var theValues = thisQuestion.values;

                            //-- we creat a label element for the text label.
                            var label = document.createElement('label');
                            var questionname = document.createElement('P');
                            questionname.textContent = "Question " + questioncount + ": " + thisQuestion.question;
                            //-- we create the form element 
                            var theForm = document.createElement("form");
                            theForm.appendChild(questionname);
                            //-- we set the forms name
                            theForm.setAttribute('name', thisQuestion.question);

                            //-- we iterate over each value and create a input for it and we add the value
                            for (q = 0; q < theValues.length; q++) {
                                
                                theInput = document.createElement("input");

                                theInput.setAttribute('type', "radio");

                                theInput.setAttribute('name', thisQuestion.question);
                                theInput.setAttribute('value', theValues[q]);


                                //-- we add the input to its text label.  ( put it insdie of it )
                                label.appendChild(theInput);
                                label.innerHTML += "<span> " + theValues[q] + "</span><br>";
                                //--we add the label to the form.
                                theForm.appendChild(label);
                            }

                            //-- we get the correct Hype element to append to.
//                            question = document.getElementById("question");
                            questionshow.appendChild(theForm);

                        }
                    }
                    }
            
            }else {
                        image.src = "";
                    }
                

                    document.getElementById("question").value = "";
                }
            } 
            var recordToLoad = document.getElementById("recordToLoad");
            if (recordToLoad.childNodes.length > 0) {
                recordToLoad.removeChild(recordToLoad.childNodes[0]);
            }
        }
    



function deleteQuiz(chap) {
    if (dbOpen) {
        db.close();
        console.log("db closed in before createquiz");
    }
    var request = indexedDB.open('quiz');
    console.log("db open for first request")
    console.log(dbVersion);
    request.onsuccess = function (e) {
        var database = e.target.result;
        var version = parseInt(database.version);

        database.close();
        console.log("dbclose on firstrequest")
        var secondRequest = indexedDB.open('quiz', version + 1);
        dbVersion = version + 1;
        console.log("db open for secondrequest")
        console.log(dbVersion);
        secondRequest.onupgradeneeded = function (e) {
            var database = e.target.result;
            var objectStore = database.deleteObjectStore(chap);
            //create btn after adding new chapter
            var element = document.getElementById(chap);
            element.parentNode.removeChild(element);
            currentQuiz = "";
            document.getElementById("quiz").textContent = "Select Your Quiz";

        };
        secondRequest.onsuccess = function (e) {
            dbVersion = parseInt(database.version);
            e.target.result.close();
            console.log("db closed in second request");
            dbOpen = false;
            document.getElementById("newQuizName").value = "";
            document.location.reload();
        }
    }
}

//function deletePage(page) {
//    let trans = db.transaction([currentChapter], 'readwrite');
//    //    var objectStore = trans.objectStore(currentChapter);
//    var req = trans.objectStore(currentChapter);
//    var getAllKeysRequest = req.getAllKeys();
//    getAllKeysRequest.onsuccess = function () {
//        console.log(getAllKeysRequest.result[currentPage]);
//        var objectStoreRequest = req.delete(getAllKeysRequest.result[currentPage]);
//        objectStoreRequest.onsuccess = function (event) {
//            console.log("deleted Page: " + page);
//            //            document.location.reload();
//            selectChapter(currentChapter);
//        };
//    }
//}
