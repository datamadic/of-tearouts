'use strict';

angular.module('tearoutapp').directive('grid', function () {
       return {
              templateUrl: "http://datamadic.github.io/of-tearouts/out/views/grid.html",
              restrict: "E",
              scope: {},
              controller: function controller($scope, $interval, $rootScope) {
                     $scope.numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];

                     $interval(function () {
                            $scope.numbers = $scope.numbers.map(function (num) {
                                   if (~ ~(Math.random() * 10) % 2) {
                                          return (Math.random() * 100).toFixed(2);
                                   }

                                   return num;
                            });

                            $rootScope.$broadcast('nums-changed');
                     }, 500);
              }
       };
});
