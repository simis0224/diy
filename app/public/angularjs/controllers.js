function postListController($scope, $http, cssInjector) {
  cssInjector.add("../components/listPost/listPost.css");
  // when landing on the page, get all todos and show them
  $http.get('/api/posts')
    .success(function(res) {
      $scope.items = res.items;
    })
    .error(function(data) {
      console.log('Error: ' + data);
    });
}

function postCreateController($scope, $http) {
  $scope.createPost = function () {
    $http.post('/api/createPost', $scope.formData)
      .success(function (res) {
        $scope.item = res.item;
        console.log(res.item);
      })
      .error(function (data) {
        console.log('Error: ' + data);
      });
  }
}

function postDetailController($scope, $http, $routeParams) {
  var id = $routeParams.id;
  // when landing on the page, get all todos and show them
  $http.get('/api/post/' + id)
    .success(function(res) {
      $scope.item = res.item;
      $scope.message = res.message;
    })
    .error(function(data) {
      console.log('Error: ' + data);
    });

    $scope.createPost = function() {
      $http.post('/api/createPost', $scope.formData)
      .success(function(res) {
        $scope.item = res.item;
        console.log(res.item);
      })
      .error(function(data) {
        console.log('Error: ' + data);
      });
    };

    $scope.deletePost = function () {
      $http.delete('/api/post/' + id)
        .success(function (res) {
          if(!res.hasError) {
            $scope.item = null;
          }
          $scope.message = res.message;
          console.log(res.message);
        })
        .error(function (data) {
          console.log('Error: ' + data);
        });
    };
}

function loginController($scope, $http, $route, $location, $cookieStore, AuthService) {
  $scope.formData = {};

  $scope.login = function () {
    $http.post('/api/login', $scope.formData)
      .success(function (res) {
        $scope.user = res.user;
        AuthService.setCurrentUser($cookieStore, res.user);
        $location.url('/');
      })
      .error(function (data) {
        console.log('Error: ' + data);
      });
  }
}

function navigationHeaderController($scope, $http, $cookieStore, AuthService) {
  $scope.isLoggedIn = AuthService.isLoggedIn($cookieStore);
  $scope.currentUser = AuthService.getCurrentUser($cookieStore);
}
