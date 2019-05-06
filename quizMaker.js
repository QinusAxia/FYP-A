//global variables
var title = null; //title of the quiz
var increment = 1; //to keep track of question number
document.getElementById("quizTitleVal").value = "";

//hide the add question button first
var x = document.getElementById("newStuff");
x.style.display = "none";

$("#addTitle").submit(function () {
    title = document.querySelector('#quizTitleVal').value;
    if (title != "" || title == null) {
        $("#addTitle").replaceWith('<h3>' + title + '</h3>');
        x.style.display = "block"; //show the button 
        //replace the title form with another
        var questionID = title.replace(/\s/g, '') + increment; //removing strings from the title and add increment to create unique question ID
        $("div.newQuest").append("<form class='addQuestion' onsubmit='return false'> <div class='question'> <div> <p> Question " + increment + "</p><label for='test'> Marks<input type='number' id='test'></label></div> <div class='col-md-12'><input type='text' name='questionBox' placeholder='Begin Typing Question here' class='form-control input-lg'></div> <div class='col-md-8'> <div class='input-group'> <div class='input-group-prepend'> <div class='input-group-text'> <input type='radio' name='radioCorrect' value='A' checked> </div> </div> <input type='text' id='" + questionID + "A' name='answer' placeholder='Option A' class='form-control A'> </div> </div> <div class='col-md-8'> <div class='input-group'> <div class='input-group-prepend'> <div class='input-group-text'> <input type='radio' name='radioCorrect' value='B'> </div> </div> <input type='text' id='" + questionID + "B' name='answer' placeholder='Option B' class='form-control B'> </div> </div> <div class='col-md-8'> <div class='input-group'> <div class='input-group-prepend'> <div class='input-group-text'> <input type='radio' name='radioCorrect' value='C'> </div> </div> <input type='text' id='" + questionID + "C' name='answer' placeholder='Option C' class='form-control C'> </div> </div> <div class='col-md-8'> <div class='input-group'> <div class='input-group-prepend'> <div class='input-group-text'> <input type='radio' name='radioCorrect' value='D'> </div> </div> <input type='text' id='" + questionID + "D' name='answer' placeholder='Option D' class='form-control D'> </div> </div> <div class='col-md-12'> <button type='submit' class='saveQuestionBtn btn btn-primary'>Save Question</button> <button type='reset' class='btn btn-secondary'> Reset Question</button> </div> </div> </form>");
        console.log(questionID);
        createDB();
    } else {
        alert("Title cannot be empty");
    }

});

let db = null;

function createDB() { //this function is called when ever a new quiz is made to check if database exist or needs to be updated

//    var dbExists = true;
//    var request2 = window.indexeddb.open("QuizMaker");
//    request2.onupgradeneeded = function (e) {
//        e.target.transaction.abort();
//        dbExists = false;
//    }
//    if(dbExists == true){
//        deleteDatabase();
//        
//    }
        const dbname = "QuizMaker";
        const dbVersion = 1; // something needs to be done about this, because whenever a new object store is created, the dbVersion increases
        const request = indexedDB.open(dbname, dbVersion);

        request.onupgradeneeded = function (event) { //this needs to be called whenever the tutor creates a new quiz
            db = event.target.result;
            var quizTitle = title;
            db.createObjectStore(quizTitle, {
                keypath: "questionid"
            })
            console.log("Object Store " + quizTitle + " has been made");
        }

        //on success
        request.onsuccess = function (event) {
            db = event.target.result
            console.log("Database " + dbname + " version " + dbVersion + " has been succesfully made");
        }
        //on error
        request.onerror = function (event) {
            console.log("Error: " + event.target.errorCode);
        }

}

//function to add new question
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

    console.log(quesID, ques, a, b, c, d, ans, mark); //testing if getting correct values

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
    const tx = db.transaction(title, "readwrite");
    tx.onerror = function (e) {
        alert(` Error! ${e.target.error}  `);
    }
    var quizQuestion = tx.objectStore(title);
    quizQuestion.put(fullquestion, quesID);

});


function getAllItems(callback) {
    var r = indexedDB.open("QuizMaker")
    r.onsuccess = function (e) {
        var db = r.result;
        var trans = db.transaction(title, IDBTransaction.READ_ONLY);
        var store = trans.objectStore(title);
        var items = [];

        trans.oncomplete = function (evt) {
            callback(items);
        };

        var cursorRequest = store.openCursor();

        cursorRequest.onerror = function (error) {
            console.log(error);
        };

        cursorRequest.onsuccess = function (evt) {
            var cursor = evt.target.result;
            if (cursor) {
                items.push(cursor.value);
                cursor.continue();

            }
        };
    }
}

function exportToJsonFile(jsonData) {
    let dataStr = JSON.stringify(jsonData);
    let dataStr2 = '{"' + title + '":' + dataStr + "}";
    let dataUri = 'data:application/json,' + encodeURIComponent(dataStr2);

    let exportFileDefaultName = 'data.json';

    let linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    var dlbtn = document.getElementById("downloadbtn");
    dlbtn.appendChild(linkElement);

    var a = document.createElement('a');
    var linkText = document.createTextNode("Export JSON");
    a.class= "btn btn-outline-primary";
    a.appendChild(linkText);
    a.href = dataUri;
    a.download = (exportFileDefaultName);
    var downloadbtn = document.getElementById('downloadbtn');
    downloadbtn.appendChild(a);
    console.log(dataStr2);
}

function deleteDatabase() {

    var DBDeleteRequest = window.indexedDB.deleteDatabase("QuizMaker");

    DBDeleteRequest.onerror = function (event) {
        console.log("Error deleting database.");
    };

    DBDeleteRequest.onsuccess = function (event) {
        console.log("Database deleted successfully");

        console.log(event.result); // should be undefined
    };
}


var convertfile = document.getElementById('exportjsonfile');

convertfile.onclick = function () {

    getAllItems(function (items) {
        var len = items.length;
        for (var i = 0; i < len; i += 1) {
            console.log(items[i]);
        }

        exportToJsonFile(items);
    })

}

var createNewQuiz = document.getElementById('createnewquiz');

createNewQuiz.onclick = function () {
    document.location.reload();
    deleteDatabase();
}
