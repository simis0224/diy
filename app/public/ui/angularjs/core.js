// public/core.js
var app = angular.module('app', [
  'ngResource',
  'ngRoute',
  'angular.css.injector',
  'authenticateService',
  'uploadService',
  'posts']);


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
        templateUrl: '../ui/angularjs/posts/listPost.html',
        controller: 'postListController'
      }).
      when('/viewPost/:id', {
        templateUrl: '../ui/angularjs/posts/viewPost.html',
        controller: 'postDetailController'
      }).
      when('/editPost/:id', {
        templateUrl: '../ui/angularjs/posts/editPost.html',
        controller: 'postEditController',
        resolve: {
          authenticated: function(authenticateService) {
            authenticateService.requireAuthenticated();
          }
        }
      }).
      when('/createPost', {
        templateUrl: '../ui/angularjs/posts/createPost.html',
        controller: 'postCreateController',
        resolve: {
          authenticated: function (authenticateService) {
            authenticateService.requireAuthenticated();
          }
        }
      }).
      when('/login', {
        templateUrl: '../ui/templates/login/login.html',
        controller: 'loginController'
      }).
      otherwise({
        redirectTo: '/'
      });
  }]);

angular.module('app').controller('appController', ['authenticateService', function(authenticateService) {
  authenticateService.checkCurrentUser();
}]);

