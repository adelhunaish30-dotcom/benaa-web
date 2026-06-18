<?php
// تفعيل الـ CORS لتسمح للـ React بالوصول للبيانات بدون أخطاء حمراء
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

// الاتصال بقاعدة البيانات (عدل البيانات إذا كانت مختلفة لديك)
$host = "localhost";
$db_name = "db_benaa"; // اسم قاعدة البيانات الخاصة بمشروعك
$username = "root";
$password = ""; // افتراضي في XAMPP يكون فارغاً

try {
    $conn = new PDO("mysql:host=" . $host . ";dbname=" . $db_name . ";charset=utf8", $username, $password);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    // الاستعلام لجلب المشاريع من جدول المشاريع (تأكد أن اسم الجدول هو projects)
    $query = "SELECT * FROM projects ORDER BY id DESC";
    $stmt = $conn->prepare($query);
    $stmt->execute();
    
    $projects = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    // إرسال البيانات إلى الـ React بصيغة JSON
    http_response_code(200);
    echo json_encode($projects);

} catch(PDOException $exception) {
    http_response_code(500);
    echo json_encode(array("message" => "خطأ في الاتصال بقاعدة البيانات: " . $exception->getMessage()));
}
?>