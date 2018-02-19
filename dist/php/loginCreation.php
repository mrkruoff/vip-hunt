<?php
ini_set('display_erros', 'On');
$mysqli=new mysqli("oniddb.cws.oregonstate.edu", "behmerl-db", "kydsTsEbE8LP0z88", "behmerl-db");
if($mysqli->connect_errno)
{
    echo "Connection error " . $mysqli->connect_errno . " " . $mysqli->connect_error;

}

if(empty($stringvar))
{

}

if(!($stmt = $mysqli->prepare("INSERT INTO UserAuthentication (user_email, user_password)VALUES(?, ?)")))
{
    echo "Connection error " . $stmt->errno . " " . $stmt->error;
}

if(!($stmt->bind_param("ss", $_POST['userid'], $_POST['psw'])))
{
    echo "Bind failed " . $stmt->errno . " " . $stmt->error;
}

if(!$stmt->execute())
{
    echo "Execute failed " . $stmt->errno . " " . $stmt->error;

}
else
{
    echo "Creditenials";
}


echo "credentials created!!!!!";
?>
