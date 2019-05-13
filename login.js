function initLogin() {
    var login = document.getElementById('login');

    var loginTitle = document.createElement('h1');
    loginTitle.innerHTML = 'Login';
    var hr = document.createElement('hr');
    hr.setAttribute('style', 'width: 70%');
    var username = document.createElement('p');
    username.innerHTML = 'Username: ';
    var usernameinput = document.createElement('input');
    usernameinput.setAttribute('type', 'text');
    usernameinput.setAttribute('name', 'usernameinput');
    usernameinput.setAttribute('id', 'usernameinput');
    var password = document.createElement('p');
    password.innerHTML = 'Password: ';
    var passwordinput = document.createElement('input');
    passwordinput.setAttribute('type', 'password');
    passwordinput.setAttribute('name', 'passwordinput');
    passwordinput.setAttribute('id', 'passwordinput');
    var loginButton = document.createElement('button');
    loginButton.innerHTML = 'Login';
    loginButton.addEventListener("click", function () {
        verifyUser();
    });

    login.appendChild(loginTitle);
    login.appendChild(hr);
    username.appendChild(usernameinput);
    login.appendChild(username);
    password.appendChild(passwordinput);
    login.appendChild(password);
    login.appendChild(loginButton);

}

function verifyUser() {
    var database = firebase.database();
    var ref = database.ref('login');
    ref.on('value', gotData, errData);

    function gotData(data) {
        var user = data.val();
        var students = Object.keys(user);

        var logged = false;

        var userinput = document.getElementById('usernameinput');
        var passinput = document.getElementById('passwordinput');

        for (var i = 0; i < students.length; i++) {
            var k = students[i];
            var username = user[k].user;
            var password = user[k].password;
            var studentskey = students[i];
            if ((userinput.value == username) && (passinput.value == password)) {
                logged = true;
                deleteLoginPage();
                console.log('account logged in');
                loadAccount(studentskey);
            }
        }
        if (logged == false) {
            alert('wrong username or password');
        }


    }

    function errData(err) {
        console.log('Error!');
        console.log(err);
    }

}

function loadData() {
    //    loadAccount();
}


function loadAccount(studentskey) {
    var database = firebase.database();
    var ref = database.ref('login/' + studentskey);
    ref.on('value', gotData, errData);

    function gotData(data) {
        var user = data.val();
        console.log(user.user);
        console.log(user.password);
        
        var accountConfig = document.getElementById('accountConfiguration');

        while (accountConfig.hasChildNodes()) {
            accountConfig.removeChild(accountConfig.firstChild);
        }
        
        var changepasswordtitle = document.createElement('h1');
        changepasswordtitle.innerHTML = 'Change Password';
        
        var hr = document.createElement('hr');

        var username = document.createElement('p');
        username.innerHTML = 'Username: ' + user.user;

        var oldpasswordtitle = document.createElement('p');
        oldpasswordtitle.innerHTML = 'Old Password:';
        var oldpassword = document.createElement('input');
        oldpassword.setAttribute('type', 'password');
        oldpassword.setAttribute('name', 'oldpassword');
        oldpassword.setAttribute('id', 'oldpassword');

        var newpasswordtitle = document.createElement('p');
        newpasswordtitle.innerHTML = 'New Password:';
        var newpassword = document.createElement('input');
        newpassword.setAttribute('type', 'password');
        newpassword.setAttribute('name', 'newpassword');
        newpassword.setAttribute('id', 'newpassword');

        var newpasswordconfirmtitle = document.createElement('p');
        newpasswordconfirmtitle.innerHTML = 'Confirm New Password:';
        var newpasswordconfirm = document.createElement('input');
        newpasswordconfirm.setAttribute('type', 'password');
        newpasswordconfirm.setAttribute('name', 'newpasswordconfirm');
        newpasswordconfirm.setAttribute('id', 'newpasswordconfirm');

        var br = document.createElement('br');

        var saveBtn = document.createElement('button');
        saveBtn.innerHTML = 'Save';
        saveBtn.addEventListener("click", function () {
            savePassword(studentskey, user.user, user.password);
        });
        
        var cancelBtn = document.createElement('button');
        cancelBtn.innerHTML = 'Cancel';
        cancelBtn.setAttribute('style','margin-left: 5%');
        cancelBtn.addEventListener("click", function () {
            document.location.reload();
        });

        var accountConfig = document.getElementById('accountConfiguration');
        accountConfig.appendChild(changepasswordtitle);
        accountConfig.appendChild(hr);
        accountConfig.appendChild(username);
        oldpasswordtitle.appendChild(oldpassword);
        accountConfig.appendChild(oldpasswordtitle);
        newpasswordtitle.appendChild(newpassword);
        accountConfig.appendChild(newpasswordtitle);
        newpasswordconfirmtitle.appendChild(newpasswordconfirm);
        accountConfig.appendChild(newpasswordconfirmtitle);
        accountConfig.appendChild(br);
        accountConfig.appendChild(saveBtn);
        accountConfig.appendChild(cancelBtn);
        
    }

    function errData(err) {
        console.log(err);
    }
}

function savePassword(studentskey, username, oldpassword) {
    var oldpasswordinput = document.getElementById('oldpassword').value;
    var newpasswordinput = document.getElementById('newpassword').value;
    var newpasswordconfirminput = document.getElementById('newpasswordconfirm').value;
//    var database = firebase.database().ref();
    
    if((oldpasswordinput == oldpassword)&&(newpasswordinput == newpasswordconfirminput)){
        var retVal = confirm("Do you want to submit ?");
        if (retVal == true) {
            var database = firebase.database().ref();
            user = username;
            password = newpasswordinput;
            data = {user, password}
            
            database.child('login/' + studentskey).update(data);
            alert("Password changed!");
            document.location.reload();
            return true;
        } else {
            return false;
        }
    }else{
        console.log('wrong old password/newpassword/newpasswordconfirm');
    }



}

function deleteLoginPage() {
    var login = document.getElementById('login');
    while (login.hasChildNodes()) {
        login.removeChild(login.firstChild);
    }
}

window.onload = function (e) {
    initLogin();
}
