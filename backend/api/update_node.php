<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') { exit; }

include_once __DIR__ . '/../config/db.php';

try {
    $data = json_decode(file_get_contents("php://input"));
   
    if (!$data || !isset($data->id) || !isset($data->content)) {
        http_response_code(400);
        echo json_encode(["status" => "error", "message" => "ID ve içerik gerekli."]);
        exit;
    }
    
    $id = intval($data->id);
   
    $content = trim($data->content); 
    $permanent_action = isset($data->permanent_action) ? trim($data->permanent_action) : null;
    
   
    if (mb_strlen($content) < 1) {
        http_response_code(400);
        echo json_encode(["status" => "error", "message" => "İçerik boş olamaz."]);
        exit;
    }
    
  
    $query = "UPDATE root_causes 
              SET content = :content, 
                  permanent_action = :action 
              WHERE id = :id";
    
    $stmt = $pdo->prepare($query);
    $stmt->bindParam(":content", $content);
    $stmt->bindParam(":action", $permanent_action);
    $stmt->bindParam(":id", $id);
    
    if ($stmt->execute()) {
      
        http_response_code(200);
        echo json_encode([
            "status" => "success",
            "message" => "Node updated successfully",
            "id" => $id,
            "debug_content" => $content 
        ]);
    } else {
        throw new Exception("SQL Hatası oluştu.");
    }
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        "status" => "error",
        "message" => $e->getMessage()
    ]);
}