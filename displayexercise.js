//var loadDatabase = document.getElementById('loadDatabase');
//var homeworkTitle = document.getElementById('homeworkTitle');

//loadDatabase.onclick = function () {
//    var database = firebase.database();
//    var ref = database.ref('homework');
//    ref.on('value', gotData, errData);
//}
var currentTitle = null;
var currentUser = null;

function loadDatabase() {
    var database = firebase.database();
    var ref = database.ref('homework');
    ref.on('value', gotData, errData);
    //    var ref2 = database.ref('submission');
    //    ref2.on('value', gotData2, errData2);
}

function gotData(data) {
    var homework = data.val();
    //    console.log(homework);
    var keys = Object.keys(homework);

    console.log(keys);
    var mylogin = document.getElementById('myLogin');

    for (var i = 0; i < keys.length; i++) {
        //        ref = database.ref('homework/' + keys[i]);
        //        ref.on('value',gotData2,errData2);
        var title = document.createElement("button");
        title.id = keys[i];
        title.value = keys[i];
        title.style = "display: block;"

        title.addEventListener("click", function () {
            displayHomework(this.value);
        });

        title.appendChild(document.createTextNode(keys[i]));
        var homeworkTitle = document.getElementById('homeworkTitle');
        homeworkTitle.appendChild(title);

    }
    var logintitle = document.createElement('h1');
    logintitle.innerHTML = "Login"
    var username = document.createElement('P');
    username.innerHTML = "Username: ";

    var usernameinput = document.createElement('input');
    usernameinput.setAttribute('type', "text");
    usernameinput.setAttribute('name', 'usernameinput');
    usernameinput.setAttribute('id', 'usernameinput');

    var password = document.createElement('P');
    password.innerHTML = "Password: ";

    var passwordinput = document.createElement('input');
    passwordinput.setAttribute('type', "password");
    passwordinput.setAttribute('name', 'passwordinput');
    passwordinput.setAttribute('id', 'passwordinput');

    var loginbutton = document.createElement('button');
    loginbutton.innerHTML = 'Login';
    loginbutton.addEventListener("click", function () {
        verifyUser();
    });
    loginbutton.setAttribute('id', 'loginbtn');
    var br = document.createElement('br');

    myLogin.appendChild(logintitle);
    myLogin.appendChild(username);
    myLogin.appendChild(usernameinput);
    myLogin.appendChild(password);
    myLogin.appendChild(passwordinput);
    myLogin.appendChild(br);
    myLogin.appendChild(loginbutton);

}

function errData(err) {
    console.log("Error!");
    console.log(err);
}

function verifyUser() {
    var userinput = document.getElementById('usernameinput');
    var passinput = document.getElementById('passwordinput');

    console.log(userinput.value);
    console.log(passinput.value);

    var database = firebase.database();
    var ref = database.ref('login');

    ref.on('value', gotData, errData);

    function gotData(data) {
        var user = data.val();
        var students = Object.keys(user);
        var logged = false;

        for (var i = 0; i < students.length; i++) {
            var k = students[i];
            var username = user[k].user;
            var password = user[k].password;

            console.log(username, password);
            if ((userinput.value == user[k].user) && (passinput.value == user[k].password)) {
                console.log("loggedin");
                currentUser = userinput.value;
                var myLogin = document.getElementById('myLogin');

                while (myLogin.hasChildNodes()) {
                    myLogin.removeChild(myLogin.firstChild);
                }
                logged = true;
                displaySubmission();
                break;
            }
        }
        if (logged == false) {
            alert("Wrong Username or Password");
        }

    }

    function errData(err) {
        console.log(err);
    }
}

function displaySubmission() {

    var database = firebase.database();
    ref = database.ref('submission');
    ref.on('value', gotData4, errData4);

    function gotData4(data) {
        var subjectitle = data.val();
        var arrsub = Object.keys(subjectitle);

        console.log(arrsub);
        for (var i = 0; i < arrsub.length; i++) {
            console.log(arrsub[i]);

            var p = document.createElement('P');
            p.innerHTML = arrsub[i];
            p.setAttribute('style', 'font-weight: bold; font-size:20px;')

            var sublist = document.getElementById('mySubmission');
            mySubmission.appendChild(p);

            ref = database.ref('submission/' + arrsub[i]);
            ref.on('value', gotData3, errData3);

            function gotData3(data) {
                var submissionlist = data.val();
                var arrstudent = Object.keys(submissionlist);
                var currentTitle2 = arrsub[i];

                for (var j = 0; j < arrstudent.length; j++) {
                    console.log(arrstudent[j]);
                    console.log(arrsub[i]);
                    var newusername = arrstudent[j].replace('(marked)', '');
                    if (newusername == currentUser) {
                        var p = document.createElement('P');
                        p.innerHTML = arrstudent[j];
                        var viewStudent = document.createElement("a");
                        viewStudent.addEventListener("click", function () {
                            var submissionsec = document.getElementById('homeworkSection');

                            while (submissionsec.hasChildNodes()) {
                                submissionsec.removeChild(submissionsec.firstChild);
                            }
                            displayMySubmission(currentTitle2, this.text);
                        });
                        viewStudent.appendChild(p);

                        var sublist = document.getElementById('mySubmission');
                        mySubmission.appendChild(viewStudent);
                    }
                }
                
            }

            function errData3(err) {
                console.log(err);
            }
        }
    }

    function errData4(err) {
        console.log(err);
    }
}

function displayMySubmission(currentTitle2, user) {
    var database = firebase.database();
    ref = database.ref('submission/' + currentTitle2 + '/' + user);
    console.log(currentTitle2, user);
    ref.on('value', gotData, errData);


    function gotData(data) {
        var studentquestion = data.val();
        console.log(data.val());
        var keys = Object.keys(studentquestion);
        document.getElementById("homework").textContent = currentTitle2;
        console.log(keys);
        var submissionsec = document.getElementById('homeworkSection');


        for (var i = 0; i < keys.length; i++) {
            var k = keys[i];
            var question = studentquestion[k].question;
            var questype = studentquestion[k].questype;
            var answer = studentquestion[k].answer;
            var commentgiven = studentquestion[k].comment;
            var status = studentquestion[k].status;

            console.log(question);

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

                obja.innerHTML = '<strong>A: </strong>' + a;
                objb.innerHTML = '<strong>B: </strong>' + b;
                objc.innerHTML = '<strong>C: </strong>' + c;
                objd.innerHTML = '<strong>D: </strong>' + d;

                var ans = document.createElement('p');
                ans.innerHTML = '<strong>Selected Answer: </strong>' + answer;

                submissionsec.appendChild(questitle);
                submissionsec.appendChild(obja);
                submissionsec.appendChild(objb);
                submissionsec.appendChild(objc);
                submissionsec.appendChild(objd);
                submissionsec.appendChild(objd);
                submissionsec.appendChild(ans);
                
                if((user.substr(user.length -8)) == "(marked)"){
                    var stat = document.createElement('p');
                    stat.innerHTML = status;
                    submissionsec.appendChild(stat);

                    var commenttext = document.createElement('P');
                    commenttext.innerHTML = "<strong>Comment: </strong>" + commentgiven;

                    submissionsec.appendChild(commenttext);
                }
                
                var hr = document.createElement('hr');
                submissionsec.appendChild(hr);



            } else {
                var questitle = document.createElement('p');
                questitle.setAttribute('style', 'font-weight:bold');
                questitle.innerHTML = question;

                var ans = document.createElement('p');
                ans.innerHTML = '<strong>Selected Answer: </strong>' + answer;

                submissionsec.appendChild(questitle);
                submissionsec.appendChild(ans);


                if((user.substr(user.length -8)) == "(marked)"){
                    var stat = document.createElement('p');
                    stat.innerHTML = status;
                    submissionsec.appendChild(stat);

                    var commenttext = document.createElement('P');
                    commenttext.innerHTML = "<strong>Comment: </strong>" + commentgiven;

                    submissionsec.appendChild(commenttext);
                }

                var hr = document.createElement('hr');
                submissionsec.appendChild(hr);

            }

        }
    }
}

function displayHomework(keys) {
    console.log(keys);
    var homeworkSection = document.getElementById('homeworkSection');

    while (homeworkSection.hasChildNodes()) {
        homeworkSection.removeChild(homeworkSection.firstChild);
    }


    document.getElementById("homework").textContent = keys;
    currentTitle = keys;

    var database = firebase.database();
    var ref = database.ref('homework/' + keys);

    console.log(keys);
    ref.on('value', gotData2, errData2);

    function gotData2(data) {

        var questionkey = data.val();
        var keys = Object.keys(questionkey);
        for (var i = 0; i < keys.length; i++) {
            var k = keys[i];
            var type = questionkey[k].questype;
            var questionid = questionkey[k].questionid;
            var questiontitle = questionkey[k].question;

            var homeworkSection = document.getElementById('homeworkSection');
            var h1 = document.createElement("h1");
            h1.appendChild(document.createTextNode("Question " + (i + 1) + ": " + questiontitle));
            homeworkSection.appendChild(h1);


            if (type == 'objectiveType') {
                var a = questionkey[k].A;
                var b = questionkey[k].B;
                var c = questionkey[k].C;
                var d = questionkey[k].D;

                var label = document.createElement('label');

                var theInput = document.createElement("input");
                theInput.setAttribute('type', "radio");
                theInput.setAttribute('name', questiontitle + 'obj');
                theInput.setAttribute('id', questiontitle + 'obj');
                theInput.setAttribute('value', a);
                label.appendChild(theInput);
                label.innerHTML += "<span> " + a + "</span><br>";
                homeworkSection.appendChild(label);

                theInput.setAttribute('type', "radio");
                theInput.setAttribute('name', questiontitle + 'obj');
                theInput.setAttribute('id', questiontitle + 'obj');
                theInput.setAttribute('value', b);
                label.appendChild(theInput);
                label.innerHTML += "<span> " + b + "</span><br>";
                homeworkSection.appendChild(label);

                theInput.setAttribute('type', "radio");
                theInput.setAttribute('name', questiontitle + 'obj');
                theInput.setAttribute('id', questiontitle + 'obj');
                theInput.setAttribute('value', c);
                label.appendChild(theInput);
                label.innerHTML += "<span> " + c + "</span><br>";
                homeworkSection.appendChild(label);

                theInput.setAttribute('type', "radio");
                theInput.setAttribute('name', questiontitle + 'obj');
                theInput.setAttribute('id', questiontitle + 'obj');
                theInput.setAttribute('value', d);
                label.appendChild(theInput);
                label.innerHTML += "<span> " + d + "</span><br>";
                homeworkSection.appendChild(label);
            } else {
                var inputfieldtext = document.createElement('P');
                inputfieldtext.innerHTML = "Answers: ";

                var inputfield = document.createElement('input');
                inputfield.setAttribute('type', "text");
                inputfield.setAttribute('name', questiontitle + 'sub');
                inputfield.setAttribute('id', questiontitle + 'sub');

                homeworkSection.appendChild(inputfieldtext);
                homeworkSection.appendChild(inputfield);

            }

            console.log(questiontitle);

        }

        var savepara = document.createElement('p');

        var saveBtn = document.createElement("button");
        saveBtn.id = keys;
        saveBtn.value = keys;
        saveBtn.addEventListener("click", function () {
            getConfirmation(questionkey, keys);
        });
        saveBtn.innerHTML = "save";

        savepara.appendChild(saveBtn);
        homeworkSection.appendChild(savepara);

    }

    function errData2(err) {
        console.log("Error!");
        console.log(err);
    }

}

function getConfirmation(questionkey, keys) {
    var retStudentUsername = prompt("Enter your username : ", "username");
    var retStudentPassword = prompt("Enter your password : ", "password");

    var database = firebase.database();
    var ref = database.ref('login');

    ref.on('value', gotData, errData);

    function gotData(data) {
        var user = data.val();
        var students = Object.keys(user);

        for (var i = 0; i < students.length; i++) {
            var k = students[i];
            var username = user[k].user;
            var password = user[k].password;
            var logged = false;
            console.log(username, password);
            if ((retStudentUsername == user[k].user) && (retStudentPassword == user[k].password)) {
                console.log("loggedin");
                logged = true;
                currentUser = retStudentUsername;

                var retVal = confirm("Do you want to submit ?");
                if (retVal == true) {
                    saveHomework(questionkey, keys, retStudentUsername);
                    document.location.reload();
                    return true;
                } else {
                    return false;
                }
                break;
            }
        }
        if (logged == false) {
            alert("Wrong Username or Password");
        }

    }

    function errData(err) {
        console.log(err);
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

        if (quesType == "objectiveType") {
            var a = questionkey[k].A;
            var b = questionkey[k].B;
            var c = questionkey[k].C;
            var d = questionkey[k].D;
            var item = "input[name='" + questiontitle + 'obj' + "']:checked";

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
        } else {
            var item = "input[name='" + questiontitle + 'sub' + "']";

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

function gotData2(data) {
    var homework = data.val();
    var keys = Object.keys(homework);

    console.log(keys);

    console.log(keys[0]);

    //    var database = firebase.database();
    //    ref = database.ref('submission/' + keys[0]);
    //    ref.on('value',gotData3,errData3);
    //    function gotData3(data2){
    //        var submissionlist = data2.val();
    //        var arrsub = Object.keys(submissionlist);
    //    
    //        
    //        for(var i = 0; i< arrsub.length; i++){
    //            console.log(arrsub[i]);
    //            
    //            
    //            var p = document.createElement('P');
    //            p.innerHTML = arrsub[i];
    //            
    //            var sublist = document.getElementById('mySubmission');
    //            mySubmission.appendChild(p);
    //        }
    //    }

    function errData3(err) {

    }

}

function errData2(err) {
    console.log("Error!");
    console.log(err);
}


window.onload = function (e) {
    loadDatabase();
}
