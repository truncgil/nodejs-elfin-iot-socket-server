<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
    set_time_limit(3);

    $fp = stream_socket_client("tcp://185.149.103.78:5000", $errno, $errstr);
    if (!$fp) {
    echo "HATA: $errno - $errstr<br />\n";
    } else {
    
            $length = 14;
            if(isset($_GET['l'])) {
                    $length = $_GET['l'];
            }
            
            fwrite($fp, '{"imei":"'.$_GET['imei'] . '","command":"' . $_GET['command'] . '"}');
            try {
                echo implode(unpack("H*", fread($fp, $length)));
                fclose($fp);
            } catch (\Throwable $th) {
                //throw $th;
            }

            usleep(500);
            
        
            
    }



?>