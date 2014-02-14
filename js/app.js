app = angular.module('app', ['ngRoute']);
app.config(function ($routeProvider) {
    $routeProvider.when('/', {
      // controller: '',
      templateUrl: 'index.html'
    }).when('/myGroups', {
      templateUrl: ''
    }).otherwise({
      redirectTo: '/'
    });
  });

//// group controller
app.controller('groupViewController', 'getUsersGroups', function($scope){
  $scope.usersGroups = getUsersGroups.getGroups;
})

//// get User's groups
app.factory('getUsersGroups', function(){
  return {
    getGroups: function(option){
      $http({
        method : 'GET',
        url : '/getGroupsURL',
        params: { user_id: user.id }
        }).success(function(data, status, headers, config) {
          return data;
        }).error(function(data, status, headers, config) {
          console.log(status, error)
      });    
    }
  }
});

// app.service('groupCreator', )
// var groupViewController = function(){
//   this.groupName = name;
// }

// groupViewController.prototype.nameGroup = function(){
//   this.groupName = 

// }
// multiple controllers, one view 

// {{ groupName }}
// {{ groupUsersArray }}
// {{ groupMenu }}

