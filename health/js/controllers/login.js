/*
 * Login Controller
 */
function LoginCtrl($scope, localStorageService, $location, $window) {
	
	$scope.user={};
	$scope.successmessage=false;
    $scope.successmsg='';   
    $scope.errormessage=false;
    $scope.errormsg='';

	$scope.login=function(){
		$scope.loader=true;
		if(($scope.user.userName==undefined || $scope.user.userName=='') && ($scope.user.password=='' || $scope.user.password==undefined)){
			$scope.errormsg="Username and password not blank";
		}

		if($scope.user.userName=='admin' && $scope.user.password=='admin' ){
			// localStorageService.set('loginStatus',true);
			localStorage.setItem('loginStatus',true);
			window.location.href="#/home";
		}else{
			$scope.errormessage=true;
			$scope.errormsg="Invalid username or password";
			return;
		}
		$scope.loader=false;
	}
}
