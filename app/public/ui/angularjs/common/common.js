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

.directive('navigationFooter', function() {
  return {
    restrict: 'E',
    templateUrl: '/ui/angularjs/common/navigationFooter.html'
  }
})

.controller('navigationHeaderController', [
    '$scope', '$http', '$location', '$route','$modal', '$rootScope', 'authenticateService', 'cssInjector',
  function($scope, $http, $location, $route, $modal, $rootScope, authenticateService, cssInjector) {

  cssInjector.add("../ui/angularjs/common/navigationHeader.css");

  $scope.user = {
    username: null,
    password: null
  };

  $scope.errorMessage = "";

  var openLoginDialog = function() {
    $modal.open({
      templateUrl: '/ui/angularjs/users/login.html',
      backdrop: true,
      windowClass: 'modal',
      controller: function ($scope, $modalInstance, user, errorMessage) {

        $scope.user = user;
        $scope.errorMessage = errorMessage

        var onLoginSuccess = function () {
          $modalInstance.close();
          $location.url('/');
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


