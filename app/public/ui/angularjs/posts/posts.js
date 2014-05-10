angular.module('posts', ['uploadService'])

.controller('postListController', ['$scope', '$http', 'cssInjector', function ($scope, $http, cssInjector) {

  cssInjector.add("../ui/angularjs/posts/listPost.css");

  $http.get('/api/posts')
    .success(function(res) {
      $scope.data = res.data;
    })
    .error(function(data) {
      console.log('Error: ' + data);
    });

}])

.controller('postCreateController', ['$scope', '$http', '$location', '$upload', 'cssInjector', 'uploadService',
    function ($scope, $http, $location, $upload, cssInjector, uploadService) {

  cssInjector.add("../ui/angularjs/posts/createPost.css");

  $scope.formData = {};

  $scope.createPost = function () {
    $http.post('/api/post/create', $scope.formData)
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
          $scope.formData.postImage = res.imageUrl;
          var previewImage = angular.element( document.querySelector( '.imagePreview' ) )[0];
          previewImage.src = res.imageUrl;
          console.log("Upload image succeeded.");
        } else {
          console.log('Upload error:' + res);
        }
      },
      function (res) {
        console.log('Error: ' + res);
      });
    };
}])

.controller('postEditController', ['$scope', '$http', '$routeParams', '$location', 'cssInjector', 'uploadService',
    function ($scope, $http, $routeParams, $location, cssInjector, uploadService) {

  cssInjector.add("../ui/angularjs/posts/editPost.css");

  var id = $routeParams.id;

  $http.get('/api/post/' + id)
    .success(function(res) {
      $scope.formData = res.data;
      $scope.message = res.message;
    })
    .error(function(res) {
      $scope.errorMessage = res.error.message;
      console.log('Error: ' + res);
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

  $scope.uploadImage = function($files) {
    uploadService.uploadImage($files,
      function(res, status, headers, config) {
        // file is uploaded successfully
        if(res.success === 1) {
          $scope.formData.postImage = res.imageUrl;
          var previewImage = angular.element( document.querySelector( '.postImage' ) )[0];
          previewImage.src = res.imageUrl;
          console.log("Upload image succeeded.");
        } else {
          console.log('Upload error:' + res);
        }
      },
      function (res) {
        console.log('Error: ' + res);
      });
    };
}])

.controller('postDetailController', ['$scope', '$http', '$routeParams', '$location', 'cssInjector',
    function ($scope, $http, $routeParams, $location, cssInjector) {

  cssInjector.add("../ui/angularjs/posts/viewPost.css");

  var id = $routeParams.id;

  $http.get('/api/post/' + id)
    .success(function(res) {
      $scope.data = res.data;
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