// write GET request for login page, dropdown menu /schools
//// SEND JSON FOR POSTS

var app = angular.module('app', []);

/*
-----------------------------CONTROLLERS----------------------------------------------------------------------------------
*/

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
}])

app.controller('createGroupController', ['$scope', 'createGroup', function($scope, createGroup){
  $scope.intensities = ['low', 'medium', 'high'];
  $scope.courses = [];
  $scope.group = {
    'name' : null,
    'course_id' : null,
    'motto' : null,
    'description' : null,   
    'intensity' : null,
    'entry_question' : null
  };
  $scope.submit = function(){
    createGroup.createNewGroup($scope.group);
  }
}])

app.controller('allGroupsViewController', [ '$scope', '$http', function($scope, $http){
  $scope.groups = $scope.groups || [];
  $scope.currentGroup = null;
  $scope.sendLeaveGroupData = function(id){
    console.log('clicked leave group: ', id)
    $http({
      method: 'GET', 
      url: '/leave_group',
      data: JSON.stringify(id)
    }).success(function(data, status){
      console.log('sending delete ', data);
    }).error(function(){
        console.log('error deleting: ', data)
    })
  }

  $scope.leaveGroup = function(){
    $scope.group_id = window.location.pathname.split('/')[2];
    console.log($scope.group_id);
    $http({
      method: 'POST',
      url: '/leave_group',
      data: JSON.stringify({group_id: $scope.group_id})
      }).success(function(data, status){
        console.log('deleted group ', data);
        window.location.href = '/';
      }).error(function(){
        console.log('error in deleting group: ', data)
      })
    }
}]);

app.controller('findGroupController', ['$scope', '$http', function($scope, $http){
  $scope.groups = [];
  $scope.user_groups = [];
  $scope.location = window.location.search.split('=')[1]
  $scope.request = {
    entry_answer : null,
    group_id : $scope.location,
    ignored : false
  }

  $scope.showLightbox = function(name){
    document.getElementById(name).style.display ='block';
    document.getElementById('fade').style.display ='block';
  };

  $scope.hideLightbox = function(name){
    document.getElementById(name).style.display ='none';
    document.getElementById('fade').style.display ='none';
  };
  $scope.keyup = function(e){
    console.log(e);
  }
  $scope.submit_answer = function(){
    $scope.request.created_at = new Date();
    $http({
      method: 'POST',
      url: '/requests',
      data: JSON.stringify($scope.request)
    }).success(function() {
      console.log('request sent');
      window.location.href = '/';      
    }).error(function(err){
      console.log(err);
      angular.element('.contentWrapper').prepend("<span class='error'>You are already in that group.</span>");
    });
  }
}]);

app.controller('requestController', ['$scope', '$http', function($scope, $http){
  $scope.requests = [];
  $scope.approve = function(user, request_id){
    console.log(user);
    $http({
      method: 'POST',
      url: '/members',
      data: JSON.stringify({
        user_id: user,
        group_id: window.location.pathname.split('/')[2],
        request_id: request_id
      })
    }).success(function(){
      console.log('user added!')
      window.location.href = '/';
    }).error(function(err){
      console.log(err)
      angular.element('.contentWrapper').prepend("<span class='error'>The user is already a member of the group.</span>");
    });
  };
  
  $scope.ignoreRequest = function(id) {
    $http({
      method: 'PUT',
      url: '/requests/' + id
    }).success(function() {
      console.log('request ignored!');
      window.location.href = window.location.pathname;
    }).error(function(err) {
      console.log(err);
    });  
  };
  
}]);
app.controller('topicController', ['$scope', '$http', function($scope, $http){
  $scope.topics = [];
  $scope.topic = {
    topic_date : null,
    title : null,
    group_id : window.location.pathname.split('/')[2],
  };
  
  $scope.submitTopic= function(){
    $http({
      method: 'POST', 
      url: '/topics',
      data: JSON.stringify($scope.topic)
    }).success(function(data, status){
      window.location.href = '/groups/' + $scope.topic.group_id + '/flashcards';
      console.log($scope.topic);
    }).error(function(err, data){
      console.log(err);
    })
  }
}]);

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
    if ($scope.flipped) {
      $scope.flip($scope.currentCard);
    };
    
    if ($scope.currentCard > 0) {
      $scope.currentCard--;
    }
  };
  
  $scope.goForward = function() {
    if ($scope.flipped) {
      $scope.flip($scope.currentCard);
    };

    if ($scope.currentCard < $scope.flashcards.length-1) {
      $scope.currentCard++;
    }        
  };
  
  $scope.flip = function(index) {    
    angular.element('#div-' + index).toggleClass('animated');
    $scope.flipped = !$scope.flipped;
  };
  
  angular.element(document).ready(function() {
    $scope.configureText(0, ".front");    
  });

  
}]);

app.controller('shareController', ['$scope', '$http', '$timeout', function($scope, $http, $timeout) {
  $scope.flashcards = [];
  $scope.pads = [];
  $scope.topic = null;
    
  $scope.createPads = function(counter) {
    if (counter === $scope.flashcards.length) {
      return;
    }
    $scope.openConnections(counter, true);
  };
  
  $scope.addEditors = function(index) {
    var el = document.getElementById("editors");
    var node = angular.element('#editors');
    var connection = sharejs.open(index + "-editors", 'text', function(error, doc) {
      if (error) {
        console.log("ERROR: ", error);
      } else {
        var update = function() {
          el.innerHTML = doc.snapshot;
        }
        update();
        window.doc = doc;        
        doc.on('change', update);

        var regCurr = new RegExp('current', "i");
        if (doc.snapshot.match(regCurr) === null) {
          doc.submitOp([{i:"<p class='bold'>Current Editors</p>", p:0}]);          
        }
        
        var regUser = new RegExp(node.data('user'), "i");        
        if (doc.snapshot.match(regUser) === null) {
          doc.submitOp([{i:"<p>" + node.data('user') + "</p>", p: doc.snapshot.length}]);                       
        } 
      
        window.onunload = window.onbeforeunload = function() {
          doc.del(doc.snapshot.match(regUser).index, node.data('user').length);
          return "";
        };
      }
    });
  };
    
  $scope.openConnections = function(index, iterating) {
    var termID = $scope.topic._id + "-pad" + index + "-term";
    var termElem = document.getElementById(termID);
    // connect to the share js server
    var connection = sharejs.open(termID, 'text', function(error, doc) {
        if (error) {
            console.log("ERROR:", error);
        } else {
            // attach the ShareJS document to the textarea for the term
            $scope.pads.push(doc);
            doc.attach_textarea(termElem);
            
            var defID = $scope.topic._id + "-pad" + index + "-def";
            var defElem = document.getElementById(defID);

            // connect to the share js server
            var connection2 = sharejs.open(defID, 'text', function(error, doc2) {
                if (error) {
                    console.log("ERROR:", error);
                } else {
                  
                  // attach the ShareJS document to the textarea for the def
                  $scope.pads.push(doc2);
                  doc2.attach_textarea(defElem);
                
                  (iterating) ? $scope.createPads(index + 1) : $scope.saveText();
                }
            });
        }
    });
  };
  
  $scope.saveText = function() {
    var cards = [];
    for (var i = 0; i < $scope.pads.length; i+=2) {
      cards.push({term: $scope.pads[i].getText(), definition: $scope.pads[i+1].getText()})
    }
    var body = {
      topic_id:  $scope.topic._id,
      cards: cards
    };
    $http({
      method: 'PUT',
      url: '/topics',
      data: JSON.stringify(body)
    }).success(function() {
      angular.element('.shareDiv span').fadeIn(1000).fadeOut(2000);
      console.log('saved!');
    });
  };
    
  $scope.addFlashcard = function() {    
    $scope.flashcards.push({term: "", definition: ""});   
    $timeout($scope.openConnections.bind(null,$scope.flashcards.length-1, false), 1000);
  };
  
  $scope.removeFlashcard = function(index){
    var flashcardDivToRemove = $scope.topic._id + '-pad' + index;
    angular.element(document.getElementById(flashcardDivToRemove)).remove();
    $scope.flashcards.splice(index, 1);
    $scope.pads.splice(index*2, 2);
    $scope.saveText();
  };
  
  $scope.syncDB = function() {
    $http({
      method: 'GET',
      url: '/topics?id=' + $scope.topic._id
    }).success(function(data) {
      if (data.flashcards.length > $scope.flashcards.length) {
        $scope.addFlashcard();
      } else if (data.flashcards.length < $scope.flashcards.length) {
        window.onbeforeunload = null;
        window.location.reload();
      }
    });
  };
  
  //create pads once DOM has loaded
  angular.element(document).ready(function() {
    $scope.createPads(0);
    $scope.addEditors($scope.topic._id);
    
    //auto-sync DB every 5 seconds
    setInterval(function() {
      $scope.syncDB();
    }, 5000);
            
  });
  
}]);

/*
-----------------------------FACTORIES------------------------------------------------------------------------------------
*/
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

app.factory('createGroup', ['$http', function($http){
  return {
    createNewGroup: function(data){
      $http({
        method: 'POST',
        url: '/groups',
        data: JSON.stringify(data)
        }).success(function(data, status, headers){
          window.location.href = '/';
        }).error(function(){
          console.log('error in creating new group: ', data)
        })
      }
  };   
}]);

