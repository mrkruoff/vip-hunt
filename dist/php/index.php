<?php
ini_set('display_erros', 'On');
$mysqli=new mysqli("oniddb.cws.oregonstate.edu", "behmerl-db", "kydsTsEbE8LP0z88", "behmerl-db");
if($mysqli->connect_errno)
{
    echo "Connection error " . $mysqli->connect_errno . " " . $mysqli->connect_error;

}

echo "Connection successful";

?>

<!DOCTYPE html>

<head>


<script type="text/javascript">

/*this clears the contents of what the user entered*/

function submit_form() {
    document.cred_create.submit();
    document.cred_create.reset(); 
}

function required()
{
    var empt = document.forms["cred_create"]["psw"].value;
    var emptTwo = document.forms["cred_create"]["userid"].value;
    if (empt == "" || emptTwo=="")
    {
        alert("Please input a Value");
        return false;
    }
    else 
    {
        return true; 
    }
}

</script>

</head>

<html>
<body>


<!-- Two different forms - one for log in and one for creating an account -->

<!-- user name and password creation - need to include the hashing method to protect info -->

<form name="cred_create" method="post" action="loginCreation.php" target="index.php" onsubmit="required()">
User name:<br>
<input type="text" name="userid" required>
<br>
User password:<br>
<input type="password" name="psw" required><br><br>
<input type="submit" value="Create Account" onclick="required();"> 
</form>

<!-- user name and password check and verification -->

<form method="post" action="loginCheck.php">
User name:<br>
<input type="text" name="userid" required>
<br>
User password:<br>
<input type="password" name="psw" required><br>
<input type="submit" value="Log In" >
</form>


</body>
</html>
