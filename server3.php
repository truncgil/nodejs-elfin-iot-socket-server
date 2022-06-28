<?php

// server.php

$server = stream_socket_server("tcp://185.149.103.78:1957", $errno, $errorMessage);

if($server == false) {
    throw new Exception("Could not bind to socket: $errorMessage");

}

for(;;) {
    $client = @stream_socket_accept($server);

    if($client) {
        stream_copy_to_stream($client, $client);
        fclose($client);
    }
}