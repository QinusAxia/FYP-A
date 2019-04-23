/*jslint white:true*/
/*global angular*/



let db;
let dbVersion1 = 1;
var dbVersion;
var version;
let dbReady = false;
let dbOpen = false;

document.addEventListener('DOMContentLoaded', () => {
    console.log('dom content loaded');

    document.querySelector('#pictureTest').addEventListener('change', doFile);
    document.querySelector('#testImageBtn').addEventListener('click', doImageTest);
    document.querySelector('#btnNewChapter').addEventListener('click', createChapter);

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

        let trans = db.transaction(['cachedForms'], 'readwrite');
        let addReq = trans.objectStore('cachedForms').add(ob);

        addReq.onerror = function (e) {
            console.log('error storing data');
            console.error(e);
        }

        trans.oncomplete = function (e) {
            console.log('data stored');
        }
    }
}

function doImageTest() {
    console.log('doImageTest');
    let image = document.querySelector('#testImage');
    let recordToLoad = parseInt(document.querySelector('#recordToLoad').value, 10);
    if (recordToLoad === '') recordToLoad = 1;

    let trans = db.transaction(['cachedForms'], 'readonly');
    //hard coded id
    let req = trans.objectStore('cachedForms').get(recordToLoad);
    req.onsuccess = function (e) {
        let record = e.target.result;
        console.log('get success', record);
        image.src = 'data:image/jpeg;base64,' + btoa(record.data);
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
        };
        secondRequest.onsuccess = function (e) {
            dbVersion = parseInt(database.version);
            e.target.result.close();
            console.log("db closed in second request");
            dbOpen = false;
            chapterName = "";
        }
        initDb();
    }



}
