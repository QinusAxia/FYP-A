//global variables
var title = null; //title of the homework
var increment = 1; //to keep track of question number
document.getElementById("homeworkTitleVal").value = "";

//hide the add question button first
var x = document.getElementById("newStuff");
x.style.display = "none";

$("#addTitle").submit(function () {
    title = document.querySelector('#homeworkTitleVal').value;
    if (title != "" || title == null) {
        $("#addTitle").replaceWith('<h3>' + title + '</h3>');
        x.style.display = "block"; //show the button 
        //replace the title form with another
        var questionID = title.replace(/\s/g, '') + increment;
        $("div.newQuest").append("<form class='addQuestion' onsubmit='return false'><div class='question'> <div> <p> Question " + increment + "</p></div> <div class='col-md-12'><input type='text' name='questionBox' placeholder='Begin Typing Question here' class='form-control input-lg'></div></div><div class='col-md-8'><input type='radio' name='typeSelect' value='objectiveType' checked> <span>Objective</span> <input type='radio' name='typeSelect' value='subjectiveType'> <span>Subjective</span> </div><div class='col-md-8'> <div class='input-group'> <div class='input-group-prepend'> <div class='input-group-text'> <input type='radio' id='objA' name='radioCorrect' value='A' checked> </div> </div> <input type='text' id='" + questionID + "A' name='answer' placeholder='Option A' class='form-control A'> </div> </div> <div class='col-md-8'> <div class='input-group'> <div class='input-group-prepend'> <div class='input-group-text'> <input type='radio' id='objB' name='radioCorrect' value='B'> </div> </div> <input type='text' id='" + questionID + "B' name='answer' placeholder='Option B' class='form-control B'> </div> </div> <div class='col-md-8'> <div class='input-group'> <div class='input-group-prepend'> <div class='input-group-text'> <input type='radio' id='objC' name='radioCorrect' value='C'> </div> </div> <input type='text' id='" + questionID + "C' name='answer' placeholder='Option C' class='form-control C'> </div> </div> <div class='col-md-8'> <div class='input-group'> <div class='input-group-prepend'> <div class='input-group-text'> <input type='radio' id='objD' name='radioCorrect' value='D'> </div> </div> <input type='text' id='" + questionID + "D' name='answer' placeholder='Option D' class='form-control D'> </div> </div><div class='col-md-12'><button type='submit' class='saveQuestionBtn btn btn-primary'>Save Question</button> <button type='reset' class='btn btn-secondary'> Reset Question</button> </div> </div></form>");

        $('input:radio[name="typeSelect"]').change(function () {
            if ($(this).val() == 'subjectiveType') {
                disable();
            } else {
                undisable();
            }
        });

        function disable() {
            document.getElementById("objA").disabled = true;
            document.getElementById("objB").disabled = true;
            document.getElementById("objC").disabled = true;
            document.getElementById("objD").disabled = true;
            document.getElementById(questionID + "A").disabled = true;
            document.getElementById(questionID + "B").disabled = true;
            document.getElementById(questionID + "C").disabled = true;
            document.getElementById(questionID + "D").disabled = true;
        }

        function undisable() {
            document.getElementById("objA").disabled = false;
            document.getElementById("objB").disabled = false;
            document.getElementById("objC").disabled = false;
            document.getElementById("objD").disabled = false;
            document.getElementById(questionID + "A").disabled = false;
            document.getElementById(questionID + "B").disabled = false;
            document.getElementById(questionID + "C").disabled = false;
            document.getElementById(questionID + "D").disabled = false;
        }

        console.log(questionID);
        createDB();
    } else {
        alert("Title cannot be empty");
    }

});

let db = null;

function createDB() { //this function is called when ever a new quiz is made

    const dbname = "HomeworkMaker";
    const dbVersion = 1;
    const request = indexedDB.open(dbname, dbVersion);

    request.onupgradeneeded = function (event) { //this needs to be called whenever the tutor creates a new quiz
        db = event.target.result;
        var homeworkTitle = title;
        db.createObjectStore(homeworkTitle, {
            keypath: "questionid"
        })
        console.log("Object Store " + homeworkTitle + " has been made");
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
    $("div.newQuest").append("<form class='addQuestion' onsubmit='return false'><div class='question'> <div> <p> Question " + increment + "</p></div> <div class='col-md-12'><input type='text' name='questionBox' placeholder='Begin Typing Question here' class='form-control input-lg'></div></div><div class='col-md-8'><input type='radio' name='typeSelect' value='objectiveType' checked> <span>Objective</span> <input type='radio' name='typeSelect' value='subjectiveType'> <span>Subjective</span> </div><div class='col-md-8'> <div class='input-group'> <div class='input-group-prepend'> <div class='input-group-text'> <input type='radio' id='objA' name='radioCorrect' value='A' checked> </div> </div> <input type='text' id='" + questionID + "A' name='answer' placeholder='Option A' class='form-control A'> </div> </div> <div class='col-md-8'> <div class='input-group'> <div class='input-group-prepend'> <div class='input-group-text'> <input type='radio' id='objB' name='radioCorrect' value='B'> </div> </div> <input type='text' id='" + questionID + "B' name='answer' placeholder='Option B' class='form-control B'> </div> </div> <div class='col-md-8'> <div class='input-group'> <div class='input-group-prepend'> <div class='input-group-text'> <input type='radio' id='objC' name='radioCorrect' value='C'> </div> </div> <input type='text' id='" + questionID + "C' name='answer' placeholder='Option C' class='form-control C'> </div> </div> <div class='col-md-8'> <div class='input-group'> <div class='input-group-prepend'> <div class='input-group-text'> <input type='radio' id='objD' name='radioCorrect' value='D'> </div> </div> <input type='text' id='" + questionID + "D' name='answer' placeholder='Option D' class='form-control D'> </div> </div><div class='col-md-12'><button type='submit' class='saveQuestionBtn btn btn-primary'>Save Question</button> <button type='reset' class='btn btn-secondary'> Reset Question</button> </div> </div></form>");

    $('input:radio[name="typeSelect"]').change(function () {
        if ($(this).val() == 'subjectiveType') {
            disable();
        } else {
            undisable();
        }
    });

    function disable() {
        document.getElementById("objA").disabled = true;
        document.getElementById("objB").disabled = true;
        document.getElementById("objC").disabled = true;
        document.getElementById("objD").disabled = true;
        document.getElementById(questionID + "A").disabled = true;
        document.getElementById(questionID + "B").disabled = true;
        document.getElementById(questionID + "C").disabled = true;
        document.getElementById(questionID + "D").disabled = true;
    }

    function undisable() {
        document.getElementById("objA").disabled = false;
        document.getElementById("objB").disabled = false;
        document.getElementById("objC").disabled = false;
        document.getElementById("objD").disabled = false;
        document.getElementById(questionID + "A").disabled = false;
        document.getElementById(questionID + "B").disabled = false;
        document.getElementById(questionID + "C").disabled = false;
        document.getElementById(questionID + "D").disabled = false;
    }

    console.log(questionID);
});

$(document).on("click", "button.saveQuestionBtn", function () {
    //get the values from the input
    var quesID = increment;

    var ques = $(this).parent().parent().find("input[name=questionBox]").val();
    var quesType = $(this).parent().parent().find("input[name=typeSelect]:checked").val();
    var a = $(this).parent().parent().find("input.A").val();
    var b = $(this).parent().parent().find("input.B").val();
    var c = $(this).parent().parent().find("input.C").val();
    var d = $(this).parent().parent().find("input.D").val();
    //    var ans = $(this).parent().parent().find("input[name=radioCorrect]:checked").parent().parent().parent().find("input[type=text]").val();

    console.log(quesID, ques, a, b, c, d, quesType); //testing if getting correct values


    if (quesType == "objectiveType") {
        var fullquestion = {
            questionid: quesID,
            question: ques,
            A: a,
            B: b,
            C: c,
            D: d,
            questype: quesType
        }

        const tx = db.transaction(title, "readwrite");
        tx.onerror = function (e) {
            alert(` Error! ${e.target.error}  `);
        }
        var homeworkQuestion = tx.objectStore(title);
        homeworkQuestion.put(fullquestion, quesID);
    } else {
        var fullquestion = {
            questionid: quesID,
            question: ques,
            questype: quesType
        }

        const tx = db.transaction(title, "readwrite");
        tx.onerror = function (e) {
            alert(` Error! ${e.target.error}  `);
        }
        var homeworkQuestion = tx.objectStore(title);
        homeworkQuestion.put(fullquestion, quesID);
    }
});



var homeworkname = document.getElementById("homeworkname");
//var submitbtn = document.getElementById("submit");
//
//submitbtn.onclick = function () {
//    submitToDatabase()
//};


function getAllItems(callback) {
    var r = indexedDB.open("HomeworkMaker")
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

function deleteDatabase() {

    var DBDeleteRequest = window.indexedDB.deleteDatabase("HomeworkMaker");

    DBDeleteRequest.onerror = function (event) {
        console.log("Error deleting database.");
    };

    DBDeleteRequest.onsuccess = function (event) {
        console.log("Database deleted successfully");

        console.log(event.result); // should be undefined
    };
}


var submitBtn = document.getElementById('submit');

submitBtn.onclick = function () {
    getConfirmation();
}

function getConfirmation() {
    var retVal = confirm("Do you want to submit ?");
    if (retVal == true) {
        submitToDatabase();
        return true;
    } else {
        return false;
    }
}

function submitToDatabase() {

    var database = firebase.database();
    var ref = database.ref('homework/' + title);

    getAllItems(function (items) {
        var len = items.length;
        for (var i = 0; i < len; i += 1) {
            console.log(items[i]);
            ref.push(items[i]);
        }

    })

}



var createNewHomework = document.getElementById('createnewhomework');

createNewHomework.onclick = function () {
    document.location.reload();
    deleteDatabase();
}
