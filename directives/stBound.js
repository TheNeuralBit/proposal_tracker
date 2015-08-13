angular.module('smart-table')
  .directive('stBound', ['stConfig', '$timeout','$parse', function (stConfig, $timeout, $parse) {
    return {
      require: '^stTable',
      link: function (scope, element, attr, ctrl) {
        var tableCtrl = ctrl;
        var promise = null;
        var throttle = attr.stDelay || stConfig.search.delay;
        var event = attr.stInputEvent || stConfig.search.inputEvent;

        attr.$observe('stBound', function (newValue, oldValue) {
          var input = element[0].value;
          if (newValue !== oldValue && input) {
            ctrl.tableState().search = {};
            tableCtrl.search(input, newValue);
          }
        });

        getQueryByDirection = function(query, direction)
        {
          if (query === undefined)
            return '';
          if (direction in query)
            return query[direction];
          else
            return '';
        };

        //table state -> view
        scope.$watch(function () {
          return ctrl.tableState().search;
        }, function (newValue, oldValue) {
          var predicateExpression = attr.stBound || '$';
          if (newValue.predicateObject && getQueryByDirection($parse(predicateExpression)(newValue.predicateObject), attr.direction) !== element[0].value) {
            element[0].value = getQueryByDirection($parse(predicateExpression)(newValue.predicateObject), attr.direction) || '';
          }
        }, true);

        // view -> table state
        element.bind(event, function (evt) {
          evt = evt.originalEvent || evt;
          if (promise !== null) {
            $timeout.cancel(promise);
          }

          promise = $timeout(function () {
            if (evt.target.value === '')
            {
              delete ctrl.tableState().search.predicateObject[attr.stBound][attr.direction];
              tableCtrl.search(ctrl.tableState().search.predicateObject[attr.stBound], attr.stBound);
              return;
            }

            var query = {};
            if (ctrl.tableState().search.predicateObject && attr.stBound in ctrl.tableState().search.predicateObject)
            {
              query = ctrl.tableState().search.predicateObject[attr.stBound];
            }
            query[attr.direction] = evt.target.value;

            tableCtrl.search(query, attr.stBound);
            promise = null;
          }, throttle);
        });
      }
    };
  }]);

angular.module('smart-table')
  .directive('stDebug', function() {
    return {
      require: '^stTable',
      template: '{{table_ctrl.search.predicateObject}}',
      link: function() {}
    };
  });
