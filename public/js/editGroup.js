// edit-group.jade
app.controller("editGroupController", ['$scope', '$http', 'INTENSITIES', 'groupHandler', function($scope, $http, INTENSITIES, groupHandler){
 
  $scope.group = {};
  $scope.error = false;
  $scope.courses = [];
  $scope.intensities = INTENSITIES;

  $scope.edit = function(){
    groupHandler.editGroup($scope.group._id, $scope.group, function() {
      $scope.error = true;
    });
  }

  $scope.leave = function(){
    groupHandler.leaveGroup($scope.group._id);
  }  
  $scope.delete = function(){
    groupHandler.deleteGroup($scope.group._id);
  };

}]);

app.factory('groupHandler', ['$http', function($http){
  var errored = false;
  return {
    editGroup: function(group_id, group, callback){
      $http({
        method: 'PUT', 
        url: '/groups/' + group_id,
        data: JSON.stringify(group)
      }).success(function(){
        window.location.href = '/';
      }).error(function(){ 
        callback();
      });
    },
    leaveGroup: function(group_id){
      var confirmed = confirm("Are you sure you want to leave this group?");
      if (confirmed) {
        $http({
          method: 'POST',
          url: '/leave_group',
          data: JSON.stringify({
            group_id: group_id
          })
        }).success(function(data, status){
          window.location.href = '/';
        });     
      }
    },
    deleteGroup: function(group_id){
      var confirmed = confirm("Are you sure you want to delete this group?");
      if(confirmed){
        $http({
          method: 'PUT', 
          url: '/groups/' + group_id + '/delete',
        }).success(function(){
          window.location.href = '/';
        });
      }
    }
  };
}]);