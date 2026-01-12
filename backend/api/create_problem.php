<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

include_once __DIR__ . '/../config/db.php';


$data = json_decode(file_get_contents("php://input"));

if(!empty($data->title) && !empty($data->responsible_team)) {
    try {
        $query = "INSERT INTO problems (title, description, responsible_team, status) VALUES (:title, :description, :team, 'Open')";
        $stmt = $pdo->prepare($query);

        $stmt->bindParam(":title", $data->title);
        $stmt->bindParam(":description", $data->description);
        $stmt->bindParam(":team", $data->responsible_team);

        if($stmt->execute()) {
            echo json_encode(["message" => "Problem başarıyla oluşturuldu."]);
        } else {
            echo json_encode(["message" => "Hata oluştu."]);
        }
    } catch (PDOException $e) {
        echo json_encode(["message" => "Veritabanı hatası: " . $e->getMessage()]);
    }
} else {
    echo json_encode(["message" => "Lütfen gerekli alanları doldurun."]);
}