angular.module('posts', [])

.controller('postListController', ['$scope', '$http', 'cssInjector', function ($scope, $http, cssInjector) {

  cssInjector.add("../ui/angularjs/posts/listPost.css");
  // when landing on the page, get all todos and show them
  $http.get('/api/posts')
    .success(function(res) {
      $scope.items = res.items;
    })
    .error(function(data) {
      console.log('Error: ' + data);
    });

}])


.controller('postCreateController', ['$scope', '$http', function ($scope, $http) {

  $scope.createPost = function () {
    $http.post('/api/createPost', $scope.formData)
      .success(function (res) {
        $scope.item = res.item;
        console.log(res.item);
      })
      .error(function (data) {
        console.log('Error: ' + data);
      });
  }

}])

.controller('postDetailController', ['$scope', '$http', '$routeParams', function ($scope, $http, $routeParams) {

  var id = $routeParams.id;
  // when landing on the page, get all todos and show them
  $http.get('/api/post/' + id)
    .success(function(res) {
      $scope.item = res.item;
      $scope.message = res.message;
    })
    .error(function(data) {
      console.log('Error: ' + data);
    });

  $scope.createPost = function() {
    $http.post('/api/createPost', $scope.formData)
      .success(function(res) {
        $scope.item = res.item;
        console.log(res.item);
      })
      .error(function(data) {
        console.log('Error: ' + data);
      });
  };

  $scope.deletePost = function () {
    $http.delete('/api/post/' + id)
      .success(function (res) {
        if(!res.hasError) {
          $scope.item = null;
        }
        $scope.message = res.message;
        console.log(res.message);
      })
      .error(function (data) {
        console.log('Error: ' + data);
      });
  };

}])