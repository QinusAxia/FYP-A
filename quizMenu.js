let db = null;
var dbname = "quizTitle";
var dbVersion = 1;
var request = indexedDB.open(dbname,dbVersion);

request.onerror = function(event) {
    console.log("Error: " + event.target.errorCode); ;
}

request.onsuccess = function(event) {
    db = event.target.result
    console.log("Database " + dbname + " version " + dbVersion+ " has been succesfully opened");          
  
    // This line will log the version of the connected database, which should be
    // an object that looks like { ['my-store-name'] }
    
    // console.log(db.objectStoreNames);
  };