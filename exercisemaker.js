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
        $("div.newQuest").append("<form class='addQuestion' onsubmit='return false'><div class='question'> <div> <p> Question " + increment + "</p></div> <div class='col-md-12'><input type='text' name='questionBox' id='" + questionID + "Q' placeholder='Begin Typing Question here' class='form-control input-lg'></div></div><div class='col-md-8'><input type='radio' id='" + questionID + "O' name='typeSelect' value='objectiveType' checked> <span>Objective</span> <input type='radio' id='" + questionID + "S' name='typeSelect' value='subjectiveType'> <span>Subjective</span> </div><div class='col-md-8'> <div class='input-group'> <div class='input-group-prepend'> <div class='input-group-text'> <input type='radio' id='objA' disabled name='radioCorrect' value='A' checked> </div> </div> <input type='text' id='" + questionID + "A' name='" + questionID + "answer' placeholder='Option A' class='form-control A'> </div> </div> <div class='col-md-8'> <div class='input-group'> <div class='input-group-prepend'> <div class='input-group-text'> <input type='radio' id='objB' disabled name='radioCorrect' value='B'> </div> </div> <input type='text' id='" + questionID + "B' name='" + questionID + "answer' placeholder='Option B' class='form-control B'> </div> </div> <div class='col-md-8'> <div class='input-group'> <div class='input-group-prepend'> <div class='input-group-text'> <input type='radio' id='objC' disabled name='radioCorrect' value='C'> </div> </div> <input type='text' id='" + questionID + "C' name='" + questionID + "answer' placeholder='Option C' class='form-control C'> </div> </div> <div class='col-md-8'> <div class='input-group'> <div class='input-group-prepend'> <div class='input-group-text'> <input type='radio' id='objD' disabled name='radioCorrect' value='D'> </div> </div> <input type='text' id='" + questionID + "D' name='" + questionID + "answer' placeholder='Option D' class='form-control D'> </div> </div><div class='col-md-12'><button type='submit' class='saveQuestionBtn btn btn-primary' id='" + questionID + "saveQuestion' name='saveQuestion'>Save Question</button><button type='reset' class='btn btn-secondary'> Reset Question</button> </div> </div></form>");
        
        $('input:radio[name="typeSelect"]').change(function () {
            if ($(this).val() == 'subjectiveType') {
                disable(this);
            } else {
                undisable(this);
            }
        });

        function disable(currentQues) {
            var quesID = currentQues.id;
            var questionID2 = quesID.substr(0, quesID.length - 1);
            document.getElementById(questionID2 + "A").disabled = true;
            document.getElementById(questionID2 + "B").disabled = true;
            document.getElementById(questionID2 + "C").disabled = true;
            document.getElementById(questionID2 + "D").disabled = true;
        }

        function undisable(currentQues) {
            var quesID = currentQues.id;
            var questionID2 = quesID.substr(0, quesID.length - 1);
            document.getElementById(questionID2 + "A").disabled = false;
            document.getElementById(questionID2 + "B").disabled = false;
            document.getElementById(questionID2 + "C").disabled = false;
            document.getElementById(questionID2 + "D").disabled = false;
        }

        $("input").on('change', function () {
            var quesID = this.id;
            console.log(quesID);
            console.log(questionID);
            var questionID2 = quesID.substr(0, quesID.length - 1);
            document.getElementById(questionID2 + "saveQuestion").disabled = false;
            document.getElementById(questionID2 + "saveQuestion").innerHTML = 'Save Question';
            document.getElementById(questionID2 + "saveQuestion").style.backgroundColor = '#006dcc';

        });
        
        console.log(questionID);
        createDB();
    } else {
        alert("Title cannot be empty");
    }

});

let db = null;

function createDB() { //this function is called when ever a new quiz is made

    deleteDatabase();

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
    $("div.newQuest").append("<form class='addQuestion' onsubmit='return false'><div class='question'> <div> <p> Question " + increment + "</p></div> <div class='col-md-12'><input type='text' name='questionBox' id='" + questionID + "Q' placeholder='Begin Typing Question here' class='form-control input-lg'></div></div><div class='col-md-8'><input type='radio' name='typeSelect' value='objectiveType' id='" + questionID + "O' checked> <span>Objective</span> <input type='radio' id='" + questionID + "S' name='typeSelect' value='subjectiveType'> <span>Subjective</span> </div><div class='col-md-8'> <div class='input-group'> <div class='input-group-prepend'> <div class='input-group-text'> <input type='radio' id='objA' disabled name='radioCorrect' value='A' checked> </div> </div> <input type='text' id='" + questionID + "A' name='" + questionID + "answer' placeholder='Option A' class='form-control A'> </div> </div> <div class='col-md-8'> <div class='input-group'> <div class='input-group-prepend'> <div class='input-group-text'> <input type='radio' id='objB' disabled name='radioCorrect' value='B'> </div> </div> <input type='text' id='" + questionID + "B' name='" + questionID + "answer' placeholder='Option B' class='form-control B'> </div> </div> <div class='col-md-8'> <div class='input-group'> <div class='input-group-prepend'> <div class='input-group-text'> <input type='radio' id='objC' disabled name='radioCorrect' value='C'> </div> </div> <input type='text' id='" + questionID + "C' name='" + questionID + "answer' placeholder='Option C' class='form-control C'> </div> </div> <div class='col-md-8'> <div class='input-group'> <div class='input-group-prepend'> <div class='input-group-text'> <input type='radio' id='objD' disabled name='radioCorrect' value='D'> </div> </div> <input type='text' id='" + questionID + "D' name='" + questionID + "answer' placeholder='Option D' class='form-control D'> </div> </div><div class='col-md-12'><button type='submit' class='saveQuestionBtn btn btn-primary' id='" + questionID + "saveQuestion' name='saveQuestion'>Save Question</button><button type='reset' class='btn btn-secondary'> Reset Question</button> </div> </div></form>");

    $('input:radio[name="typeSelect"]').change(function () {
        if ($(this).val() == 'subjectiveType') {
            disable(this);
        } else {
            undisable(this);
        }
    });

    function disable(currentQues) {
        var quesID = currentQues.id;
        var questionID2 = quesID.substr(0, quesID.length - 1);
        document.getElementById(questionID2 + "A").disabled = true;
        document.getElementById(questionID2 + "B").disabled = true;
        document.getElementById(questionID2 + "C").disabled = true;
        document.getElementById(questionID2 + "D").disabled = true;
    }

    function undisable(currentQues) {
        var quesID = currentQues.id;
        var questionID2 = quesID.substr(0, quesID.length - 1);
        document.getElementById(questionID2 + "A").disabled = false;
        document.getElementById(questionID2 + "B").disabled = false;
        document.getElementById(questionID2 + "C").disabled = false;
        document.getElementById(questionID2 + "D").disabled = false;
    }

    $(this).parent().parent().find("input").on('change', function () {
        var quesID = this.id;
        var questionID2 = quesID.substr(0, quesID.length - 1);
        document.getElementById(questionID2 + "saveQuestion").disabled = false;
        document.getElementById(questionID2 + "saveQuestion").innerHTML = 'Save Question';
        document.getElementById(questionID2 + "saveQuestion").style.backgroundColor = '#006dcc';

    });

});


//$(document).ready(function() {
//     $(':input[type="submit"]').prop('disabled', true);
//     $('input[type="text"]').keyup(function() {
//        if($(this).val() != '') {
//           $(':input[type="submit"]').prop('disabled', false);
//        }
//     });
// });

function saveQuestion(current) {

    var quesID = current.id.replace("saveQuestion", "");
    var quesID2 = quesID.replace("f", "");

    var ques = $(current).parent().parent().find("input[name=questionBox]").val();
    var quesType = $(current).parent().parent().find("input[name=typeSelect]:checked").val();
    var a = $(current).parent().parent().find("input.A").val();
    var b = $(current).parent().parent().find("input.B").val();
    var c = $(current).parent().parent().find("input.C").val();
    var d = $(current).parent().parent().find("input.D").val();
    //    var current = $(this).parent().parent().find("input[name=radioCorrect]:checked").parent().parent().parent().find("input[type=text]").val();

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

    current.style.background = 'green';
    current.innerHTML = 'Saved';
    current.disabled = true;


}
$(document).on("click", "button.saveQuestionBtn", function () {
    saveQuestion(this);
});


var homeworkname = document.getElementById("homeworkname");


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
