// views/topics/topics.jade
app.controller('topicController', ['$scope', '$http', '$rootScope', 'topicHandler', function($scope, $http, $rootScope, topicHandler){
  
  $scope.topics = [];
  $scope.topic = {
    title : null,
    group_id : window.location.pathname.split('/')[2],
    pads: []
  };
  $scope.temp = null;
  
  $scope.submitTopic= function(){
    topicHandler.submitTopic($scope.topic);
  };
  
  $scope.editTopic = function(topicObj) {
    if ($scope.topic.title.length) {
      topicHandler.editTopic(topicObj, $scope.topic.title, function(){
        $scope.showLightbox(topicObj._id);
      });
    }
  };

  $scope.deleteTopic = function(topicObj) {
    topicHandler.deleteTopic(topicObj, function(){
      $scope.showLightbox(topicObj._id);
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
      var title = prompt("What do you want to name your topic?");
      topic.title = title;
      $http({
        method: 'POST', 
        url: '/topics',
        data: JSON.stringify(topic)
      }).success(function(data, status){
        window.location.reload();
      })
    },

    editTopic: function(topicObj, title, callback){
      topicObj.title = title;
      $http({
        method: 'PUT', 
        url: '/topics/' + topicObj._id,
        data: JSON.stringify(topicObj)
      }).success(function(data, status){
        angular.element('.topicDiv.' + topicObj._id + ' a.topic').text(topicObj.title);
        angular.element('.lightboxContent input').val('');
        callback();
      });
    },

    deleteTopic: function(topicObj, callback){
      $http({
        method: 'PUT', 
        url: '/topics/' + topicObj._id + '/delete',
        data: JSON.stringify({group_id: topicObj.group_id})
      }).success(function(data, status){
        angular.element('.topicDiv.' + topicObj._id).remove();
        callback();
      });
    }
  };

}]);
