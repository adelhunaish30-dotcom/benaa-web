<?php
// assign_consultant.php
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit(0);
}

include_once 'config.php';

$data = json_decode(file_get_contents("php://input"));

if (!empty($data->project_id) && !empty($data->consultants_id)) {
    
    $project_id = intval($data->project_id);
    // تصحيح: استقبال المعرف كنص تنظيفاً له لمطابقة الـ varchar(50) في الـ SQL
    $consultants_id = $conn->real_escape_string(strval($data->consultants_id));

    // استعلام التحديث لحقل الربط في جدول المشاريع
    $query = "UPDATE projects SET consultants_id = ? WHERE id = ?";
    $stmt = $conn->prepare($query);

    if ($stmt) {
        $stmt->bind_param("si", $consultants_id, $project_id);
        
        if ($stmt->execute()) {
            http_response_code(200);
            echo json_encode(array("success" => true, "message" => "تم تعيين المستشار للمشروع بنجاح وتحديث قاعدة البيانات."), JSON_UNESCAPED_UNICODE);
        } else {
            http_response_code(500);
            echo json_encode(array("success" => false, "message" => "فشل تنفيذ الاستعلام: " . $stmt->error), JSON_UNESCAPED_UNICODE);
        }
        $stmt->close();
    } else {
        http_response_code(500);
        echo json_encode(array("success" => false, "message" => "خطأ في تجهيز استعلام التحديث."), JSON_UNESCAPED_UNICODE);
    }
} else {
    http_response_code(400);
    echo json_encode(array("success" => false, "message" => "البيانات المرسلة غير مكتملة."), JSON_UNESCAPED_UNICODE);
}
?>