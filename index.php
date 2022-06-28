<?php 
$json_string = json_encode($_POST);
$json_string2 = json_encode($_GET);
$json_string3 = json_encode($_SERVER);

$file_handle = fopen('post.json', 'w');
$file_handle2 = fopen('get.json', 'w');
$file_handle3 = fopen('server.json', 'w');
fwrite($file_handle, $json_string);
fwrite($file_handle2, $json_string2);
fwrite($file_handle3, $json_string3);
fclose($file_handle);
fclose($file_handle2);
fclose($file_handle3);
echo "success";
// For info re: writing files in PHP:
?>