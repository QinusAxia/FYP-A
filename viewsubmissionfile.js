//var loadDatabase = document.getElementById('loadDatabase');
//var homeworkTitle = document.getElementById('homeworkTitle');
//
//loadDatabase.onclick = function () {
//    var database = firebase.database();
//    var ref = database.ref('homework');
//    ref.on('value', gotData, errData);
//}
var currentTitle = null;
var currentStudent = null;

function loadDatabase() {
    var homeworktitle = getUrlVars()["homework"];
    console.log(homeworktitle);
    var studentname = getUrlVars()["student"];
    console.log(studentname);
    var homeworktitlenew = homeworktitle.replace('-', ' ');
    var studentnamenew = studentname.replace('-', ' ');
    
    currentTitle = homeworktitlenew;
    currentStudent = studentnamenew;

    var database = firebase.database();
    var ref = database.ref('submission/' + homeworktitlenew + '/' + studentnamenew);
    ref.on('value', gotData, errData);
}

function gotData(data) {
    var studentquestion = data.val();
    var keys = Object.keys(studentquestion);

    console.log(keys);
    var submissionsec = document.getElementById('submissionSection');
    
    for (var i = 0; i < keys.length; i++) {
        var k = keys[i];
        var question = studentquestion[k].question;
        var questype = studentquestion[k].questype;
        var answer = studentquestion[k].answer;

        if (questype == "objectiveType") {
            var a = studentquestion[k].A;
            var b = studentquestion[k].B;
            var c = studentquestion[k].C;
            var d = studentquestion[k].D;
            console.log(question, questype, answer, a, b, c, d);

            var questitle = document.createElement('p');
            questitle.setAttribute('style', 'font-weight:bold');
            questitle.innerHTML = question;
            var obja = document.createElement('p');
            var objb = document.createElement('p');
            var objc = document.createElement('p');
            var objd = document.createElement('p');

            obja.innerHTML = 'A: ' + a;
            objb.innerHTML = 'B: ' + b;
            objc.innerHTML = 'C: ' + c;
            objd.innerHTML = 'D: ' + d;

            var ans = document.createElement('p');
            ans.innerHTML = 'Selected Answer: ' + answer;

            submissionsec.appendChild(questitle);
            submissionsec.appendChild(obja);
            submissionsec.appendChild(objb);
            submissionsec.appendChild(objc);
            submissionsec.appendChild(objd);
            submissionsec.appendChild(objd);
            submissionsec.appendChild(ans);

            var label = document.createElement('label');

            var theInput = document.createElement("input");
            theInput.setAttribute('type', "radio");
            theInput.setAttribute('name', question + 'obj');
            theInput.setAttribute('id', question + 'obj');
            theInput.setAttribute('value', 'correct');
            label.appendChild(theInput);
            label.innerHTML += "<span> " + 'Correct ' + "</span>";
            submissionsec.appendChild(label);

            theInput.setAttribute('type', "radio");
            theInput.setAttribute('name', question + 'obj');
            theInput.setAttribute('id', question + 'obj');
            theInput.setAttribute('value', 'wrong');
            label.appendChild(theInput);
            label.innerHTML += "<span> " + 'Wrong' + "</span><br>";
            submissionsec.appendChild(label);

            var commenttext = document.createElement('P');
            commenttext.innerHTML = "Comment: ";

            var commentinputfield = document.createElement('input');
            commentinputfield.setAttribute('type', "text");
            commentinputfield.setAttribute('name', question + 'comment');
            commentinputfield.setAttribute('id', question + 'comment');

            submissionsec.appendChild(commenttext);
            submissionsec.appendChild(commentinputfield);

            var hr = document.createElement('hr');
            submissionsec.appendChild(hr);



        } else {
            var questitle = document.createElement('p');
            questitle.setAttribute('style', 'font-weight:bold');
            questitle.innerHTML = question;

            var ans = document.createElement('p');
            ans.innerHTML = 'Selected Answer: ' + answer;

            submissionsec.appendChild(questitle);
            submissionsec.appendChild(ans);

            var label = document.createElement('label');

            var theInput = document.createElement("input");
            theInput.setAttribute('type', "radio");
            theInput.setAttribute('name', question + 'obj');
            theInput.setAttribute('id', question + 'obj');
            theInput.setAttribute('value', 'correct');
            label.appendChild(theInput);
            label.innerHTML += "<span> " + 'Correct ' + "</span>";
            submissionsec.appendChild(label);

            theInput.setAttribute('type', "radio");
            theInput.setAttribute('name', question + 'obj');
            theInput.setAttribute('id', question + 'obj');
            theInput.setAttribute('value', 'wrong');
            label.appendChild(theInput);
            label.innerHTML += "<span> " + 'Wrong' + "</span><br>";
            submissionsec.appendChild(label);

            var commenttext = document.createElement('P');
            commenttext.innerHTML = "Comment: ";

            var commentinputfield = document.createElement('input');
            commentinputfield.setAttribute('type', "text");
            commentinputfield.setAttribute('name', question + 'comment');
            commentinputfield.setAttribute('id', question + 'comment');

            submissionsec.appendChild(commenttext);
            submissionsec.appendChild(commentinputfield);

            var hr = document.createElement('hr');
            submissionsec.appendChild(hr);

        }

        //        console.log(question);
    }
    
        var savepara = document.createElement('p');
        
        var saveBtn = document.createElement("button");
        saveBtn.id = keys;
        saveBtn.value = keys;
        saveBtn.addEventListener("click", function () {
            getConfirmation(studentquestion, keys);
        });
        saveBtn.innerHTML = "save";

        savepara.appendChild(saveBtn);
        submissionsec.appendChild(savepara);

}

function getConfirmation(studentquestion, keys) {
    var retVal = confirm("Do you want to submit ?");
    if (retVal == true) {
        saveHomework(studentquestion, keys);
        window.location.href = "submission.html";
        return true;
    } else {
        return false;
    }
}

function saveHomework(studentquestion, keys) {
    var database = firebase.database();
    var ref = database.ref('submission/' + currentTitle + '/' + currentStudent);
    ref.remove();
    
    //    var radios = document.getElementById('Dog has hair');
    console.log(currentTitle);

    var database = firebase.database();
    var ref = database.ref('submission/' + currentTitle);
    for (var i = 0; i < keys.length; i++) {
        var k = keys[i];
        console.log(k);
        
    }
    
    var ref = database.ref('submission/' + currentTitle + '/' + currentStudent + "(marked)");

    for (var i = 0; i < keys.length; i++) {
        var k = keys[i];
        var questionid = studentquestion[k].questionid;
        var questiontitle = studentquestion[k].question;
        var quesType = studentquestion[k].questype;
        var ans = studentquestion[k].answer;
        
        if(quesType == "objectiveType"){
            var a = studentquestion[k].A;
            var b = studentquestion[k].B;
            var c = studentquestion[k].C;
            var d = studentquestion[k].D;
            var stat = "input[name='" + questiontitle +'obj' + "']:checked";
            var comment = "input[name='" + questiontitle +'comment' + "']";

            var data = {
                questionid: questionid,
                question: questiontitle,
                questype: quesType,
                A: a,
                B: b,
                C: c,
                D: d,
                answer: ans,
                status: document.querySelector(stat).value,
                comment: document.querySelector(comment).value
            }

            ref.push(data);
        }else{
            var stat = "input[name='" + questiontitle +'obj' + "']:checked";
            var comment = "input[name='" + questiontitle +'comment' + "']";
            
            var data = {
                questionid: questionid,
                question: questiontitle,
                questype: quesType,
                answer: ans,
                status: document.querySelector(stat).value,
                comment: document.querySelector(comment).value
            }
            
            
            ref.push(data);
        }
        
        
    }

}

function getUrlVars() {
    var vars = {};
    var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function (m, key, value) {
        vars[key] = value;
    });
    return vars;
}
//
function errData(err) {
    console.log("Error!");
    console.log(err);
}



window.onload = function (e) {
    loadDatabase();
}
