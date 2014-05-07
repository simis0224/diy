function loginController($scope, $location, authenticateService) {
  $scope.login = function() {
    authenticateService.login($scope.formData);
  };
}

function navigationHeaderController($scope, $http, $location, $route, authenticateService, cssInjector) {
  cssInjector.add("../ui/templates/navigationHeader/navigationHeader.css");
  authenticateService.checkCurrentUser();
}
