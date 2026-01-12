<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') { exit; }

include_once __DIR__ . '/../config/db.php';
$data = json_decode(file_get_contents("php://input"));

if($data && !empty($data->id)) {
    try {
        
        $query = "DELETE FROM root_causes WHERE id = :id OR parent_id = :pid";
        $stmt = $pdo->prepare($query);
        
        $stmt->bindParam(":id", $data->id);
        $stmt->bindParam(":pid", $data->id); 

        if($stmt->execute()) {
            echo json_encode(["status" => "success"]);
        } else {
            echo json_encode(["status" => "error", "message" => "Silme islemi basarisiz."]);
        }
    } catch (PDOException $e) {
        echo json_encode(["status" => "error", "message" => "SQL Hatasi: " . $e->getMessage()]);
    }
} else {
    echo json_encode(["status" => "error", "message" => "Gecersiz veri gelmedi."]);
}