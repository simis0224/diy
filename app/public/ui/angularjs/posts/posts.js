angular.module('posts', ['uploadService', 'crudService'])

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

.controller('postCreateController', ['$scope', '$http', '$location', '$upload', 'cssInjector', 'uploadService', 'crudService',
    function ($scope, $http, $location, $upload, cssInjector, uploadService, crudService) {

  cssInjector.add("../ui/angularjs/posts/createPost.css");

  $scope.post = {};

  $scope.createPost = function () {

    var onCreateSuccess = function(res) {
      $location.url('/viewPost/' + res.data._id);
    }

    var onCreateError = function(res) {
      if (res.success === 1) {
        $scope.errorMessage = res.error.message;
      } else {
        $scope.errorMessage = res;
      }
    }

    crudService.create('post', $scope.post, onCreateSuccess, onCreateError);
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

.controller('postEditController', ['$scope', '$http', '$routeParams', '$location', 'cssInjector', 'uploadService', 'crudService',
    function ($scope, $http, $routeParams, $location, cssInjector, uploadService, crudService) {

  cssInjector.add("../ui/angularjs/posts/editPost.css");

  var id = $routeParams.id;

  var onGetSuccess = function(res) {
    $scope.post = res.data;
    $scope.message = res.message;
  };

  crudService.get('post', id, onGetSuccess);

  $scope.updatePost = function () {

    var onUpdateSuccess = function (res) {
      $location.url('/viewPost/' + id);
    }

    var onUpdateError = function (res) {
      if (res.success === 1) {
        $scope.errorMessage = res.error.message;
      } else {
        $scope.errorMessage = res;
      }
    }

    crudService.update('post', id, $scope.post, onUpdateSuccess, onUpdateError);
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

.controller('postDetailController', ['$scope', '$http', '$routeParams', '$location', 'cssInjector', 'authenticateService', 'crudService',
    function ($scope, $http, $routeParams, $location, cssInjector, authenticateService, crudService) {

  cssInjector.add("../ui/angularjs/posts/viewPost.css");

  var id = $routeParams.id;

  $scope.$watch(function() {
    return authenticateService.currentUser;
  }, function(currentUser) {
    $scope.currentUser = currentUser;
  });

  var onGetSuccess = function(res) {
    $scope.post = res.data;
    $scope.message = res.message;
  };

  crudService.get('post', id, onGetSuccess);

  $scope.deletePost = function () {

    var onDeleteSuccess = function(res) {
      $location.url('/');
    };

    var onDeleteError = function(res) {
      if (res.success === 1) {
        $scope.errorMessage = res.error.message;
      } else {
        $scope.errorMessage = res;
      }
    };

    crudService.delete('post', id, onDeleteSuccess, onDeleteError);
  };

}]);