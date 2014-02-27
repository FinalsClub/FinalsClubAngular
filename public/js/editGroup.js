app.controller("editGroupController", ['$scope', '$http', function($scope, $http){
  $scope.group = {};
  $scope.meeting = null;
  $scope.submitDate = function(){
    $http({
      method: 'PUT', 
      url: '/groups/' + $scope.group._id,
      data: JSON.stringify({meeting: $scope.meeting})
    }).success(function(){
      window.location.href = '/';
    }).error(function(){
      console.log('date not sent! ', $scope.group)      
    })
  };
}]);