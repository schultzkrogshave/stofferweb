<?php

	$GLOBALS['HOST'] = 'http://test.enovate-it.com:3000';
	function getList($range) {
		$result = array ();
		$serviceUrl = $GLOBALS['HOST'].'/renestoffer?select=id,uniquedocid,kemisk_navn,create_date,einecs_nr&order=id.desc';
		
		$headers = array(
				'Content-Type: application/json',
				'Range: ' . $range
		);
		
		$ch = curl_init ( $serviceUrl );
		curl_setopt ( $ch, CURLOPT_URL, $serviceUrl );
		//curl_setopt ( $ch, CURLOPT_HTTPHEADER, array ('Content-Type: application/json') );
		//curl_setopt ( $ch, CURLOPT_HTTPHEADER, array ('Range: ' . $range ) );
	
		curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
		curl_setopt ( $ch, CURLOPT_RETURNTRANSFER, true );
		$result = curl_exec ( $ch );
		
		$array = json_decode ( $result, true );
		return $array;
	}
	function add($data) {
		$serviceUrl = $GLOBALS['HOST'].'/renestoffer';
		
		$dataString=json_encode($data);
		$headers = array(
				'Content-Type: application/json',
				'Content-Length: ' . strlen($dataString)
		);
		
		$ch = curl_init($serviceUrl);
		curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "POST");
		curl_setopt($ch, CURLOPT_POSTFIELDS, $dataString);
		curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
		
		$result = curl_exec($ch);
		
		if(isset($result) && $result == true){
			return true;
		}else{
			return false;
		}
	}
	
	function delete($id) {
		$serviceUrl = $GLOBALS['HOST'].'/renestoffer?id=eq.'.$id;
			
		$headers = array(
				'Content-Type: application/json'
		);
		
		$ch = curl_init($serviceUrl);
		curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "DELETE");
		//curl_setopt($ch, CURLOPT_POSTFIELDS, $dataString);
		curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
		
		$result = curl_exec($ch);
		
		if(isset($result) && $result == true){
			return true;
		}else{
			return false;
		}
	}

	function getData($id){
		$result = array ();
		$serviceUrl = $GLOBALS['HOST']."/renestoffer?id=eq.".$id;
		
		$headers = array(
				'Content-Type: application/json'
		);
		
		$ch = curl_init ( $serviceUrl );
		curl_setopt ( $ch, CURLOPT_URL, $serviceUrl );
		
		curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
		curl_setopt ( $ch, CURLOPT_RETURNTRANSFER, true );
		$result = curl_exec ( $ch );
		
		$array = json_decode ( $result, true );
		return $array;
	}
	
	function update($data,$id) {
		$serviceUrl = $GLOBALS['HOST'].'/renestoffer?id=eq.'.$id;
	
		$dataString=json_encode($data);
		$headers = array(
				'Content-Type: application/json',
				'Content-Length: ' . strlen($dataString)
		);
	
		$ch = curl_init($serviceUrl);
		curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "PATCH");
		curl_setopt($ch, CURLOPT_POSTFIELDS, $dataString);
		curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
	
		$result = curl_exec($ch);
	
		if(isset($result) && $result == true){
			return true;
		}else{
			return false;
		}
	}
	
	function search($data){
		$result = array ();
		$serviceUrl = $GLOBALS['HOST'].'/rpc/searchfun';
		
		$dataString=json_encode($data);
		$headers = array(
				'Content-Type: application/json',
				'Content-Length: ' . strlen($dataString)
		);
		
		$ch = curl_init($serviceUrl);
		curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "POST");
		curl_setopt($ch, CURLOPT_POSTFIELDS, $dataString);
		curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
		curl_setopt ( $ch, CURLOPT_RETURNTRANSFER, true );
		$result = curl_exec ( $ch );
		
		$array = json_decode ( $result, true );
		return $array;
	}

	function sendJSON($data,$range=false) {
		header ( 'Content-type:application/json' );
		header ( 'Access-Control-Allow-Origin:*' );
		header ( 'Access-Control-Allow-Headers:Origin, X-Requested-With, Content-Type, Accept' );
		
		if($range){
			header ( 'Content-Range:'.$range );
		}
		
		return json_encode ( $data );
	}
?>