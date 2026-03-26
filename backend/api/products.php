<?php
// backend/api/products.php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

require_once '../db.config.php';

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    $id = isset($_GET['id']) ? intval($_GET['id']) : null;
    if ($id) {
        $stmt = $conn->prepare("SELECT * FROM products WHERE id = ?");
        $stmt->bind_param("i", $id);
        $stmt->execute();
        $result = $stmt->get_result();
        echo json_encode($result->fetch_assoc());
        $stmt->close();
    } else {
        $result = $conn->query("SELECT * FROM products ORDER BY id DESC");
        $products = [];
        while ($row = $result->fetch_assoc()) { $products[] = $row; }
        echo json_encode($products);
    }
} elseif ($method === 'POST') {
    $data = json_decode(file_get_contents("php://input"), true);
    if (!$data) {
        echo json_encode(["status" => "error", "message" => "Invalid JSON"]);
        exit;
    }
    $id = isset($data['id']) ? $data['id'] : null;
    $name = $data['name'];
    $category = $data['category'];
    $price = $data['price'];
    $description = $data['description'];
    $image_url = $data['image_url'];

    if ($id) {
        $stmt = $conn->prepare("UPDATE products SET name=?, category=?, price=?, description=?, image_url=? WHERE id=?");
        $stmt->bind_param("ssdsis", $name, $category, $price, $description, $image_url, $id);
    } else {
        $stmt = $conn->prepare("INSERT INTO products (name, category, price, description, image_url) VALUES (?, ?, ?, ?, ?)");
        $stmt->bind_param("ssdss", $name, $category, $price, $description, $image_url);
    }

    if ($stmt->execute()) {
        echo json_encode(["status" => "success", "message" => "Product saved"]);
    } else {
        echo json_encode(["status" => "error", "message" => $stmt->error]);
    }
    $stmt->close();
} elseif ($method === 'DELETE') {
    $id = isset($_GET['id']) ? intval($_GET['id']) : null;
    if (!$id) {
        echo json_encode(["status" => "error", "message" => "Missing ID"]);
        exit;
    }
    $stmt = $conn->prepare("DELETE FROM products WHERE id = ?");
    $stmt->bind_param("i", $id);
    if ($stmt->execute()) {
        echo json_encode(["status" => "success", "message" => "Product deleted"]);
    } else {
        echo json_encode(["status" => "error", "message" => $stmt->error]);
    }
    $stmt->close();
} else {
    http_response_code(405);
    echo json_encode(["status" => "error", "message" => "Method not allowed"]);
}

$conn->close();
?>
