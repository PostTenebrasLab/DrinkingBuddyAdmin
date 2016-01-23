var app = angular.module('DrinkingBuddyAdmin', ['ngRoute','ngMaterial','ngResource']);


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

app.controller("UsersController", ["$scope", "$resource", "$http", function($scope, $resource, $http){
		$scope.users = [
			{
				id: 1,
				name: "Pablo",
				balance: 122
			}
		];

		var User = $resource(APP_HOST + '/users/:user_id',
			{user_id:'@id'}
		);

		$http.get(APP_HOST + '/users').then(function(response){			
			var data = response.data;
			var users = [];
			
			for(var i in data){
				users.push(new User(data[i]));
			}
			$scope.users = users;
			
		});

}]);


app.controller("InventoryController", ["$scope", "$resource", "$http", function($scope, $resource, $http){
	//fill with data for example
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


	var Beverage = $resource(APP_HOST + '/beverages/:beverage_id',
		{beverage_id:'@id'}
	);

	$http.get(APP_HOST + '/beverages').then(function(response){
		var data = response.data;
		var beverages = [];
		for(var i in data){
			beverages.push(new Beverage(data[i]));
		}
		$scope.items = beverages;
	});

	$scope.incQuantity = function(item){
		item.quantity += 1;
		item.$save();
	}

	$scope.decQuantity = function(item){
		if(item.quantity > 0)
				item.quantity -= 1;
		item.$save();
	}
}]);