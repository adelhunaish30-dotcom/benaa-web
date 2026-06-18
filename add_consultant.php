<?php
// تضمين ملف الإعدادات المركزي لحل مشكلة CORS والاتصال
include_once 'config.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    
    // 1. استقبال البيانات النصية من لوحة التحكم (FormData)
    $name     = $_POST['name'] ?? null;
    $title_ar = $_POST['title_ar'] ?? null;
    $title_en = $_POST['title_en'] ?? null;
    $email    = $_POST['email'] ?? null;
    $phone    = $_POST['phone'] ?? null;
    $status   = $_POST['status'] ?? 'Active'; 

    // 2. التحقق من الحقول الإلزامية
    if (empty($name) || empty($title_ar) || empty($title_en)) {
        http_response_code(400);
        echo json_encode([
            "success" => false,
            "message" => "الاسم والمسمى الوظيفي (عربي وإنجليزي) حقول إجبارية."
        ], JSON_UNESCAPED_UNICODE);
        exit();
    }

    // تنظيف البيانات لمنع ثغرات SQL Injection لـ mysqli
    $name     = $conn->real_escape_string($name);
    $title_ar = $conn->real_escape_string($title_ar);
    $title_en = $conn->real_escape_string($title_en);
    $email    = $conn->real_escape_string($email);
    $phone    = $conn->real_escape_string($phone);
    $status   = $conn->real_escape_string($status);

    // 3. معالجة ورفع الصورة (حقل الإرسال يجب أن يكون باسم avatar)
    $avatar_url = null;
    
    if (isset($_FILES['avatar']) && $_FILES['avatar']['error'] === UPLOAD_ERR_OK) {
        $fileTmpPath = $_FILES['avatar']['tmp_name'];
        $fileName = $_FILES['avatar']['name'];
        $fileSize = $_FILES['avatar']['size'];
        $fileExtension = strtolower(pathinfo($fileName, PATHINFO_EXTENSION));
        
        $allowedExtensions = ['jpg', 'jpeg', 'png', 'webp'];
        $maxFileSize = 3 * 1024 * 1024; // 3 ميجابايت

        if (!in_array($fileExtension, $allowedExtensions)) {
            http_response_code(400);
            echo json_encode(["success" => false, "message" => "صيغة الصورة غير مدعومة. المسموح: JPG, PNG, WEBP فقط."], JSON_UNESCAPED_UNICODE);
            exit();
        }

        if ($fileSize > $maxFileSize) {
            http_response_code(400);
            echo json_encode(["success" => false, "message" => "حجم الصورة كبير جداً، الحد الأقصى 3 ميجابايت."], JSON_UNESCAPED_UNICODE);
            exit();
        }

        $uploadFileDir = './uploads/';
        if (!is_dir($uploadFileDir)) {
            mkdir($uploadFileDir, 0755, true);
        }
        
        $newFileName = md5(time() . $fileName) . '.' . $fileExtension;
        $dest_path = $uploadFileDir . $newFileName;
        
        if (move_uploaded_file($fileTmpPath, $dest_path)) {
            $avatar_url = "uploads/" . $newFileName; 
        } else {
            http_response_code(500);
            echo json_encode(["success" => false, "message" => "فشل رفع الصورة على السيرفر."], JSON_UNESCAPED_UNICODE);
            exit();
        }
    }

    // 4. توليد الـ ID الفريد (لأن نوعه Varchar في جدولك)
    $unique_id = 'cons_' . uniqid(); 

    // 5. إدخال البيانات في جدول consultants باستخدام استعلام Prepared Statement للحماية والأمان
    $query = "INSERT INTO consultants (id, name, title_ar, title_en, email, phone, status, avatar_url) 
              VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
              
    $stmt = $conn->prepare($query);
    if ($stmt) {
        $stmt->bind_param("ssssssss", $unique_id, $name, $title_ar, $title_en, $email, $phone, $status, $avatar_url);
        
        if ($stmt->execute()) {
            http_response_code(201);
            echo json_encode([
                "success" => true,
                "status" => "success",
                "message" => "تم إضافة المستشار وصورته بنجاح.",
                "consultant_id" => $unique_id
            ], JSON_UNESCAPED_UNICODE);
        } else {
            http_response_code(500);
            echo json_encode(["success" => false, "message" => "فشل حفظ بيانات المستشار: " . $stmt->error], JSON_UNESCAPED_UNICODE);
        }
        $stmt->close();
    } else {
        http_response_code(500);
        echo json_encode(["success" => false, "message" => "خطأ في تجهيز استعلام الحفظ."], JSON_UNESCAPED_UNICODE);
    }
} else {
    http_response_code(405);
    echo json_encode(["status" => "error", "message" => "طريقة الطلب غير مسموح بها"], JSON_UNESCAPED_UNICODE);
}
?>