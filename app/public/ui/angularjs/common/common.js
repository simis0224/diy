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
    '$scope', '$http', '$location', '$route', '$rootScope', '$window', 'authenticateService', 'cssInjector',
  function($scope, $http, $location, $route, $rootScope, $window, authenticateService, cssInjector) {

  cssInjector.add("../ui/angularjs/common/navigationHeader.css");

  $scope.user = {
    username: null,
    password: null
  };

  $scope.errorMessage = "";

  $scope.weiboLogin = function() {
    $window.updateCurrentUser = function(user) {
      authenticateService.currentUser = user;
      $route.reload();
      delete $window.updateCurrentUser;
    }

    $window.open('/auth/weibo', '', 'height=500,width=800,top='+(screen.height-500)/2+',left='+(screen.width-800)/2+',toolbar=no,menubar=no,scrollbars=yes,resizable=no,location=no,status=no');
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

.directive('tagGroup', function() {
  return {
    restrict: 'E',
    scope: {
      tags: '='
    },
    templateUrl: '/ui/angularjs/common/tagGroup.html'
  }
})

.controller('tagGroupController', [
  '$scope', '$location', 'cssInjector',
  function($scope, $location, cssInjector) {

    cssInjector.add("../ui/angularjs/common/tagGroup.css");

}])

.directive('baiduMap', ['$window', '$q', function($window, $q) {

   const BAIDU_MAP_SCRIPT_SRC = 'http://api.map.baidu.com/api?v=2.0&ak=XC4na07DTIFVoacSkYjEetPr&callback=initMap';

   var initMap = function() {
     var map = new BMap.Map("allmap");               // 创建Map实例
     var point = new BMap.Point(116.404, 39.915);    // 创建点坐标
     map.centerAndZoom(point,15);                    // 初始化地图,设置中心点坐标和地图级别。
     var marker = new BMap.Marker(point);  // 创建标注
     map.addOverlay(marker);              // 将标注添加到地图中
   };

  function loadScript() {
    var initMapScript = document.createElement('script');
    initMapScript.text = 'var initMap = ' + initMap;
    document.body.appendChild(initMapScript);

    var loadMapScript = document.createElement('script'); // use global document since Angular's $document is weak
    document.body.appendChild(loadMapScript);
    loadMapScript.src = BAIDU_MAP_SCRIPT_SRC;
  }

  function lazyloadScript() {
    var deferred = $q.defer();
    $window.initMap = function () {
      initialize();
      deferred.resolve();
    };

    $( document ).ready(function() {
      loadScript();
    });
    return deferred.promise;
  }

  return {
    restrict: 'E',
    templateUrl: '/ui/angularjs/common/baiduMap.html',
    link: function (scope, element, attrs) { // function content is optional
      if ($window.BMap) {
        initMap();
        console.log('baidu map already loaded');
      } else {
        lazyloadScript().then(function () {
          console.log('baidu map loading promise resolved');
          if ($window.BMap) {
            console.log('baidu map loaded');
          } else {
            console.log('baidu map not loaded');
          }
        }, function () {
          console.log('baidu map loading promise rejected');
        });
      }
    }
  }
}])

.controller('baiduMapController', [
  '$scope', '$location', 'cssInjector',
  function($scope, $location, cssInjector) {

    cssInjector.add("../ui/angularjs/common/baiduMap.css");

}])


