angular.module('uploadService', [ 'angularFileUpload' ])
  .factory('uploadService',
  [ '$upload',
    function ($upload) {

      var service = {
        uploadImage: function($files, onSuccess, onError, onProgress) {
          for (var i = 0; i < $files.length; i++) {
            var file = $files[i];
            $upload.upload({
              url: '/api/upload/image',
              method: 'POST',
              file: file
            }).progress(function(evt) {
              var percent = parseInt(100.0 * evt.loaded / evt.total);
              onProgress(percent)
              console.log('percent: ' + percent);
            }).success(onSuccess)
              .error(onError);
          }
        }
      }

      return service;

    }]);
