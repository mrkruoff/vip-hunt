

<?php
$message="";
$conn = mysqli_connect("oniddb.cws.oregonstate.edu", "behmerl-db", "kydsTsEbE8LP0z88", "behmerl-db");


$result = mysqli_query($conn,"SELECT * FROM UserAuthentication WHERE user_email='" . $_POST["userid"] . "' 
    AND user_password = '". $_POST["psw"]."'");
$count  = mysqli_num_rows($result);
if($count==0) {
    echo  "Invalid Username or Password!";
} else {
    echo  "You are successfully authenticated!";
}
?>
