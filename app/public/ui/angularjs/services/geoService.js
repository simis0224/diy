angular.module('geoService', [])
  .factory('geoService',
  [ '$http',
    function ($http) {
      var service = {
        getGeoLocation: function(city, address, onSuccess, onError) {
          $http.get('/api/getGeoLocation?address=' + address + '&city=' + city)
            .success(function (res) {
              if (res && res.success === 1) {
                console.log(res);
                (onSuccess || angular.noop)(res);
              } else {
                console.error(res.error);
                (onError || angular.noop)(res);
              }
            })
            .error(function (res) {
              (onError || angular.noop)();
              console.error(res);
            });
        }
      }

      return service;

    }]);