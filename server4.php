<?php
$port = 8000;
$socket = stream_socket_server("tcp://185.149.103.78:$port", $errno, $errstr);
echo "listen port: $port \n";
if (!$socket) {
  echo "$errstr ($errno)<br />\n";
} else {
  while ($conn = stream_socket_accept($socket)) {
    echo "baglandi \n";
    fwrite($conn, 'The local time is ' . date('n/j/Y g:i a') . "\n");
    fclose($conn);
  }
  fclose($socket);
}
?>