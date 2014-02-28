// views/topics/topics.jade
app.controller('topicController', ['$scope', '$http', '$rootScope', 'topicHandler', '$timeout', function($scope, $http, $rootScope, topicHandler, $timeout){
  $scope.error = false;
  $scope.topics = [];
  $scope.topic = {
    title : null,
    group_id : window.location.pathname.split('/')[2],
    pads: []
  };
  
  $scope.submitTopic= function(){
    topicHandler.submitTopic($scope.topic, function() {
      $scope.toggleError();
      $timeout($scope.toggleError, 4000);       

    });
  };
  
  $scope.editTopic = function(topicObj) {
    topicHandler.editTopic(topicObj, $scope.topic.title, function(){
      $scope.showLightbox(topicObj._id);
    }, function() {
      $scope.showLightbox(topicObj._id);
      $scope.toggleError();
      $timeout($scope.toggleError, 4000);       
    });
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
  
  $scope.toggleError = function() {
    $scope.error = !$scope.error;
  };
    
}]);


app.factory('topicHandler', ['$http', function($http){
  
  return {
   submitTopic: function(topic, callback){
       var title = prompt("What do you want to name your topic?");
       if(title.length){
         topic.title = title;
         $http({
           method: 'POST', 
           url: '/topics',
           data: JSON.stringify(topic)
         }).success(function(data, status){
           window.location.reload();
         }); 
       } else {
        callback();
       }
     },
    editTopic: function(topicObj, title, callback, errorCallback){
      if (title) {
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
      } else {
        errorCallback();
      }
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
