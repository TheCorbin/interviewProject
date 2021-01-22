angular.module('starter.controllers', [])

.controller('UserCtrl', function($scope, $filter, $ionicModal, Table) {

  $scope.Init = function () {
    console.log('INIT!')
    $scope.users = []
    Table.getAll(new User().tableName).then(function (users) {
      var temp = [];
      angular.forEach(users, function (user) {
        temp.push(new User(user));
      })
      $scope.users = temp
      $scope.filteredUsers = temp
      $scope.calculateAges($scope.filteredUsers);
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
      $scope.calculateAges($scope.filteredUsers);
    });
  };

  $scope.add = function () {
    $scope.newUser = new User();
    $scope.AddModal.show();
  };

  $scope.edit = function(user) {
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
        $scope.calculateAges($scope.filteredUsers);
      }
      $scope.AddModal.hide();
    });
  }

  $scope.cancel = function () {
    $scope.AddModal.hide();
    $scope.EditModal.hide();
  }

  $scope.calculateAges = function(users) {
    var tempAges = []
    var lowestDays = 0;
    var highestDays = 0;
    var averageDays = 0;

    users.forEach( function (user) {
      var userBirthdate = new Date(user.birthdate);
      var diff = Math.floor(( Date.now() - Date.parse(userBirthdate))/ 86400000);
      tempAges.push(diff);
    })

    lowestDays = Math.min(...tempAges);
    highestDays = Math.max(...tempAges);
    averageDays = Math.floor(tempAges.reduce((a,b) => a + b, 0) / tempAges.length)

    $scope.calculatedAges = {lowest: lowestDays, highest: highestDays, average: averageDays}
  }

  $scope.Init();
})
