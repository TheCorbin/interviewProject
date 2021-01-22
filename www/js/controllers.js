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

    $ionicModal.fromTemplateUrl('templates/user-edit.html', {
      scope: $scope, animation: 'slide-in-up'
    }).then(function (modal) {
      $scope.EditModal = modal;
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

  $scope.edit = function(user) {
    console.log('the user', user)
    $scope.editUser = user;
    $scope.EditModal.show()
  }

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

  $scope.saveEdit = function () {
    //Edit record
    console.log('scope.editUser', $scope.editUser)
    Table.update($scope.editUser).then(function (result) {
      console.log('the result', result)
    })
    $scope.EditModal.hide();
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

  $scope.cancel = function () {
    $scope.AddModal.hide();
  }

  $scope.Init();
})

.controller('AddCtrl', function($scope, $cordovaSQLite) {


})
