// views/splashpage.jade
app.controller('homepageController', ['$scope', '$rootScope', function($scope, $rootScope) {
  $scope.load = function() {
    $rootScope.homepage = "homepageImage";
  };
}]);
