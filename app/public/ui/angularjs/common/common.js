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
    '$scope', '$http', '$location', '$route','$modal', '$rootScope', 'authenticateService', 'cssInjector',
  function($scope, $http, $location, $route, $modal, $rootScope, authenticateService, cssInjector) {

  cssInjector.add("../ui/angularjs/common/navigationHeader.css");

  $scope.user = {
    username: null,
    password: null
  };

  $scope.errorMessage = "";

  var openLoginDialog = function(redirectUrlOnSuccess, redirectUrlOnCancel) {
    $modal.open({
      templateUrl: '/ui/angularjs/users/login.html',
      backdrop: true,
      windowClass: 'modal',
      controller: function ($scope, $modalInstance, user, errorMessage) {

        $scope.user = user;
        $scope.errorMessage = errorMessage

        var onLoginSuccess = function () {
          $modalInstance.close();
          if (redirectUrlOnSuccess) {
            $location.url(redirectUrlOnSuccess);
          }
        }

        var onLoginFailure = function (err) {
          $scope.errorMessage = err;
        }

        $scope.login = function() {
          authenticateService.login(user, onLoginSuccess, onLoginFailure);
        }

        $scope.redirectToSignupPage = function() {
          $modalInstance.close();
          $location.url('/signup');
        }

        $scope.cancel = function () {
          if (redirectUrlOnCancel) {
            $location.url(redirectUrlOnCancel);
          }
          $modalInstance.dismiss('cancel');
        };
      },
      resolve: {
        user: function () {
          return $scope.user;
        },
        errorMessage: function() {
          return $scope.errorMessage;
        }
      }
    });
  }

  $rootScope.$on("openLoginDialogEvent", function (event, args) {
    openLoginDialog();
  });

  $scope.openLoginDialog = function() {
    openLoginDialog();
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
  '$scope', '$http', '$location', '$route','$modal', '$rootScope', 'uploadService',
  function($scope, $http, $location, $route, $modal, $rootScope, uploadService) {

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


