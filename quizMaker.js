var db;
var request = indexedDB.open("MyTestDatabase");
request.onerror = function(event) {
    // Generic error handler for all errors targeted at this database's
// requests!
  console.log("Database error code: " + event.target.errorCode);
};
request.onsuccess = function(event) {
  db = event.target.result;
};

//function to add new question
$("#newStuff").click(function(){
  $("div.newQuest").append('<div class="col-md-12"><input type="text" name="questionBox" placeholder="Begin Typing Question here"class="form-control input-lg"></div>');
});