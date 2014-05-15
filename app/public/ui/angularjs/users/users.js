angular.module('users', [])

.controller('loginController', ['$scope', 'authenticateService', 'cssInjector',
  function($scope, authenticateService, cssInjector) {

  cssInjector.add("../ui/angularjs/users/login.css");

  $scope.login = function() {
    authenticateService.login($scope.user);
  };

}])

.controller('signupController', ['$scope', '$rootScope', '$location', 'authenticateService', 'cssInjector',
  function($scope, $rootScope, $location, authenticateService, cssInjector) {

  cssInjector.add("../ui/angularjs/users/login.css");

  var onSignupSuccess = function () {
    $location.url('/');
  }

  var onSignupFailure = function (err) {
    $scope.errorMessage = err;
  }

  $scope.signup = function() {
    authenticateService.signup($scope.user, onSignupSuccess, onSignupFailure);
  }

  $scope.openLoginDialog = function() {
    $rootScope.$broadcast("openLoginDialogEvent");
  }

}])

.controller('userEditController', ['$scope', '$http', '$routeParams', '$location', 'cssInjector', 'uploadService',
  function ($scope, $http, $routeParams, $location, cssInjector, uploadService) {

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

    $scope.updateUser = function() {
      $http.post('/api/user/update/' + id, $scope.formData)
        .success(function(res) {
          if(res.success === 1) {
            $location.url('/viewUser/' + id);
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

.controller('userDetailController', ['$scope', '$http', '$routeParams', '$location', 'cssInjector', 'authenticateService',
  function ($scope, $http, $routeParams, $location, cssInjector, authenticateService) {

    var id = $routeParams.id;

    $scope.$watch(function() {
      return authenticateService.currentUser;
    }, function(currentUser) {
      $scope.currentUser = currentUser;
    });

    $http.get('/api/user/' + id)
      .success(function(res) {
        $scope.user = res.data;
        $scope.message = res.message;
      })
      .error(function(data) {
        console.log('Error: ' + data);
      });
  }]);