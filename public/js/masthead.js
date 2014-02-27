app.controller('indexController', ['$rootScope', 'HOST', function($rootScope, HOST) {
  $rootScope.lightbox = false;
  $rootScope.homepage = "";
  $rootScope.host = HOST;
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