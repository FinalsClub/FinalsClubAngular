app.controller('topicController', ['$scope', '$http', function($scope, $http){
  $scope.topics = [];
  $scope.topic = {
    title : null,
    group_id : window.location.pathname.split('/')[2],
    pads: []
  };
  
  $scope.submitTopic= function(){
    var title = prompt("What do you want to name your topic?");
    $scope.topic.title = title;
    
    $http({
      method: 'POST', 
      url: '/topics',
      data: JSON.stringify($scope.topic)
    }).success(function(data, status){
      window.location.reload();
    }).error(function(err, data){
      console.log(err);
    });
  };
  
  $scope.editTopic = function(topicObj) {
    var title = prompt("New topic name: ");  
    if (title.length) {
      $http({
        method: 'PUT', 
        url: '/topics/' + topicObj._id,
        data: JSON.stringify({title: title})
      }).success(function(data, status){
        window.location.reload();
      }).error(function(err, data){
        console.log(err);
      });      
    }
  };
  
}]);
