app.controller('findGroupController', ['$scope', '$http', function($scope, $http){
  $scope.groups = [];
  $scope.user_groups = [];
  $scope.location = window.location.search.split('=')[1]
  $scope.request = {
    entry_answer : null,
    group_id : $scope.location,
    ignored : false
  };

  $scope.showLightbox = function(name){    
    document.getElementById(name).style.display ='block';
    document.getElementById('fade').style.display ='block';
    document.getElementById('fade').className = 'black_overlay'
  };

  $scope.hideLightbox = function(name){
    document.getElementById(name).style.display ='none';
    document.getElementById('fade').className = '';
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
      console.log(err);
      angular.element('.contentWrapper').prepend("<span class='error'>You are already in that group.</span>");
    });
  };
}]);
