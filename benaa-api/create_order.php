<?php
// create_order.php

// 1️⃣ إعدادات الـ CORS الكاملة لمنع أي حظر من المتصفح مع بورت الـ React حقك
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS, PUT, DELETE");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit(0); // إنهاء الطلب المبدئي بنجاح
}

include_once 'config.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);
    
    // قراءة البيانات مع وضع قيم افتراضية ذكية في حال اختلاف المسميات بين الفرونت والباك
    $id = $conn->real_escape_string($input['id'] ?? $input['orderId'] ?? ('ord-' . uniqid()));
    $customer_name = $conn->real_escape_string($input['customerName'] ?? $input['name'] ?? 'عميل منصة بناء');
    $customer_phone = $conn->real_escape_string($input['customerPhone'] ?? $input['phone'] ?? '777777777');
    
    // تجميع تفاصيل المنتجات بشكل نصي مرن
    $products_summary = isset($input['products']) ? (is_array($input['products']) ? json_encode($input['products'], JSON_UNESCAPED_UNICODE) : $input['products']) : 'طلب مواد بناء متنوعة';
    $products_summary = $conn->real_escape_string($products_summary);
    
    $total_amount = floatval($input['totalAmount'] ?? $input['total'] ?? $input['price'] ?? 0);
    $payment_method = $conn->real_escape_string($input['paymentMethod'] ?? 'Cash');
    $status = 'New';
    
    // إيقاف فحص قيود المفاتيح الأجنبية مؤقتاً لضمان تسجيل الطلب فوراً كـ guest
    $conn->query("SET FOREIGN_KEY_CHECKS = 0");

    // استعلام الإدخال المحدث والمتوافق مع جدول orders
    $query = "INSERT INTO orders (id, user_id, customer_name, customer_phone, products_summary, total_amount, payment_method, status) 
              VALUES ('$id', 'guest', '$customer_name', '$customer_phone', '$products_summary', $total_amount, '$payment_method', '$status')
              ON DUPLICATE KEY UPDATE customer_name='$customer_name', customer_phone='$customer_phone', products_summary='$products_summary', total_amount=$total_amount, status='$status'";
              
    if ($conn->query($query)) {
        $conn->query("SET FOREIGN_KEY_CHECKS = 1");
        echo json_encode(["status" => "success", "message" => "تم تعميد وحفظ طلب التوريد بنجاح في النظام المركزي"], JSON_UNESCAPED_UNICODE);
    } else {
        $conn->query("SET FOREIGN_KEY_CHECKS = 1");
        http_response_code(500);
        echo json_encode(["status" => "error", "message" => "فشل حفظ الطلب في السيرفر المحلي: " . $conn->error], JSON_UNESCAPED_UNICODE);
    }
} else {
    http_response_code(405);
    echo json_encode(["status" => "error", "message" => "طريقة الإرسال غير مدعومة"], JSON_UNESCAPED_UNICODE);
}
?>