<?php

header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS, PUT, DELETE");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit(0);
}
// ask_consultant.php
include_once 'config.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);
    
    // مطابقة الحقول الحقيقية لجدول consultation_requests في الـ SQL
    if (isset($input['customerName']) && isset($input['customerPhone'])) {
        $customer_name = $conn->real_escape_string($input['customerName']);
        $customer_email = isset($input['customerEmail']) ? $conn->real_escape_string($input['customerEmail']) : '';
        $customer_phone = $conn->real_escape_string($input['customerPhone']);
        $message = $conn->real_escape_string($input['message'] ?? '');
        $consultant_id = isset($input['consultantId']) ? $conn->real_escape_string($input['consultantId']) : null;
        $status = 'Pending';
        
        // تعطيل القيود مؤقتاً لضمان مرونة الإرسال والـ Guest Checkout
        $conn->query("SET FOREIGN_KEY_CHECKS = 0");

        // تصحيح اسم الجدول إلى الاسم الفعلي في القاعدة: consultation_requests
        $query = "INSERT INTO consultation_requests (user_id, consultant_id, name, phone, message, status) 
                  VALUES ('guest', " . ($consultant_id ? "'$consultant_id'" : "NULL") . ", '$customer_name', '$customer_phone', '$message', '$status')";
                  
        if ($conn->query($query)) {
            $conn->query("SET FOREIGN_KEY_CHECKS = 1");
            echo json_encode(["status" => "success", "message" => "تم حفظ طلب الاستشارة بنجاح في النظام مركزي"], JSON_UNESCAPED_UNICODE);
        } else {
            $conn->query("SET FOREIGN_KEY_CHECKS = 1");
            http_response_code(500);
            echo json_encode(["status" => "error", "message" => "فشل حفظ الاستشارة: " . $conn->error], JSON_UNESCAPED_UNICODE);
        }
    } else {
        http_response_code(400);
        echo json_encode(["status" => "error", "message" => "البيانات الأساسية غير مكتملة"], JSON_UNESCAPED_UNICODE);
    }
}
?>