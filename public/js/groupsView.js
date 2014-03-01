// views/groups/groups.jade
app.controller('allGroupsViewController', [ '$scope', '$http', '$rootScope', function($scope, $http, $rootScope){
  $scope.groups = $scope.groups || [];
  $scope.currentGroup = null;

  $scope.dateExists = function(group){
    return group.next_meeting ? true : false;
  };

  $scope.showLightbox = function(id){    
    $rootScope.lightbox = !$rootScope.lightbox;
    angular.element("." + id).toggleClass('block');
  };
  
}]);
