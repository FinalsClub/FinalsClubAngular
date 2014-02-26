app.controller('topicController', ['$scope', '$http', function($scope, $http){
  $scope.topics = [];
  $scope.topic = {
    topic_date : null,
    title : null,
    group_id : window.location.pathname.split('/')[2]
  };
  
  $scope.submitTopic= function(){
    $http({
      method: 'POST', 
      url: '/topics',
      data: JSON.stringify($scope.topic)
    }).success(function(data, status){
      window.location.href = '/groups/' + $scope.topic.group_id + '/flashcards';
    }).error(function(err, data){
      console.log(err);
    });
  };
}]);
