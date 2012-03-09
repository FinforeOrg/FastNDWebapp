<!doctype html>
<html lang="en">
<head>
	<meta charset="utf-8" />	
	<title>Finfore.net</title>
	<meta http-equiv="X-UA-Compatible" content="chrome=1" />
	<meta name="viewport" content="width=device-width, initial-scale=1" />
	<meta name="apple-mobile-web-app-capable" content="yes" />
	<style>
		html {
			height: 100%;
			width: 100%;			
			background: #f0f0f0;
			background-image: linear-gradient(top, #eeeeee, #dddddd);
			background-image: -moz-linear-gradient(top, #eeeeee, #dddddd);
			background-image: -webkit-gradient(linear,left top,left bottom,	color-stop(0, #eeeeee),	color-stop(1, #dddddd));			
			font-family: sans-serif;
			color: #333;
			text-align: center;
		}
	</style>
</head>
<body>
	
	You are being redirected to Finfore.net..
	
	<?php		
		// first time login?
		$update = 'false';
		if($_GET['update_profile']) {
			$update = $_GET['update_profile'];
		};
		
		// get auth_token
		$token = '';
		if(isset($_GET['auth_token'])) {
			$token = $_GET['auth_token'];
		};
		
		// get auth_secret
		$secret = '';
		if(isset($_GET['auth_secret'])) {
			$secret = $_GET['auth_secret'];
		};
		
		// get user _id
		$id = '';
		if(isset($_GET['user_id'])) {
			$id = $_GET['user_id'];
		};
		
		$handle = fopen('http://api.finfore.net/users/' . $id . '.json?auth_token=' . $token . '&auth_secret=' . $secret, "r");
		
		$users = '{}';
		if ($handle) {
			$users = fgets($handle);
			fclose($handle);
		}
	?>
	
	
	
	<script>
		// get the vars from PHP
		// should we update the profile?
		var updateProfile = <?php echo $update ?> + '';
		// user details
		var userResponse = <?php echo $users ?>;

		if(userResponse) {
			localStorage.setItem('user', JSON.stringify(userResponse));
			localStorage.setItem('updateProfile', updateProfile);
		};
		
		window.location = 'http://' + window.location.hostname + '/';
	</script>

</body>
</html>
