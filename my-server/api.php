<?php
header("Content-Type: application/json");

// Kết nối MySQL
$servername = "sql309.infinityfree.com"; 
$username = "if0_38330199";
$password = "fZrJygWDwyw4";
$dbname = "if0_38330199_database";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die(json_encode(["error" => "Kết nối thất bại: " . $conn->connect_error]));
}

// Truy vấn dữ liệu từ bảng `trips`
$sql = "SELECT * FROM trips";  // Đổi thành bảng bạn cần lấy
$result = $conn->query($sql);

$data = [];
while ($row = $result->fetch_assoc()) {
    $data[] = $row;
}

echo json_encode($data);

$conn->close();
?>
