app.controller('homepageController', ['$scope', function($scope) {
  $scope.loadImage = function() {
    angular.element('body').css({
      'background-image': 'url("img/homepage4.png")',
      'background-repeat': 'no-repeat',
      'overflow': 'hidden',
      'background-position': 'center'
    });
  };
}]);
