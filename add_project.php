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
// add_project.php
include_once 'config.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // استقبال البيانات المرسلة من واجهة React (Admin)
    $input = json_decode(file_get_contents('php://input'), true);
    
    // 1️⃣ استخراج البيانات المرسلة من الفرونت إند
    $title = $conn->real_escape_string($input['title'] ?? 'مشروع هندسي جديد');
    $type = $conn->real_escape_string($input['type'] ?? 'غير محدد');
    $city = $conn->real_escape_string($input['city'] ?? 'صنعاء');
    $status = $conn->real_escape_string($input['status'] ?? 'جديد');
    $area = floatval($input['area'] ?? 0);
    $budget = floatval($input['budget'] ?? 0);
    
    // 2️⃣ تجميع التفاصيل الإضافية في حقل الوصف لمطابقة حقل description في الـ SQL
    $description_text = "نوع المنشأة: $type | المدينة: $city | المساحة: $area م٢ | الميزانية التقديرية: $budget YER";
    $description = $conn->real_escape_string($description_text);

    // معرف المستخدم الافتراضي لتخطي قيود الـ Foreign Key للزوار
    $user_id = 'guest'; 
    
    // إيقاف قيود المفاتيح الأجنبية مؤقتاً لضمان مرونة الحفظ والتجربة المحلية
    $conn->query("SET FOREIGN_KEY_CHECKS = 0");

    // 3️⃣ استعلام الإدخال المحدث تماماً ليطابق حقول جدول projects في الـ SQL الحالي
    // تم إزالة حقل id من الإدخال لأن السيرفر يولده تلقائياً كـ INT AUTO_INCREMENT
    $query = "INSERT INTO projects (user_id, title, description, status, consultants_id) 
              VALUES ('$user_id', '$title', '$description', '$status', NULL)";
              
    if ($conn->query($query)) {
        // جلب الرقم التعريفي التلقائي الذي تم إنشاؤه في قاعدة البيانات
        $inserted_id = $conn->insert_id;
        
        $conn->query("SET FOREIGN_KEY_CHECKS = 1");
        echo json_encode([
            "status" => "success", 
            "message" => "تم تسجيل وحفظ المشروع بنجاح في النظام المركزي وتوليد المعرف الرقمي",
            "project_id" => $inserted_id
        ], JSON_UNESCAPED_UNICODE);
    } else {
        $conn->query("SET FOREIGN_KEY_CHECKS = 1");
        http_response_code(500);
        echo json_encode([
            "status" => "error", 
            "message" => "فشل حفظ المشروع في السيرفر المحلي: " . $conn->error
        ], JSON_UNESCAPED_UNICODE);
    }
} else {
    http_response_code(405);
    echo json_encode(["status" => "error", "message" => "طريقة إرسال الطلب غير مدعومة"], JSON_UNESCAPED_UNICODE);
}
?>