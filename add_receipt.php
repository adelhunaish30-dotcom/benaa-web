<?php
// تضمين ملف الإعدادات المركزي للـ CORS والاتصال الموحد
include_once 'config.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    
    // استقبال البيانات من واجهة React عبر الـ $_POST لدعم رفع الملفات الحقيقي
    $order_id       = $_POST['order_id'] ?? null;
    $amount         = floatval($_POST['amount'] ?? 0);
    $payment_method = $_POST['payment_method'] ?? 'Kuraimi App'; // الخيارات المقيدة بالـ ENUM في قاعدتك
    $transaction_no = $_POST['transaction_no'] ?? null; // رقم الحوالة الإلزامي في قاعدة البيانات
    
    // التحقق من الحقول الإجبارية لمنع أخطاء الـ SQL
    if (empty($order_id) || empty($transaction_no) || $amount <= 0) {
        http_response_code(400);
        echo json_encode([
            "success" => false, 
            "message" => "تنبيه: معرف الطلب، رقم العملية/الحوالة، والمبلغ هي حقول إلزامية."
        ], JSON_UNESCAPED_UNICODE);
        exit();
    }

    // تنظيف البيانات
    $order_id       = $conn->real_escape_string($order_id);
    $payment_method = $conn->real_escape_string($payment_method);
    $transaction_no = $conn->real_escape_string($transaction_no);
    
    // معالجة السند المرفوع كملف صورة حقيقي
    $receipt_image = 'default_receipt.png';
    
    if (isset($_FILES['receipt_file']) && $_FILES['receipt_file']['error'] === UPLOAD_ERR_OK) {
        $fileTmpPath   = $_FILES['receipt_file']['tmp_name'];
        $fileName      = $_FILES['receipt_file']['name'];
        $fileExtension = strtolower(pathinfo($fileName, PATHINFO_EXTENSION));
        
        $allowedExtensions = ['jpg', 'jpeg', 'png', 'webp', 'pdf'];
        
        if (in_array($fileExtension, $allowedExtensions)) {
            $uploadFileDir = './uploads/receipts/';
            if (!is_dir($uploadFileDir)) {
                mkdir($uploadFileDir, 0755, true);
            }
            
            $newFileName = 'rec_' . md5(time() . $fileName) . '.' . $fileExtension;
            $dest_path   = $uploadFileDir . $newFileName;
            
            if (move_uploaded_file($fileTmpPath, $dest_path)) {
                $receipt_image = "uploads/receipts/" . $newFileName;
            }
        }
    }

    // إدخال البيانات ومطابقتها تماماً لبنية جدول payment_receipts في الـ SQL
    $query = "INSERT INTO payment_receipts (order_id, payment_method, transaction_no, amount, receipt_image, payment_status, status) 
              VALUES (?, ?, ?, ?, ?, 'pending', 'Pending')";
              
    $stmt = $conn->prepare($query);
    if ($stmt) {
        $stmt->bind_param("sssds", $order_id, $payment_method, $transaction_no, $amount, $receipt_image);
        
        if ($stmt->execute()) {
            echo json_encode([
                "success" => true, 
                "status" => "success", 
                "message" => "تم رفع وإرسال إيصال السداد بنجاح، رقم الحوالة مسجل وبانتظار المراجعة."
            ], JSON_UNESCAPED_UNICODE);
        } else {
            http_response_code(500);
            // معالجة تكرار رقم الحوالة الفريد
            if ($conn->errno == 1062) {
                echo json_encode(["success" => false, "message" => "خطأ: رقم الحوالة/العملية هذا تم رفعه مسبقاً في النظام!"], JSON_UNESCAPED_UNICODE);
            } else {
                echo json_encode(["success" => false, "message" => "فشل حفظ الإيصال: " . $stmt->error], JSON_UNESCAPED_UNICODE);
            }
        }
        $stmt->close();
    }
} else {
    http_response_code(405);
    echo json_encode(["status" => "error", "message" => "الطريقة غير مدعومة"], JSON_UNESCAPED_UNICODE);
}
?>