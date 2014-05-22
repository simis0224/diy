angular.module('users', [])

.config(function ($routeProvider) {
  $routeProvider.
    when('/viewUser/:id', {
      templateUrl: '../ui/angularjs/users/viewUser.html',
      controller: 'userDetailController'
    }).
    when('/editUser/:id', {
      templateUrl: '../ui/angularjs/users/editUser.html',
      controller: 'userEditController',
      resolve: {
        authenticated: function(authenticateService) {
          authenticateService.requireAuthenticated();
        }
      }
    }).
    when('/login', {
      templateUrl: '../ui/angularjs/users/login.html',
      controller: 'loginController'
    }).
    when('/signup', {
      templateUrl: '../ui/angularjs/users/signup.html',
      controller: 'signupController'
    });
})

.controller('loginController', ['$scope', '$location', '$routeParams', 'authenticateService', 'cssInjector',
  function($scope, $location, $routeParams, authenticateService, cssInjector) {

  cssInjector.add("../ui/angularjs/users/login.css");

  $scope.login = function() {
    var onLoginSuccess = function() {
      if($routeParams.retUrl) {
        $location.url($routeParams.retUrl);
      } else {
        $location.url('/');
      }
    }
    authenticateService.login($scope.user, onLoginSuccess);
  };

}])

.controller('signupController', ['$scope', '$rootScope', '$location', 'authenticateService', 'cssInjector',
  function($scope, $rootScope, $location, authenticateService, cssInjector) {

  cssInjector.add("../ui/angularjs/users/login.css");

  $scope.signup = function() {
    var onSignupSuccess = function () {
      $location.url('/');
    }

    var onSignupFailure = function (err) {
      $scope.errorMessage = err;
    }

    authenticateService.signup($scope.user, onSignupSuccess, onSignupFailure);
  }
}])

.controller('userEditController', ['$scope', '$http', '$routeParams', '$location', 'cssInjector', 'uploadService', 'crudService',
  function ($scope, $http, $routeParams, $location, cssInjector, uploadService, crudService) {

    var id = $routeParams.id;

    var onGetSuccess = function (res) {
      $scope.user = res.data;
      $scope.message = res.message;
    }

    var onGetError = function (res) {
      $scope.errorMessage = res.error.message;
    }

    crudService.get('user', id, onGetSuccess, onGetError);

    $scope.updateUser = function() {

      var onUpdateSuccess = function (res) {
        $location.url('/viewUser/' + id);
      }

      var onUpdateError = function (res) {
        if (res.success === 1) {
          $scope.errorMessage = res.error.message;
        } else {
          $scope.errorMessage = res;
        }
      }

      crudService.update('user', id, $scope.user, onUpdateSuccess, onUpdateError);

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

.controller('userDetailController', ['$scope', '$http', '$routeParams', '$location', 'cssInjector', 'authenticateService', 'crudService',
  function ($scope, $http, $routeParams, $location, cssInjector, authenticateService, crudService) {

    var id = $routeParams.id;

    $scope.$watch(function() {
      return authenticateService.currentUser;
    }, function(currentUser) {
      $scope.currentUser = currentUser;
    });

    var onGetSuccess = function (res) {
      $scope.user = res.data;
      $scope.message = res.message;
    }

    var onGetError = function (res) {
      $scope.errorMessage = res.error.message;
    }

    crudService.get('user', id, onGetSuccess, onGetError);
  }]);