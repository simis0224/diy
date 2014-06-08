angular.module('posts', ['uploadService', 'crudService', 'ngTable', 'bootstrap-tagsinput'])

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

.controller('postGridController', ['$scope', '$http', 'cssInjector', 'crudService', function ($scope, $http, cssInjector, crudService) {

  cssInjector.add("../ui/angularjs/posts/gridPost.css");

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

.controller('postListController', ['$scope', '$http', '$location', '$route', 'cssInjector', 'crudService', 'ngTableParams',
    function ($scope, $http, $location, $route, cssInjector, crudService, ngTableParams) {

  cssInjector.add("../ui/angularjs/posts/listPost.css");

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

.controller('postCreateController', ['$scope', '$http', '$location', '$upload', '$routeParams', 'cssInjector', 'uploadService', 'crudService',
    function ($scope, $http, $location, $upload, $routeParams, cssInjector, uploadService, crudService) {

  cssInjector.add("../ui/angularjs/posts/createPost.css");

  $scope.post = {};

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

    // TODO make tagInput directive
    $scope.post.tags = $("#tagInput").tagsinput('items');
    crudService.create('post', $scope.post, onCreateSuccess, onCreateError);
  }

  $scope.imageUploadOnSuccess = function(imageUrl) {
    $scope.post.postImage = imageUrl;
  }

  $scope.imageUploadOnError = function(message) {
    $scope.errorMessage = message;
  }

  $scope.redirectToPreviousPage = function(){
    var retUrl = $routeParams.retUrl ? $routeParams.retUrl : '/';
    $location.url(retUrl);
  }

  // TODO make tagInput directive
  $('#tagInput').tagsinput({
    typeahead: {
      source: function(query) {
        return $.getJSON('citynames.json');
      }
    }
  });

  $scope.queryCities = function(query) {
    return $http.get('cities.json');
  };
}])

.controller('postEditController', ['$scope', '$http', '$routeParams', '$location', 'cssInjector', 'uploadService', 'crudService',
    function ($scope, $http, $routeParams, $location, cssInjector, uploadService, crudService) {

  cssInjector.add("../ui/angularjs/posts/editPost.css");

  var id = $routeParams.id;

  var onGetSuccess = function(res) {
    $scope.post = res.data;
    $scope.message = res.message;
    if ($scope.post.tags) {
      for(var i = 0; i < $scope.post.tags.length; i++) {
        $('#tagInput').tagsinput('add', $scope.post.tags[i]);
      }
    }
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

    // TODO make tagInput directive
    $scope.post.tags = $("#tagInput").tagsinput('items');
    crudService.update('post', id, $scope.post, onUpdateSuccess, onUpdateError);
  };

  $scope.imageUploadOnSuccess = function(imageUrl) {
    $scope.post.postImage = imageUrl;
  }

  $scope.imageUploadOnError = function(message) {
    $scope.errorMessage = message;
  }

  $scope.redirectToPreviousPage = function(){
    var retUrl = $routeParams.retUrl ? $routeParams.retUrl : '/';
    $location.url(retUrl);
  }

  // TODO make tagInput directive
  $('#tagInput').tagsinput({
    typeahead: {
      source: function(query) {
        return $.getJSON('citynames.json');
      }
    }
  });
}])

.controller('postDetailController', ['$scope', '$http', '$routeParams', '$location', 'cssInjector', 'authenticateService', 'crudService',
    function ($scope, $http, $routeParams, $location, cssInjector, authenticateService, crudService) {

  cssInjector.add("../ui/angularjs/posts/viewPost.css");

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

}]);