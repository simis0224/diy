angular.module('authenticateService', [])

.factory('authenticateService',
  [ '$http', '$location', '$q', '$timeout',
    function ($http, $location, $q, $timeout) {

      var service = {
        currentUser: null,
        login: function (user, onLoginSuccess, onLoginFailure) {
          $http.post('/api/login', user)
            .success(function (res) {
              if(res.success === 1) {
                service.currentUser = res.data;
                onLoginSuccess();
              } else {
                onLoginFailure(res.error.message);
              }
            })
            .error(function (err) {
              onLoginFailure(err);
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
        requireAuthenticated: function(){
          // Initialize a new promise
          var deferred = $q.defer();

          if (service.currentUser) {
            $timeout(deferred.resolve, 0);
          } else {
            // Make an AJAX call to check if the user is logged in
            $http.get('/api/user/me').success(function(res){
              // Authenticated
              if (res !== '0') {
                service.currentUser = res.data;
                $timeout(deferred.resolve, 0);
              }

              // Not Authenticated
              else {
                $timeout(function(){deferred.reject();}, 0);
                $location.url('/login');
              }
            });
          }

          return deferred.promise;
        }
      }

      return service;
}]);
