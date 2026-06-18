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
// إجبار السيرفر على إظهار الأخطاء البرمجية إن وجدت لفحصها
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

include_once 'config.php';

$query = "SELECT * FROM products";
$result = $conn->query($query);

$products = [];
if ($result && $result->num_rows > 0) {
    while($row = $result->fetch_assoc()) {
        $products[] = [
            "id" => $row['id'],
            "nameAr" => $row['name_ar'],
            "nameEn" => $row['name_en'],
            "category" => $row['category'],
            "price" => floatval($row['price']),
            "stock" => intval($row['stock']),
            "unit_ar" => $row['unit_ar'],
            "unit_en" => $row['unit_en'],
            "supplier" => $row['supplier'],
            "image" => $row['image_url']
        ];
    }
}

echo json_encode($products, JSON_UNESCAPED_UNICODE);
?>