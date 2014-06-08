angular.module('common', ['ui.bootstrap'])

.directive('navigationHeader', ['authenticateService', function(authenticateService) {
  return {
    restrict: 'E',
    templateUrl: '/ui/angularjs/common/navigationHeader.html',
    scope: true,
    link: function($scope) {
      $scope.logout = authenticateService.logout;
      $scope.$watch(function() {
        return authenticateService.currentUser;
      }, function(currentUser) {
        $scope.currentUser = currentUser;
      });
    }
  }
}])

.controller('navigationHeaderController', [
    '$scope', '$http', '$location', '$route', '$rootScope', 'authenticateService', 'cssInjector',
  function($scope, $http, $location, $route, $rootScope, authenticateService, cssInjector) {

  cssInjector.add("../ui/angularjs/common/navigationHeader.css");

  $scope.user = {
    username: null,
    password: null
  };

  $scope.errorMessage = "";

  $scope.redirectToLoginPage = function(){
    var retUrl = $location.path() === '/login' || $location.path() === '/signup' ? '/' : $location.path();
    $location.url('/login?retUrl=' + retUrl);
  }

  $scope.redirectToEditUserPage = function(){
    $location.url('/editUser/' + authenticateService.currentUser.id + '?retUrl=' +  $location.path());
  }
}])

.directive('navigationFooter', function() {
  return {
    restrict: 'E',
    templateUrl: '/ui/angularjs/common/navigationFooter.html'
  }
})

.directive('imageUploader', function() {
  return {
    restrict: 'E',
    scope: {
      onSuccess: '&',
      onError: '&'
    },
    templateUrl: '/ui/angularjs/common/imageUploader.html'
  }
})

.controller('imageUploaderController', [
  '$scope', '$location', 'uploadService', 'cssInjector',
  function($scope, $location, uploadService, cssInjector) {

    cssInjector.add("../ui/angularjs/common/imageUploader.css");

    $scope.previewImageSrc = '';

    $scope.uploadImage = function($files) {

      var onSuccess = function(res, status, headers, config) {
        // file is uploaded successfully
        if(res.success === 1) {
          $scope.previewImageSrc = res.imageUrl;
          $scope.onSuccess({imageUrl: res.imageUrl});
          console.log("Upload image succeeded.");
        } else {
          $scope.onError({error: res});
          console.error('Upload image error:' + res);
        }
      }

      var onError = function (res) {
        console.error('Upload image error: ' + res);
      }

      var onProgress = function (percent) {
        $scope.uploadProgress = percent;
      }

      uploadService.uploadImage($files, onSuccess, onError, onProgress);
    };
}])


