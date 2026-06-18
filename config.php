<?php
// إجبار السيرفر على إظهار الأخطاء البرمجية إن وجدت
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// التعديل الشامل والذكي لحل مشكلة الـ CORS مع بورت الـ React وبورت الـ Apache حقك
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS, PUT, DELETE");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit(0); // إنهاء الطلب المبدئي لـ CORS بنجاح
}

$host = "localhost";
$user = "root";
$password = "";
$dbname = "db_benaa"; 

// الاتصال بالسيرفر
$conn = new mysqli($host, $user, $password, $dbname);

if ($conn->connect_error) {
    die(json_encode(["status" => "error", "message" => "فشل الاتصال بقاعدة البيانات"], JSON_UNESCAPED_UNICODE));
}

// ضبط الترميز للغة العربية
$conn->set_charset("utf8mb4");
?>