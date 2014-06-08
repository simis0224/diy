angular.module('crudService', [])
  .factory('crudService',
  [ '$http', '$location',
    function ($http, $location) {

      var service = {
        get: function (entity, id, onSuccess, onError) {
          $http.get('/api/' + entity + '/' + id)
            .success(function(res) {
              console.log('Get ' + entity + '(' + id + ') succeeded.');
              (onSuccess || angular.noop)(res);
            })
            .error(function(res) {
              console.error('Get ' + entity + '(' + id + ') failed. Error: ' + res);
              (onError || angular.noop)();
            });
        },
        list: function (entity, onSuccess, onError) {
          $http.get('/api/' + entity + '/list')
            .success(function (res) {
              if (res && res.success === 1) {
                console.log('List ' + entity + ' succeeded.');
                (onSuccess || angular.noop)(res);
              } else {
                console.error('List ' + entity + ' failed. Error: ' + res.error.message);
                (onError || angular.noop)(res);
              }
            })
            .error(function (res) {
              (onError || angular.noop)();
              console.error('Create ' + entity + ' failed. Error: ' + res);
            });
        },
        create: function (entity, data, onSuccess, onError) {
          $http.post('/api/' + entity + '/create', data)
            .success(function (res) {
              if (res && res.success === 1) {
                console.log('Create ' + entity + '(' + res.data._id + ') succeeded.');
                (onSuccess || angular.noop)(res);
              } else {
                console.error('Create ' + entity + ' failed. Error: ' + res.error.message);
                (onError || angular.noop)(res);
              }
            })
            .error(function (res) {
              (onError || angular.noop)();
              console.error('Create ' + entity + ' failed. Error: ' + res);
            });
        },
        delete: function (entity, id, onSuccess, onError) {
          $http.post('/api/' + entity + '/delete/' + id)
            .success(function (res) {
              if(res && res.success === 1) {
                console.log('Delete ' + entity + '(' + id + ') succeeded.');
                (onSuccess || angular.noop)(res);
              } else {
                console.error('Delete ' + entity + '(' + id + ') failed. Error: ' + res.error.message);
                (onError || angular.noop)(res);
              }
            })
            .error(function (res) {
              console.error('Delete ' + entity + '(' + id + ') failed. Error: ' + res);
              (onError || angular.noop)(res);
            });
        },
        update: function(entity, id, data, onSuccess, onError) {
          $http.post('/api/' + entity + '/update/' + id, data)
            .success(function(res) {
              if(res && res.success === 1) {
                console.log('Update ' + entity + '(' + id + ') succeeded.');
                (onSuccess || angular.noop)(res);
              } else {
                console.error('Update ' + entity + '(' + id + ') failed. Error: ' + res.error.message);
                (onError || angular.noop)(res);
              }
            })
            .error(function(res) {
              console.error('Update ' + entity + '(' + id + ') failed. Error: ' + res);
              (onError || angular.noop)(res);
            });
        }
      }

      return service;

    }]);
