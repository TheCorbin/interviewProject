angular.module('starter.controllers', [])

.controller('DashCtrl', function($scope, $cordovaSQLite) {})

.controller('ChatsCtrl', function($scope, Chats) {
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  $scope.chats = Chats.all();
  $scope.remove = function(chat) {
    Chats.remove(chat);
  };
})

.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
  $scope.chat = Chats.get($stateParams.chatId);
})

.controller('AccountCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };
})

.controller('ViewCtrl', function($scope, $cordovaSQLite) {

  var query = "SELECT * FROM people";

  $cordovaSQLite.execute($scope.db, query).then(function(res) {
    var message = "INSERT ID -> " + res.insertId;
    alert(message);
  }, function (err) {
    console.error(err);
    alert(err);
  });


})

.controller('AddCtrl', function($scope, $cordovaSQLite) {

  $scope.insert = function( firstname, lastname, sex, birthdate) {
    let person = $scope.person

    var query = "INSERT INTO people (firstName, lastName, sex, birthDate) VALUES (?,?,?,?)";

    $cordovaSQLite.execute($scope.db, query, [person.firstName, person.lastName, person.sex, person.birthDate]).then(function(res) {
      var message = "INSERT ID -> " + res.insertId;
      alert(message);
    }, function (err) {
      alert(err);
    });
  }

})
