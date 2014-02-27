app.controller('flashcardController', ['$scope', '$timeout', function($scope, $timeout) {
  $scope.flashcards = [];
  $scope.topic = null;
  $scope.flipped = false;
  $scope.currentCard = 0;
    
  $scope.configureText = function(counter, side) {
    if (counter === $scope.flashcards.length) {
      return;
    }    
    var el = angular.element('#div-' + counter + " " + side + ' p');
    
    if (el.data('length') < 60) {
      el.addClass('big'); 
    } else if (el.data('length') < 200) {
      el.addClass('medium');
    } else {
      el.addClass('small');
    }
      
    side = side === ".back" ? ".front" : ".back";
    counter = side === ".front" ? counter + 1 : counter;
    $scope.configureText(counter, side);
  };
  
  $scope.goBack = function() {
    $scope.flipped && $scope.flip($scope.currentCard);
    $scope.currentCard > 0 && $scope.currentCard--;
  };
  
  $scope.goForward = function() {
    $scope.flipped && $scope.flip($scope.currentCard);
    $scope.currentCard < $scope.flashcards.length-1 && $scope.currentCard++;
  };
  
  $scope.flip = function(index) {    
    angular.element('#div-' + index).toggleClass('animated');
    $scope.flipped = !$scope.flipped;
  };
  
  angular.element(document).ready(function() {
    $scope.configureText(0, ".front");    
  });  
}]);
