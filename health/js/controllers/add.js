function addCtrl($scope, $http, localStorageService, $window){
	$scope.name='aaa';

	$scope.info={};
	$scope.successmessage=false;
	$scope.successmsg='';	
	$scope.errormessage=false;
	$scope.errormsg='';

	$scope.dateDisable=false;
	$scope.HOST = 'api/index.php?api=add';


	$scope.ok=function(){
		alert('Hi');
	}

	$scope.submitForm=function(){
		//console.log(angular.toJson($scope.info));
		$scope.loader=true;
		$http({
		 	method : "POST",
		   // url : "test.enovate-it.com:3000/renestoffer",
		    url :  $scope.HOST,
		    //"192.168.12.98:3000/renestoffer",
		    data : angular.toJson($scope.info),
		    headers : {
		        'Content-Type' : 'application/json'
		    }
		}).success(function(response,status) {
			$scope.successmessage=true;
			$scope.successmsg='Record added successfully';
			$scope.loader=false;
			window.location.href="#/home";

		}).error(function(response,status){
			$scope.loader=false;
			$scope.successmessage=true;
			$scope.successmsg='Error';
		});
	}


	$scope.getCurrentDate=function(){
		var today = new Date();
		var minute = moment(today).get('minute');
		//minute = minute + 10;
		today = moment(today).minute(minute).format("YYYY-MM-DD HH:m:ss");
		$scope.info.create_date=today;
		//$('#create_date').datetimepicker({  minDate:new Date()});

		$('#create_date').datetimepicker({
			format : "yyyy-mm-dd hh:ii:ss",
			autoclose : true,
			todayBtn : true,
			pickerPosition : "bottom-left",
			minDate:new Date()
		});
		//disabled="true"
	}

	//$scope.getCurrentDate();

	$scope.cancel=function(){
		window.location.href="#/home";
	}
}