function updateCtrl($scope, $http, localStorageService, $window){
	$scope.name='aaa';

	$scope.info={};
	$scope.successmessage=false;
	$scope.successmsg='';	
	$scope.errormessage=false;
	$scope.errormsg='';

	$scope.dateDisable=false;

	$scope.HOST = 'api/index.php?api=';
    $scope.URL = 'getData&id=';
    $scope.updateUrl='update&id=';

	$scope.ok=function(){
		alert('Hi');
	}

	$scope.submitForm=function(){
		//console.log(angular.toJson($scope.info));
		var id=localStorage.getItem('id');
		$scope.loader=true;
		$http({
		 	method : "PATCH",
		    url : $scope.HOST + $scope.updateUrl + id,
		    //"test.enovate-it.com:3000/renestoffer?id=eq."+id,		
		    data : angular.toJson($scope.info),    
		    headers : {
		        'Content-Type' : 'application/json'
		    }
		}).success(function(response,status,headers) {
			$scope.successmessage=true;
			$scope.successmsg='Record updated successfully';
			$scope.loader=false;
			window.location.href="#/home";			
		}).error(function(response,status){
			$scope.loader=false;
			$scope.successmessage=true;
			$scope.successmsg='Record not found';
		});
	}

	$scope.getInfo=function(){
		var id=localStorage.getItem('id');

		$scope.loader=true;
		$http({
		 	method : "GET",
		    url : $scope.HOST + $scope.URL+ id,
		    //"test.enovate-it.com:3000/renestoffer?id=eq."+id,		    
		    headers : {
		        'Content-Type' : 'application/json'
		    }
		}).success(function(response,status) {			
			$scope.loader=false;
			$scope.info= (response['data'][0] !=undefined) ? response['data'][0] : [];
		}).error(function(response,status){
			$scope.loader=false;
			$scope.successmessage=true;
			$scope.successmsg='No record found';

			window.location.href="#/home";
		});
	}

	$scope.getInfo();

	$scope.cancel=function(){
		window.location.href="#/home";
	}

}