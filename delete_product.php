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
// تضمين ملف الإعدادات والاتصال بقاعدة البيانات مع إعدادات CORS
include_once 'config.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // استقبال جسم الطلب المشفر بصيغة JSON
    $input = json_decode(file_get_contents('php://input'), true);
    
    if (isset($input['id'])) {
        $id = $conn->real_escape_string($input['id']);
        
        $query = "DELETE FROM products WHERE id = '$id'";
                  
        if ($conn->query($query)) {
            echo json_encode(["status" => "success", "message" => "تم حذف المنتج بنجاح"], JSON_UNESCAPED_UNICODE);
        } else {
            http_response_code(500);
            echo json_encode(["status" => "error", "message" => "فشل حذف المنتج: " . $conn->error], JSON_UNESCAPED_UNICODE);
        }
    } else {
        http_response_code(400);
        echo json_encode(["status" => "error", "message" => "معرف المنتج غير محدد"], JSON_UNESCAPED_UNICODE);
    }
} else {
    http_response_code(405);
    echo json_encode(["status" => "error", "message" => "طريقة الطلب غير مسموح بها"], JSON_UNESCAPED_UNICODE);
}
?>
