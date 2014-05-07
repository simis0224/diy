angular.module('authenticateService', ['ngCookies'])

.factory('authenticateService',
  [ '$http', '$location',
    function ($http, $location) {

      var service = {
        currentUser: null,
        login: function (user) {
          $http.post('/api/login', user)
            .success(function (res) {
              service.currentUser = res.data;
              $location.url('/');
            })
            .error(function (data) {
              console.log('Error: ' + data);
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
        }
      }

      return service;
}]);
