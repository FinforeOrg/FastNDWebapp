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
	
	<script>
	<?php
		$feed_account_id = $_GET["feed_account_id"];
		if($feed_account_id) {
	?>				
		window.opener.postMessage('<?php echo $feed_account_id ?>', '*');		
	<?php } ?>
		window.close();	
	</script>

</body>
</html>
