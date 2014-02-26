app.controller('findGroupController', ['$scope', '$http', '$rootScope', function($scope, $http, $rootScope){
  $scope.groups = [];
  $scope.user_groups = [];
  $scope.location = window.location.search.split('=')[1]
  $scope.request = {
    entry_answer : null,
    group_id : $scope.location,
    ignored : false
  };

  $scope.showLightbox = function(id){    
    $rootScope.lightbox = !$rootScope.lightbox;
    angular.element("." + id).toggleClass('block');
  };

  $scope.submit_answer = function(){
    $scope.request.created_at = new Date();
    $http({
      method: 'POST',
      url: '/requests',
      data: JSON.stringify($scope.request)
    }).success(function() {
      window.location.href = '/';      
    }).error(function(err){
    });
  };
}]);
