angular.module('posts', [])

.controller('postListController', ['$scope', '$http', 'cssInjector', function ($scope, $http, cssInjector) {

  cssInjector.add("../ui/angularjs/posts/listPost.css");
  // when landing on the page, get all todos and show them
  $http.get('/api/posts')
    .success(function(res) {
      $scope.data = res.data;
    })
    .error(function(data) {
      console.log('Error: ' + data);
    });

}])


.controller('postCreateController', ['$scope', '$http', function ($scope, $http) {

  $scope.createPost = function () {
    $http.post('/api/post/create', $scope.formData)
      .success(function (res) {
        $scope.data = res.data;
        console.log(res.data);
      })
      .error(function (data) {
        console.log('Error: ' + data);
      });
  }

}])

.controller('postEditController', ['$scope', '$http', '$routeParams', '$location', function ($scope, $http, $routeParams, $location) {
  var id = $routeParams.id;
  // when landing on the page, get all todos and show them
  $http.get('/api/post/' + id)
    .success(function(res) {
      $scope.formData = res.data;
      $scope.message = res.message;
    })
    .error(function(data) {
      console.log('Error: ' + data);
    });

  $scope.updatePost = function() {
    $http.post('/api/post/update/' + id, $scope.formData)
      .success(function(res) {
        if(res.success === 1) {
          $location.url('/viewPost/' + id);
        } else {
          $scope.errorMessage = res.message;
        }
      })
      .error(function(data) {
        console.log('Error: ' + data);
      });
  };
}])

.controller('postDetailController', ['$scope', '$http', '$routeParams', function ($scope, $http, $routeParams) {

  var id = $routeParams.id;
  // when landing on the page, get all todos and show them
  $http.get('/api/post/' + id)
    .success(function(res) {
      $scope.data = res.data;
      $scope.message = res.message;
    })
    .error(function(data) {
      console.log('Error: ' + data);
    });

  $scope.createPost = function() {
    $http.post('/api/post/create', $scope.formData)
      .success(function(res) {
        console.log(res.data);
      })
      .error(function(data) {
        console.log('Error: ' + data);
      });
  };

  $scope.deletePost = function () {
    $http.post('/api/post/delete/' + id)
      .success(function (res) {
        if(!res.hasError) {
          $scope.data = null;
        }
        $scope.message = res.message;
        console.log(res.message);
      })
      .error(function (data) {
        console.log('Error: ' + data);
      });
  };

}])