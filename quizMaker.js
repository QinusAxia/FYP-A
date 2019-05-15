let db = null;
var title = null; //title of the quiz
var increment = 1; //to keep track of question number// is there a better away by getting the number of keys in the objectstore
var dbOpen = false;
var dbversion;

//hide the add question button first
document.getElementById("quizTitleVal").value = "";
var x = document.getElementById("newStuff");
x.style.display = "none";

window.onload = function () { //this function will load the table with the list of quizes in the database
    if (dbOpen) {
        db.close();
        console.log("db closed in before opening new request");
    }

    // if (localStorage.getItem("dbversion") === null) {
    //     localStorage.setItem("dbversion", 1);
    // } // localStorage.setItem('dbversion',parseInt(localStorage.getItem('dbversion'))+1);
    // dbversion = parseInt(localStorage.getItem('dbversion'));
    
    var request = indexedDB.open('QuizMaker');
    request.onsuccess = function (e) {
        db = e.target.result;
        console.log("db open for first request to load the table");
        dbversion = db.version;
        console.log(dbversion);
        dbOpen = true;
        var allStoreNames = new Array();
        var objectStoreNames = db.objectStoreNames;
        for (var i = 0; i < objectStoreNames.length; i++) { //get all objectstore names and put them into an array
            allStoreNames[i] = objectStoreNames[i];
        }
        //fill the table        
        for (let index = 0; index < allStoreNames.length; index++) {
            $("#quizTable tbody").append('<tr><td class="objname">' + allStoreNames[index] + '<td><button class="btn btn-warning deletquiz">Delete</button> <button class="btn btn-secondary editbtn">Edit</button></td>/td></tr>');
        }
    }
    request.onupgradeneeded = function (event) {
        if (dbversion != 1) {
            console.log("WARNING: On upgradeneeded load table NOT have been called");
        }
    }
    //on error
    request.onerror = function (event) {
        console.log("Error: " + event.target.errorCode);
    }
};

$(document).on("click", "button.deletquiz", function () {
    var test = $(this).parents().parent().find("td.objname").html();
    console.log(test);

    if (dbOpen) {
        db.close();
        dbOpen = false;
        console.log("db closed in before opening new request to delete obstore");
    }

    dbversion +=1; console.log(dbversion);    
    var request = indexedDB.open('QuizMaker', dbversion);
    
    request.onsuccess = function (event) {        
        dbOpen = true;
        db = event.target.result;        
        console.log("Database upgrade success version: " + dbversion)
    }

    request.onupgradeneeded = function (event) {        
        db = event.target.result;
        db.deleteObjectStore(test);
        console.log("Object store deleted");        
    }

    //on error
    request.onerror = function (event) {
        console.log("Error: " + event.target.errorCode);
    }

    $(this).parents("tr").remove();

});

$("#addTitle").submit(function () {
    title = document.querySelector('#quizTitleVal').value;
    if (title == "" || title == null) {
        alert("Title cannot be empty");
    } else {

        $("#quizTable tbody").append('<tr><td class="objname">' + title + '<td><button class="btn btn-warning deletquiz">Delete</button> <button class="btn btn-secondary editbtn">Edit</button></td>/td></tr>');

        if (dbOpen) {
            db.close();
            dbOpen = false;
            console.log("db closed in before adding a new quiz");
        }

        var request = indexedDB.open('QuizMaker');
        request.onerror = function (event) {
            console.log("Error: " + event.target.errorCode);;
        }

        request.onsuccess = function (e) {
            console.log("db open for first request to get the version"); //this is to get the version 
            db = e.target.result;
            dbOpen = true;
            dbversion = parseInt(db.version);
            console.log(dbversion);
            var notExist = true;
            var allStoreNames = new Array(); //to compare with title        
            var objectStoreNames = db.objectStoreNames;
            for (var i = 0; i < objectStoreNames.length; i++) {
                allStoreNames[i] = objectStoreNames[i];
            }
            console.log(allStoreNames);
            //code below is validation: making sure its not empty and does not already exist in the database
            for (let index = 0; index < allStoreNames.length; index++) {
                console.log(allStoreNames[index]);
                if (title == allStoreNames[index]) {
                    notExist = false;
                    console.log(notExist);
                }
            }

            if (notExist) {
                if (dbOpen) {
                    db.close();
                    dbOpen = false;
                    console.log("db closed after checking version. Preparing for update");
                }
                dbversion += 1;
                console.log(dbversion);
                var secondRequest = indexedDB.open('QuizMaker', dbversion); //opening higher version
                console.log("db open for secondrequest to add a new quiz: Upgrade needed");
                secondRequest.onupgradeneeded = function (e) {
                    db = e.target.result;
                    // db = secondRequest.result;
                    console.log("On Upgrade has been called to add new quiz");
                    var quizTitle = title;
                    db.createObjectStore(quizTitle, {
                        keypath: "questionid"
                    });
                    console.log("Object Store " + quizTitle + " has been made");
                };

                secondRequest.onsuccess = function (e) {
                    dbOpen = true;
                    console.log("Quiz succesfully added");
                    //then make changes to html
                    $("#addTitle").replaceWith('<h3>' + title + '</h3>');
                    x.style.display = "block"; //show the button 
                    //replace the title form with another
                    var questionID = title.replace(/\s/g, '') + increment; //removing strings from the title and add increment to create unique question ID
                    $("div.newQuest").append("<form class='addQuestion' onsubmit='return false'> <div class='question'> <div> <p> Question " + increment + "</p><label for='test'> Marks<input type='number' id='test'></label></div> <div class='col-md-12'><input type='text' name='questionBox' placeholder='Begin Typing Question here' class='form-control input-lg'></div> <div class='col-md-8'> <div class='input-group'> <div class='input-group-prepend'> <div class='input-group-text'> <input type='radio' name='radioCorrect' value='A' checked> </div> </div> <input type='text' id='" + questionID + "A' name='answer' placeholder='Option A' class='form-control A'> </div> </div> <div class='col-md-8'> <div class='input-group'> <div class='input-group-prepend'> <div class='input-group-text'> <input type='radio' name='radioCorrect' value='B'> </div> </div> <input type='text' id='" + questionID + "B' name='answer' placeholder='Option B' class='form-control B'> </div> </div> <div class='col-md-8'> <div class='input-group'> <div class='input-group-prepend'> <div class='input-group-text'> <input type='radio' name='radioCorrect' value='C'> </div> </div> <input type='text' id='" + questionID + "C' name='answer' placeholder='Option C' class='form-control C'> </div> </div> <div class='col-md-8'> <div class='input-group'> <div class='input-group-prepend'> <div class='input-group-text'> <input type='radio' name='radioCorrect' value='D'> </div> </div> <input type='text' id='" + questionID + "D' name='answer' placeholder='Option D' class='form-control D'> </div> </div> <div class='col-md-12'> <button type='submit' class='saveQuestionBtn btn btn-primary'>Save Question</button> <button type='reset' class='btn btn-secondary'> Reset Question</button> </div> </div> </form>");
                    console.log(questionID);
                    console.log(title);
                };

                secondRequest.onerror = function (e) {
                    console.log("Error: " + e.target.errorCode);
                };
            } else {
                alert("This quiz has a similar name to an existing quiz");
            }
        }
    }

});

//function to add new question interface
$("#newStuff").click(function () {
    increment += 1;
    var questionID = title.replace(/\s/g, '') + increment;
    $("div.newQuest").append("<form class='addQuestion' onsubmit='return false'> <div class='question'> <div> <p> Question " + increment + "</p><label for='test'> Marks<input type='number' id='test'></label></div> <div class='col-md-12'><input type='text' name='questionBox' placeholder='Begin Typing Question here' class='form-control input-lg'></div> <div class='col-md-8'> <div class='input-group'> <div class='input-group-prepend'> <div class='input-group-text'> <input type='radio' name='radioCorrect' value='A' checked> </div> </div> <input type='text' id='" + questionID + "A' name='answer' placeholder='Option A' class='form-control A'> </div> </div> <div class='col-md-8'> <div class='input-group'> <div class='input-group-prepend'> <div class='input-group-text'> <input type='radio' name='radioCorrect' value='B'> </div> </div> <input type='text' id='" + questionID + "B' name='answer' placeholder='Option B' class='form-control B'> </div> </div> <div class='col-md-8'> <div class='input-group'> <div class='input-group-prepend'> <div class='input-group-text'> <input type='radio' name='radioCorrect' value='C'> </div> </div> <input type='text' id='" + questionID + "C' name='answer' placeholder='Option C' class='form-control C'> </div> </div> <div class='col-md-8'> <div class='input-group'> <div class='input-group-prepend'> <div class='input-group-text'> <input type='radio' name='radioCorrect' value='D'> </div> </div> <input type='text' id='" + questionID + "D' name='answer' placeholder='Option D' class='form-control D'> </div> </div> <div class='col-md-12'> <button type='submit' class='saveQuestionBtn btn btn-primary'>Save Question</button> <button type='reset' class='btn btn-secondary'> Reset Question</button> </div> </div> </form>");
    console.log(questionID);
});

$(document).on("click", "button.saveQuestionBtn", function () {
    //get the values from the input
    var quesID = increment;
    var ques = $(this).parent().parent().find("input[name=questionBox]").val();
    var a = $(this).parent().parent().find("input.A").val();
    var b = $(this).parent().parent().find("input.B").val();
    var c = $(this).parent().parent().find("input.C").val();
    var d = $(this).parent().parent().find("input.D").val();
    var ans = $(this).parent().parent().find("input[name=radioCorrect]:checked").parent().parent().parent().find("input[type=text]").val();
    var mark = $(this).parent().parent().find("input[type=number]").val();

    var fullquestion = {
        questionid: quesID,
        question: ques,
        A: a,
        B: b,
        C: c,
        D: d,
        correctAns: ans,
        marks: mark
    }

    console.log(fullquestion); //test to see if data is written correctly

    if (dbOpen) {
        db.close()
        console.log("closing database connection to reopen");
    }

    var request = indexedDB.open('QuizMaker', dbversion);
    request.onupgradeneeded = function (e) {
        console.log("Upgrade needed should NOT have been called");
    }
    request.onsuccess = function (e) {
        db = e.target.result;
        console.log(title + " in " + db.version);
        var tx = db.transaction(title, "readwrite");
        tx.onerror = function (e) {
            alert(` Error! ${e.target.error}  `);
        }
        var quizQuestion = tx.objectStore(title);
        quizQuestion.put(fullquestion, quesID);
    }

    request.onerror = function (e) {
        console.log("Error: " + e.target.errorCode);
    }


});

// function getAllItems(callback) {
//     var r = indexedDB.open("QuizMaker")
//     r.onsuccess = function (e) {
//         var db = r.result;
//         var trans = db.transaction(title, IDBTransaction.READ_ONLY);
//         var store = trans.objectStore(title);
//         var items = [];

//         trans.oncomplete = function (evt) {
//             callback(items);
//         };

//         var cursorRequest = store.openCursor();

//         cursorRequest.onerror = function (error) {
//             console.log(error);
//         };

//         cursorRequest.onsuccess = function (evt) {
//             var cursor = evt.target.result;
//             if (cursor) {
//                 items.push(cursor.value);
//                 cursor.continue();
//             }
//             console.log(items)
//         };
//     }
// }

// function exportToJsonFile(jsonData) {
//     let dataStr = JSON.stringify(jsonData);
//     let dataStr2 = '{"' + title + '":' + dataStr + "}";
//     let dataUri = 'data:application/json,' + encodeURIComponent(dataStr2);

//     let exportFileDefaultName = 'data.json';

//     let linkElement = document.createElement('a');
//     linkElement.setAttribute('href', dataUri);
//     linkElement.setAttribute('download', exportFileDefaultName);
//     linkElement.click();
//     var dlbtn = document.getElementById("downloadbtn");
//     dlbtn.appendChild(linkElement);

//     var a = document.createElement('a');
//     var linkText = document.createTextNode("Export JSON");
//     a.class = "btn btn-outline-primary";
//     a.appendChild(linkText);
//     a.href = dataUri;
//     a.download = (exportFileDefaultName);
//     var downloadbtn = document.getElementById('downloadbtn');
//     downloadbtn.appendChild(a);
//     console.log(dataStr2);
// }

// //This button is supposed to convert the data into json for export
// var convertfile = document.getElementById('exportjsonfile');
// convertfile.onclick = function () {
//     getAllItems(function (items) {
//         var len = items.length;
//         for (var i = 0; i < len; i += 1) {
//             console.log(items[i]);
//         }
//         exportToJsonFile(items);
//     })
// }

//marked for removal because we do not intend to delete the database in real production
// function deleteDatabase() {
//     var DBDeleteRequest = window.indexedDB.deleteDatabase("QuizMaker");
//     DBDeleteRequest.onerror = function (event) {
//         console.log("Error deleting database.");
//     };
//     DBDeleteRequest.onsuccess = function (event) {
//         console.log("Database deleted successfully");
//         console.log(event.result); // should be undefined
//     };
// }

//Marked for removal because creating a new quiz should not require deletion of database
// var createNewQuiz = document.getElementById('createnewquiz');
// createNewQuiz.onclick = function () {
//     document.location.reload();
//     deleteDatabase();
// }
