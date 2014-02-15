app = angular.module('app', ['ngRoute']);
app.config(function ($httpProvider, $routeProvider, $locationProvider) {
  $httpProvider.interceptors.push(interceptor);
  $locationProvider.html5Mode(true);
  $routeProvider
    .when('/', { template: '/templates/index.jade', controller: 'UserController' })
    .when('/log_in', { template: '/templates/logIn.jade', controller: 'LogInController' })
// write GET request for login page, dropdown menu /schools
//// SEND JSON FOR POSTS
    .when('/sign_up', { template: '/templates/signUp.jade', controller: 'SignUpController' })
    .when('/groups/'+group.id+'/flashcards', { template: '/templates/flashcards.jade', controller: '' })
    .when('/groups/'+group.id+'/flashcards'+lecture.id+'', { template: '/templates/lectureFlashcards.jade', controller: '' })
    .when('/groups/'+group.id+'/flashcards'+lecture.id+'/edit', { template: '/templates/editFlashcards.jade', controller: '' })
    .when('/groups/search', { template: '/templates/searchGroups.jade', controller: '' })
    .when('/groups/new', { template: '/templates/createGroups.jade', controller: '' })
    .when('groups/'+group.id+'/communications', { template: '/templates/communications.jade', controller: '' })
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
  // run signup factory
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
    };  
  }   
});

//// mygroups controller
app.controller('allGroupsViewController', 'getUsersGroups', function($scope){
  $scope.usersGroups = getUsersGroups.getGroups;
  // $scope.usersSubjects = ...
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