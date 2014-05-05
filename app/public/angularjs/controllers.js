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
  $scope.formData = {};

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
  $scope.formData = {};

  var id = $routeParams.id;
  // when landing on the page, get all todos and show them
  $http.get('/api/post/' + id)
    .success(function(res) {
      $scope.item = res.item;
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
    }

//  // when submitting the add form, send the text to the node API
//  $scope.createTodo = function() {
//    $http.post('/api/todos', $scope.formData)
//      .success(function(data) {
//        $scope.formData = {}; // clear the form so our user is ready to enter another
//        $scope.todos = data;
//        console.log(data);
//      })
//      .error(function(data) {
//        console.log('Error: ' + data);
//      });
//  };
//
//  // delete a todo after checking it
//  $scope.deleteTodo = function(id) {
//    $http.delete('/api/todos/' + id)
//      .success(function(data) {
//        $scope.todos = data;
//        console.log(data);
//      })
//      .error(function(data) {
//        console.log('Error: ' + data);
//      });
//  };

}