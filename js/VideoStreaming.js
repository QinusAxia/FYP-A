var fileloc = "";
var fresh = 0;

function onFileSelected(e){
    var selectedFile = event.target.files[0];
    var reader = new FileReader();
  
    reader.onload = function(event) {
      fileloc = event.target.result;
    };
  
    reader.readAsDataURL(selectedFile);
}

function loadVideo(){
    var source = document.createElement("source");
    source.id = "vidSource"
    source.setAttribute("src", fileloc);
    source.type = "video/mp4";
    var vid = document.getElementById("vidCanvas");

    console.log(source);

    if (fresh == 0){
        vid.appendChild(source);
        vid.load();
        fresh = 1;
    }else{
        vid.removeChild(document.getElementById("vidSource"));
        vid.appendChild(source);
        vid.load();
    }

}

var textFile = null;
function WriteToFile(){
    var data = new Blob([text], {type: 'text/plain'});

    // If we are replacing a previously generated file we need to
    // manually revoke the object URL to avoid memory leaks.
    if (textFile !== null) {
      window.URL.revokeObjectURL(textFile);
    }

    textFile = window.URL.createObjectURL(data);

    return textFile;
  

    // s = readTextFile("file:///D:/Users/ASUS/Documents/GitHub/FYP-A/info/Address.txt");

    // var firstName = document.getElementById('address');
 
    // s.writeline(firstName);
 
    // s.writeline("-----------------------------");
    // s.Close();
}
