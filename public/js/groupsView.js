app.controller('allGroupsViewController', [ '$scope', '$http', function($scope, $http){
  $scope.groups = $scope.groups || [];
  $scope.currentGroup = null;
  
  $scope.leaveGroup = function(){
    $scope.group_id = window.location.pathname.split('/')[2];
    $http({
      method: 'POST',
      url: '/leave_group',
      data: JSON.stringify({group_id: $scope.group_id})
      }).success(function(data, status){
        window.location.href = '/';
      }).error(function(data){
        console.log('error in deleting group: ', data)
      });
    };
}]);
