angular.module('posts', [])

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

.controller('postCreateController', ['$scope', '$http', '$location', '$upload', 'cssInjector',
    function ($scope, $http, $location, $upload, cssInjector) {

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

  $scope.onFileSelect = function($files) {
    //$files: an array of files selected, each file has name, size, and type.
    for (var i = 0; i < $files.length; i++) {
      var file = $files[i];
      $scope.upload = $upload.upload({
        url: '/api/upload/image',
        method: 'POST',
        // headers: {'header-key': 'header-value'},
        // withCredentials: true,
        data: { myObj: $scope.myModelObj },
        file: file
      }).progress(function(evt) {
        console.log('percent: ' + parseInt(100.0 * evt.loaded / evt.total));
      }).success(function(res, status, headers, config) {
        // file is uploaded successfully
        if(res.success === 1) {
          $scope.formData.postImage = res.imageUrl;
          var previewImage = angular.element( document.querySelector( '.imagePreview' ) )[0];
          previewImage.src = res.imageUrl;
          console.log("Upload image succeeded.");
        } else {
          console.log('Upload error:' + res);
        }
      })
      .error(function (res) {
        console.log('Error: ' + res);
      });
    }
  };
}])

.controller('postEditController', ['$scope', '$http', '$routeParams', '$location', function ($scope, $http, $routeParams, $location) {
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