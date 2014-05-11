angular.module('common', [])

.directive('navigationHeader', ['authenticateService', function(authenticateService) {
  return {
    restrict: 'E',
    templateUrl: '/ui/angularjs/common/navigationHeader.html',
    scope: true,
    link: function($scope) {
      $scope.logout = authenticateService.logout;
      $scope.$watch(function() {
        return authenticateService.currentUser;
      }, function(currentUser) {
        $scope.currentUser = currentUser;
      });
    }
  }
}])

.directive('navigationFooter', function() {
  return {
    restrict: 'E',
    templateUrl: '/ui/angularjs/common/navigationFooter.html'
  }
})

.controller('navigationHeaderController', ['$scope', '$http', '$location', '$route', 'authenticateService', 'cssInjector',
  function($scope, $http, $location, $route, authenticateService, cssInjector) {
  cssInjector.add("../ui/angularjs/common/navigationHeader.css");
}])


