app.controller('SignUpController', ['$scope', 'signUp',  function($scope, signUp){
  $scope.newUser = {
    'phone_number' : null,
    'email' : null,
    'school' : null,
    'intensity' : null
  };
  $scope.schools = [];
  $scope.intensities = ['low', 'medium', 'high']; 
  $scope.submit = function() {
    signUp.createNewUser($scope.newUser);
  };
}]);

app.factory('signUp', ['$http', function($http){
  return {
    createNewUser: function(data){
      $http({
        method: 'PUT',
        url: '/sign_up/',
        data: JSON.stringify(data)
        }).success(function(data, status, headers){
          window.location.href = '/';
        }).error(function(){
          console.log('error in creating new user: ', data)
        })
      }
    };   
}]);

