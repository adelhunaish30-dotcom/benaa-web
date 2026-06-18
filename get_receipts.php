<?php
// تضمين ملف الإعدادات الموحد للـ CORS وقاعدة البيانات
include_once 'config.php';

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    
    // الاستعلام المطابق 100% للحقول الفعلية في جدول السندات
    $sql = "SELECT id, order_id, payment_method, payment_status, transaction_no, amount, receipt_image, status, created_at 
            FROM payment_receipts 
            ORDER BY id DESC";
            
    $result = $conn->query($sql);

    if ($result) {
        $receipts = [];
        
        // بناء النطاق المحلي لعرض الصور بشكل حي ومباشر في الفرونت إند
        $protocol = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off' || $_SERVER['SERVER_PORT'] == 443) ? "https://" : "http://";
        $domainName = $protocol . $_SERVER['HTTP_HOST'] . dirname($_SERVER['PHP_SELF']) . '/';

        while ($row = $result->fetch_assoc()) {
            if (!empty($row['receipt_image']) && $row['receipt_image'] !== 'default_receipt.png') {
                $row['receipt_image'] = $domainName . $row['receipt_image'];
            }
            $receipts[] = $row;
        }

        http_response_code(200);
        echo json_encode([
            "success" => true,
            "count" => count($receipts),
            "data" => $receipts
        ], JSON_UNESCAPED_UNICODE);
        
    } else {
        http_response_code(500);
        echo json_encode([
            "success" => false,
            "message" => "حدث خطأ أثناء جلب السندات المالية: " . $conn->error
        ], JSON_UNESCAPED_UNICODE);
    }
} else {
    http_response_code(405);
    echo json_encode(["status" => "error", "message" => "طريقة الطلب غير مدعومة"], JSON_UNESCAPED_UNICODE);
}
?>