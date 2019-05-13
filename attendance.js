
    // Your web app's Firebase configuration
var firebaseConfig = {
    apiKey: "AIzaSyDQCDZDYfD7z5Qa2GDefkLmZgZApNj1i2k",
    authDomain: "sjk-chung-hua-attendance.firebaseapp.com",
    databaseURL: "https://sjk-chung-hua-attendance.firebaseio.com",
    projectId: "sjk-chung-hua-attendance",
    storageBucket: "sjk-chung-hua-attendance.appspot.com",
    messagingSenderId: "209757428174",
    appId: "1:209757428174:web:9ae33de868f620b7"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

var db = firebase.firestore();

//this is a temporary function
$("#addStudentForm").submit(function() {
    var englishName = document.querySelector("#ename").value;
    var cName = document.querySelector("#cname").value;
    var bilangan = parseInt($("#bilangan").val());
    var jantina = $("#genderDrop option:selected").text();
    console.log(englishName +" "+ cName +" "+bilangan+" "+jantina);
    
    // parseInt($("#inputDetailsQuantity" + rowID).val())


    // Add a new document in collection "studentList"
    db.collection("studentList").doc(englishName).set({
        ename: englishName,
        cname: cName,
        bil: bilangan,
        gender: jantina
    })
    .then(function() {
        console.log("Document successfully written");
    })
    .catch(function(error) {
        console.error("Error writing document: ", error);
    });

})

window.onload = function () {
    loadtable();
}

function loadtable() {
    
    db.collection("studentList").get().then(function(querySnapshot) {
        var content = "";
        var productIDarray = {};
        var IDcounterForEachProduct=0;        
        querySnapshot.forEach (function(doc){
            productIDarray[IDcounterForEachProduct]=doc.id;//mapping the index number to ID
            content += '<tr class="tapAbsent">';
            
            content += '<td>' + doc.data().bil + '</td>';
            content += '<td class="ename">' + doc.data().ename + '</td>';
            content += '<td class="cname">' + doc.data().cname + '</td>';

            content += '</tr>';
            IDcounterForEachProduct++;
            console.log(doc.data().ename);
        });
        console.log(content);
        $('#studentTable').append(content);
    });

}

$(document).on("click", "tr.tapAbsent", function () {
    var trow = $(this).find("td.ename").html();
    console.log(trow);    
    this.classList.toggle("selected");    
})