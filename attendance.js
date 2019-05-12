    // Your web app's Firebase configuration
    var firebaseConfig = {
        apiKey: "AIzaSyDQCDZDYfD7z5Qa2GDefkLmZgZApNj1i2k",
        authDomain: "sjk-chung-hua-attendance.firebaseapp.com",
        databaseURL: "https://sjk-chung-hua-attendance.firebaseio.com",
        projectId: "sjk-chung-hua-attendance",
        storageBucket: "sjk-chung-hua-attendance.appspot.com",
        messagingSenderId: "209757428174",
        appId: "1:209757428174:web:e6f4220d20f3ba0e"
    };

    var db = firebase.firestore();

    // Add a new document in collection "cities"
    db.collection("cities").doc("LA").set({
        name: "Los Angeles",
        state: "CA",
        country: "USA"
    })
    .then(function() {
        console.log("Document successfully written!");
    })
    .catch(function(error) {
        console.error("Error writing document: ", error);
    });

    db.collection("all_students").get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            console.log(`${doc.id} => ${doc.data()}`);
        });
    });