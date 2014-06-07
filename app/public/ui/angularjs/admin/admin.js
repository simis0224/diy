angular.module('admin', [])

.config(function ($routeProvider) {
  $routeProvider.
    when('/adminPage', {
      templateUrl: '../ui/angularjs/admin/adminPage.html',
      resolve: {
        authenticated: function(authenticateService) {
          authenticateService.requireAuthenticated({
            requireAdmin: true
          });
        }
      }
    }).
    when('/errorPage', {
      templateUrl: '../ui/angularjs/admin/errorPage.html'
    });
})