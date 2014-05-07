// public/core.js
var app = angular.module('app', [
  'ngResource',
  'ngRoute',
  'angular.css.injector',
  'authenticateService',
  'posts']);


app.config(['$routeProvider', '$locationProvider', '$httpProvider',
  function($routeProvider, $locationProvider, $httpProvider) {

    var checkLoggedin = function($q, $timeout, $http, $location, $rootScope){
      // Initialize a new promise
      var deferred = $q.defer();

      // Make an AJAX call to check if the user is logged in
      $http.get('/api/user/me').success(function(user){
        // Authenticated
        if (user !== '0')
          $timeout(deferred.resolve, 0);

        // Not Authenticated
        else {
          $timeout(function(){deferred.reject();}, 0);
          $location.url('/login');
        }
      });

      return deferred.promise;
    };

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
      when('/editPost', {
        templateUrl: '../ui/angularjs/posts/editPost.html',
        controller: 'postEditController',
        resolve: {
          loggedin: checkLoggedin
        }
      }).
      when('/createPost', {
        templateUrl: '../ui/angularjs/posts/createPost.html',
        controller: 'postCreateController',
        resolve: {
          loggedin: checkLoggedin
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

