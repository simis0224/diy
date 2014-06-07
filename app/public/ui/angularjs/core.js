// public/core.js
var app = angular.module('app', [
  'ngResource',
  'ngRoute',
  'angular.css.injector',
  'authenticateService',
  'uploadService',
  'crudService',
  'common',
  'posts',
  'users',
  'admin'
  ]);


app.config(['$routeProvider', '$locationProvider', '$httpProvider',
  function($routeProvider, $locationProvider, $httpProvider) {

    $httpProvider.responseInterceptors.push(function($q, $location) {
      return function(promise) {
        return promise.then(
          // Success: just return the response
          function(response){
            return response;
          },
          // Error: check the error status to get only the 401
          function(response) {
            if (response.status === 401)
              $location.url('/login');
            return $q.reject(response);
          }
        );
      }
    });

    $routeProvider.
      when('/', {
        templateUrl: '../ui/angularjs/posts/gridPost.html',
        controller: 'postGridController'
      }).
      otherwise({
        redirectTo: '/'
      });
  }]);

angular.module('app').controller('appController', ['authenticateService', function(authenticateService) {
  authenticateService.checkCurrentUser();
}]);

