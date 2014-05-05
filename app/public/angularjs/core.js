// public/core.js
var app = angular.module('app', ['ngResource', 'ngRoute', 'angular.css.injector']);


app.config(['$routeProvider', '$locationProvider', '$httpProvider',
  function($routeProvider, $locationProvider, $httpProvider) {

    var checkLoggedin = function($q, $timeout, $http, $location, $rootScope){
      // Initialize a new promise
      var deferred = $q.defer();

      // Make an AJAX call to check if the user is logged in
      $http.get('/api/loggedInUser').success(function(user){
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
        templateUrl: '../components/listPost/listPost.html',
        controller: 'postListController'
      }).
      when('/viewPost/:id', {
        templateUrl: '../components/viewPost/viewPost.html',
        controller: 'postDetailController'
      }).
      when('/editPost', {
        templateUrl: '../components/editPost/editPost.html',
        controller: 'postEditController',
        resolve: {
          loggedin: checkLoggedin
        }
      }).
      when('/createPost', {
        templateUrl: '../components/createPost/createPost.html',
        controller: 'postCreateController',
        resolve: {
          loggedin: checkLoggedin
        }
      }).
      otherwise({
        redirectTo: '/'
      });
  }]);