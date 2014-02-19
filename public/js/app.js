// write GET request for login page, dropdown menu /schools
//// SEND JSON FOR POSTS

app = angular.module('app', []);

/*
-----------------------------CONTROLLERS----------------------------------------------------------------------------------
*/

app.controller('LogInController', ['$scope', function($scope){

}])

app.controller('SignUpController', ['$scope', 'signUp',  function($scope, signUp){
  $scope.newUser = {
    'phone_number' : null,
    'email' : null,
    'school' : null,
    'intensity' : null
  };
  $scope.schools = [];
  $scope.intensities = ['low', 'medium', 'high']; 
  $scope.submit = function() {
    signUp.createNewUser($scope.newUser);
  };
}])

app.controller('UserController', ['$scope', 'isUserLoggedIn', 'getUserGroups', function($scope, isUserLoggedIn, getUserGroups) {
  if(isUserLoggedIn.checkLogIn()){
    $scope.user = new isUserLoggedIn();
    $scope.groups = new getUserGroups($scope.user._id);  
  } else {
    window.location.href = '/log_in';
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
    'entry_question' : null
  };
  $scope.submit = function(){
    createGroup.createNewGroup($scope.group);
  }
}])

app.controller('allGroupsViewController', [ '$scope', function($scope){
  $scope.groups = $scope.groups || [];
  $scope.currentGroup = null;
}]);


app.controller('findGroupController', ['$scope', '$http', function($scope, $http){
  $scope.groups = [];
  $scope.location = window.location.search.split('=')[1]
  $scope.request = {
    entry_answer : null,
    group_id : $scope.location,
    ignored : false
  }
  
  $scope.getCourses = function() {
    $http({
      method: 'GET',
      url: '/groups/search?courses=true'
      }).success(function(data, status){
        console.log(data);
        $scope.courses = data;
      }).error(function(){
        console.log('error in finding group by course: ', data)
      })
  };
  
  $scope.submit_answer = function(){
    console.log($scope.request);
    console.log($scope.location)
    $http({
      method: 'POST',
      url: '/requests',
      data: JSON.stringify($scope.request)
    }).success(function() {
      console.log('request sent');
      window.location.href = '/';      
    }).error(function(err){
      console.log(err);
    });
  }
}]);

app.controller('requestController', ['$scope', '$http', function($scope, $http){
  $scope.requests = [];
  $scope.approve = function(user, request_id){
    console.log(user);
    $http({
      method: 'POST',
      url: '/members',
      data: JSON.stringify({
        user_id: user,
        group_id: window.location.pathname.split('/')[2],
        request_id: request_id
      })
    }).success(function(){
      console.log('user added!')
      window.location.href = '/';
    }).error(function(err){
      console.log(err)
    });
  };
  
  $scope.ignoreRequest = function(id) {
    $http({
      method: 'PUT',
      url: '/requests/' + id
    }).success(function() {
      console.log('request ignored!');
      window.location.href = window.location.pathname;
    }).error(function(err) {
      console.log(err);
    });  
  };
  
}]);


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
    createNewUser: function(data){
      $http({
        method: 'PUT',
        url: '/sign_up/',
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

