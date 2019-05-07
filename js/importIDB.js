/*
    Import a JSON file, an array of pairs name and object
    The object hold columns as properties
    and one of the property is the content.
    A SQLite database must be converted to this format before to be loaded.
    
    Function are also added to access the content.
    
    (c) 2018 Scriptol.com - MIT License
*/

document.querySelector('#login').addEventListener('click', function () {
    search();
});

function importIDB(dname, sname, arr) {
    return new Promise(function (resolve) {
        var r = window.indexedDB.open(dname)
        r.onupgradeneeded = function () {
            var idb = r.result
            var store = idb.createObjectStore(sname, {
                keyPath: "username"
            })
//            var store2 = idb.createObjectStore("logStatus", {
//                keyPath: "log"
//            })
        }
        r.onsuccess = function () {
            var idb = r.result
            let tactn = idb.transaction(sname, "readwrite")
            var store = tactn.objectStore(sname)
            for (var obj of arr) {
                store.put(obj)
            }

            var tactn2 = idb.transaction("logStatus", "readwrite")
            var store2 = tactn2.objectStore("logStatus")

            resolve(idb)
        }
        r.onerror = function (e) {
            alert("Enable to access IndexedDB, " + e.target.errorCode)
        }
    })
}

function search() {
    var username = document.getElementById("userinput").value
    var infos = getIDB("login", "account", username)
    document.getElementById("storage").innerHTML = JSON.stringify(infos, null, ' ')
}

function getIDB(dname, sname, key) {
    return new Promise(function (resolve) {
        var r = indexedDB.open(dname)
        r.onsuccess = function (e) {
            var idb = r.result
            let tactn = idb.transaction(sname, "readonly")
            let store = tactn.objectStore(sname)
            let data = store.get(key)
            data.onsuccess = function () {
                resolve(data.result);

                var username = document.querySelector("#userinput").value;
                var password = document.querySelector("#passinput").value;

                console.log("About to login " + username);
                db = e.target.result;
                var transaction = db.transaction(["account"]); //readonly
                var objectStore = transaction.objectStore("account");
                var request = objectStore.get(username);

                request.onerror = function (e) {
                    alert("Unable to retrieve data from database!");
                    return;
                };
                request.onsuccess = function (e) {
                    //                    alert(password " " + request.result.password);

                    if (password != request.result.password) {
                        alert("Could not log you in");
                        return;
                    }
                    console.log("You are logged in");

                    var tactn2 = db.transaction("logStatus", "readwrite")
                    var store2 = tactn2.objectStore("logStatus")
                    let ob = {
                        logintime: new Date(),
                        log: username
                    };
                    store2.put(ob);
                    document.location.reload();

                };
            }
            tactn.oncomplete = function () {
                idb.close()
            }
        }
    })
}


function initAccess() {

    var r = indexedDB.open("login")
    r.onsuccess = function (e) {
        var idb = r.result;
        var transaction = idb.transaction(["logStatus"], 'readonly');
        var req = transaction.objectStore("logStatus");
        var getAllKeysRequest = req.getAllKeys();
        getAllKeysRequest.onsuccess = function () {
            console.log(getAllKeysRequest.result);

            if (getAllKeysRequest.result.length != 0) {
                console.log("hahaha");
                //delete login section
                var element = document.getElementById("loginsec");
                element.parentNode.removeChild(element);

                var transaction2 = idb.transaction(["account"], 'readonly');
                var req2 = transaction2.objectStore("account");
                var getAllKeysRequest2 = req2.getAllKeys();
                getAllKeysRequest2.onsuccess = function () {
                    //show logged account details
                    var element2 = document.createElement("P");
                    element2.innerHTML = "Logged: " + getAllKeysRequest2.result[0];
                    element2.style = "display: block; width: 100%;";
                    var displayuser = document.getElementById("displayuser");
                    displayuser.appendChild(element2);


                    var element3 = document.createElement("button");
                    element3.id = "logout";
                    element3.value = "logout";
                    element3.addEventListener("click", function () {
                        logoutFunction();
                    });
                    element3.style = "display: block;"
                    element3.appendChild(document.createTextNode("logout"));
                    var logout = document.getElementById("logged");
                    logout.appendChild(element3);
                }
            }

        }
    }
}

function logoutFunction() {
    var r = indexedDB.open("login")
    r.onsuccess = function (e) {
        var db = r.result;
        let trans = db.transaction(["logStatus"], 'readwrite');
        var req = trans.objectStore("logStatus");
        var getAllKeysRequest = req.getAllKeys();
        getAllKeysRequest.onsuccess = function () {
            var objectStoreRequest = req.delete(getAllKeysRequest.result[0]);
            objectStoreRequest.onsuccess = function (event) {
                console.log("You logged out")
                document.location.reload();
            };
        }
    }
}


window.onload = initAccess();
