function postListController($scope, $http, $routeParams, cssInjector) {
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

function postCreateController($scope, $http, $routeParams) {
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

function postDeleteController($scope, $http, $routeParams) {
  var id = $routeParams.id;

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