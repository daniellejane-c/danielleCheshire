<?php

set_include_path('.:/usr/share/php:/var/www/dl/htdocs');

require 'assets/vendor/PHPMailer/src/Exception.php';
require 'assets/vendor/PHPMailer/src/PHPMailer.php';
require 'assets/vendor/PHPMailer/src/SMTP.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;


error_reporting(E_ALL);
ini_set('display_errors', 1);

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $name = $_POST['name'];
    $email = $_POST['email'];
    $subject = $_POST['subject'];
    $message = $_POST['message'];

    // Validate input
    if (empty($name) || empty($email) || empty($subject) || empty($message)) {
        echo "All fields are required";
    } else {
        try {
            // Send email to recipient
            $mailToRecipient = new PHPMailer(true);
            //Server settings
            $mailToRecipient->isSMTP();
            $mailToRecipient->Host       = 'smtp.gmail.com'; // SMTP server
            $mailToRecipient->SMTPAuth   = true;
           //hidden for security 
           $mailToRecipient->Username   = ''; // SMTP username 
            //hidden for security
            $mailToRecipient->Password   = '';   // SMTP password
            $mailToRecipient->SMTPSecure = 'tls';
            $mailToRecipient->Port       = 587; // TCP port to connect to, use 465 for `PHPMailer::ENCRYPTION_SMTPS` above

            //Recipients
            //hidden for security
            $mailToRecipient->setFrom('', ''); // Your email and name
            $mailToRecipient->addAddress(''); // Add a recipient (you)

            // Content
            $mailToRecipient->isHTML(true); // Set email format to HTML
            $mailToRecipient->Subject = $subject;  /*. md5(rand())*/
            $mailToRecipient->Body    = "Name: $name <br>Email: $email <br>Message: $message";

	    $mailToRecipient->send(); 

           
            echo "success";
        } catch (Exception $e) {
            echo "Mailer Error: " . $e->getMessage();
        }
    }
}
?>
