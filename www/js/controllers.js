angular.module('starter.controllers', [])

.controller('UserCtrl', function($scope, $filter, $ionicModal, Table) {

  $scope.Init = function () {
    $scope.users = []
    Table.getAll(new User().tableName).then(function (users) {
      var temp = [];
      angular.forEach(users, function (user) {
        temp.push(new User(user));
      })
      $scope.users = temp
      $scope.filteredUsers = temp
    })

    $ionicModal.fromTemplateUrl('templates/user-detail.html', {
      scope: $scope, animation: 'slide-in-up'
    }).then(function (modal) {
      $scope.AddModal = modal;
    });
  }

  $scope.remove = function (user) {
    // Delete from Sqlite
    Table.deleteById(new User().tableName, new User().keyFieldName, user.id).then(function (users) {
      $scope.users.splice($scope.users.indexOf(user), 1);
    });
  };

  $scope.add = function () {
    $scope.newUser = new User();
    $scope.AddModal.show();
  };

  $scope.sexFilter = function (choice) {
    var temp = []
    $scope.users.forEach( function (user) {
      if (user.sex == choice) {
        temp.push(user)
      }
    })
    $scope.filteredUsers = temp;
  }

  $scope.resetSexFilter = function() {
    $scope.filteredUsers = $scope.users;
  }

  $scope.save = function () {
    // Save to Sqlite database:
    $scope.newUser.birthdate = $scope.newUser.birthdate.toString();
    Table.create($scope.newUser).then(function (result) {
      if (result) {
        $scope.newUser.id = result.insertId;
        $scope.users.push($scope.newUser);
      }
      $scope.AddModal.hide();
    });
  }

  $scope.Init();
})

.controller('AddCtrl', function($scope, $cordovaSQLite) {


})
