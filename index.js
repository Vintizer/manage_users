var task = angular.module('jsbursa', []);
task.controller('userControl', function($scope, getService) {
  var itemArr = [{"id":"1","name":"Jeremy Lane","phone":"(466) 514-6617","status":"active"},
    {"id":"2","name":"Austin Hunt","phone":"(314) 333-4959","status":"removed"},
    {"id":"5","name":"Jeremiah Jordan","phone":"(769) 969-5203","status":"removed"},
    {"id":"6","name":"Susie Frazier","phone":"(917) 781-9869","status":"removed"},
    {"id":"7","name":"Sally Larson","phone":"(965) 429-2716","status":"active"}];
  var itemArr2 = [{id:"11", name:"Mildred Bennett", phone:"(475) 272-7506"},
    {id:"12", name:"Ricardo Ellis", phone:"(770) 558-6195"},
    {id:"13", name:"Jon Evans", phone:"(880) 213-2834"},
    {id:"14", name:"Milton Meyer", phone:"(367) 935-1707"},
    {id:"15", name:"Lina Higgins", phone:"(836) 692-5389"},
    {id:"16", name:"Frederick Padilla", phone:"(252) 479-4740"}];
  $scope.users = itemArr;
  $scope.users2 = itemArr2;

  setTimeout(function(){
    getService.getUsers().success(function(data) {
      $scope.users2 = data;
    });
  }, 2000);
  $scope.add = function() {
    $scope.users.push({"id":"3","name":"Ronald Campbell","phone":"(686) 869-6077","status":"removed"});
  }
});
task.service('getService', function($http){
  this.getUsers = function() {
    return $http.get('http://jb5.smartjs.academy/api/users');
  }
});
angular.module('jsbursa').directive('draggableList', function() {
  return {
    scope: {
      items : '=',
      id : '@'
    },
    link: function($scope, elem, attrs) {
      if(!$scope.items) $scope.items = [];
      $scope.$watch('items', function (newValue, oldValue) {
        console.log(' changed from ');
        if ($scope.id) {
          if (localStorage.getItem($scope.id)) var itemsTimed = JSON.parse(localStorage.getItem($scope.id));
        }
        if (itemsTimed) {
          $scope.items = updateArrays(itemsTimed, saveToStorage($scope.items, true));
        }
      }, true);
      if ($scope.id) {
        if (localStorage.getItem($scope.id)) var itemsTimed = JSON.parse(localStorage.getItem($scope.id));
      }
      function updateArrays(storArr, itemsArr) {
        var result = [];
        var common = _.intersection(storArr, itemsArr);
        common = common.concat(_.difference(itemsArr, storArr));
        angular.forEach(common, function(id) {
          result.push(_.find($scope.items, {id: id.toString()}));
        });
        return result;
      }

      if (itemsTimed) {
        $scope.items = updateArrays(itemsTimed, saveToStorage($scope.items, true));
      }
      var remove;
      var e = $(elem).children('ul');
      e.sortable({
        connectWith: 'ul',
        receive: function (event, ui) {
          return receiveUser(event, ui)
        },
        start: function (event, ui) {
          return startUser(event, ui)
        },
        stop: function (event, ui) {
          return stopUser(event, ui)
        },
        remove: function (event, ui) {
          return removeUser(event, ui)
        }
      });
      function saveToStorage(array, notSave) {
        var arrToStorage = [];
        angular.forEach(array, function (item) {
          arrToStorage.push(item.id);
        });
        if (!notSave) localStorage.setItem($scope.id, angular.toJson(arrToStorage));
        else return arrToStorage;
      }
      function receiveUser(event, ui) {
        var a = $(ui.item).index();
        $scope.items.splice(a, 0, $(ui.item).data('item'));
        var tempItems = angular.copy($scope.items);
        $scope.items = [];
        $scope.$applyAsync();
        setTimeout(function () {
          $scope.items = tempItems;
          $scope.$applyAsync();
        }, 0);
        if ($scope.id) saveToStorage($scope.items);
      }

      function startUser(event, ui) {
        var a = $(ui.item).index();
        $(ui.item).data('item', $scope.items[a]);
        $scope.items.splice(a, 1);
      }
      function stopUser(event, ui) {
        if (remove) {
          remove = false;
          return;
        }
        var a = $(ui.item).index();
        $scope.items.splice(a, 0, $(ui.item).data('item'));
        $scope.$applyAsync($scope.items);
        console.log($scope.items + 'who skoped');
        if ($scope.id) saveToStorage($scope.items);
      }
      function removeUser(event, ui) {
        $scope.$applyAsync($scope.items);
        remove = true;
        if ($scope.id) saveToStorage($scope.items);
     }
    },
    template: "<ul class = 'ui-sortable'><li ng-repeat = 'ad in items' data-id = {{ad.id}}><h3>{{ad.name}}</h3><h4>{{ad.phone}}</h4></li></ul>"
  };
});
