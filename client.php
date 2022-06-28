<?php 
$socket = socket_create(AF_INET, SOCK_STREAM, SOL_TCP);
if(!is_resource($socket)) onSocketFailure("Failed to create socket");
socket_connect($socket, "185.149.103.78", 1988)
        or onSocketFailure("Failed to connect to 185.149.103.78:1984", $socket);
        socket_write($socket, "test");
 ?>