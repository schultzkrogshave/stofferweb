<?php
require_once 'services.php';

//ini_set ( 'error_reporting', E_ALL );
//ini_set ( 'display_errors', 1 );
if (isset ( $_REQUEST ['api'] ) && $_REQUEST ['api'] != '') {
	$apiName = $_REQUEST ['api'];
	$response = array();
	$success='success';
	$failure='failure';
	
	switch ($apiName) {
		case 'list' :
			$headers = getallheaders ();
			$range = isset ( $headers ['Range'] ) ? $headers ['Range'] : '0-9';			
			$result = getList($range);
			if(!isset($result)){
				$response['status']=$failure;
			}else{
				$response['status']=$success;
			}
			
			$response['data']=$result;
			echo sendJSON($response,$range);
			break;
		case 'add':
			$post = file_get_contents ( "php://input" );
			$data = json_decode($post);
			if(add($data)==true){
				$response['status']=$success;
			}else {
				$response['status']=$failure;
			}			
			echo sendJSON($response);
			break;
			
		case 'delete':			
			if(isset($_GET['id'])){
				$response['status']=$success;
				if(delete($_GET['id']) == false){				
					$response['status']=$failure;
				}
			}else{
				$response['status']=$failure;
				$response['message'] = 'Invalid Id';
			}
			
			echo sendJSON($response);
			
			break;
			
			
		case 'getData' :
			if(isset($_GET['id'])){
				$response['status']=$success;
				$result = getData($_GET['id']);
				if(!isset($result)){
					$response['status']=$failure;
				}else{
					$response['status']=$success;
				}
			}				
			$response['data']=$result;
			echo sendJSON($response);
			break;
		// default:
		
		case 'update':
			$post = file_get_contents ( "php://input" );
			$data = json_decode($post);
			if(isset($_GET['id'])){
				if(update($data,$_GET['id'])==true){
					$response['status']=$success;
				}else {
					$response['status']=$failure;
				}
			}
				
			echo sendJSON($response);
			break;
		
		case 'search':
			$post = file_get_contents ( "php://input" );
			$data = json_decode($post);
			
			$result = search($data);
			if(!isset($result)){
				$response['status']=$failure;
			}else{
				$response['data']=$result;
				$response['status']=$success;
			}
			echo sendJSON($response);
			break;
	}
}

?>
