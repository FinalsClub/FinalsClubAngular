// write GET request for login page, dropdown menu /schools
//// SEND JSON FOR POSTS

app = angular.module('app', []);

/*
-----------------------------CONTROLLERS----------------------------------------------------------------------------------
*/

app.controller('LogInController', ['$scope', function($scope){

}])

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

app.controller('UserController', ['$scope', 'isUserLoggedIn', 'getUserGroups', function($scope, isUserLoggedIn, getUserGroups) {
  if(isUserLoggedIn.checkLogIn()){
    $scope.user = new isUserLoggedIn();
    $scope.groups = new getUserGroups($scope.user._id);  
  } else {
    window.location.href = '/log_in';
  }
}]);

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
  $scope.location = window.location.search.split('=')[1]
  $scope.request = {
    entry_answer : null,
    group_id : $scope.location,
    ignored : false
  }
  
  $scope.getCourses = function() {
    $http({
      method: 'GET',
      url: '/groups/search?courses=true'
      }).success(function(data, status){
        console.log(data);
        $scope.courses = data;
      }).error(function(){
        console.log('error in finding group by course: ', data)
      })
  };
  
  $scope.submit_answer = function(){
    console.log($scope.request);
    console.log($scope.location)
    $http({
      method: 'POST',
      url: '/requests',
      data: JSON.stringify($scope.request)
    }).success(function() {
      console.log('request sent');
      window.location.href = '/';      
    }).error(function(err){
      console.log(err);
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

app.controller('flashcardController', ['$scope', function($scope) {
  $scope.flashcards = [];
  $scope.topic = null;
  $scope.flipped = false;
  $scope.currentCard = 0;
  
  $scope.goBack = function() {
    if ($scope.currentCard > 0) {
      $scope.currentCard--;
    }
  };
  
  $scope.goForward = function() {
    if ($scope.currentCard < $scope.flashcards.length-1) {
      $scope.currentCard++;
    }
  };
}]);

app.controller('shareController', ['$scope', '$http', function($scope, $http) {
  $scope.flashcards = [];
  $scope.pads = [];
  $scope.topic = null;
  $scope.createPad = function() {  
    var iterate = function(counter) {
      if (counter === $scope.flashcards.length) {
        return;
      }
      //grab textarea for this flashcards
      var termID = $scope.topic._id + "-pad" + counter + "-term";
      var termElem = document.getElementById(termID);

      // connect to the share js server
      var connection = sharejs.open(termID, 'text', function(error, doc) {
          if (error) {
              console.log("ERROR:", error);
          } else {
              // attach the ShareJS document to the textarea
              $scope.pads.push(doc);
              doc.attach_textarea(termElem);
              if (doc.getText() === "") {
                doc.insert(0, $scope.flashcards[counter]["term"]);                
              }
              var defID = $scope.topic._id + "-pad" + counter + "-def";
              var defElem = document.getElementById(defID);

              // connect to the share js server
              var connection2 = sharejs.open(defID, 'text', function(error, doc2) {
                  if (error) {
                      console.log("ERROR:", error);
                  } else {
                    // attach the ShareJS document to the textarea
                    $scope.pads.push(doc2);
                    doc2.attach_textarea(defElem);
                    if (doc2.getText() === "") {
                      doc2.insert(0, $scope.flashcards[counter]['definition']);                      
                    }
                      counter = counter + 1;      
                      iterate(counter);
                  }
              });
          }
          var defID = "pad" + counter + "-def";
          var defElem = document.getElementById(defID);

          // connect to the share js server
          var connection2 = sharejs.open(defID, 'text', function(error, doc2) {
              if (error) {
                console.log("ERROR:", error);
              } else {
                // attach the ShareJS document to the textarea
                $scope.pads.push(doc2);
                doc2.attach_textarea(defElem);
                if (doc2.getText() === "") {
                  doc2.insert(0, $scope.flashcards[counter]['definition']);                      
                }
                counter = counter + 1;      
                iterate(counter);
              }
          });
        });
    };
    iterate(0);
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
      document.getElementById('savingSpan').fadeOut(2000); // doesn't get removed from DOM
      console.log('saved!');
    });
  };
    
  $scope.addFlashcard = function() {    
    $scope.flashcards.push({term: "", definition: ""});    
  };
  
  $scope.removeFlashcard = function(index){
    var term = $scope.topic._id + "-pad" + index + "-term";
    var def = $scope.topic._id + "-pad" + index + "-def";
    console.log(document.getElementById(def))
    
    var body = {
      topic_id: $scope.topic._id,
      card: {term: document.getElementById(term).innerHTML, definition:  document.getElementById(def).innerHTML}
    };

    var flashcardDivToRemove = $scope.topic._id + '-pad' + index;
    if(document.getElementById(term).innerHTML === '' && document.getElementById(def).innerHTML === ''){
      angular.element(document.getElementById(flashcardDivToRemove)).remove();
    } else {
      var confirmDelete = confirm('Are you sure you want to delete ' + document.getElementById(term).innerHTML + ': ' +  document.getElementById(def).innerHTML+'?')
      if(confirmDelete === true){
        $http({
          method: 'PUT',
          url: '/delete_flashcards',
          data: JSON.stringify(body)
        }).success(function(){
          angular.element(document.getElementById(flashcardDivToRemove)).remove();
          console.log('flashcard deleted');
        });
      }
    }
  }

  //create pads once DOM has loaded
  angular.element(document).ready(function() {
    $scope.createPad();
    
    setInterval(function() {
      $scope.saveText();
    }, 5000);
  });
  
}]);

/*
-----------------------------FACTORIES------------------------------------------------------------------------------------
*/

app.factory('isUserLoggedIn', ['$http', function($http){
    return {
      checkLogIn: function(){
        $http({
          method: 'GET',
          url: '/loggedin'
        }).success(function(data, status){
          console.log('is user logged in ', data)
          return data;
        }).error(function(data, status){
          console.log(data)
        });
      }
    };
}]);

app.factory('getUserGroups', ['$http', function($http) {
  return function(user) {
      $http({
        method: 'GET',
        url: '/groups',
        params: { user_id : user }
      }).success(function(data, status){
        console.log(data);
        return data;
      }).error(function(data, status){
        console.log("ERROR: ", data);
      });
    } 
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
    var pads = angular.element('textarea');
