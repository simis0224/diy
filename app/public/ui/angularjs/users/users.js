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