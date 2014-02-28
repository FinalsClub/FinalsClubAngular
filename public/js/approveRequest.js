app.controller('requestController', ['$scope', '$http', 'requestHandler', function($scope, $http, requestHandler){
  $scope.requests = [];
  $scope.error = false

  $scope.approve = function(user, request_id){
    requestHandler.approveRequest(user, request_id);
  };
  
  $scope.ignore = function(id){
    requestHandler.ignoreRequest(id);
  }
  
}]);

app.factory('requestHandler', ['$http', function($http){
  return {
    approveRequest: function(user, request_id){
      $http({
      method: 'POST',
      url: '/members',
      data: JSON.stringify({
            user_id: user,
            group_id: window.location.pathname.split('/')[2],
            request_id: request_id
          })
      }).success(function(){
        window.location.href = '/';
      }).error(function(err){
        $scope.error = true;
      });  
    },
    ignoreRequest: function(id){
      $http({
        method: 'PUT',
        url: '/requests/' + id
      }).success(function() {
        window.location.href = window.location.pathname;
      });
    }
  };   
}]);

