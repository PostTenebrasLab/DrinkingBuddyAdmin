

var app = angular.module('DrinkingBuddyAdmin', [
	'ngRoute',
	'ngMaterial',
	'ngResource',
	'ngCookies'
])

.config(function($mdThemingProvider){
   
    $mdThemingProvider.theme('default')
          .primaryPalette("red")
          .accentPalette('green')
          .warnPalette('blue');
})

.config(function($routeProvider, $locationProvider){	


	$routeProvider

	.when('/login', {
		templateUrl: 'views/login.html',
		controller: 'LoginController'
	})

	
	.when('/Inventory', {
		templateUrl: 'views/inventory.html',
		controller: 'InventoryController'
	})


	.when('/Users', {
		templateUrl: 'views/users.html',
		controller: 'UsersController'
	})

	.when('/Transactions', {
		templateUrl: 'views/transactions.html',
		controller: 'TransactionsController'
	})

	.otherwise({ redirectTo: '/login' });
	//$locationProvider.html5Mode(true);
})

.run(['$rootScope', '$location', '$cookieStore', '$http',
    function ($rootScope, $location, $cookieStore, $http) {    	
        // keep user logged in after page refresh
    $rootScope.globals = $cookieStore.get('globals') || {};
    if ($rootScope.globals.currentUser) {
    	$http.defaults.headers.common = {"Access-Control-Request-Headers": "accept, origin, authorization"};
        $http.defaults.headers.common['Authorization'] = 'Basic ' + $rootScope.globals.currentUser.authdata; // jshint ignore:line
    }

    $rootScope.$on('$locationChangeStart', function (event, next, current) {
        // redirect to login page if not logged in
        if ($location.path() !== '/login' && !$rootScope.globals.currentUser) {
            $location.path('/login');
        }
    });
}]);


app.controller('MainController', function($scope, $route, $routeParams, $location) {
	$scope.$route = $route;
	$scope.$location = $location;
	$scope.$routeParams = $routeParams;
});

app.controller("UsersController", ["$scope", "$resource", "$http", function($scope, $resource, $http){		

		$scope.users = [
		/*
			{
				id: 1,
				name: "Pablo",
				balance: 122
			}
		*/
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

		$scope.save = function(){
			$scope.user.$save();
			$scope.userOriginal = angular.copy($scope.user);
			$scope.user = null;
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
	/*
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
	*/
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

	$scope.save = function(){
		$scope.beverage.$save();
		$scope.beverageOriginal = angular.copy($scope.beverage);
		$scope.beverage = null;
	}

	$scope.edited = function(){
		return !angular.equals($scope.beverage, $scope.beverageOriginal);
	}

	$scope.editInventory = function(beverage){
		$scope.beverage = beverage;
		$scope.beverageOriginal = angular.copy(beverage);
	}

	$scope.addInventory = function(){
		$scope.beverage = new Beverage();
	}
}]);


app.controller("TransactionsController", ["$scope", "$resource", "$http", function($scope, $resource, $http){
	//fill with data for example
    
	$scope.transactions = [
	/*
		{
			id: 1,
			date: "2016-01-17 19:50:10",
			value: 15,
			user_id: 1,
			element_id: 1,			
		},
		{
			id: 1,
			date: "2016-01-17 23:00:00",
			value: 15,
			user_id: 1,
			element_id: 2,
		}
	s*/
	];


	var Transaction = $resource(APP_HOST + '/transactions/:transaction_id',
		{transaction_id:'@id'}
	);

	$http.get(APP_HOST + '/transactions').then(function(response){
		var data = response.data;
		var transactions = [];
		for(var i in data){
			transactions.push(new Transaction(data[i]));
		}
		$scope.transactions = transactions;
	});
	

}]);

app.controller('LoginController', ['$scope','AuthenticationService', function($scope, AuthenticationService){
	
	$scope.login = function(){
		$scope.dataLoading = true;
		AuthenticationService.SetCredentials($scope.username, $scope.password);
		$scope.dataLoading = false;
		/*
            AuthenticationService.Login($scope.username, $scope.password, function (response) {
                if (response.success) {
                    AuthenticationService.SetCredentials($scope.username, $scope.password);
                    $location.path('/');
                } else {
                    $scope.error = response.message;
                    $scope.dataLoading = false;
                }
            });
        */
	};
}]);

app.factory('AuthenticationService',
    ['Base64', '$http', '$cookieStore', '$rootScope', '$timeout',
    function (Base64, $http, $cookieStore, $rootScope, $timeout) {
        var service = {};

        service.Login = function (username, password, callback) {
                     
            $timeout(function () {
                var response = { success: username === 'test' && password === 'test' };
                if (!response.success) {
                    response.message = 'Username or password is incorrect';
                }
                callback(response);
            }, 1000);


            /* Use this for real authentication
             ----------------------------------------------*/
            //$http.post('/api/authenticate', { username: username, password: password })
            //    .success(function (response) {
            //        callback(response);
            //    });

        };

        service.SetCredentials = function (username, password) {
            var authdata = Base64.encode(username + ':' + password);

            $rootScope.globals = {
                currentUser: {
                    username: username,
                    authdata: authdata
                }
            };

			$http.defaults.headers.common = {"Access-Control-Request-Headers": "accept, origin, authorization"};
            $http.defaults.headers.common['Authorization'] = 'Basic ' + authdata; // jshint ignore:line
            $cookieStore.put('globals', $rootScope.globals);
        };
        
        service.ClearCredentials = function () {
            $rootScope.globals = {};
            $cookieStore.remove('globals');
            $http.defaults.headers.common.Authorization = 'Basic ';
        };
		
        return service;
}]);


app.factory('Base64', function() {
    var keyStr = 'ABCDEFGHIJKLMNOP' +
            'QRSTUVWXYZabcdef' +
            'ghijklmnopqrstuv' +
            'wxyz0123456789+/' +
            '=';
    return {
        encode: function (input) {
            var output = "";
            var chr1, chr2, chr3 = "";
            var enc1, enc2, enc3, enc4 = "";
            var i = 0;

            do {
                chr1 = input.charCodeAt(i++);
                chr2 = input.charCodeAt(i++);
                chr3 = input.charCodeAt(i++);

                enc1 = chr1 >> 2;
                enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
                enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
                enc4 = chr3 & 63;

                if (isNaN(chr2)) {
                    enc3 = enc4 = 64;
                } else if (isNaN(chr3)) {
                    enc4 = 64;
                }

                output = output +
                        keyStr.charAt(enc1) +
                        keyStr.charAt(enc2) +
                        keyStr.charAt(enc3) +
                        keyStr.charAt(enc4);
                chr1 = chr2 = chr3 = "";
                enc1 = enc2 = enc3 = enc4 = "";
            } while (i < input.length);

            return output;
        },

        decode: function (input) {
            var output = "";
            var chr1, chr2, chr3 = "";
            var enc1, enc2, enc3, enc4 = "";
            var i = 0;

            // remove all characters that are not A-Z, a-z, 0-9, +, /, or =
            var base64test = /[^A-Za-z0-9\+\/\=]/g;
            if (base64test.exec(input)) {
                alert("There were invalid base64 characters in the input text.\n" +
                        "Valid base64 characters are A-Z, a-z, 0-9, '+', '/',and '='\n" +
                        "Expect errors in decoding.");
            }
            input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

            do {
                enc1 = keyStr.indexOf(input.charAt(i++));
                enc2 = keyStr.indexOf(input.charAt(i++));
                enc3 = keyStr.indexOf(input.charAt(i++));
                enc4 = keyStr.indexOf(input.charAt(i++));

                chr1 = (enc1 << 2) | (enc2 >> 4);
                chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
                chr3 = ((enc3 & 3) << 6) | enc4;

                output = output + String.fromCharCode(chr1);

                if (enc3 != 64) {
                    output = output + String.fromCharCode(chr2);
                }
                if (enc4 != 64) {
                    output = output + String.fromCharCode(chr3);
                }

                chr1 = chr2 = chr3 = "";
                enc1 = enc2 = enc3 = enc4 = "";

            } while (i < input.length);

            return output;
        }
    };
});