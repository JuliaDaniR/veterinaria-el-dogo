<?php
require_once 'modelos.php';
header('Content-Type: application/json; charset=utf-8');
ob_start();

$admin = new Modelo("administrador");

// ==================
// Seleccionar administradores
// ==================
if (isset($_GET['accion']) && $_GET['accion'] === 'seleccionar') {
    $datos = $admin->seleccionar(); // ← corregido
    echo json_encode($datos);
    ob_end_flush();
    exit;
}

// ==================
// Insertar administrador
// ==================
if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $nombre = trim($_POST["nombre_completo"] ?? '');
    $email = trim($_POST["email"] ?? '');
    $password = trim($_POST["password"] ?? '');
    $confirmar = trim($_POST["confirmar"] ?? '');

    // Validaciones
    if (empty($nombre) || empty($email) || empty($password) || empty($confirmar)) {
        echo json_encode(["success" => false, "message" => "Todos los campos son obligatorios."]);
        ob_end_flush(); exit;
    }

    if ($password !== $confirmar) {
        echo json_encode(["success" => false, "message" => "Las contraseñas no coinciden."]);
        ob_end_flush(); exit;
    }

    // Verificar email existente
    $admin->setCriterio("email = '$email'");
    $existe = $admin->seleccionar();
    if (count($existe) > 0) {
        echo json_encode(["success" => false, "message" => "Ya existe un administrador registrado."]);
        ob_end_flush(); exit;
    }

    // Hash de la contraseña
    $hash = password_hash($password, PASSWORD_DEFAULT);

    $datos = [
        "nombre_completo" => $nombre,
        "email" => $email,
        "password" => $hash
    ];

    $resultado = $admin->insertar($datos);

    if ($resultado > 0) {
        echo json_encode(["success" => true, "message" => "Administrador registrado correctamente."]);
    } else {
        echo json_encode(["success" => false, "message" => "Error al registrar administrador."]);
    }

    ob_end_flush();
    exit;
}
?>

