// views/flashcards/edit_flashcards.jade
app.controller('shareController', ['$scope', '$http', '$timeout', 'editFlashcard', function($scope, $http, $timeout, editFlashcard) {
  $scope.pads = [];
  $scope.padIDs = [];
  $scope.topic = null;
      
  $scope.createPads = function(counter) {
    if (counter === $scope.padIDs.length) {
      $scope.saveText();
      return;
    }
    
    $scope.openConnections(counter, true);
  };
    
  $scope.addEditors = function(index) {
    editFlashcard.addEditors(index);
  };
    
  $scope.openConnections = function(index, iterating) {
    var termID = $scope.topic._id + "-pad" + $scope.padIDs[index] + "-term";
    var termElem = document.getElementById(termID);
    // connect to the share js server
    var connection = sharejs.open(termID, 'text', function(error, doc) {
        if (error) {
            console.log("ERROR:", error);
        } else {
            // attach the ShareJS document to the textarea for the term
            $scope.pads.push(doc);
            doc.attach_textarea(termElem);
            
            var defID = $scope.topic._id + "-pad" + $scope.padIDs[index] + "-def";
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
    editFlashcard.saveText($scope.pads, $scope.padIDs, $scope.topic._id);
  };
    
  $scope.addFlashcard = function() {  
    if ($scope.padIDs.length) {
      $scope.padIDs.push($scope.padIDs[$scope.padIDs.length-1] + 1);
      $timeout($scope.openConnections.bind(null,$scope.padIDs.length-1, false), 1200);      
    }    
  };
  
  $scope.addRow = function(event, index, side) {
    event.keyCode === 9 && index === $scope.padIDs.length - 1 && side === 'def' && $scope.addFlashcard();
  };
  
  $scope.removeFlashcard = function(index){
    var flashcardDivToRemove = $scope.topic._id + '-pad' + $scope.padIDs[index];
    angular.element(document.getElementById(flashcardDivToRemove)).remove();
    $scope.pads[index*2].del(0,500);
    $scope.pads[index*2 + 1].del(0,500);
    $scope.pads[index*2].close(function() {
      $scope.pads[index*2 + 1].close(function() {
        $scope.pads.splice(index*2, 2);
        $scope.padIDs.splice(index, 1);
        $scope.saveText();              
      });
    });
  };
  
  $scope.syncDB = function() {
    editFlashcard.syncDB($scope.topic._id, $scope.padIDs, function() {
      $scope.addFlashcard();
    });
  };
  
  //create pads once DOM has loaded
  angular.element(document).ready(function() {
    $scope.createPads(0);
    $scope.addEditors($scope.topic._id);
    
    // auto-sync DB every 5 seconds
    setInterval(function() {
      $scope.syncDB();
    }, 10000);
  });
}]);



app.factory('editFlashcard', ['$http', function($http) {
  return {
    addEditors: function(index) {
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
    },
    saveText: function(pads, padIDs, topic_id) {
      var cards = [];
      for (var i = 0; i < pads.length; i+=2) {
        cards.push({term: pads[i].getText(), definition: pads[i+1].getText()})
      }
      var body = {
        topic_id:  topic_id,
        cards: cards,
        pads: padIDs
      };
      $http({
        method: 'PUT',
        url: '/topics',
        data: JSON.stringify(body)
      }).success(function() {
        angular.element('.shareDiv span').fadeIn(1000).fadeOut(2000);
      });
    },
    syncDB: function(topic_id, padIDs, callback) {
      $http({
        method: 'GET',
        url: '/topics?id=' + topic_id
      }).success(function(data) {
        if (data.flashcards.length > padIDs.length) {
          callback();
        } else if (data.flashcards.length < padIDs.length) {
          window.onbeforeunload = null;
          window.location.reload();
        }
      });
    }
  };
}]);






