<?php
require_once 'modelos.php';
header('Content-Type: application/json; charset=utf-8');
ob_start();

// Solo POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['success' => false, 'message' => 'Método no permitido.']);
    ob_end_flush();
    exit;
}

// Recibir datos
$email = strtolower(trim($_POST['email'] ?? ''));
$password = trim($_POST['password'] ?? '');

if ($email === '' || $password === '') {
    echo json_encode(['success' => false, 'message' => 'Email y contraseña son obligatorios.']);
    ob_end_flush();
    exit;
}

// Buscar en la tabla USUARIOS
$usuarios = new Modelo('usuarios');
$safe_email = str_replace("'", "\\'", $email);
$usuarios->setCriterio("LOWER(email) = '$safe_email'");
$resultado = $usuarios->seleccionar();

if (empty($resultado)) {
    echo json_encode(['success' => false, 'message' => 'Usuario no encontrado.']);
    ob_end_flush();
    exit;
}

$usuario = $resultado[0];
$hash = $usuario['password'] ?? '';

if (!password_verify($password, $hash)) {
    echo json_encode(['success' => false, 'message' => 'Contraseña incorrecta.']);
    ob_end_flush();
    exit;
}

// Login correcto
echo json_encode([
    'success' => true,
    'message' => 'Login exitoso',
    'usuario' => [
        'id' => $usuario['id'] ?? null,
        'nombre_completo' => $usuario['nombre_completo'] ?? '',
        'email' => $usuario['email'] ?? '',
        'rol' => $usuario['rol'] ?? 'sin_rol'
    ]
]);
ob_end_flush();
exit;
?>
