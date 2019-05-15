//var loadDatabase = document.getElementById('loadDatabase');
//var homeworkTitle = document.getElementById('homeworkTitle');

//loadDatabase.onclick = function () {
//    var database = firebase.database();
//    var ref = database.ref('homework');
//    ref.on('value', gotData, errData);
//}
var currentTitle = null;

function loadDatabase() {
    var database = firebase.database();
    var ref = database.ref('homework');
    ref.on('value', gotData, errData);
}

function gotData(data) {
    var homework = data.val();
    var keys = Object.keys(homework);

    console.log(keys);

    for (var i = 0; i < keys.length; i++) {
        //        ref = database.ref('homework/' + keys[i]);
        //        ref.on('value',gotData2,errData2);
        var title = document.createElement("button");
        title.id = keys[i];
        title.value = keys[i];
        title.style= "display: block;"
        
        title.addEventListener("click", function () {
            displayHomework(this.value);
        });
        
        title.appendChild(document.createTextNode(keys[i]));
        var homeworkTitle = document.getElementById('homeworkTitle');
        homeworkTitle.appendChild(title);

    }

}

function errData(err) {
    console.log("Error!");
    console.log(err);
}

function displayHomework(keys) {
    console.log(keys);
    var submissionSection = document.getElementById('submissionSection');

    while (submissionSection.hasChildNodes()) {
        submissionSection.removeChild(submissionSection.firstChild);
    }


    document.getElementById("submission").textContent = keys;
    currentTitle = keys;

    var database = firebase.database();
    var ref = database.ref('submission/' + keys);
    ref.on('value', gotData2, errData2);

    function gotData2(data) {

        var questionkey = data.val();
        var keys = Object.keys(questionkey);
        console.log(keys);
        for (var i = 0; i < keys.length; i++) {
            var titletipass = currentTitle.replace(" ", "-");
            var studentnametopass = keys[i].replace(" ", "-");

            var p = document.createElement("P");
            p.innerHTML = keys[i];
            var a = document.createElement("a");
            a.setAttribute('href', 'viewsubmissionfile.html?homework=' + titletipass +'&student=' + studentnametopass);
            a.appendChild(p);
            submissionSection.appendChild(a);
        }
    }

    function errData2(err) {
        console.log("Error!");
        console.log(err);
    }

}

function getConfirmation(questionkey, keys) {
    var retStudentName = prompt("Enter your name : ", "your name here");
    var retVal = confirm("Do you want to submit ?");
    if (retVal == true) {
        saveHomework(questionkey, keys, retStudentName);
        return true;
    } else {
        return false;
    }
}

function saveHomework(questionkey, keys, retStudentName) {
    var database = firebase.database();
    var ref = database.ref('submission/' + currentTitle + '/' + retStudentName);
    ref.remove();
    
    
    //    var radios = document.getElementById('Dog has hair');
    console.log(currentTitle);

    var database = firebase.database();
    var ref = database.ref('submission/' + currentTitle);
    for (var i = 0; i < keys.length; i++) {
        var k = keys[i];
        console.log(k);
        
    }
    
    var ref = database.ref('submission/' + currentTitle + '/' + retStudentName);

    for (var i = 0; i < keys.length; i++) {
        var k = keys[i];
        var questionid = questionkey[k].questionid;
        var questiontitle = questionkey[k].question;
        var quesType = questionkey[k].questype;
        
        if(quesType == "objectiveType"){
            var a = questionkey[k].A;
            var b = questionkey[k].B;
            var c = questionkey[k].C;
            var d = questionkey[k].D;
            var item = "input[name='" + questiontitle +'obj' + "']:checked";

            var data = {
                questionid: questionid,
                question: questiontitle,
                questype: quesType,
                A: a,
                B: b,
                C: c,
                D: d,
                answer: document.querySelector(item).value
            }

            ref.push(data);
        }else{
            var item = "input[name='" + questiontitle +'sub' + "']";
            
            var data = {
                questionid: questionid,
                question: questiontitle,
                questype: quesType,
                answer: document.querySelector(item).value
            }
            
            
            ref.push(data);
        }
        
        
    }

}


window.onload = function (e) {
    loadDatabase();
}
