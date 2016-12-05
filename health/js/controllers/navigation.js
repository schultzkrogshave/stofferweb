/*
 * Navigation Controller
 */
function NavCtrl($scope, $location, localStorageService) {
	// $scope.navClass = function (page) {
 //        var currentRoute = $location.path().substring(1) || 'home';
 //        return page === currentRoute ? 'active' : '';
 //    };
    $scope.APP_NAME = 'Health';

    var status=localStorage.getItem('loginStatus');

	if(status !=undefined && status){
		//alert('Login');
		$scope.loggedInUser=true;
	}else{
		window.location.href="#/";
	}

	$scope.logout=function(){
		var ret=window.confirm('Are you sure want to logout?');
		if(ret==true)
		{		
			localStorage.clear();
			window.location.href="#/";
		}else{
			return;
		}
	}

   // $scope.loggedInUser = localStorageService.get('usr');
    // $scope.logout = authenticationSvc.logout;   
}
