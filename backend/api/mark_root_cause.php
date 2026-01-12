<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Content-Type: application/json; charset=UTF-8");


if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

include_once __DIR__ . '/../config/db.php';


if (!$pdo) {
    echo json_encode(["status" => "error", "message" => "DB bağlantı hatası"]);
    exit();
}

$input = file_get_contents("php://input");
$data = json_decode($input);

if($data && isset($data->id)) {
    try {
      
        $query = "UPDATE root_causes SET is_root_cause = :status, permanent_action = :action WHERE id = :id";
        $stmt = $pdo->prepare($query);
        $stmt->execute([
            ":status" => $data->is_root_cause,
            ":action" => $data->permanent_action,
            ":id"     => $data->id
        ]);

        echo json_encode(["status" => "success"]);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(["status" => "error", "message" => $e->getMessage()]);
    }
}
?>