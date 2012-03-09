<?php
/*
 * Finfore.net Web App Proxy
 * Used by the Finfore.net Web App to make cross-domain ajax requests.
 * 
 */
error_reporting(0);
$handle = fopen($_REQUEST[urldecode('url')], "r");

if ($handle) {
    while (!feof($handle)) {
        $buffer = fgets($handle, 4096);
        echo $buffer;
    }
    fclose($handle);
}
?>
