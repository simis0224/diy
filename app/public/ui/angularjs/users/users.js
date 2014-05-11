function loginController($scope, authenticateService, cssInjector) {

  cssInjector.add("../ui/angularjs/users/login.css");

  $scope.login = function() {
    authenticateService.login($scope.formData);
  };
}

function signupController($scope, authenticateService, cssInjector) {

  cssInjector.add("../ui/angularjs/users/login.css");

}