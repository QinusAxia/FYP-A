let db = null;
var dbname = "QuizMaker";
var dbVersion = parseInt(localStorage.getItem("dbversion"));
var request = indexedDB.open(dbname, dbVersion);
var allStoreNames = new Array(); //this is to store all the storenames to display the available quiz
var countQues = 0; //this is to count the number of questions loaded when the submit button is clicked
var rightans = new Array(); //to store all the correct answer

var x = document.getElementById("submithide");
x.style.display = "none"; //hide the submit button initially until quiz is loaded


request.onerror = function (event) {
    console.log("Error: " + event.target.errorCode);;
}

request.onsuccess = function (event) {
    db = event.target.result
    console.log("Database " + dbname + " version " + dbVersion + " has been succesfully opened");
    // loadAllQues();    
    var objectStoreNames = db.objectStoreNames;
    for (var i = 0; i < objectStoreNames.length; i++) {
        allStoreNames[i] = objectStoreNames[i];
    }
    // allStoreNames.pop();
    console.log(allStoreNames);
    filldropdown();
};

function filldropdown() {
    //populate dropdown
    var txt = "";
    allStoreNames.forEach(myFunction);
    document.getElementById("sel1").innerHTML = txt;
    function myFunction(value, index, array) {
        txt = txt + '<option value="' + index + '"> ' + value + '</option>' + "<br>";
    }
}

$("#openQuiz").submit(function () {
    var e = document.getElementById("sel1");
    var quizTitle = e.options[e.selectedIndex].text;
    console.log(quizTitle);
    x.style.display = "block"; //show submit button
    loadAllQues(quizTitle);
});

$(document).on("click", "button#submithide", function () {     
    // var test = $(this).parent().children("div#appendhere").find("input[name=radioAns1]:checked").attr('value');
    // console.log(test);
    //loop as many time as the question number    
    var studans = new Array();    
    for (let index = 1; index <= countQues; index++) {
        var radioName = "input[name=radioAns"+ index + "]:checked";
        



        studans.push($(this).parent().find(radioName).val());        
    }
    console.log(studans);
    checkanswer(studans);
});

function checkanswer(studans) {
    for (let index = 0; index < studans.length; index++) {        
        if (studans[index]==rightans[index]) {
            console.log("Question " + index + " is correct. Correct answer is: " + rightans[index]);            
        } else {
            console.log("Question " + index + " is wrong. Correct answer is: " + rightans[index]);
        }
    }
}


function loadAllQues(quizTitle) {
    var transaction = db.transaction([quizTitle], "readonly");
    var objectStore = transaction.objectStore(quizTitle);
    var request = objectStore.openCursor();

    request.onsuccess = function (event) {
        // for reference
        // var fullquestion = {
        //     questionid: quesID,
        //     question: ques,
        //     A: a,
        //     B: b,
        //     C: c,
        //     D: d,
        //     correctAns: ans,
        //     marks: mark
        //   } 
        var cursor = event.target.result;
        if (cursor) {
            countQues += 1; // increment count
            $("#appendhere").append('<div class="question"> <p>Question ' + cursor.value.questionid + '</p> <p>' + cursor.value.question + '</p> <div class="input-group"> <label for="'+ cursor.key +'A"> <div class="input-group-prepend"> <div class="input-group-text"> <input type="radio" id="'+cursor.key+'A" value="' + cursor.value.A + '" name="radioAns' + cursor.key + '" checked> </div> <span class="input-group-text">A) ' + cursor.value.A + '</span> </div> </label> </div> <div class="input-group"> <label for="'+cursor.key+'B"> <div class="input-group-prepend"> <div class="input-group-text"> <input type="radio" id="'+cursor.key+'B" value="' + cursor.value.B + '" name="radioAns' + cursor.key + '"> </div> <span class="input-group-text">B) ' + cursor.value.B + '</span> </div> </label> </div> <div class="input-group"> <label for="'+cursor.key+'C"> <div class="input-group-prepend"> <div class="input-group-text"> <input type="radio" id="'+cursor.key+'C" value="' + cursor.value.C + '" name="radioAns' + cursor.key + '"> </div> <span class="input-group-text">C) ' + cursor.value.C + '</span> </div> </label> </div> <div class="input-group"> <label for="'+cursor.key+'D"> <div class="input-group-prepend"> <div class="input-group-text"> <input type="radio" id="'+cursor.key+'D" value="' + cursor.value.D + '" name="radioAns' + cursor.key + '"> </div> <span class="input-group-text">D) ' + cursor.value.D + '</span> </div> </label> </div></div>');
            rightans.push(cursor.value.correctAns);
            cursor.continue();
        } else {
            console.log('Entries all displayed. Number of questions: ' + countQues);
        }
    };
}