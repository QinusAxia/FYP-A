let db = null;
var title = null; //title of the quiz
var increment = 1; //to keep track of question number// is there a better away by getting the number of keys in the objectstore
var dbOpen = false;
var dbversion;

//hide the add question button first
document.getElementById("quizTitleVal").value = "";
var x = document.getElementById("newStuff");
x.style.display = "none";

$(window).load(function () { //this function will load the table with the list of quizes in the database
    if (dbOpen) {
        db.close();
        console.log("db closed in before opening new request");
    }

    var request = indexedDB.open('QuizMaker');
    console.log("db open for first request to load the table");
    console.log(dbVersion);

    request.onsuccess = function (e) {
        var db = e.target.result;
        dbOpen = true;
        var allStoreNames = new Array();
        var objectStoreNames = db.objectStoreNames;
        for (var i = 0; i < objectStoreNames.length; i++) { //get all objectstore names and put them into an array
            allStoreNames[i] = objectStoreNames[i];
        }
        //fill the table        
        for (let index = 0; index < allStoreNames.length; index++) {
            $("#quizTable tbody").append('<tr><td class="objname">' + allStoreNames[index] + '<td><button class="btn btn-warning deletquiz">Delete</button> <button class="btn btn-secondary editbtn">Edit</button></td>/td></tr>');
        }
    }

    request.onupgradeneeded = function (event) {
        console.log("WARNING: On upgradeneeded load table NOT have been called");
    }

    //on error
    request.onerror = function (event) {
        console.log("Error: " + event.target.errorCode);
    }

    // var dbname = "QuizMaker";
    // var dbVersion = parseInt(localStorage.getItem("dbversion"));
    // var request = indexedDB.open(dbname, dbVersion);
    //on success
    // request.onsuccess = function (event) {
    //     db = event.target.result
    //     console.log("Database " + dbname + " version " + dbVersion + " has been succesfully opened");

    //     var allStoreNames = new Array();
    //     var objectStoreNames = db.objectStoreNames;
    //     for (var i = 0; i < objectStoreNames.length; i++) {
    //         allStoreNames[i] = objectStoreNames[i];
    //     }
    //     //fill the table        
    //     for (let index = 0; index < allStoreNames.length; index++) {
    //         $("#quizTable tbody").append('<tr><td class="objname">' + allStoreNames[index] + '<td><button class="btn btn-warning deletquiz">Delete</button> <button class="btn btn-secondary editbtn">Edit</button></td>/td></tr>');
    //     }
    //     db.close(); //close db after loading the table
    // }
    // request.onupgradeneeded = function (event) { //this needs to be called whenever the tutor creates a new quiz
    //     db = event.target.result;
    //     console.log("WARNING: On upgradeneeded load table NOT have been called");
    // }
    // //on error
    // request.onerror = function (event) {
    //     console.log("Error: " + event.target.errorCode);
    // }
});

$(document).on("click", "button.deletquiz", function () {
    var test = $(this).parents().parent().find("td.objname").html();
    console.log(test);

    if (dbOpen) {
        db.close();
        dbOpen = false;
        console.log("db closed in before opening new request to delete obstore");
    }

    var request = indexedDB.open('QuizMaker');
    console.log(dbVersion);

    request.onsuccess = function (e) {
        console.log("db open to get dbversion");
        dbOpen = true;
        db = e.target.result;
        var version = parseInt(db.version);
        db.close();
        dbOpen = false;
        console.log("dbclose on firstrequest");
        var secondRequest = indexedDB.open('QuizMaker', version + 1);
        dbVersion = version + 1;
        console.log("db open for secondrequest. Call upgrade")
        console.log(dbVersion);
        secondRequest.onsuccess = function (e) {
            dbVersion = parseInt(database.version);
            console.log(dbVersion);
        }
        secondRequest.onupgradeneeded() = function (e) {
            db = e.target.result;
            db.deleteObjectStore(test);
            $(this).parents("tr").remove();
        }

        secondRequest.onerror = function (e) {
            console.log("Error: " + e.target.errorCode);
        }

    }

    request.onupgradeneeded = function (event) {
        console.log("Onupgrade needed should NOT BE called here");
    }

    //on error
    request.onerror = function (event) {
        console.log("Error: " + event.target.errorCode);
    }


    // var dbName = "QuizMaker";
    // var dbVersion = parseInt(localStorage.getItem("dbversion"))+1;
    // var request = indexedDB.open(dbName, dbVersion);
    // request.onupgradeneeded = function (e) {
    //     var db = request.result;
    //     console.log("onupgradeneeded has been called");
    //     db.deleteObjectStore(test);        
    //     db.close(); 
    //     console.log("Delete operation success. Closing database");
    // }

    // request.onsuccess = function (event) {
    //     db = event.target.result
    //     console.log("Database " + dbname + " version " + dbVersion + " has been succesfully opened to delete a quiz");
    // }

    // request.onerror = function (event) {
    //     console.log('Error', event.target.error.name);
    // }    

});

$("#addTitle").submit(function () {
    if (dbOpen) {
        db.close();
        dbOpen = false;
        console.log("db closed in before createchapter");
    }

    var request = indexedDB.open('QuizMaker');       
    request.onsuccess = function (e) {
        console.log("db open for first request to get the version"); //this is to get the version 
        db = e.target.result;
        dbOpen = true;
        dbVersion = parseInt(db.version); console.log(dbVersion);
        var notExist = true;
        var allStoreNames = new Array(); //to compare with title        
        var objectStoreNames = db.objectStoreNames;
        for (var i = 0; i < objectStoreNames.length; i++) {
            allStoreNames[i] = objectStoreNames[i];
        }
        console.log(allStoreNames);
        //code below is validation: making sure its not empty and does not already exist in the database
        for (let index = 0; index < allStoreNames.length; index++) {
            console.log(allStoreNames[index]);
            if (title == allStoreNames[index]) {
                notExist = false; 
                console.log(notExist);
            }
        }

        if (notExist) {  
            if (dbOpen) {
                db.close();
                dbOpen = false;
                console.log("db closed in before createchapter");
            }
            dbVersion +=1; console.log(dbversion);
            var secondRequest = indexedDB.open('QuizMaker', dbVersion);            
            console.log("db open for secondrequest to add a new quiz");
            secondRequest.onupgradeneeded = function (e) {
                db = e.target.result;
                
            };

            secondRequest.onsuccess = function (e) {
                dbOpen = true;
                dbVersion = parseInt(database.version);
                e.target.result.close();
                console.log("db closed in second request");
                dbOpen = false;
                document.getElementById("newChapterName").value = "";
                document.location.reload();
            }

            secondRequest.onerror = function (e) {
                console.log("Error: " + e.target.errorCode);;
            }
        } else {
            alert("This quiz has a similar name to an existing quiz");
        }

        console.log("dbclose on firstrequest");

    }

    request.onerror = function (event) {
        console.log("Error: " + event.target.errorCode);;
    }
    // request.onsuccess = function (event) {
    //     db = event.target.result
    //     console.log("Database " + dbname + " version " + dbVersion + " has been succesfully opened");
    //     var objectStoreNames = db.objectStoreNames;
    //     for (var i = 0; i < objectStoreNames.length; i++) {
    //         allStoreNames[i] = objectStoreNames[i];
    //     }

    //     //code below is validation: making sure its not empty and does not already exist in the database
    //     for (let index = 0; index < allStoreNames.length; index++) {
    //         console.log(allStoreNames[index]);
    //         if (title == allStoreNames[index]) {
    //             notExist = false;
    //             alert("This quiz has a similar name to an existing quiz");
    //             console.log(notExist);
    //         }
    //     }

    //     if (notExist) {
    //         checkTitle(title);
    //     }
    //     db.close();
    // };
});

function checkTitle(title) {
    if (title != "" && title != null) {
        $("#addTitle").replaceWith('<h3>' + title + '</h3>');
        x.style.display = "block"; //show the button 
        //replace the title form with another
        var questionID = title.replace(/\s/g, '') + increment; //removing strings from the title and add increment to create unique question ID
        $("div.newQuest").append("<form class='addQuestion' onsubmit='return false'> <div class='question'> <div> <p> Question " + increment + "</p><label for='test'> Marks<input type='number' id='test'></label></div> <div class='col-md-12'><input type='text' name='questionBox' placeholder='Begin Typing Question here' class='form-control input-lg'></div> <div class='col-md-8'> <div class='input-group'> <div class='input-group-prepend'> <div class='input-group-text'> <input type='radio' name='radioCorrect' value='A' checked> </div> </div> <input type='text' id='" + questionID + "A' name='answer' placeholder='Option A' class='form-control A'> </div> </div> <div class='col-md-8'> <div class='input-group'> <div class='input-group-prepend'> <div class='input-group-text'> <input type='radio' name='radioCorrect' value='B'> </div> </div> <input type='text' id='" + questionID + "B' name='answer' placeholder='Option B' class='form-control B'> </div> </div> <div class='col-md-8'> <div class='input-group'> <div class='input-group-prepend'> <div class='input-group-text'> <input type='radio' name='radioCorrect' value='C'> </div> </div> <input type='text' id='" + questionID + "C' name='answer' placeholder='Option C' class='form-control C'> </div> </div> <div class='col-md-8'> <div class='input-group'> <div class='input-group-prepend'> <div class='input-group-text'> <input type='radio' name='radioCorrect' value='D'> </div> </div> <input type='text' id='" + questionID + "D' name='answer' placeholder='Option D' class='form-control D'> </div> </div> <div class='col-md-12'> <button type='submit' class='saveQuestionBtn btn btn-primary'>Save Question</button> <button type='reset' class='btn btn-secondary'> Reset Question</button> </div> </div> </form>");
        console.log(questionID);
        console.log(title);
        createObjstore();
    } else {
        alert("Title cannot be empty or the same as existing quizes");
    }
}

function createObjstore() { //this function is called when ever a new quiz is made to check if database exist or needs to be updated    
    const dbname = "QuizMaker";
    //check if the db already made before, if not store dbversion
    if (localStorage.getItem("dbversion") === null) {
        localStorage.setItem("dbversion", 1);
    } else {
        localStorage.setItem('dbversion', parseInt(localStorage.getItem('dbversion')) + 1); //very important to update the dbversion before opening to create a new object store
    }

    var dbVersion = parseInt(localStorage.getItem("dbversion")); // localstorage can only store string values.
    var request = indexedDB.open(dbname, dbVersion);

    //on success
    request.onsuccess = function (event) {
        db = event.target.result
        console.log("Database " + dbname + " version " + dbVersion + " has been succesfully made");
    }

    request.onupgradeneeded = function (event) { //this needs to be called whenever the tutor creates a new quiz
        db = event.target.result;
        var quizTitle = title;
        db.createObjectStore(quizTitle, {
            keypath: "questionid"
        })
        console.log("Object Store " + quizTitle + " has been made");
    }

    //on error
    request.onerror = function (event) {
        console.log("Error: " + event.target.errorCode);
    }

}

//function to add new question interface
$("#newStuff").click(function () {
    increment += 1;
    var questionID = title.replace(/\s/g, '') + increment;
    $("div.newQuest").append("<form class='addQuestion' onsubmit='return false'> <div class='question'> <div> <p> Question " + increment + "</p><label for='test'> Marks<input type='number' id='test'></label></div> <div class='col-md-12'><input type='text' name='questionBox' placeholder='Begin Typing Question here' class='form-control input-lg'></div> <div class='col-md-8'> <div class='input-group'> <div class='input-group-prepend'> <div class='input-group-text'> <input type='radio' name='radioCorrect' value='A' checked> </div> </div> <input type='text' id='" + questionID + "A' name='answer' placeholder='Option A' class='form-control A'> </div> </div> <div class='col-md-8'> <div class='input-group'> <div class='input-group-prepend'> <div class='input-group-text'> <input type='radio' name='radioCorrect' value='B'> </div> </div> <input type='text' id='" + questionID + "B' name='answer' placeholder='Option B' class='form-control B'> </div> </div> <div class='col-md-8'> <div class='input-group'> <div class='input-group-prepend'> <div class='input-group-text'> <input type='radio' name='radioCorrect' value='C'> </div> </div> <input type='text' id='" + questionID + "C' name='answer' placeholder='Option C' class='form-control C'> </div> </div> <div class='col-md-8'> <div class='input-group'> <div class='input-group-prepend'> <div class='input-group-text'> <input type='radio' name='radioCorrect' value='D'> </div> </div> <input type='text' id='" + questionID + "D' name='answer' placeholder='Option D' class='form-control D'> </div> </div> <div class='col-md-12'> <button type='submit' class='saveQuestionBtn btn btn-primary'>Save Question</button> <button type='reset' class='btn btn-secondary'> Reset Question</button> </div> </div> </form>");
    console.log(questionID);
});

$(document).on("click", "button.saveQuestionBtn", function () {
    //get the values from the input
    var quesID = increment;
    var ques = $(this).parent().parent().find("input[name=questionBox]").val();
    var a = $(this).parent().parent().find("input.A").val();
    var b = $(this).parent().parent().find("input.B").val();
    var c = $(this).parent().parent().find("input.C").val();
    var d = $(this).parent().parent().find("input.D").val();
    var ans = $(this).parent().parent().find("input[name=radioCorrect]:checked").parent().parent().parent().find("input[type=text]").val();
    var mark = $(this).parent().parent().find("input[type=number]").val();

    var fullquestion = {
        questionid: quesID,
        question: ques,
        A: a,
        B: b,
        C: c,
        D: d,
        correctAns: ans,
        marks: mark
    }

    console.log(fullquestion); //test to see if data is written correctly

    var tx = db.transaction(title, "readwrite");
    tx.onerror = function (e) {
        alert(` Error! ${e.target.error}  `);
    }
    var quizQuestion = tx.objectStore(title);
    quizQuestion.put(fullquestion, quesID);

});

function getAllItems(callback) {
    var r = indexedDB.open("QuizMaker")
    r.onsuccess = function (e) {
        var db = r.result;
        var trans = db.transaction(title, IDBTransaction.READ_ONLY);
        var store = trans.objectStore(title);
        var items = [];

        trans.oncomplete = function (evt) {
            callback(items);
        };

        var cursorRequest = store.openCursor();

        cursorRequest.onerror = function (error) {
            console.log(error);
        };

        cursorRequest.onsuccess = function (evt) {
            var cursor = evt.target.result;
            if (cursor) {
                items.push(cursor.value);
                cursor.continue();
            }
            console.log(items)
        };
    }
}

function exportToJsonFile(jsonData) {
    let dataStr = JSON.stringify(jsonData);
    let dataStr2 = '{"' + title + '":' + dataStr + "}";
    let dataUri = 'data:application/json,' + encodeURIComponent(dataStr2);

    let exportFileDefaultName = 'data.json';

    let linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    var dlbtn = document.getElementById("downloadbtn");
    dlbtn.appendChild(linkElement);

    var a = document.createElement('a');
    var linkText = document.createTextNode("Export JSON");
    a.class = "btn btn-outline-primary";
    a.appendChild(linkText);
    a.href = dataUri;
    a.download = (exportFileDefaultName);
    var downloadbtn = document.getElementById('downloadbtn');
    downloadbtn.appendChild(a);
    console.log(dataStr2);
}

//This button is supposed to convert the data into json for export
var convertfile = document.getElementById('exportjsonfile');
convertfile.onclick = function () {
    getAllItems(function (items) {
        var len = items.length;
        for (var i = 0; i < len; i += 1) {
            console.log(items[i]);
        }
        exportToJsonFile(items);
    })
}

//marked for removal because we do not intend to delete the database in real production
// function deleteDatabase() {
//     var DBDeleteRequest = window.indexedDB.deleteDatabase("QuizMaker");
//     DBDeleteRequest.onerror = function (event) {
//         console.log("Error deleting database.");
//     };
//     DBDeleteRequest.onsuccess = function (event) {
//         console.log("Database deleted successfully");
//         console.log(event.result); // should be undefined
//     };
// }

//Marked for removal because creating a new quiz should not require deletion of database
// var createNewQuiz = document.getElementById('createnewquiz');
// createNewQuiz.onclick = function () {
//     document.location.reload();
//     deleteDatabase();
// }
