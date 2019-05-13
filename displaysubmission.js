//var currentTitle = null;
//
//function loadSubmissionDatabase() {
//    var database = firebase.database();
//    var ref = database.ref('submission');
//    ref.on('value', gotData2, errData2);
//}
//
//function gotData2(data) {
//    var homework = data.val();
//    var keys = Object.keys(homework);
//
//    console.log(keys);
//
////    for (var i = 0; i < keys.length; i++) {
////        var title = document.createElement("button");
////        title.id = keys[i];
////        title.value = keys[i];
////        title.style= "display: block;"
////        
////        title.addEventListener("click", function () {
////            displayHomework(this.value);
////        });
////        
////        title.appendChild(document.createTextNode(keys[i]));
////        var homeworkTitle = document.getElementById('homeworkTitle');
////        homeworkTitle.appendChild(title);
////
////    }
//
//}
//
//function errData2(err) {
//    console.log("Error!");
//    console.log(err);
//}
//
////function displayHomework(keys) {
////    console.log(keys);
////    var homeworkSection = document.getElementById('homeworkSection');
////
////    while (homeworkSection.hasChildNodes()) {
////        homeworkSection.removeChild(homeworkSection.firstChild);
////    }
////
////
////    document.getElementById("homework").textContent = keys;
////    currentTitle = keys;
////
////    var database = firebase.database();
////    var ref = database.ref('homework/' + keys);
////
////    console.log(keys);
////    ref.on('value', gotData2, errData2);
////
////    function gotData2(data) {
////
////        var questionkey = data.val();
////        var keys = Object.keys(questionkey);
////        for (var i = 0; i < keys.length; i++) {
////            var k = keys[i];
////            var type = questionkey[k].questype;
////            var questionid = questionkey[k].questionid;
////            var questiontitle = questionkey[k].question;
////            
////            var homeworkSection = document.getElementById('homeworkSection');
////            var h1 = document.createElement("h1");
////            h1.appendChild(document.createTextNode("Question " + (i + 1) + ": " + questiontitle));
////            homeworkSection.appendChild(h1);
////
////
////            if (type == 'objectiveType') {
////                var a = questionkey[k].A;
////                var b = questionkey[k].B;
////                var c = questionkey[k].C;
////                var d = questionkey[k].D;
////
////                var label = document.createElement('label');
////
////                var theInput = document.createElement("input");
////                theInput.setAttribute('type', "radio");
////                theInput.setAttribute('name', questiontitle + 'obj');
////                theInput.setAttribute('id', questiontitle + 'obj');
////                theInput.setAttribute('value', a);
////                label.appendChild(theInput);
////                label.innerHTML += "<span> " + a + "</span><br>";
////                homeworkSection.appendChild(label);
////
////                theInput.setAttribute('type', "radio");
////                theInput.setAttribute('name', questiontitle + 'obj');
////                theInput.setAttribute('id', questiontitle + 'obj');
////                theInput.setAttribute('value', b);
////                label.appendChild(theInput);
////                label.innerHTML += "<span> " + b + "</span><br>";
////                homeworkSection.appendChild(label);
////
////                theInput.setAttribute('type', "radio");
////                theInput.setAttribute('name', questiontitle + 'obj');
////                theInput.setAttribute('id', questiontitle + 'obj');
////                theInput.setAttribute('value', c);
////                label.appendChild(theInput);
////                label.innerHTML += "<span> " + c + "</span><br>";
////                homeworkSection.appendChild(label);
////
////                theInput.setAttribute('type', "radio");
////                theInput.setAttribute('name', questiontitle + 'obj');
////                theInput.setAttribute('id', questiontitle + 'obj');
////                theInput.setAttribute('value', d);
////                label.appendChild(theInput);
////                label.innerHTML += "<span> " + d + "</span><br>";
////                homeworkSection.appendChild(label);
////            } else {
////                var inputfieldtext = document.createElement('P');
////                inputfieldtext.innerHTML = "Answers: ";
////
////                var inputfield = document.createElement('input');
////                inputfield.setAttribute('type', "text");
////                inputfield.setAttribute('name', questiontitle + 'sub');
////                inputfield.setAttribute('id', questiontitle + 'sub');
////
////                homeworkSection.appendChild(inputfieldtext);
////                homeworkSection.appendChild(inputfield);
////
////            }
////
////            console.log(questiontitle);
////
////        }
////        
////        var savepara = document.createElement('p');
////        
////        var saveBtn = document.createElement("button");
////        saveBtn.id = keys;
////        saveBtn.value = keys;
////        saveBtn.addEventListener("click", function () {
////            getConfirmation(questionkey, keys);
////        });
////        saveBtn.innerHTML = "save";
////
////        savepara.appendChild(saveBtn);
////        homeworkSection.appendChild(savepara);
////
////    }
////
////    function errData2(err) {
////        console.log("Error!");
////        console.log(err);
////    }
////
////}
////
////function getConfirmation(questionkey, keys) {
////    var retStudentName = prompt("Enter your name : ", "your name here");
////    var retVal = confirm("Do you want to submit ?");
////    if (retVal == true) {
////        saveHomework(questionkey, keys, retStudentName);
////        return true;
////    } else {
////        return false;
////    }
////}
////
////function saveHomework(questionkey, keys, retStudentName) {
////    var database = firebase.database();
////    var ref = database.ref('submission/' + currentTitle + '/' + retStudentName);
////    ref.remove();
////    
////    
////    //    var radios = document.getElementById('Dog has hair');
////    console.log(currentTitle);
////
////    var database = firebase.database();
////    var ref = database.ref('submission/' + currentTitle);
////    for (var i = 0; i < keys.length; i++) {
////        var k = keys[i];
////        console.log(k);
////        
////    }
////    
////    var ref = database.ref('submission/' + currentTitle + '/' + retStudentName);
////
////    for (var i = 0; i < keys.length; i++) {
////        var k = keys[i];
////        var questionid = questionkey[k].questionid;
////        var questiontitle = questionkey[k].question;
////        var quesType = questionkey[k].questype;
////        
////        if(quesType == "objectiveType"){
////            var a = questionkey[k].A;
////            var b = questionkey[k].B;
////            var c = questionkey[k].C;
////            var d = questionkey[k].D;
////            var item = "input[name='" + questiontitle +'obj' + "']:checked";
////
////            var data = {
////                questionid: questionid,
////                question: questiontitle,
////                questype: quesType,
////                A: a,
////                B: b,
////                C: c,
////                D: d,
////                answer: document.querySelector(item).value
////            }
////
////            ref.push(data);
////        }else{
////            var item = "input[name='" + questiontitle +'sub' + "']";
////            
////            var data = {
////                questionid: questionid,
////                question: questiontitle,
////                questype: quesType,
////                answer: document.querySelector(item).value
////            }
////            
////            
////            ref.push(data);
////        }
////        
////        
////    }
////
////}
//
//
//window.onload = function (e) {
//    loadSubmissionDatabase();
//}
