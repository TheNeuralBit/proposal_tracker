(function() {
  var app = angular.module('proposal_tracker', ['ui.bootstrap', 'smart-table', 'smart-table-filters', 'ngRoute']);

  app.config(['$routeProvider', function($routeProvider) {
    $routeProvider.
      when('/', {
        templateUrl: 'partials/home.html'
      }).
      when('/list', {
        templateUrl: 'partials/proposal_list.html',
        controller: 'ProposalListController'
      }).
      when('/analytics', {
        templateUrl: 'partials/proposal_analytics.html',
        controller: 'ProposalAnalyticsController',
      }).
      otherwise({
        redirectTo: '/'
      });
  }]);

  app.controller('HeaderController', function($scope, $location) { 
    $scope.isActive = function (viewLocation) { 
      return viewLocation === $location.path();
    };
  });

  app.factory('ProposalListService', function($http) {
    var factory = {};
    factory.proposal_data = {};
    factory.proposal_data.list = [];
    factory.proposal_data.displayed_list = [];

    $http.get('./proposals.json').success(function(data) {
      factory.proposal_data.list = data;
      factory.proposal_data.displayed_list = [].concat(factory.proposal_data.list);
      console.debug(factory.proposal_data.list);
    });

    return factory;
  });

  app.controller('ProposalListController', function($scope, ProposalListService){
    $scope.proposal_data = ProposalListService.proposal_data;
  });

  app.controller('ProposalAnalyticsController', function($scope, ProposalListService){
    $scope.proposal_data = ProposalListService.proposal_data;
  });
})();
