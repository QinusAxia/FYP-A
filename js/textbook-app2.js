/*jslint white:true*/
/*global angular*/

let db;
let dbVersion1 = 1;
var dbVersion;
var version;
let dbReady = false;
let dbOpen = false;
var currentChapter;
var currentPage;
var currentChapterMaximumPage;
var firstObject;
var dataInCurrentChapter;

document.addEventListener('DOMContentLoaded', () => {
    console.log('dom content loaded');

    document.querySelector('#pictureTest').addEventListener('change', doFile);
    //    document.querySelector('#testImageBtn').addEventListener('click', doImageTestWithRecordToLoad);
    //    document.querySelector('#recordToLoad').addEventListener('select', doImageTestWithOption, false);
    document.querySelector('#nextPage').addEventListener('click', doImageTestWithNextBtn);
    document.querySelector('#previousPage').addEventListener('click', doImageTestWithPreviousBtn);
    document.querySelector('#btnNewChapter').addEventListener('click', createChapter);
    document.querySelector('#delChapter').addEventListener('click', function () {
        deleteChapter(currentChapter);
    });
    document.querySelector('#delPage').addEventListener('click', function () {
        deletePage(currentPage);
    });
    //    document.querySelector('#btnEditChapter').addEventListener('click', editChapter);
    initDb();
});

function initDb() {

    let request = indexedDB.open('textbook');

    request.onerror = function (e) {
        console.error('Unable to open database.');
    }

    request.onsuccess = function (e) {
        db = e.target.result;
        console.log('db opened');
        console.log(parseInt(db.version));
        dbOpen = true;

        var trans = db.transaction(db.objectStoreNames);
        let addReq = trans.objectStore(db.objectStoreNames[0]);
        //db.objectStoreNames.length
        console.log(addReq.name);

        //create chapter button
        for (var i = 0; i < db.objectStoreNames.length; i++) {
            var element = document.createElement("button");
            element.id = db.objectStoreNames[i];
            element.value = db.objectStoreNames[i];
            element.addEventListener("click", function () {
                selectChapter(this.id);
            });
            element.style = "display: block; width: 100%;";
            element.appendChild(document.createTextNode(db.objectStoreNames[i]));
            var page = document.getElementById("btn");
            page.appendChild(element);
            console.log(element);
        }

    }
}

function doFile(e) {
    console.log('change event fired for input field');
    let file = e.target.files[0];
    var reader = new FileReader();
    //				reader.readAsDataURL(file);
    reader.readAsBinaryString(file);

    reader.onload = function (e) {
        //alert(e.target.result);
        let bits = e.target.result;
        let ob = {
            created: new Date(),
            data: bits
        };

        let trans = db.transaction([currentChapter], 'readwrite');
        let addReq = trans.objectStore(currentChapter).add(ob);

        addReq.onerror = function (e) {
            console.log('error storing data');
            console.error(e);
        }

        trans.oncomplete = function (e) {
            let image = document.querySelector('#testImage');
            let trans = db.transaction([currentChapter], 'readonly');
            var req2 = trans.objectStore(currentChapter);
            var getAllKeysRequest = req2.getAllKeys();
            getAllKeysRequest.onsuccess = function () {
                console.log(getAllKeysRequest.result);
                var countRequest = req2.count();
                countRequest.onsuccess = function () {
                    if (countRequest.result != 0) {
                        currentPage = countRequest.result - 1;
                        let req = trans.objectStore(currentChapter).get(getAllKeysRequest.result[currentPage]);
                        document.getElementById("page").textContent = "Page " + (currentPage + 1);
                        req.onsuccess = function (e) {
                            let record = e.target.result;
                            if (record != undefined) {
                                console.log('get success', record);
                                image.src = 'data:image/jpeg;base64,' + btoa(record.data);
                            } else {
                                image.src = "";
                            }

                            document.getElementById("pictureTest").value = "";
                        }
                    } else {
                        image.src = "";
                        console("hhehehe");
                    }

                    var recordToLoad = document.getElementById("recordToLoad");
                    if (recordToLoad.childNodes.length > 0) {
                        recordToLoad.removeChild(recordToLoad.childNodes[0]);
                    }
                    var selectList = document.createElement("select");
                    selectList.id = "selectPage";
                    recordToLoad.appendChild(selectList);

                    var option = document.createElement("option");
                    option.value = 0;
                    option.text = "Go to Page:";
                    selectList.appendChild(option);

                    //Create and append the options
                    for (var i = 0; i < countRequest.result; i++) {
                        var option = document.createElement("option");
                        option.value = i + 1;
                        option.addEventListener("click", function () {
                            doImageTestWithOption(this.value);
                        });
                        option.text = i + 1;
                        selectList.appendChild(option);
                    }
                }
            }
            console.log('data stored');
            alert("data stored");
        }
    }
}

function doImageTest() {
    console.log('doImageTest');
    let image = document.querySelector('#testImage');
    let recordToLoad = parseInt(document.querySelector('#recordToLoad').value, 10);
    if (recordToLoad === '') recordToLoad = 1;

    let trans = db.transaction([currentChapter], 'readonly');
    //hard coded id
    let req = trans.objectStore(currentChapter).get(recordToLoad);
    currentPage = recordToLoad;
    req.onsuccess = function (e) {
        let record = e.target.result;
        console.log('get success', record);
        image.src = 'data:image/jpeg;base64,' + btoa(record.data);
    }
}

function doImageTestWithOption(selectedPage) {
    console.log('doImageTest');
    let image = document.querySelector('#testImage');
    var transaction = db.transaction([currentChapter], 'readonly');
    var objectStore = transaction.objectStore(currentChapter);

    var req2 = transaction.objectStore(currentChapter);
    var getAllKeysRequest = req2.getAllKeys();
    getAllKeysRequest.onsuccess = function () {
        console.log(getAllKeysRequest.result);
        currentPage = selectedPage - 1;
        let req = transaction.objectStore(currentChapter).get(getAllKeysRequest.result[currentPage]);
        document.getElementById("page").textContent = "Page " + (currentPage + 1);

        req.onsuccess = function (e) {
            let record = e.target.result;
            if (record != undefined) {
                console.log('get success', record);
                image.src = 'data:image/jpeg;base64,' + btoa(record.data);
            } else {
                image.src = "";
            }
        }


    }
}

function doImageTestWithNextBtn() {
    console.log('doImageTest');
    let image = document.querySelector('#testImage');
    var transaction = db.transaction([currentChapter], 'readonly');
    var objectStore = transaction.objectStore(currentChapter);

    var req2 = transaction.objectStore(currentChapter);
    var getAllKeysRequest = req2.getAllKeys();
    getAllKeysRequest.onsuccess = function () {
        console.log(getAllKeysRequest.result);
        //        currentPage = 1;

        var countRequest = req2.count();
        countRequest.onsuccess = function () {
            if (countRequest.result != 0) {
                if (currentPage < countRequest.result - 1) {
                    currentPage += 1;
                    console.log(currentPage);
                }
                //                currentPage += 1;
                let req = transaction.objectStore(currentChapter).get(getAllKeysRequest.result[currentPage]);
                document.getElementById("page").textContent = "Page " + (currentPage + 1);

                req.onsuccess = function (e) {
                    let record = e.target.result;
                    if (record != undefined) {
                        console.log('get success', record);
                        image.src = 'data:image/jpeg;base64,' + btoa(record.data);
                    } else {
                        image.src = "";
                    }
                }
            } else {
                image.src = "";
            }
        }
    }
}

function doImageTestWithPreviousBtn() {
    //    console.log('doImageTest');
    //    let image = document.querySelector('#testImage');
    //    var transaction = db.transaction([currentChapter], 'readonly');
    //    var objectStore = transaction.objectStore(currentChapter);
    //
    //    var countRequest = objectStore.count();
    //    countRequest.onsuccess = function () {
    //        currentChapterMaximumPage = countRequest.result;
    //        console.log("objectstore legnth:" + currentChapterMaximumPage);
    //        if (currentPage > 1) {
    //            currentPage -= 1;
    //            console.log(currentPage);
    //        }
    //        let trans = db.transaction([currentChapter], 'readonly');
    //        //hard coded id
    //        let req = trans.objectStore(currentChapter).get(currentPage);
    //        req.onsuccess = function (e) {
    //            let record = e.target.result;
    //            console.log('get success', record);
    //            image.src = 'data:image/jpeg;base64,' + btoa(record.data);
    //        }
    //    }
    console.log('doImageTest');
    let image = document.querySelector('#testImage');
    var transaction = db.transaction([currentChapter], 'readonly');
    var objectStore = transaction.objectStore(currentChapter);

    var req2 = transaction.objectStore(currentChapter);
    var getAllKeysRequest = req2.getAllKeys();
    getAllKeysRequest.onsuccess = function () {
        console.log(getAllKeysRequest.result);
        //        currentPage = 1;

        var countRequest = req2.count();
        countRequest.onsuccess = function () {
            if (countRequest.result != 0) {
                if (currentPage > 0) {
                    currentPage -= 1;
                    console.log(currentPage);
                }
                //                currentPage -= 1;
                let req = transaction.objectStore(currentChapter).get(getAllKeysRequest.result[currentPage]);
                document.getElementById("page").textContent = "Page " + (currentPage + 1);
                req.onsuccess = function (e) {
                    let record = e.target.result;
                    if (record != undefined) {
                        console.log('get success', record);
                        image.src = 'data:image/jpeg;base64,' + btoa(record.data);
                    } else {
                        image.src = "";
                    }
                }
            } else {
                image.src = "";
            }
        }
    }
}

function createChapter() {

    if (dbOpen) {
        db.close();
        console.log("db closed in before createchapter");
    }

    var request = indexedDB.open('textbook');
    console.log("db open for first request")
    console.log(dbVersion);
    request.onsuccess = function (e) {
        var database = e.target.result;
        var version = parseInt(database.version);

        database.close();
        console.log("dbclose on firstrequest")
        var secondRequest = indexedDB.open('textbook', version + 1);
        dbVersion = version + 1;
        console.log("db open for secondrequest")
        console.log(dbVersion);
        let chapterName = document.getElementById("newChapterName").value;
        secondRequest.onupgradeneeded = function (e) {
            var database = e.target.result;
            var objectStore = database.createObjectStore(chapterName, {
                keyPath: 'id',
                autoIncrement: true
            });
            //create btn after adding new chapter
            var element = document.createElement("button");
            element.id = chapterName;
            element.style = "display: block; width: 100%;";
            element.appendChild(document.createTextNode(chapterName));
            var page = document.getElementById("btn");
            page.appendChild(element);
            console.log(element);


        };
        secondRequest.onsuccess = function (e) {
            dbVersion = parseInt(database.version);
            e.target.result.close();
            console.log("db closed in second request");
            dbOpen = false;
            document.getElementById("newChapterName").value = "";
            document.location.reload();
        }
        //        initDb();
    }
}

function selectChapter(id) {
    currentChapter = id;
    document.getElementById("chapter").textContent = currentChapter;
    let image = document.querySelector('#testImage');
    let trans = db.transaction([currentChapter], 'readonly');
    var req2 = trans.objectStore(currentChapter);
    var getAllKeysRequest = req2.getAllKeys();
    getAllKeysRequest.onsuccess = function () {
        console.log(getAllKeysRequest.result);
        //        currentPage = 1;

        var countRequest = req2.count();
        countRequest.onsuccess = function () {
            if (countRequest.result != 0) {
                let req = trans.objectStore(currentChapter).get(getAllKeysRequest.result[0]);
                currentPage = 0;
                document.getElementById("page").textContent = "Page " + (currentPage + 1);
                req.onsuccess = function (e) {
                    let record = e.target.result;
                    if (record != undefined) {
                        console.log('get success', record);
                        image.src = 'data:image/jpeg;base64,' + btoa(record.data);
                    } else {
                        image.src = "";
                    }

                    document.getElementById("pictureTest").value = "";
                }
            } else {
                image.src = "";
            }

            var recordToLoad = document.getElementById("recordToLoad");
            if (recordToLoad.childNodes.length > 0) {
                recordToLoad.removeChild(recordToLoad.childNodes[0]);
            }
            var selectList = document.createElement("select");
            selectList.id = "selectPage";
            recordToLoad.appendChild(selectList);

            var option = document.createElement("option");
            option.value = 0;
            option.text = "Go to Page:";
            selectList.appendChild(option);

            //Create and append the options
            for (var i = 0; i < countRequest.result; i++) {
                var option = document.createElement("option");
                option.value = i + 1;
                option.addEventListener("click", function () {
                    doImageTestWithOption(this.value);
                });
                option.text = i + 1;
                selectList.appendChild(option);
            }
        }
    }
    //create chapter button


}

//    req.onerror = function(e){
//        image.src = 'data:image/jpeg;base64,' + btoa("");
//    }


//function editChapter() {
//    if (dbOpen) {
//        db.close();
//        console.log("db closed in before createchapter");
//    }
//    var request = indexedDB.open('textbook');
//    console.log("db open for first request")
//    console.log(dbVersion);
//    request.onsuccess = function (e) {
//        var database = e.target.result;
//        var version = parseInt(database.version);
//
//        database.close();
//        console.log("dbclose on firstrequest")
//        var secondRequest = indexedDB.open('textbook', version + 1);
//        dbVersion = version + 1;
//        console.log("db open for secondrequest")
//        console.log(dbVersion);
//        let editChapterName = document.getElementById("editChapterName").value;
//        secondRequest.onupgradeneeded = function (e) {
//            var db = e.target.result;
////            var objectStore = database.objectStoreNames.name = editChapterName;
//            
//            let trans = db.transaction([currentChapter], 'readwrite');
//            let addReq2 = trans.objectStore(currentChapter).name = editChapterName;
//            //db.objectStoreNames.length
////            addReq2.name = editChapterName;
//            console.log(addReq2.name);
//            //create btn after adding new chapter
//            //            var element = document.getElementById(chap);
//            //            element.parentNode.removeChild(element);
//            //            currentChapter = "";
//            //            document.getElementById("chapter").textContent = "Select Your Chapter";
//
//        };
//        secondRequest.onsuccess = function (e) {
//            dbVersion = parseInt(database.version);
//            e.target.result.close();
//            console.log("db closed in second request");
//            dbOpen = false;
//            document.getElementById("newChapterName").value = "";
//            document.location.reload();
//        }
//    }
//}

function deleteChapter(chap) {
    if (dbOpen) {
        db.close();
        console.log("db closed in before createchapter");
    }
    var request = indexedDB.open('textbook');
    console.log("db open for first request")
    console.log(dbVersion);
    request.onsuccess = function (e) {
        var database = e.target.result;
        var version = parseInt(database.version);

        database.close();
        console.log("dbclose on firstrequest")
        var secondRequest = indexedDB.open('textbook', version + 1);
        dbVersion = version + 1;
        console.log("db open for secondrequest")
        console.log(dbVersion);
        secondRequest.onupgradeneeded = function (e) {
            var database = e.target.result;
            var objectStore = database.deleteObjectStore(chap);
            //create btn after adding new chapter
            var element = document.getElementById(chap);
            element.parentNode.removeChild(element);
            currentChapter = "";
            document.getElementById("chapter").textContent = "Select Your Chapter";

        };
        secondRequest.onsuccess = function (e) {
            dbVersion = parseInt(database.version);
            e.target.result.close();
            console.log("db closed in second request");
            dbOpen = false;
            document.getElementById("newChapterName").value = "";
            document.location.reload();
        }
        //                initDb();
    }
}

function deletePage(page) {
    let trans = db.transaction([currentChapter], 'readwrite');
    //    var objectStore = trans.objectStore(currentChapter);
    var req = trans.objectStore(currentChapter);
    var getAllKeysRequest = req.getAllKeys();
    getAllKeysRequest.onsuccess = function () {
        console.log(getAllKeysRequest.result[currentPage]);
        var objectStoreRequest = req.delete(getAllKeysRequest.result[currentPage]);
        objectStoreRequest.onsuccess = function (event) {
            console.log("deleted Page: " + page);
            document.location.reload();
        };
    }
}

//function ClearFields(){
//    document.getElementById("newChapterName").value = "";
//}
