// write GET request for login page, dropdown menu /schools
//// SEND JSON FOR POSTS
app = angular.module('app', ['ngRoute']);
app.config(function ($httpProvider, $routeProvider, $locationProvider) {
  // $httpProvider.interceptors.push(interceptor);
  $locationProvider.html5Mode(true);
  $routeProvider
    .when('/', { controller: 'UserController' })
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

app.factory('interceptor',['$q','$location',function($q,$location){
  return {
    response: function(response){
      return promise.then(
        function success(response) {
        return response;
      },
      function error(response) {
        if(response.status === 401){ // 401 - unauthorized
          $location.path('/log_in');
          return $q.reject(response);
        }
        else{
          return $q.reject(response); 
        }
      });
    }
  }
}]);

// if user doesn't exist
app.controller('LogInController', 'logIn', function($scope){

})

app.controller('SignUpController', 'signUp', function($scope){
  $scope.schools = signUp.getSchools;
})
// if user exists
app.controller('UserController', function($rootscope, $scope) {
  $rootscope.groups = user.groups;
});


app.factory('logIn', function(){


});

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
app.controller('allGroupsViewController', 'getUsersGroups', function($scope){
  $scope.usersGroups = getUsersGroups.getGroups;
})

//// get User's groups
app.factory('getUsersGroups', function(){
  return {
    getGroups: function(){
      $http({
        method : 'GET',
        url : '/getGroupsURL',
        params: { user_id: user.id }
        }).success(function(data, status, headers, config) {
          return data; // should be an array
        }).error(function(data, status, headers, config) {
          console.log(status, error)
      });    
    }
  }
});


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