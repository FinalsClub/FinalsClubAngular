// write GET request for login page, dropdown menu /schools
//// SEND JSON FOR POSTS
app = angular.module('app', ['ngRoute']);

app.config(function ($routeProvider, $locationProvider) {
  $locationProvider.html5Mode(true);
  $routeProvider
    .when('/', { templateUrl: '/templates/groups.jade', controller: 'UserController' })
    .when('/log_in', { templateUrl: '/templates/logIn.jade', controller: 'LogInController' })
    .when('/sign_up', { templateUrl: '/templates/signUp.jade', controller: 'SignUpController' })
    // .when('/groups/'+group.id+'/flashcards', { templateUrl: '/templates/flashcards.jade', controller: '' })
    // .when('/groups/'+group.id+'/flashcards'+lecture.id+'', { templateUrl: '/templates/lectureFlashcards.jade', controller: '' })
    // .when('/groups/'+group.id+'/flashcards'+lecture.id+'/edit', { templateUrl: '/templates/editFlashcards.jade', controller: '' })
    // .when('/groups/search', { templateUrl: '/templates/searchGroups.jade', controller: '' })
    // .when('/groups/new', { templateUrl: '/templates/createGroups.jade', controller: '' })
    // .when('groups/'+group.id+'/communications', { templateUrl: '/templates/communications.jade', controller: '' })
    .otherwise({ redirectTo: '/' });
});


// if user doesn't exist
app.controller('LogInController', ['$scope', function($scope){

}])

app.controller('SignUpController', 'signUp', function($scope){
  $scope.schools = signUp.getSchools;
})

app.factory('getUserGroups', ['$http', function($http) {
  return function(user) {
      $http({
        method : 'GET',
        url : '/groups',
        params : { user_id : user }
      }).success(function(data, status){
        console.log(data);
        return data;
      }).error(function(data, status){
        console.log("ERROR: ", data);
      });
    } 
}]);

// if user exists
app.controller('UserController', ['$scope', '$location', 'isUserLoggedIn', 'getUserGroups', function($scope, $location, isUserLoggedIn, getUserGroups) {
  if(isUserLoggedIn.checkLogIn()){
    console.log('in here')
    $scope.user = new isUserLoggedIn();
    $scope.groups = new getUserGroups($scope.user._id);  
  } else {
    $location.path('/log_in');
  }
}]);

app.factory('isUserLoggedIn', ['$http', function($http){
    return {
      checkLogIn : function(){
        $http({
          method : 'GET',
          url : '/loggedin'
        }).success(function(data, status){
          console.log('is user logged in ', data)
          return data;
        }).error(function(data, status){
          console.log(data)
        });
      }
    };
}]);

app.factory('signUp', function(){
  return {
    getSchools: function(option){
      $http({
        method : 'GET',
        url : '/schools',
        }).success(function(data, status, headers, config) {
          data = JSON.parse(data);
          return data; // array of school names
        }).error(function(data, status, headers, config) {
          console.log(status, error)
      });   
    }  
  };   
});

// app.factory('')
//// mygroups controller
app.controller('allGroupsViewController', 'isUserLoggedIn', 'getUsersGroups', function($scope){
  $scope.usersGroups = getUsersGroups.getGroups;
})



// app.factory('getUsersGroups', function(){
//   return {
//     getGroups: function(option){
//       $http({
//         method : 'GET',
//         url : '/getGroupsURL',
//         params: { user_id: user.id }
//         }).success(function(data, status, headers, config) {
//           return data; // should be an array
//         }).error(function(data, status, headers, config) {
//           console.log(status, error)
//       });    
//     }
//   }
// });


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

app.controller('createGroupController', function($scope){

})