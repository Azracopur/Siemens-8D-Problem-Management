<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') { exit; }

include_once __DIR__ . '/../config/db.php';
$data = json_decode(file_get_contents("php://input"));

if($data && !empty($data->content)) {
    try {
        
        $query = "INSERT INTO root_causes (problem_id, parent_id, content, permanent_action, is_root_cause) 
                  VALUES (:pid, :paid, :content, :action, :is_root)";
        $stmt = $pdo->prepare($query);

        $stmt->bindParam(":pid", $data->problem_id);
        $parentId = !empty($data->parent_id) ? $data->parent_id : null;
        $stmt->bindParam(":paid", $parentId);
        $stmt->bindParam(":content", $data->content);
        $stmt->bindParam(":action", $data->permanent_action);
        
        
        $isRoot = 0;
        $stmt->bindParam(":is_root", $isRoot);

        if($stmt->execute()) {
            echo json_encode(["status" => "success"]);
        }
    } catch (PDOException $e) {
        echo json_encode(["status" => "error", "message" => $e->getMessage()]);
    }
}