// requests.jade
app.controller('requestController', ['$scope', '$http', 'requestHandler', function($scope, $http, requestHandler){
  $scope.requests = [];
  $scope.error = false

  $scope.approve = requestHandler.approveRequest.bind(null, user, request_id);
  
  $scope.ignore = requestHandler.ignoreRequest.bind(null, id);
  
  
}]);

app.factory('requestHandler', ['$http', '$scope', function($http, $scope){
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

