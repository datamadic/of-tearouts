angular.module('tearoutapp').directive('grid', ()=>{
	return {
        templateUrl: "/views/grid.html",
        restrict: "E",
        scope: {},
        controller: function($scope, $interval){
        	$scope.numbers = [1,2,3,4,5,6,7,8,9];

        	$interval(() => {
        		$scope.numbers = $scope.numbers.map((num)=>{
        			if (~~(Math.random() * 10) % 2) {
        				return (Math.random()*100).toFixed(2);
        			}

        			return num;
        		});
        	}, 500);
        },
    };
});