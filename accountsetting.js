function initLogin() {
    var adminLogin = document.getElementById('adminLogin');

    var loginTitle = document.createElement('h1');
    loginTitle.innerHTML = 'Admin Login'
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

    adminLogin.appendChild(loginTitle);
    adminLogin.appendChild(hr);
    username.appendChild(usernameinput);
    adminLogin.appendChild(username);
    password.appendChild(passwordinput);
    adminLogin.appendChild(password);
    adminLogin.appendChild(loginButton);

}

function verifyUser() {
    var database = firebase.database();
    var ref = database.ref('login/admin');
    ref.on('value', gotData, errData);

    function gotData(data) {
        var user = data.val();
        var students = Object.keys(user);

        var logged = false;
        var username = user.user;
        var password = user.password;

        var userinput = document.getElementById('usernameinput');
        var passinput = document.getElementById('passwordinput');

        console.log(userinput.value);
        console.log(passinput.value);

        if ((userinput.value == user.user) && (passinput.value == user.password)) {
            logged = true;
            deleteLoginPage();
            console.log('admin logged in');
            loadData();
        } else {
            console.log('wrong admin account');
        }
    }

    function errData(err) {
        console.log('Error!');
        console.log(err);
    }

}

function loadData() {
    createUser();
    loadAccount();
}

function createUser() {

    var createUser = document.getElementById('createUser');

    var createUserTitle = document.createElement('h1');
    createUserTitle.innerHTML = 'Create New User';
    var hr = document.createElement('hr');
    var usernameLabel = document.createElement('p');
    usernameLabel.innerHTML = 'New Username:';
    var usernameInput = document.createElement('input');
    usernameInput.setAttribute('type', 'text');
    usernameInput.setAttribute('id', 'newusernameinput')
    var passwordLabel = document.createElement('p');
    passwordLabel.innerHTML = 'New Password:';
    var passwordInput = document.createElement('input');
    passwordInput.setAttribute('type', 'text');
    passwordInput.setAttribute('id', 'newpasswordinput');
    var createBtn = document.createElement('button');
    createBtn.innerHTML = 'Create User';
    createBtn.addEventListener('click', function () {
        addUserToDatabase();
    });

    createUser.appendChild(createUserTitle);
    usernameLabel.appendChild(usernameInput);
    createUser.appendChild(usernameLabel);
    passwordLabel.appendChild(passwordInput);
    createUser.appendChild(passwordLabel);
    createUser.appendChild(createBtn);
}

function addUserToDatabase() {
    console.log('sss');
    var newuserinput = document.getElementById('newusernameinput').value;
    var newpassinput = document.getElementById('newpasswordinput').value;

    var retVal = confirm("Please confirm with the username and password: \nUsername: " + newuserinput + '\nPassword: ' + newpassinput);
    if (retVal == true) {
        var database = firebase.database();
        var ref = database.ref('login');

        ref.push(newuserinput = {
            "user": newuserinput,
            "password": newpassinput
        });
        console.log("success");
        var acclist = document.getElementById('existUserList');
        while (acclist.hasChildNodes()) {
            acclist.removeChild(acclist.firstChild);
        }
        loadAccount();
        
        document.getElementById('newusernameinput').value = '';
        document.getElementById('newpasswordinput').value = '';
        return true;
    } else {
        return false;
    }


}



function loadAccount() {

    var database = firebase.database();
    var ref = database.ref('login');
    ref.on('value', gotData, errData);

    function gotData(data) {
        var user = data.val();
        var students = Object.keys(user);
        console.log(students);

        var existUserList = document.getElementById('existUserList');
        //        var configTitle = document.createElement('h1');
        //        configTitle.innerHTML = 'Account Configuration';
        var listTitle = document.createElement('h2');
        listTitle.innerHTML = 'List of Account:';


        //        existUserList.appendChild(configTitle);

        existUserList.appendChild(listTitle);

        for (var i = 0; i < students.length; i++) {
            var k = students[i];
            var username = user[k].user;
            var password = user[k].password;

            console.log(students[i], username, password);
            var usernamelabel = document.createElement('p');
            usernamelabel.innerHTML = user[k].user;
            //            var passwordlabel = document.createElement('p');
            //            passwordlabel.innerHTML = user[k].password;

            existUserList.appendChild(usernamelabel);
            //            existUserList.appendChild(passwordlabel);

        }
    }

    function errData(err) {
        console.log(err);
    }
}

function deleteLoginPage() {
    var adminLogin = document.getElementById('adminLogin');
    while (adminLogin.hasChildNodes()) {
        adminLogin.removeChild(adminLogin.firstChild);
    }
}

window.onload = function (e) {
    initLogin();
}
