<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
include_once __DIR__ . '/../config/db.php';

$problem_id = isset($_GET['problem_id']) ? $_GET['problem_id'] : die();


$query = "SELECT * FROM root_causes WHERE problem_id = :pid";
$stmt = $pdo->prepare($query);
$stmt->bindParam(":pid", $problem_id);
$stmt->execute();
$all_data = $stmt->fetchAll(PDO::FETCH_ASSOC);


function buildTree(array $elements, $parentId = null) {
    $branch = array();
    foreach ($elements as $element) {
        if ($element['parent_id'] == $parentId) {
            $children = buildTree($elements, $element['id']);
            if ($children) {
                $element['children'] = $children;
            }
            $branch[] = $element;
        }
    }
    return $branch;
}

$tree = buildTree($all_data);
echo json_encode($tree);