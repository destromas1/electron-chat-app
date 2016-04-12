"use strict";

var app = angular.module("app", []);

app.controller('chatCtrl', ['$scope','$location', function ($scope,$location) {
    console.log('chatCtrl is running...');

    var room = {
      room :  1
    }; // $location.search();
    $scope.chatMessages = [];
    $scope.roomList = [];
    $scope.userList = [];
    $scope.thisRoom = room.room;
                
	$scope.userId = 'xxxxxxxx'.replace(/[xy]/g, function(c) {
    		var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
		    return r.toString(16);
		});

    // var socket = io.connect('http://localhost:4080');
    var socket = io.connect('https://node-chat-multirooms.herokuapp.com');


	socket.on('connect', function(){		
		socket.emit('newuser', $scope.userId , room.room);
	});

	socket.on('msgFromServer', function (user, msg) {
		
		$scope.chatMessages.push({userId : user , message : msg});
		$scope.$digest();
	});

	socket.on('roomInfoFromServer', function(rooms, currentRoom) {
		$scope.roomList = [];
		for(var key in rooms){
	        $scope.roomList.push(key);
	    }
		$scope.$digest();
	});

	socket.on('usersFromServer', function(users) {
    	$scope.userList = users;		
		  $scope.$digest();
	});

	

	$scope.sendMsg = function(){
		socket.emit('msgFromClient', $scope.textMsg);
		$scope.textMsg = '';
  };

}]);
