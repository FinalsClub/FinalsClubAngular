//find-group.jade, join-group.jade
app.controller('findGroupController', ['$scope', '$http', '$rootScope', 'searchHandler', function($scope, $http, $rootScope, searchHandler){
  
  $scope.groups = [];
  $scope.user_groups = [];
  $scope.location = window.location.search.split('=')[1]
  $scope.error = false;
  $scope.request = {
    entry_answer : null,
    group_id : $scope.location,
    ignored : false
  };
  
  $scope.checkGroupLength = function(users){
    return users.length ? true : false;
  };

  $scope.joinEmptyGroup = function(id, user){
    searchHandler.joinEmptyGroup(id, user);
  };
  
  $scope.showLightbox = function(id){    
    $rootScope.lightbox = !$rootScope.lightbox;
    angular.element("." + id).toggleClass('block');
  };

  $scope.submit_answer = function(){
    searchHandler.submit_answer($scope.request, function(){
      $scope.error = true;
    });
  };

}]);

app.factory('searchHandler', ['$http', function($http){
  return {
    joinEmptyGroup: function(id, user){
      $http({
        method: 'POST',
        url: '/members',
        data: JSON.stringify({
          group_id: id,
          user_id: user, 
          request_id: null
        })
      }).success(function() {
        window.location.href = '/';      
      });
    },
    submit_answer: function(request, callback){
      request.created_at = new Date();
      $http({
        method: 'POST',
        url: '/requests',
        data: JSON.stringify(request)
      }).success(function() {
        window.location.href = '/';      
      }).error(function(err){
        callback();
      });
    }
  };
}]);