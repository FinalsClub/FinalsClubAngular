app.controller('topicController', ['$scope', '$http', '$rootScope', 'topicHandler', function($scope, $http, $rootScope, topicHandler){
  $scope.topics = [];
  $scope.topic = {
    title : null,
    group_id : window.location.pathname.split('/')[2],
    pads: []
  };
  $scope.temp = null;
  
  $scope.submitTopic= function(){
    var title = prompt("What do you want to name your topic?");
    $scope.topic.title = title;
    topicHandler.submitTopic($scope.topic);
  };
  
  $scope.editTopic = function(topicObj) {
    if ($scope.topic.title.length) {
      $http({
        method: 'PUT', 
        url: '/topics/' + topicObj._id,
        data: JSON.stringify($scope.topic)
      }).success(function(data, status){
        $scope.showLightbox(topicObj._id);
        angular.element('.topicDiv.' + topicObj._id + ' a.topic').text($scope.topic.title);
        angular.element('.lightboxContent input').val('');
      }).error(function(err, data){
        console.log(err);
      });      
    }
  };

  $scope.deleteTopic = function(topicObj) {
    $http({
      method: 'PUT', 
      url: '/topics/' + topicObj._id + '/delete',
      data: JSON.stringify({group_id: topicObj.group_id})
    }).success(function(data, status){
      $scope.showLightbox(topicObj._id);
      angular.element('.topicDiv.' + topicObj._id).remove();
    }).error(function(err, data){
      console.log(err);
    });      
  };
  
  $scope.showLightbox = function(id) {
    $rootScope.lightbox = !$rootScope.lightbox;
    angular.element("." + id).toggleClass('block');
  };
    
}]);

app.factory('topicHandler', ['$http', function($http){
  return {
    submitTopic: function(topic){
      $http({
        method: 'POST', 
        url: '/topics',
        data: JSON.stringify(topic)
      }).success(function(data, status){
        window.location.reload();
      })
    },
    editTopic: function(){

    },
    deleteTopic: function(){

    }
  };
}]);
