<?php
$address = "185.149.103.78"; // localhost
$port = 504;// rand(1000,2000);

$sock = socket_create(AF_INET, SOCK_STREAM, SOL_TCP);

if (($sock = socket_create(AF_INET, SOCK_STREAM, SOL_TCP)) === false) {
    echo "socket_create() failed: reason: " . socket_strerror(socket_last_error());
}

if (!socket_bind($sock, $address, $port)) {
    echo "socket_bind() failed: reason: " . socket_strerror(socket_last_error($sock));
}

if (socket_listen($sock, 5) === false) {
    echo "socket_listen() failed: reason: " . socket_strerror(socket_last_error($sock));
}

echo "Listen port: $port \n";
while (true) {
        // socket tarafına gelen talepleri kabul et
        if (($msgsock = socket_accept($sock)) === false) {
            echo "socket_accept() failed: reason: " . socket_strerror(socket_last_error($sock));
            break;
        }

        while (true) {
            echo "birisi bağlandı";
            // mesajı değişkene al
                if (false === ($buf = socket_read($msgsock, 2048, PHP_NORMAL_READ))) {
                    
                    //echo "socket_read() failed: reason: " . socket_strerror(socket_last_error($msgsock));
                    break 2;
                  //  continue;
                }
            
            // gelen mesajı ekrana yazdıralım
                echo "Gelen mesaj : " . $buf . "\n";
                socket_write($msgsock, $buf, strlen($buf));
        

            
        }
}