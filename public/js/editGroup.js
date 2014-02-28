app.controller("editGroupController", ['$scope', '$http', 'INTENSITIES', function($scope, $http, INTENSITIES){
  $scope.group = {};
  $scope.error = false;
  $scope.courses = [];
  $scope.intensities = INTENSITIES;

  $scope.editGroup = function(){
    $http({
      method: 'PUT', 
      url: '/groups/' + $scope.group._id,
      data: JSON.stringify($scope.group)
    }).success(function(){
      window.location.href = '/';
    }).error(function(){ 
      $scope.error = true;
    })
  };
  
  $scope.leaveGroup = function(){
    var confirmed = confirm("Are you sure you want to leave this group?");
    if (confirmed) {
      $http({
        method: 'POST',
        url: '/leave_group',
        data: JSON.stringify({
          group_id: $scope.group._id
        })
      }).success(function(data, status){
          window.location.href = '/';
      }).error(function(data){
          console.log('error in deleting group: ', data)
      });      
    }
  };
  
  $scope.deleteGroup = function(){
    var confirmed = confirm("Are you sure you want to delete this group?");
    if(confirmed){
      $http({
        method: 'PUT', 
        url: '/groups/' + $scope.group._id + '/delete',
      }).success(function(){
        window.location.href = '/';
      }).error(function(){
        console.log('date not sent! ', id)      
      })
    }
  }
}]);