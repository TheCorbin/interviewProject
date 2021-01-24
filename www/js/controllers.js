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
  }

  $scope.remove = function (user) {
    Table.deleteById(new User().tableName, new User().keyFieldName, user.id).then(function (users) {
      $scope.users.splice($scope.users.indexOf(user), 1);
      $scope.filteredUsers.splice($scope.filteredUsers.indexOf(user), 1);
    });
  };

  $scope.add = function () {
    $scope.maxDate = new Date().toJSON().split('T')[0];
    $scope.newUser = new User();

    $ionicModal.fromTemplateUrl('templates/user-detail.html', {
      scope: $scope, animation: 'slide-in-up'
    }).then(function (modal) {
      $scope.AddModal = modal;
      $scope.AddModal.show();
    });
  };

  $scope.edit = function(user) {
    $scope.maxDate = new Date().toJSON().split('T')[0];

    $scope.editUser= user;
    if (user.birthdate){
      $scope.editUser.birthdate = new Date(user.birthdate).toISOString().slice(0, 10);
    }

    $ionicModal.fromTemplateUrl('templates/user-edit.html', {
      scope: $scope, animation: 'slide-in-up'
    }).then(function (modal) {
      $scope.EditModal = modal;
      $scope.EditModal.show()
    });
  }

  $scope.saveEdit = function () {
    //Edit record
    $scope.editUser.birthdate = $scope.editUser.birthdate.toString();

    Table.update($scope.editUser).then(function (result) {
      $scope.calculateAges($scope.filteredUsers);

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
        $scope.sexFilter($scope.sexChoice)
        $scope.calculateAges($scope.filteredUsers);
      }
      $scope.AddModal.hide();
    });
  }

  $scope.sexFilter = function (choice) {
    $scope.sexChoice = choice;
    var temp = []
    $scope.users.forEach( function (user) {
      if (user.sex == choice) {
        temp.push(user)
      }
    })
    $scope.filteredUsers = temp;
    $scope.calculateAges($scope.filteredUsers);
  }

  $scope.resetSexFilter = function() {
    $scope.sexChoice = ""
    $scope.filteredUsers = $scope.users;
    $scope.calculateAges($scope.filteredUsers);
  }

  $scope.cancel = function () {
    $scope.AddModal.hide();
  }

  $scope.editCancel = function () {
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
    if (tempAges.length > 0){
      $scope.calculatedAges = {lowest: lowestDays, highest: highestDays, average: averageDays}
    } else {
      $scope.calculatedAges = {lowest: 0, highest: 0, average: 0}  }
    }

  $scope.Init();
})
