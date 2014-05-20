angular.module('posts', ['uploadService'])

.config(function ($routeProvider) {
  $routeProvider.
    when('/viewPost/:id', {
      templateUrl: '../ui/angularjs/posts/viewPost.html',
      controller: 'postDetailController'
    }).
    when('/editPost/:id', {
      templateUrl: '../ui/angularjs/posts/editPost.html',
      controller: 'postEditController',
      resolve: {
        authenticated: function(authenticateService) {
          authenticateService.requireAuthenticated();
        }
      }
    }).
    when('/createPost', {
      templateUrl: '../ui/angularjs/posts/createPost.html',
      controller: 'postCreateController',
      resolve: {
        authenticated: function (authenticateService) {
          authenticateService.requireAuthenticated();
        }
      }
    });
})

.controller('postListController', ['$scope', '$http', 'cssInjector', function ($scope, $http, cssInjector) {

  cssInjector.add("../ui/angularjs/posts/listPost.css");

  $http.get('/api/posts')
    .success(function(res) {
      $scope.posts = res.data;
    })
    .error(function(data) {
      console.log('Error: ' + data);
    });

}])

.controller('postCreateController', ['$scope', '$http', '$location', '$upload', 'cssInjector', 'uploadService',
    function ($scope, $http, $location, $upload, cssInjector, uploadService) {

  cssInjector.add("../ui/angularjs/posts/createPost.css");

  $scope.post = {};

  $scope.createPost = function () {
    $http.post('/api/post/create', $scope.post)
      .success(function (res) {
        if (res.success === 1) {
          console.log("Create post succeeded.");
          $location.url('/viewPost/' + res.data._id);
        } else {
          $scope.errorMessage = res.error.message;
          console.log("Create post failed. Error: " + res.error.message);
        }
    })
    .error(function (res) {
      console.log('Error: ' + res);
    });
  }

  $scope.uploadImage = function($files) {
    uploadService.uploadImage($files,
      function(res, status, headers, config) {
        // file is uploaded successfully
        if(res.success === 1) {
          $scope.post.postImage = res.imageUrl;
          var previewImage = angular.element( document.querySelector( '.imagePreview' ) )[0];
          previewImage.src = res.imageUrl;
          console.log("Upload image succeeded.");
        } else {
          console.log('Upload error:' + res);
        }
      },
      function (res) {
        console.log('Error: ' + res);
      },
      function (percent) {
        $scope.uploadProgress = percent;
      });
    };
}])

.controller('postEditController', ['$scope', '$http', '$routeParams', '$location', 'cssInjector', 'uploadService',
    function ($scope, $http, $routeParams, $location, cssInjector, uploadService) {

  cssInjector.add("../ui/angularjs/posts/editPost.css");

  var id = $routeParams.id;

  $http.get('/api/post/' + id)
    .success(function(res) {
      $scope.post = res.data;
      $scope.message = res.message;
    })
    .error(function(res) {
      $scope.errorMessage = res.error.message;
      console.log('Error: ' + res);
    });

  $scope.updatePost = function() {
    $http.post('/api/post/update/' + id, $scope.post)
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

  $scope.uploadImage = function($files) {
    uploadService.uploadImage($files,
      function(res, status, headers, config) {
        // file is uploaded successfully
        if(res.success === 1) {
          $scope.post.postImage = res.imageUrl;
          var previewImage = angular.element( document.querySelector( '.postImage' ) )[0];
          previewImage.src = res.imageUrl;
          console.log("Upload image succeeded.");
        } else {
          console.log('Upload error:' + res);
        }
      },
      function (res) {
        console.log('Error: ' + res);
      },
      function (percent) {
        $scope.uploadProgress = percent;
      });
    };
}])

.controller('postDetailController', ['$scope', '$http', '$routeParams', '$location', 'cssInjector', 'authenticateService',
    function ($scope, $http, $routeParams, $location, cssInjector, authenticateService) {

  cssInjector.add("../ui/angularjs/posts/viewPost.css");

  var id = $routeParams.id;

  $scope.$watch(function() {
    return authenticateService.currentUser;
  }, function(currentUser) {
    $scope.currentUser = currentUser;
  });

  $http.get('/api/post/' + id)
    .success(function(res) {
      $scope.post = res.data;
      $scope.message = res.message;
    })
    .error(function(data) {
      console.log('Error: ' + data);
    });

  $scope.deletePost = function () {
    $http.post('/api/post/delete/' + id)
      .success(function (res) {
        if(res.success === 1) {
          console.log("Delete " + id + " succeeded.");
          $location.url('/');
        } else {
          $scope.errorMessage = res.error.message;
          console.log("Delete " + id + " failed. Error: " + res.error.message);
        }
      })
      .error(function (res) {
        console.log('Error: ' + res);
      });
  };

}]);