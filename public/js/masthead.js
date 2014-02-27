app.controller('indexController', ['$rootScope', function($rootScope) {
  $rootScope.lightbox = false;
  $rootScope.homepage = "";
}]);


app.directive('ngIf', function(){
  return {
    link: function(scope, element, attrs){
       if(scope.$eval(attrs.ngIf)) {
        element.replaceWith(element.children());
      } else {
        element.replaceWith(' ');
      }
    }
  };
})