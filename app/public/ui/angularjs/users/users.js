angular.module('users', [])

.controller('loginController', ['$scope', 'authenticateService', 'cssInjector',
  function($scope, authenticateService, cssInjector) {

  cssInjector.add("../ui/angularjs/users/login.css");

  $scope.login = function() {
    authenticateService.login($scope.formData);
  };

}])

.controller('signupController', ['$scope', 'authenticateService', 'cssInjector',
  function($scope, authenticateService, cssInjector) {

  cssInjector.add("../ui/angularjs/users/login.css");

}])