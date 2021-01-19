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

.controller('ViewCtrl', function($scope, People) {
  console.log('test in View Ctrl')

})

.controller('AddCtrl', function($scope, $cordovaSQLite) {

  $scope.insert = function( firstname, lastname, sex, birthdate) {
    console.log('safety test');
    console.log('the values!', $scope);
    let person = $scope.person

    var query = "INSERT INTO people (firstname, lastname, sex, birthdate) VALUES (?,?,?,?,?)";

    $cordovaSQLite.execute($scope.db, query, [person.firstname, person.lastname, person.sex, person.birthdate]).then(function(res) {
      var message = "INSERT ID -> " + res.insertId;
      console.log(message);
      alert(message);
  }, function (err) {
      console.error(err);
      alert(err);
  });

    // window.sqlitePlugin.execute(db, query, [firstname, lastname]).then(function(res) {
    //   console.log("INSERT ID -> " + res.insertId);
    // }, function (err) {
    //     console.error(err);
    // });
  }

})
