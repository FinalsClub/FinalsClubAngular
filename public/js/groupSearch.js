app.controller('findGroupController', ['$scope', '$http', '$rootScope', function($scope, $http, $rootScope){
  $scope.groups = [];
  $scope.user_groups = [];
  $scope.location = window.location.search.split('=')[1]
  $scope.error = false;
  $scope.request = {
    entry_answer : null,
    group_id : $scope.location,
    ignored : false
  };
  
  $scope.checkGroupLength = function(users){
    // debugger;
    if(users.length){
      return true;
    } else {
      return false;
    }
  }
  $scope.joinEmptyGroup = function(id, user){
    console.log(user);
    $http({
      method: 'POST',
      url: '/members',
      data: JSON.stringify({
        group_id: id,
        user_id: user, 
        request_id: null
      })
    }).success(function() {
      window.location.href = '/';      
    }).error(function(err){
    });
  }
  
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
      console.log("ERRRROORRRR")
      $scope.error = true;
    });
  };
}]);

app.directive('ngIf', function(){
  return {
    link: function(scope, element, attrs){
       if(scope.$eval(attrs.ngIf)) {
        element.replaceWith(element.children())
      } else {
        element.replaceWith(' ')
      }
    }
  }
})