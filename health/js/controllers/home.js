
function HomeCtrl($scope, $http, $rootScope, localStorageService, $location, $window,$filter){
	// init
    $scope.sort = {       
        sortingOrder : 'id',
        reverse : false
    };
    
    $scope.gap = 5;
    
    $scope.successmessage=false;
    $scope.successmsg='';   
    $scope.errormessage=false;
    $scope.errormsg='';

    //For api call
    $scope.startIndex=0;
    $scope.limit=10;
    $scope.perPageItem = 10;
    $scope.allItems = [];

    //For pagination
    $scope.filteredItems = [];
    $scope.groupedItems = [];
    $scope.itemsPerPage = 10;
    $scope.pagedItems = [];
    $scope.currentPage = 0;
   	$scope.items = [];
   	$scope.totalItems = 15719;
   	$scope.loader=false;

    $scope.HOST = 'api/index.php?api=';
    $scope.GET_URL = 'list';
    //'test.enovate-it.com:3000/renestoffer?select=id,uniquedocid,kemisk_navn,create_date,einecs_nr&order=id.desc';

    $scope.DELETE_URL = 'delete&id='; //'test.enovate-it.com:3000/renestoffer?id=eq.';

    $scope.SEARCH_URL = 'search';
    //'test.enovate-it.com:3000/rpc/searchfun';

	$scope.getInfo=function(){
		var noOfRecord = Math.abs($scope.perPageItem - 1) ;

        var startIndex = 0;	
        /*if($scope.currentPage!=0){
        	var startIndex = Math.abs((noOfRecord - $scope.perPageItem) );	
        }*/
        $scope.items = [];
        $scope.allItems = [];
        $scope.pagedItems = [];
        $scope.loader=true;
        $http({
		 	method : "GET",
		    url : $scope.HOST + $scope.GET_URL,
		    //data : angular.toJson(data),
		    headers : {
		        'Content-Type' : 'application/json',
		        'Range': startIndex + '-' + noOfRecord
		    }
		}).success(function(response,status,headers) {
			var result = angular.fromJson(response['data'])
			for(i=0;i<result.length;i++){
			 	$scope.items.push(result[i]);
			 	$scope.allItems.push(result[i]);
			}

			localStorage.setItem('allItems',angular.toJson($scope.allItems));
			$scope.currentPage = 0;
			$scope.pagedItems[$scope.currentPage]=$scope.items;
			$scope.gap = 2;
			var range = headers('Content-Range');
			var rangeArr = range.split('/');
			$scope.totalItems = rangeArr[1];

			localStorage.setItem('startIndex',startIndex);
			localStorage.setItem('noOfRecord',noOfRecord);

			$scope.loader=false;

		}).error(function(response,status){
			alert('No record found');
			$scope.loader=false;
		});
	}

	$scope.getInfo();

    var searchMatch = function (haystack, needle) {
        if (!needle) {
            return true;
        }
        return haystack.toLowerCase().indexOf(needle.toLowerCase()) !== -1;
    };

    // init the filtered items
    $scope.search = function () {
        $scope.filteredItems = $filter('filter')($scope.items, function (item) {
            for(var attr in item) {
                if (searchMatch(item[attr], $scope.query))
                    return true;
            }
            return false;
        });
        // take care of the sorting order
        if ($scope.sort.sortingOrder !== '') {
            $scope.filteredItems = $filter('orderBy')($scope.filteredItems, $scope.sort.sortingOrder, $scope.sort.reverse);
        }
        $scope.currentPage = 0;
        // now group by pages
        $scope.groupToPages();
    };
    
  
    // calculate page in place
    $scope.groupToPages = function () {
        $scope.pagedItems = [];
        
        for (var i = 0; i < $scope.filteredItems.length; i++) {
            if (i % $scope.itemsPerPage === 0) {
                $scope.pagedItems[Math.floor(i / $scope.itemsPerPage)] = [ $scope.filteredItems[i] ];
            } else {
                $scope.pagedItems[Math.floor(i / $scope.itemsPerPage)].push($scope.filteredItems[i]);
            }
        }
    };
    
    $scope.range = function (size,start, end) {
        var ret = [];        
        console.log(size,start, end);
                      
        if (size < end) {
            end = size;
            start = size-$scope.gap;
        }
        for (var i = start + 1; i < end; i++) {
            ret.push(i);
        }        
         console.log(ret);        
        return ret;
    };
    
    $scope.prevPage = function () {
        if ($scope.currentPage > 0) {
	        $scope.currentPage--;
        }
    };
    
    $scope.nextPage = function () {
        if ($scope.currentPage <= $scope.pagedItems.length - 1) {
        //if($scope.currentPage == $scope.totalItems/10){
          	$scope.currentPage++;
	        //call api
	        //var start=localStorage.getItem('startIndex');
			var end=localStorage.getItem('noOfRecord');

			var noOfRecord = 9;
			var startIndex = 0;
			if(end != undefined){
				noOfRecord = parseInt(end) + parseInt($scope.limit);
				startIndex = parseInt(end) + parseInt(1);
			}
			$scope.loader=true;

	        $http({
			 	method : "GET",
			    url : $scope.HOST + $scope.GET_URL,
			    //data : angular.toJson(data),
			    headers : {
			        'Content-Type' : 'application/json',
			        'Range': startIndex + '-' + noOfRecord
			    }
			}).success(function(response,status,headers) {
				var result = angular.fromJson(response['data'])

				var allItemsArr= angular.fromJson(localStorage.getItem('allItems'));

				if(allItemsArr != undefined){
					$scope.allItems = allItemsArr;
				}

				var items = [];
				for(i=0;i<result.length;i++){
				 	//$scope.items.push(result[i]);
				 	items.push(result[i]);
				 	$scope.allItems.push(result[i]);
				}				

				localStorage.setItem('allItems',angular.toJson($scope.allItems));
				$scope.pagedItems[$scope.currentPage] = items;
				if( $scope.pagedItems.length > 5){
					$scope.gap = 5;
				}else{
					$scope.gap = $scope.pagedItems.length + 1;
				}
				
				//$scope.currentPage = $scope.pagedItems.length / 10;
				var range = headers('Content-Range');
				var rangeArr = range.split('/');
				$scope.totalItems = rangeArr[1];

				localStorage.setItem('startIndex',startIndex);
				localStorage.setItem('noOfRecord',noOfRecord);

				$scope.loader=false;
			}).error(function(response,status){
				alert('No record found');
				$scope.loader=false;
			});

			

		}

    };
    
    $scope.setPage = function () {
        $scope.currentPage = this.n;
    };

    // functions have been describe process the data for display
    $scope.search();

    $scope.editInfo=function(id){
        localStorage.setItem('id',id);
        window.location.href="#/update";
    }

    $scope.deleteInfo=function(id){
        var ret=window.confirm('Are you sure want to logout?');
        if(ret==true)
        {       
            $scope.loader=true;
            $http({
                method : "DELETE",
                url : $scope.HOST + $scope.DELETE_URL + id,            
                headers : {
                    'Content-Type' : 'application/json'
                }
            }).success(function(response,status,headers) {          
                $scope.loader=false;
                $scope.getInfo();
                
            }).error(function(response,status){
                $scope.loader=false;
                $scope.successmessage=true;
                $scope.successmsg='No record found';

                window.location.href="#/home";
            });
        }else{
            return;
        }
    }

    $scope.searchData=function(){
        var searchStr=$scope.searchString;

        if(searchStr == '' || searchStr == undefined){
            $scope.errormessage=true;
            $scope.errormsg = 'Invalid search';
            return false;
        }

        $scope.errormessage=false;

        $scope.items = [];
        $scope.allItems = [];
        $scope.pagedItems = [];
        $scope.loader=true;

        var data = {};
        data['searchfield']=searchStr;

        $http({
            method : "POST",
            url : $scope.HOST + $scope.SEARCH_URL,
            data : angular.toJson(data),
            headers : {
                'Content-Type' : 'application/json'
            }
        }).success(function(response,status,headers) {
            var result = angular.fromJson(response['data'][0]['searchfun'])

            if(result == '' || result == undefined){
                $scope.errormessage=true;
                $scope.errormsg = 'No record found';
                $scope.loader=false;
                return false;
            }

            for(i=0;i<result.length;i++){
                $scope.items.push(result[i]);
                $scope.allItems.push(result[i]);
            }

            // localStorage.setItem('allItems',angular.toJson($scope.allItems));
            $scope.currentPage = 0;
            $scope.pagedItems[$scope.currentPage]=$scope.items;
            $scope.gap = 2;
            $scope.loader=false;
            $scope.searchString = searchStr;

        }).error(function(response,status){
            //alert('No record found');
            $scope.errormessage=true;
            $scope.errormsg = 'No record found';
            $scope.loader=false;
        });
    }

}

