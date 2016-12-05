var POSTGAPP=angular.module('POSTGAPP',["ngRoute", "ui.bootstrap", "LocalStorageModule", "angularUtils.directives.dirPagination", "flow", "naif.base64", "ui.date","textAngular"]).config(postgapp);

var appName = 'postgREST';

function postgapp($routeProvider) {
	$routeProvider.when('/', {
		templateUrl : 'partials/loginTemplate.html',
		controller : 'LoginCtrl',
		resolve : 
			checkLogin()			
	}).when('/home', {
		templateUrl : 'partials/homeTemplate.html',
		controller : 'HomeCtrl',
		resolve : 
			checkLogin()			
		
	}).when('/add', {
		templateUrl : 'partials/addTemplate.html',
		controller : 'addCtrl',
		resolve : 
			checkLogin()
	}).when('/update', {
		templateUrl : 'partials/updateTemplate.html',
		controller : 'updateCtrl',
		resolve : 
			checkLogin()
	})
}


function checkLogin(){
	var redirecturl = window.location.href;
	var url=redirecturl.split('#');	

	var status=localStorage.getItem('loginStatus');

	// if(status != undefined && status == "false" ){
	// 	window.location.href="#/";
	// }else if(status=="true"){
	// 	window.location.href="#/home";
	// }
	if(status == undefined){
		window.location.href="#/";
	}else if(url[1] ==undefined || url == '/'){
		window.location.href="#/home";
	}
}


POSTGAPP.$inject = ['$scope', '$filter'];

POSTGAPP.directive("customSort", function() {
	return {
	    restrict: 'A',
	    transclude: true,    
	    scope: {
	      order: '=',
	      sort: '='
	    },
	    template : 
	      ' <a ng-click="sort_by(order)" style="color: #555555;">'+
	      '    <span ng-transclude></span>'+
	      '    <i ng-class="selectedCls(order)"></i>'+
	      '</a>',
	    link: function(scope) {
	                
	    // change sorting order
	    scope.sort_by = function(newSortingOrder) {       
	        var sort = scope.sort;
	        
	        if (sort.sortingOrder == newSortingOrder){
	            sort.reverse = !sort.reverse;
	        }                    

	        sort.sortingOrder = newSortingOrder;        
	    };
	    
	   
	    scope.selectedCls = function(column) {
	        if(column == scope.sort.sortingOrder){
	            return ('icon-chevron-' + ((scope.sort.reverse) ? 'down' : 'up'));
	        }
	        else{            
	            return'icon-sort' 
	        } 
	    };      
	  }// end link
	}
});