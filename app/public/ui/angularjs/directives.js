app.directive('navigationHeader', function() {
  return {
    restrict: 'E',
    templateUrl: '/ui/templates/navigationHeader/navigationHeader.html',
    scope: {
      currentUser: '='
    }
  }
});

app.directive('navigationFooter', function() {
  return {
    restrict: 'E',
    templateUrl: '/ui/templates/navigationFooter/navigationFooter.html'
  }
});