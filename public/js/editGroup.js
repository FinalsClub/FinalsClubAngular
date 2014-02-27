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
    })
  };
  $scope.deleteGroup = function(id){
    var confirmed = confirm("Are you sure you want to delete this group?");
    if(confirmed){
      $http({
        method: 'PUT', 
        url: '/groups/' + id + '/delete',
      }).success(function(){
        window.location.href = '/';
      }).error(function(){
        console.log('date not sent! ', id)      
      })
    }
  }
}]);