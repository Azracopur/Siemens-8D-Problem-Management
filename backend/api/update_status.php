<?php
ob_start();
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    ob_end_clean();
    http_response_code(200);
    exit();
}

ini_set('display_errors', 0);
error_reporting(E_ALL);

function fatal_error_handler() {
    $error = error_get_last();
    if ($error !== NULL && $error['type'] === E_ERROR) {
        ob_clean();
        echo json_encode(["status" => "error", "message" => "KRİTİK HATA: " . $error['message']]);
    }
}
register_shutdown_function('fatal_error_handler');


$base_dir = dirname(__DIR__);
$db_file = $base_dir . '/config/db.php';

if (!file_exists($db_file)) {
    $db_file_alt = dirname($base_dir) . '/config/db.php'; 
    if(file_exists($db_file_alt)) {
        include $db_file_alt;
    } else {
        echo json_encode(["status" => "error", "message" => "db.php bulunamadı!"]);
        exit();
    }
} else {
    include $db_file;
}

$pdo_conn = null;
$tum_degiskenler = get_defined_vars();
foreach ($tum_degiskenler as $degisken) {
    if ($degisken instanceof PDO) {
        $pdo_conn = $degisken;
        break;
    }
}

if (!$pdo_conn) {
    ob_clean();
    echo json_encode(["status" => "error", "message" => "PDO bağlantısı bulunamadı."]);
    exit();
}

ob_clean(); 


$input = file_get_contents("php://input");
$data = json_decode($input);

if(isset($data->problem_id) && isset($data->status)) {
    
    try {
    $pdo_conn->beginTransaction(); 

   
    $sql_status = "UPDATE problems SET 
                    status = :status_val,
                    resolved_at = CASE WHEN :status_check = 'Resolved' THEN NOW() ELSE NULL END
                   WHERE id = :id";
    
    $stmt1 = $pdo_conn->prepare($sql_status);
    $stmt1->execute([
        ':status_val'   => $data->status,
        ':status_check' => $data->status,
        ':id'           => $data->problem_id
    ]);

   
    if ($data->status === 'Open') {
        
        $sql_clear = "UPDATE root_causes SET 
                        is_root_cause = 0, 
                        permanent_action = NULL 
                      WHERE problem_id = :prob_id";
        $stmt2 = $pdo_conn->prepare($sql_clear);
        $stmt2->execute([':prob_id' => $data->problem_id]);
    }

    $pdo_conn->commit(); 
    echo json_encode(["status" => "success", "message" => "Problem açıldı ve analizler temizlendi."]);

} catch (PDOException $e) {
    $pdo_conn->rollBack();
    echo json_encode(["status" => "error", "message" => $e->getMessage()]);
}

} else {
    echo json_encode(["status" => "error", "message" => "Eksik veri."]);
}

ob_end_flush();
?>