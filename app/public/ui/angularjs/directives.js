app.directive('navigationHeader', ['authenticateService', function(authenticateService) {
  return {
    restrict: 'E',
    templateUrl: '/ui/templates/navigationHeader/navigationHeader.html',
    scope: true,
    link: function($scope, $element, $attrs, $controller) {
      $scope.$watch(function() {
        return authenticateService.currentUser;
      }, function(currentUser) {
        $scope.currentUser = currentUser;
      });
    }
  }
}]);

app.directive('navigationFooter', function() {
  return {
    restrict: 'E',
    templateUrl: '/ui/templates/navigationFooter/navigationFooter.html'
  }
});