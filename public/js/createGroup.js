// views/groups/create-group.jade
app.controller('createGroupController', ['$scope', 'createGroup', 'INTENSITIES', function($scope, createGroup, INTENSITIES){
  $scope.intensities = INTENSITIES;
  $scope.courses = [];
  $scope.group = {
    name : null,
    course_name : null,
    motto : null,
    description : null,   
    intensity : null,
    entry_question : null,
    next_meeting : null, 
    hidden : false
  };
  $scope.submit = function(){
    createGroup.createNewGroup($scope.group);
  }
}]);

app.factory('createGroup', ['$http', function($http){
  return {
    createNewGroup: function(data){
      $http({
        method: 'POST',
        url: '/groups',
        data: JSON.stringify(data)
        }).success(function(data, status, headers){
          window.location.href = '/';
        }).error(function(){
          console.log('error in creating new group: ', data)
        })
      }
  };   
}]);
