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

		$scope.editUser = function(user){
			$scope.user = user;
			$scope.userOriginal = angular.copy(user);
		}

		$scope.cancelEdit = function(){
			$scope.user.name = $scope.userOriginal.name;
			$scope.user.balance = $scope.userOriginal.balance;
			$scope.user = null;
		}

		$scope.edited = function(){
			return !angular.equals($scope.user, $scope.userOriginal);
		}

/*
		$scope.editBalance = function(ev, user) {
		    // Appending dialog to document.body to cover sidenav in docs app
		    var confirm = $mdDialog.confirm()
		          .title('Would you like to delete your debt?')
		          .textContent('All of the banks have agreed to forgive you your debts.')
		          .ariaLabel('Lucky day')
		          .targetEvent(ev)
		          .ok('Please do it!')
		          .cancel('Sounds like a scam');
		    $mdDialog.show(confirm).then(function() {
		      $scope.status = 'You decided to get rid of your debt.';
		    }, function() {
		      $scope.status = 'You decided to keep your debt.';
		    });
		};
*/		
}]);


app.controller("InventoryController", ["$scope", "$resource", "$http", function($scope, $resource, $http){
	//fill with data for example

    var originatorEv;

    this.openMenu = function($mdOpenMenu, ev) {
      originatorEv = ev;
      $mdOpenMenu(ev);
    };

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