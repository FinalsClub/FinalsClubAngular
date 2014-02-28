// views/groups/groups.jade
app.controller('allGroupsViewController', [ '$scope', '$http', function($scope, $http){
  $scope.groups = $scope.groups || [];
  $scope.currentGroup = null;

  $scope.dateExists = function(group){
    return group.next_meeting ? true : false;
  };

}]);
