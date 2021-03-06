angular.module('posts', ['uploadService', 'crudService', 'geoService', 'ngTable', 'ngTagsInput', 'akoenig.deckgrid'])

.config(function ($routeProvider) {
  $routeProvider.
    when('/viewPost/:id', {
      templateUrl: '../ui/angularjs/posts/viewPost.html',
      controller: 'postDetailController'
    }).
    when('/listPost', {
      templateUrl: '../ui/angularjs/posts/listPost.html',
      controller: 'postListController'
    }).
    when('/editPost/:id', {
      templateUrl: '../ui/angularjs/posts/editPost.html',
      controller: 'postEditController',
      resolve: {
        authenticated: function(authenticateService) {
          authenticateService.requireAuthenticated({
            requireAdmin: true
          });
        }
      }
    }).
    when('/createPost', {
      templateUrl: '../ui/angularjs/posts/createPost.html',
      controller: 'postCreateController',
      resolve: {
        authenticated: function (authenticateService) {
          authenticateService.requireAuthenticated({
            requireAdmin: true
          });
        }
      }
    });
})

.controller('postGridController', ['$scope', '$http', 'crudService', function ($scope, $http, crudService) {

  var onListSuccess = function(res) {
    $scope.posts = res.data;
  }

  var onListError = function(res) {
    if (res && res.success === 1) {
      $scope.errorMessage = res.error.message;
    } else {
      $scope.errorMessage = res;
    }
  }

  crudService.list('post', onListSuccess, onListError);

}])

.controller('postListController', ['$scope', '$http', '$location', '$route', 'crudService', 'ngTableParams',
    function ($scope, $http, $location, $route, crudService, ngTableParams) {

  var onListSuccess = function(res) {
    posts = res.data;

    $scope.tableParams = new ngTableParams({
      page: 1,            // show first page
      count: 10           // count per page
    }, {
      total: posts.length, // length of data
      getData: function($defer, params) {
        $defer.resolve(posts.slice((params.page() - 1) * params.count(), params.page() * params.count()));
      }
    });
  }

  var onListError = function(res) {
    if (res && res.success === 1) {
      $scope.errorMessage = res.error.message;
    } else {
      $scope.errorMessage = res;
    }
  }

  crudService.list('post', onListSuccess, onListError);

  $scope.deletePost = function (id) {

    var onDeleteSuccess = function(res) {
      $route.reload();
    };

    var onDeleteError = function(res) {
      if (res && res.success === 1) {
        $scope.errorMessage = res.error.message;
      } else {
        $scope.errorMessage = res;
      }
    };

    crudService.delete('post', id, onDeleteSuccess, onDeleteError);
  };

  $scope.redirectToPostEditPage = function(id){
    $location.url('/editPost/' + id + '?retUrl=' + $location.path());
  }

  $scope.redirectToPostCreatePage = function(id){
    $location.url('/createPost?retUrl=' + $location.path());
  }

}])

.controller('postCreateController', ['$scope', '$http', '$location', '$upload', '$routeParams', 'uploadService', 'crudService', 'geoService',
    function ($scope, $http, $location, $upload, $routeParams, uploadService, crudService, geoService) {

  $scope.post = {};

  $scope.requestGeoLocation = function(){

    var onRequestGeoLocationSuccess = function (res) {
      $scope.post.coordinates =  $scope.post.coordinates || {};
      $scope.post.coordinates.x = res.coordinates.x;
      $scope.post.coordinates.y = res.coordinates.y;
    }

    var onRequestGeoLocationError = function(res) {}

    geoService.getGeoLocation($scope.post.city, $scope.post.address, onRequestGeoLocationSuccess, onRequestGeoLocationError);

  };

  $scope.createPost = function () {

    var onCreateSuccess = function(res) {
      $location.url('/viewPost/' + res.data._id);
    }

    var onCreateError = function(res) {
      if (res && res.success === 1) {
        $scope.errorMessage = res.error.message;
      } else {
        $scope.errorMessage = res;
      }
    }

    crudService.create('post', $scope.post, onCreateSuccess, onCreateError);
  }

  $scope.imageUploadOnSuccess = function(imageUrl) {
    $scope.post.images = [imageUrl];
  }

  $scope.imageUploadOnError = function(message) {
    $scope.errorMessage = message;
  }

  $scope.redirectToPreviousPage = function(){
    var retUrl = $routeParams.retUrl ? $routeParams.retUrl : '/';
    $location.url(retUrl);
  }

}])

.controller('postEditController', ['$scope', '$http', '$routeParams', '$location', 'uploadService', 'crudService', 'geoService',
    function ($scope, $http, $routeParams, $location, uploadService, crudService, geoService) {

  var id = $routeParams.id;

  var onGetSuccess = function(res) {
    $scope.post = res.data;
    $scope.message = res.message;
  };

  crudService.get('post', id, onGetSuccess);

  $scope.updatePost = function () {

    var onUpdateSuccess = function (res) {
      $location.url('/viewPost/' + id);
    }

    var onUpdateError = function (res) {
      if (res && res.success === 1) {
        $scope.errorMessage = res.error.message;
      } else {
        $scope.errorMessage = res;
      }
    }

    crudService.update('post', id, $scope.post, onUpdateSuccess, onUpdateError);
  };

  $scope.requestGeoLocation = function(){

    var onRequestGeoLocationSuccess = function (res) {
      $scope.post.coordinates =  $scope.post.coordinates || {};
      $scope.post.coordinates.x = res.coordinates.x;
      $scope.post.coordinates.y = res.coordinates.y;
    }

    var onRequestGeoLocationError = function(res) {}

    geoService.getGeoLocation($scope.post.city, $scope.post.address, onRequestGeoLocationSuccess, onRequestGeoLocationError);

  };

  $scope.imageUploadOnSuccess = function(imageUrl) {
    $scope.post.images = [imageUrl];
  }

  $scope.imageUploadOnError = function(message) {
    $scope.errorMessage = message;
  }

  $scope.redirectToPreviousPage = function(){
    var retUrl = $routeParams.retUrl ? $routeParams.retUrl : '/';
    $location.url(retUrl);
  }
}])

.controller('postDetailController', ['$scope', '$http', '$routeParams', '$location', 'authenticateService', 'crudService',
    function ($scope, $http, $routeParams, $location, authenticateService, crudService) {

  var id = $routeParams.id;

  $scope.$watch(function() {
    return authenticateService.currentUser;
  }, function(currentUser) {
    $scope.currentUser = currentUser;
  });

  var onGetSuccess = function(res) {
    $scope.post = res.data;
    $scope.message = res.message;
  };

  crudService.get('post', id, onGetSuccess);
}])


.directive('postCard', function() {
  return {
    restrict: 'E',
    scope: {
      post: '='
    },
    templateUrl: '/ui/angularjs/posts/postCard.html'
  }
})
