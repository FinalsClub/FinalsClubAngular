// write GET request for login page, dropdown menu /schools
//// SEND JSON FOR POSTS

app = angular.module('app', []);

app.config(function ($locationProvider) {
  $locationProvider.html5Mode(true);
});


/*
-----------------------------CONTROLLERS----------------------------------------------------------------------------------
*/

app.controller('LogInController', ['$scope', function($scope){

}])

app.controller('SignUpController', ['$scope', '$location', 'signUp',  function($scope, $location, signUp){
  $scope.location = $location.search().id;
  $scope.newUser = {
    'phone_number' : null,
    'email' : null,
    'school' : null,
    'intensity' : null
  };
  $scope.schools = [];
  $scope.intensities = ['low', 'medium', 'high']; 
  $scope.submit = function() {
    console.log($scope.location);
    signUp.createNewUser($scope.newUser, $scope.location);
  };
}])

app.controller('UserController', ['$scope', '$location', 'isUserLoggedIn', 'getUserGroups', function($scope, $location, isUserLoggedIn, getUserGroups) {
  if(isUserLoggedIn.checkLogIn()){
    console.log('in here')
    $scope.user = new isUserLoggedIn();
    $scope.groups = new getUserGroups($scope.user._id);  
  } else {
    $location.path('/log_in');
  }
}]);

app.controller('createGroupController', ['$scope', 'createGroup', function($scope, createGroup){
  $scope.intensities = ['low', 'medium', 'high'];
  $scope.courses = [];
  $scope.group = {
    'name' : null,
    'course_id' : null,
    'motto' : null,
    'description' : null,   
    'intensity' : null,
    'question' : null
  };
  $scope.submit = function(){
    createGroup.createNewGroup($scope.group);
  }
}])

app.controller('allGroupsViewController', function($scope){
  $scope.groups = $scope.groups || [];
  
})



/*
-----------------------------FACTORIES------------------------------------------------------------------------------------
*/

app.factory('isUserLoggedIn', ['$http', function($http){
    return {
      checkLogIn: function(){
        $http({
          method: 'GET',
          url: '/loggedin'
        }).success(function(data, status){
          console.log('is user logged in ', data)
          return data;
        }).error(function(data, status){
          console.log(data)
        });
      }
    };
}]);

app.factory('getUserGroups', ['$http', function($http) {
  return function(user) {
      $http({
        method: 'GET',
        url: '/groups',
        params: { user_id : user }
      }).success(function(data, status){
        console.log(data);
        return data;
      }).error(function(data, status){
        console.log("ERROR: ", data);
      });
    } 
}]);

app.factory('signUp', ['$http', function($http){
  return {
    createNewUser: function(data, id){
      $http({
        method: 'PUT',
        url: '/sign_up/' + id,
        data: JSON.stringify(data)
        }).success(function(data, status, headers){
          window.location.href = '/';
        }).error(function(){
          console.log('error in creating new user: ', data)
        })
      }
  };   
}]);

app.factory('createGroup', ['$http', function($http){
  return {
    createNewGroup: function(data){
      $http({
        method: 'POST',
        url: '/groups',
        data: JSON.stringify(data)
        }).success(function(data, status, headers){
          window.location.href = '/';
        }).error(function(){
          console.log('error in creating new group: ', data)
        })
      }
  };   
}]);


app.controller('groupController', 'getGroupsLectures', function($scope){
  $scope.groupSubject = getGroupsLectures.getSubject;
  $scope.groupLectures = getGroupsLectures.getLectures;
})

app.factory('getGroupsLectures', function(){
  return {
    getLectures: function(option){
      $http({
        method : 'GET',
        url : '/someOtherURL',
        params: { group_id: group.id } // or group name or whatever
        }).success(function(data, status, headers, config) {
          return data; // should be an array
        }).error(function(data, status, headers, config) {
          console.log(status, error)
      });    
    },
    getSubject: function(option){ // necessary?
      $http({
        method : 'GET',
        url : '/someOtherURL',
        params: { group_id: group.id } // or group name or whatever
        }).success(function(data, status, headers, config) {
          return data; // should be an array
        }).error(function(data, status, headers, config) {
          console.log(status, error)
      });    
    }
  }
})