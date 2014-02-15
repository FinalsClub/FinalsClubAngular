app = angular.module('app', ['ngRoute']);
app.config(function ($httpProvider, $routeProvider, $locationProvider) {
  $httpProvider.interceptors.push(interceptor);
  $locationProvider.html5Mode(true);
  $routeProvider
    .when('/', { template: 'index.jade', controller: 'UserController' })
    .when('/log_in', { template: 'log_in.jade', controller: 'LogInController' })
    .when('/sign_up', { template: 'sign_up.jade', controller: 'SignUpController' })
    .when('/groups/'+group.id+'/flashcards', { template: 'flashcards.jade', controller: '' })
    .when('/groups/'+group.id+'/flashcards'+lecture.id+'', { template: 'lectureFlashcards.jade', controller: '' })
    .when('/groups/'+group.id+'/flashcards'+lecture.id+'/edit', { template: 'editFlashcards.jade', controller: '' })
    .when('/groups/search', { template: 'searchGroups.jade', controller: '' })
    .when('/groups/new', { template: 'createGroups.jade', controller: '' })
    .when('groups/'+group.id+'/communications', { template: 'communications.jade', controller: '' })
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


    /////// http interceptor for USER object: 
    ///// user obj comes with group names
    ///// more get requests for lectures, etc
app.controller('LogInController', function($scope){

})

app.controller('UserController', function($rootscope, $scope) {
  // if user exists
  $rootscope.groups = user.groups;
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