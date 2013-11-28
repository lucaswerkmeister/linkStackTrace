<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>linkStacktrace</title>
</head>
<body>
  <p>
    Hi! linkStacktrace will go through a Java stacktrace, search for files in a Github repository and add links to the stacktrace.
  </p>
  <p>
    In order to make the necessary search requests through the Github API, we’ll need to authenticate with your credentials.
    But don’t worry! We don’t need your credentials directly; if you click the link below, Github will give us an OAuth access token.
    We can’t do anything harmful to your profile with this token – it’s only used to make the requests to the Github API.
  </p>
  <?php
     include("./config.php");
     $link = "https://github.com/login/oauth/authorize?client_id=" . CLIENT_ID;
     echo "<a href=\"$link\">Clicky here!</a>";
  ?>
</body>
</html>
