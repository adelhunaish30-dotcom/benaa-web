<?php
// تضمين ملف الإعدادات المركزي للـ CORS والاتصال
include_once 'config.php';

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    
    // 1. استعلام جلب البيانات
    $sql = "SELECT id, name, title_ar, title_en, email, phone, status, avatar_url FROM consultants";
    $result = $conn->query($sql);

    if ($result) {
        $consultants = [];
        
        // 2. تعديل رابط الصورة ليحتوي على الرابط الكامل للسيرفر المحلي (رابط ديناميكي)
        $protocol = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off' || $_SERVER['SERVER_PORT'] == 443) ? "https://" : "http://";
        $domainName = $protocol . $_SERVER['HTTP_HOST'] . dirname($_SERVER['PHP_SELF']) . '/';

        while ($row = $result->fetch_assoc()) {
            if (!empty($row['avatar_url'])) {
                // تحويل المجلد uploads إلى رابط مباشر كامل
                $row['avatar_url'] = $domainName . $row['avatar_url'];
            } else {
                // صورة افتراضية ذكية بحسب اسم المستشار
                $row['avatar_url'] = "https://ui-avatars.com/api/?name=" . urlencode($row['name']) . "&background=random";
            }
            $consultants[] = $row;
        }

        // 3. إرجاع النتيجة بنجاح للفرونت إند
        http_response_code(200);
        echo json_encode([
            "success" => true,
            "count" => count($consultants),
            "data" => $consultants
        ], JSON_UNESCAPED_UNICODE);
        
    } else {
        http_response_code(500);
        echo json_encode([
            "success" => false,
            "message" => "فشل جلب بيانات المستشارين: " . $conn->error
        ], JSON_UNESCAPED_UNICODE);
    }
} else {
    http_response_code(405);
    echo json_encode(["status" => "error", "message" => "طريقة الطلب غير مدعومة"], JSON_UNESCAPED_UNICODE);
}
?>