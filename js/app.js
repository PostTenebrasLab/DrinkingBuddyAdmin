var app = angular.module('DrinkingBuddyAdmin', ['ngRoute','ngMaterial']);


app.config(function($mdThemingProvider){
   
    $mdThemingProvider.theme('default')
          .primaryPalette("red")
          .accentPalette('green')
          .warnPalette('blue');
});

app.config(function($routeProvider, $locationProvider){
	
	$routeProvider.when('/Inventory', {
		templateUrl: 'views/inventory.html',
		controller: 'InventoryController'
	});


	$routeProvider.when('/Users', {
		templateUrl: 'views/users.html',
		controller: 'UsersController'
	});

	//$locationProvider.html5Mode(true);
});

app.controller('MainController', function($scope, $route, $routeParams, $location) {
	$scope.$route = $route;
	$scope.$location = $location;
	$scope.$routeParams = $routeParams;
});

app.controller("UsersController", ["$scope", function($scope){
		$scope.users = [
			{
				id: 1,
				name: "Pablo",
				balance: 122
			}
		];

}]);


app.controller("InventoryController", ["$scope", function($scope){

	$scope.items = [
		{
			id: 1,
			name: "Ice Tea",
			quantity: 3,
			price: 15
		},
		{
			id: 3,
			name: "Coca",
			quantity: 32,
			price: 15
		}
	];

	$scope.incQuantity = function(item){
		item.quantity += 1;
	}

	$scope.decQuantity = function(item){
		if(item.quantity > 0)
				item.quantity -= 1;
	}
}]);