<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET, POST");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

include_once __DIR__ . '/../config/db.php';

$method = $_SERVER['REQUEST_METHOD'];


if ($method == 'GET') {
    $sql = "SELECT * FROM problems ORDER BY created_at DESC";
    $stmt = $pdo->prepare($sql);
    $stmt->execute();
    $problems = $stmt->fetchAll();
    echo json_encode($problems);
}


if ($method == 'POST') {
    $data = json_decode(file_get_contents("php://input"));
    
    if(!empty($data->title) && !empty($data->responsible_team)) {
        $sql = "INSERT INTO problems (title, description, responsible_team, status) VALUES (?, ?, ?, 'Open')";
        $stmt = $pdo->prepare($sql);
        
        if($stmt->execute([$data->title, $data->description ?? '', $data->responsible_team])) {
            http_response_code(201);
            echo json_encode(['message' => 'Problem oluşturuldu.']);
        } else {
            http_response_code(503);
            echo json_encode(['message' => 'Problem oluşturulamadı.']);
        }
    } else {
        http_response_code(400);
        echo json_encode(['message' => 'Eksik veri.']);
    }
}
?>