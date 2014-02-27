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