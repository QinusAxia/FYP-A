var allStoreNames = new Array(); //this is to store all the storenames to display the available quiz
var countQues = 0; //this is to count the number of questions loaded when the submit button is clicked
var rightans = new Array(); //to store all the correct answer
var dbopened = false; // to keep track if db instance is open

let db = null;

window.onload = function () {    
    var dbname = "QuizMaker";

    $("#submithide").toggle();//hide submit quiz button
    $("#returnResult").toggle("slide"); //hide result card;

    if (dbopened) {
        db.close(); console.log("database closed: onload function")
    }
    var request = indexedDB.open(dbname);
    request.onsuccess = function (event) {
        db = event.target.result
        dbopened = true;
        console.log("Database " + dbname + " version " + db.version + " has been succesfully opened");
        // loadAllQues();    
        var objectStoreNames = db.objectStoreNames;
        for (var i = 0; i < objectStoreNames.length; i++) {
            allStoreNames[i] = objectStoreNames[i];
        }    
        console.log(allStoreNames);
        filldropdown();
    };

    request.onupgradeneeded = function(e) {
        console.log("THIS SHOULD NOT HAVE BEEN CALLED unless db is empty");
    }

    request.onerror = function (event) {
        console.log("Error: " + event.target.errorCode);;
    }

}

function filldropdown() { //populate dropdown    
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
    // console.log(quizTitle);
    
    $("#quizTitle").replaceWith('<h3 id="quizTitle">'+quizTitle+'</h3>');
    $("#submithide").toggle();
    $("#hideOnLoad").toggle("slide");
    loadAllQues(quizTitle);
});

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
        //   } 
        var cursor = event.target.result;
        if (cursor) {
            countQues += 1; // increment count
            $("#appendhere").append(' <div class="qSet" id="quesNum'+ cursor.value.questionid +'"> <h4>Question ' + cursor.value.questionid + '</h4> <h5>' + cursor.value.question + '</h5> <div class="ans"> <label class="ctain"> <span class="texta">' + cursor.value.A + '</span> <input type="radio" id="'+cursor.key+'A" name="radioAns' + cursor.key + '" value="A"> <span class="checkmark"></span> </label> </div> <div class="ans"> <label class="ctain"> <span class="texta">' + cursor.value.B + '</span> <input type="radio" id="'+cursor.key+'B" name="radioAns' + cursor.key + '" value="B"> <span class="checkmark"></span> </label> </div> <div class="ans"> <label class="ctain"> <span class="texta">' + cursor.value.C + '</span> <input type="radio" id="'+cursor.key+'C" name="radioAns' + cursor.key + '" value="C"> <span class="checkmark"></span> </label> </div> <div class="ans"> <label class="ctain"> <span class="texta">' + cursor.value.D + '</span> <input type="radio" id="'+cursor.key+'D" name="radioAns' + cursor.key + '" value="D"> <span class="checkmark"></span> </label> </div> </div>');
            rightans.push(cursor.value.correctAns);
            cursor.continue();
        } else {
            // console.log('Entries all displayed. Number of questions: ' + countQues);
            console.log(rightans);
        }
        
    };
} 

$(document).on("click", "button#submithide", function () {     
    // var test = $(this).parent().children("di v#appendhere").find("input[name=radioAns1]:checked").attr('value');
    // console.log(test);
    //loop as many time as the question number 
    var countR=0;
    var countW=0;   
    for (let index = 0; index < countQues; index++) {
        var stuans = $("#quesNum" + (index+1)).find("input[name=radioAns"+(index+1)+"]:checked").attr('value');
        if (stuans==rightans[index]) {//if student answer match right answer
            $("#quesNum" + (index+1)).find("input[name=radioAns"+(index+1)+"]:checked").parent().parent().addClass("correct");//color green
            countR +=1;
        } else {
            $("#quesNum" + (index+1)).find("input[value="+rightans[index]+"]").parent().parent().addClass("wrong");//else color correct answer with red
            countW +=1;
        }
    }

    $("#submitQuiz :input").prop("disabled", true); //disable input after marking
    $("html, body").animate({ scrollTop: 0 }, "fast"); //scroll to top of page    
    $("button#submithide").toggle("slide");

    calcResult(countR,countW);
});

function calcResult(countR,countW) {
    var percentage =parseFloat((countR/countQues)*100).toFixed(1);console.log(percentage + "%");   
    $("span#percent").html(percentage + " %");
    $("span#ratio").html(countR + " correct out of " + countQues);

    
    //Percentage
    //Ratio
    //Time taken
    //
    $("#returnResult").toggle("slide");
}


$(document).on("click", "button#returnMain", function () {
    location.reload();
})