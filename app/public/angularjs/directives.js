app.directive('navigationHeader', function() {
  return {
    restrict: 'E',
    templateUrl: './components/navigationHeader/navigationHeader.html',
    scope: {
      currentUser: '='
    }
  }
});

app.directive('navigationFooter', function() {
  return {
    restrict: 'E',
    templateUrl: './components/navigationFooter/navigationFooter.html'
  }
});