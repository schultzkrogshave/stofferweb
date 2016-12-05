var C360API = angular.module('C360API', ["ngRoute", "ui.bootstrap", "LocalStorageModule", "angularUtils.directives.dirPagination", "flow", "naif.base64", "ui.date","textAngular"]).config(c360api);

function c360api($routeProvider) {
	$routeProvider.when('/', {
		templateUrl : 'partials/loginTemplate.html',
		controller : 'LoginCtrl'
	}).when('/shops', {
		templateUrl : 'partials/shopsTemplate.html',
		controller : 'ShopsCtrl',
		resolve : {	//Added By YS : 27-3-2015
				    authShop: ["$q", "authenticationSvc", function($q, authenticationSvc) {

				 	  var loginInfo = authenticationSvc.getLoginInfo();
				      if (loginInfo) {
				        return $q.when(loginInfo); // goes to $routeChangeSuccess
				      } else {
				        return $q.reject({ authenticated: false }); // goes to $routeChangeError
				      }
				    }]
				  }
	}).when('/shopdetail/:shopid/:isbrand', {
		templateUrl : 'partials/shopDetailTemplate.html',
		controller : 'ShopDetailCtrl',
		resolve : {	//Added By YS : 27-3-2015
				    authDetail: ["$q", "authenticationSvc", function($q, authenticationSvc) {

				 	  var loginInfo = authenticationSvc.getLoginInfo();
				      if (loginInfo) {
				        return $q.when(loginInfo); // goes to $routeChangeSuccess
				      } else {
				        return $q.reject({ authenticated: false }); // goes to $routeChangeError
				      }
				    }]
				  }
	}).when('/activate/:shopid/:token', {
		templateUrl : 'partials/activateTemplate.html',
		controller : 'ActivateCtrl'/*,
		resolve : {	//Added By YS : 27-3-2015
				    authActive: ["$q", "authenticationSvc", function($q, authenticationSvc) {

				 	  var loginInfo = authenticationSvc.getLoginInfo();
				      if (loginInfo) {
				        return $q.when(loginInfo); // goes to $routeChangeSuccess
				      } else {
				        return $q.reject({ authenticated: false }); // goes to $routeChangeError
				      }
				    }]
				  }*/
	}).when('/test', {
		templateUrl : 'partials/testTemplate.html',
		controller : 'TestCtrl'
	}).when('/testd', {
		templateUrl : 'partials/testlistSubscribersTemplate.html',
		controller : 'TestListSubscribersCtrl'
	}).when('/testdd', {
		templateUrl : 'partials/2testlistSubscribersTemplate.html',
		controller : 'BTestListSubscribersCtrl'
	}).when('/testp/:shopid', {
		templateUrl : 'partials/testTemplate2.html',
		controller : 'ShopDetail2Ctrl'
	})

}
//$httpProvider.defaults.headers.common["X-Requested-With"] = "XMLHttpRequest"
C360API.run(function($http, $rootScope, $location, ConstantsE, ConstantsR) {
  $http.defaults.headers.common["X-Requested-With"] = 'XMLHttpRequest';
  $rootScope.Constants = ConstantsE;
  $rootScope.changeFile = function(translate)
  {
  	if(translate)
  	{
  		$rootScope.Constants = ConstantsR;
  	}
  	else
  	{
  		 $rootScope.Constants = ConstantsE;
  	}
  } 
 
  // localStorageService.add('apiurl', 'http://brands.triponx.com/');
  $rootScope.$on("$routeChangeError", function(event, current, previous, eventObj) {
    if (eventObj.authenticated === false) {
      $location.path("/");
    }
  });
});
// C360API.run(function($rootScope, localStorageService) {
// 	localStorageService.add('apiurl', 'http://brands.triponx.com/');
// });

C360API.factory("ServiceConstants", function()
{
	return{
			basePath : 'http://brands.triponx.com/',
			reqImgHeight : '480',
			reqImgWidth : '640'
	}

});
C360API.factory("authenticationSvc", function($http, $q, $location, localStorageService, ServiceConstants) 
{
	var apiurl = ServiceConstants.basePath;
	var logindata = {};
	var loginInfo;

  	function login(userName, password) {
    var deferred = $q.defer();

    logindata.login = userName;
	logindata.pass = password;

	$http({
			method : 'POST',
			url : apiurl + 'login/enter/',
			data : {
				login : logindata.login,
				pass : logindata.pass
			},
			headers : {
				'Content-Type' : 'application/x-www-form-urlencoded'
			},
			transformRequest : function(obj) {
				var str = [];
				for (var p in obj)
				str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
				return str.join("&");
			},
		}).success(function(response) {
			if (response) {
				if(response.success){				 
				 localStorageService.add("token",response.token);				 
				 localStorageService.add("usr",response.usr);
				 loginInfo = {
					        token: response.token,
					        userName: response.usr
					       };					
				localStorageService.add('loginInfo', JSON.stringify(loginInfo));
				// localStorageService.add('loggedInUser', usr);
				deferred.resolve(response);
				}else if(response.success==false){				 
				 	deferred.reject('Invalid credentials');
				}else {
					console.log("No Error Code");
				 } 
			}
		});
 
    return deferred.promise;
  }

  function getLoginInfo()
  {
  	return loginInfo;
  }

  function logout()
  {
  	localStorageService.clearAll();
    // loginInfo = null;
    $location.path("/");
  };

  function init() {
        if (localStorageService.get('loginInfo')) {
            loginInfo = JSON.parse(localStorageService.get('loginInfo'));
        }
    }
    init();

  return {
  	login: login,
  	getLoginInfo: getLoginInfo,
    logout: logout
  };

});

C360API.factory('dataService', function($http) {

	var getData = function(url, data) {

		return $http({
			method : "GET",
			url : url,
			params : data
		}).then(function(result) {
			return result;
		});
	};
	return {
		getData : getData
	};
});
C360API.directive("ngFileSelect", function() {

	return {
		link : function($scope, el) {
			el.bind("change", function(e) {
				angular.forEach((e.srcElement || e.target).files, function(value, key) {
					$scope.getFile(value);
				});
			})
		}
	}
})
C360API.directive("ngFileType", function() {
		return {
			link: function(scope, el) {
				console.log(scope);
	            $(el).bind('change', function() {
	            	var arr=this.files[0].type.split('/');	            	
	            	var fileType=arr[1];
	            	//alert(this.files[0].type);
	            	//setTimeout(function () { 
	            		scope.$apply(function () { 
	            		if(fileType=='gif' || fileType=='jpg'||fileType=='jpeg'||fileType=='png'){
		            		// alert(1);
		            		scope.fileTypeMessage=false;
		            	}else{
		            		// alert(2);		            		
		            		scope.fileTypeMessage=true;
		            	}
		            	alert(scope.fileTypeMessage);
	            	}); 
	            //}, 500);	            	
	              //alert('File type:' + this.files[0].type);
	          });
	        }
		}
	})


C360API.factory('fileReader', function($q, $log) {
	var onLoad = function(reader, deferred, scope) {
		return function() {
			scope.$apply(function() {
				deferred.resolve(reader.result);
			});
		};
	};

	var onError = function(reader, deferred, scope) {
		return function() {
			scope.$apply(function() {
				deferred.reject(reader.result);
			});
		};
	};

	var onProgress = function(reader, scope) {
		return function(event) {
			scope.$broadcast("fileProgress", {
				total : event.total,
				loaded : event.loaded
			});
		};
	};

	var getReader = function(deferred, scope) {
		var reader = new FileReader();
		reader.onload = onLoad(reader, deferred, scope);
		reader.onerror = onError(reader, deferred, scope);
		reader.onprogress = onProgress(reader, scope);
		return reader;
	};

	var readAsDataURL = function(file, scope) {
		var deferred = $q.defer();

		var reader = getReader(deferred, scope);
		reader.readAsDataURL(file);

		return deferred.promise;
	};
	return {
		readAsDataUrl : readAsDataURL
	};

	
});
