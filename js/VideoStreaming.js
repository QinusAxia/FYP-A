var myVideo = document.getElementById("vidCanvas"); 


var app = angular.module("myApp", []);
app.controller ("myCtrl", function ($scope){
    $scope.loadVideo = function(){
        var input = document.getElementById("vidfile").files[0].name;
        $scope.vidpath.src = "image/" + input;
        console.log($scope.vidpath);
    }
});