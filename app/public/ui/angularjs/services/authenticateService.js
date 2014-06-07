angular.module('authenticateService', [])

.factory('authenticateService',
  [ '$http', '$location', '$q', '$timeout', '$rootScope',
    function ($http, $location, $q, $timeout, $rootScope) {

      var service = {
        currentUser: null,
        signup: function (user, onSignupSuccess, onSignupFailure) {
          $http.post('/api/signup', user)
            .success(function (res) {
              if(res.success === 1) {
                service.currentUser = res.data;
                (onSignupSuccess || angular.noop)();
              } else {
                (onSignupFailure || angular.noop)(res.error.message);
                console.log('Error: ' + res);
              }
            })
            .error(function (err) {
              (onSignupFailure || angular.noop)(err);
              console.log('Error: ' + err);
            });
        },
        login: function (user, onLoginSuccess, onLoginFailure) {
          $http.post('/api/login', user)
            .success(function (res) {
              if(res.success === 1) {
                service.currentUser = res.data;
                (onLoginSuccess || angular.noop)();
              } else {
                (onLoginFailure || angular.noop)(res.error.message);
              }
            })
            .error(function (err) {
              (onLoginFailure || angular.noop)(err);
              console.log('Error: ' + err);
            });
        },
        logout: function() {
          $http.post('/api/logout')
            .success(function (res) {
              service.currentUser = null;
              $location.url('/');
            })
            .error(function (data) {
              console.log('Error: ' + data);
            });
        },
        checkCurrentUser: function() {
          if ( !service.current ) {
            $http.get('/api/user/me').success(function(res){
              if (res != '0') {
                service.currentUser = res.data;
              }
            });
          }
        },
        requireAuthenticated: function(options){
          options = options || {};
          // Initialize a new promise
          var deferred = $q.defer();

          var validateAdmin = function () {
            if (service.currentUser.isAdmin) {
              $timeout(deferred.resolve, 0);
            } else {
              $timeout(function(){deferred.reject();}, 0);
              $location.url('/errorPage');
            }
          }

          if (service.currentUser) {
            if (options.requireAdmin) {
              validateAdmin();
            } else {
              $timeout(deferred.resolve, 0);
            }
          } else {
            // Make an AJAX call to check if the user is logged in
            $http.get('/api/user/me').success(function(res){
              // Authenticated
              if (res !== '0') {
                service.currentUser = res.data;
                if (options.requireAdmin) {
                  validateAdmin();
                } else {
                  $timeout(deferred.resolve, 0);
                }
              }

              // Not Authenticated
              else {
                $timeout(function(){deferred.reject();}, 0);
                $location.url('/login?retUrl=' + $location.path());
              }
            });
          }

          return deferred.promise;
        }
      }

      return service;
}]);
