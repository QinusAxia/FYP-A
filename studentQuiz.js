let db = null;
var dbname = "QuizMaker";
var dbVersion = 1;
var request = indexedDB.open(dbname, dbVersion);

request.onerror = function (event) {
    console.log("Error: " + event.target.errorCode);;
}

request.onsuccess = function (event) {
    db = event.target.result
    console.log("Database " + dbname + " version " + dbVersion + " has been succesfully opened");
    loadAllQues();
};

function loadAllQues() {
    var transaction = db.transaction("yolo", "readonly");
    var objectStore = transaction.objectStore('yolo');
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
            $("#questionReplace").append('<div class="question"> <p>Question ' + cursor.value.questionid + '</p> <p>'+ cursor.value.question +'<span class="mark">' + cursor.value.marks +'</span></p> <div class="input-group"> <div class="input-group-prepend"> <div class="input-group-text"> <input type="radio" name="radioAns '+ cursor.key +'" checked> </div> <span class="input-group-text">A) '+ cursor.value.A +'</span> </div> </div> <div class="input-group"> <div class="input-group-prepend"> <div class="input-group-text"> <input type="radio" name="radioAns '+ cursor.key +'"> </div> <span class="input-group-text">B) ' + cursor.value.B + '</span> </div> </div> <div class="input-group"> <div class="input-group-prepend"> <div class="input-group-text"> <input type="radio" name="radioAns '+ cursor.key +'"> </div> <span class="input-group-text">C) '+ cursor.value.C +'</span> </div> </div> <div class="input-group"> <div class="input-group-prepend"> <div class="input-group-text"> <input type="radio" name="radioAns '+ cursor.key +'"> </div> <span class="input-group-text">D) '+ cursor.value.D +'</span> </div> </div></div>');
            
            cursor.continue();
        } else {
            console.log('Entries all displayed.');
        }
    };
}