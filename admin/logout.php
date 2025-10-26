<?php
session_start();
unset($_SESSION['admin_user']);
session_destroy();
header('Location: /web_jasa/admin/login.php');
exit;
