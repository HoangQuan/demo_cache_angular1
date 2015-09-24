angular.module('demoCacheApp', []).
factory('DemoCache', function($cacheFactory) {
    return $cacheFactory('demoCache', {
        capacity: 3 // optional - turns the cache into LRU cache
    });
}).
directive('onEnter', function() {
    return function(scope, element, attrs) {
        element.bind("keydown keypress", function(event) {
            if (event.which === 13) {
                scope.$apply(function() {
                    scope.$eval(attrs.onEnter);
                });
                event.preventDefault();
            }
        });
    };
});

var MyCacheController = function($scope, DemoCache) {
    $scope.tinhtoan = function() {
        var equation = $scope.equation,
            result = DemoCache.get(equation),
            status = 'Ket qua tu Cache';
        if (!result) {
            status = 'Ket qua dc tinh';
            result = eval(equation);
            DemoCache.put(equation, result);
        }
        $scope.result = result;
        $scope.status = status;
        $scope.cacheInfo = DemoCache.info();
    }
    $scope.clearCache = function() {
        DemoCache.removeAll();
        $scope.cacheInfo = DemoCache.info();
    }
}
