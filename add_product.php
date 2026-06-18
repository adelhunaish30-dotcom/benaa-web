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
    
    if (isset($input['id']) && isset($input['nameAr']) && isset($input['nameEn'])) {
        $id = $conn->real_escape_string($input['id']);
        $name_ar = $conn->real_escape_string($input['nameAr']);
        $name_en = $conn->real_escape_string($input['nameEn']);
        $category = $conn->real_escape_string($input['category']);
        $price = floatval($input['price']);
        $stock = intval($input['stock']);
        $unit_ar = $conn->real_escape_string($input['unitAr']);
        $unit_en = $conn->real_escape_string($input['unitEn']);
        $supplier = $conn->real_escape_string($input['supplier']);
        $image_url = $conn->real_escape_string($input['image']);
        
        $query = "INSERT INTO products (id, name_ar, name_en, category, price, stock, unit_ar, unit_en, supplier, image_url) 
                  VALUES ('$id', '$name_ar', '$name_en', '$category', $price, $stock, '$unit_ar', '$unit_en', '$supplier', '$image_url')
                  ON DUPLICATE KEY UPDATE name_ar = '$name_ar', name_en = '$name_en', category = '$category', price = $price, stock = $stock, unit_ar = '$unit_ar', unit_en = '$unit_en', supplier = '$supplier', image_url = '$image_url'";
                  
        if ($conn->query($query)) {
            echo json_encode(["status" => "success", "message" => "تم حفظ المنتج بنجاح في قاعدة البيانات", "product_id" => $id], JSON_UNESCAPED_UNICODE);
        } else {
            http_response_code(500);
            echo json_encode(["status" => "error", "message" => "فشل حفظ المنتج في قاعدة البيانات: " . $conn->error], JSON_UNESCAPED_UNICODE);
        }
    } else {
        http_response_code(400);
        echo json_encode(["status" => "error", "message" => "بيانات المنتج غير مكتملة"], JSON_UNESCAPED_UNICODE);
    }
} else {
    http_response_code(405);
    echo json_encode(["status" => "error", "message" => "طريقة الطلب غير مسموح بها"], JSON_UNESCAPED_UNICODE);
}
?>
