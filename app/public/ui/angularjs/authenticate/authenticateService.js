angular.module('authenticateService', ['ngCookies'])

.factory('authenticateService',
  [ '$http', '$q',
    function ($http, $q) {

      var service = {
        currentUser: null,
        login: function() {   },
        logout: function() {  },
        checkCurrentUser: function() {
          if ( !service.current ) {
            $http.get('/api/user/me').success(function(res){
              if (res != '0') {
                service.currentUser = res.data;
              }
            });
          }
        },
        setCurrentUser: function(user) {
          service.currentUser = user;
        },
        removeCurrentUser: function() {
          service.currentUser = null;
        }
      }

      return service;
}]);
