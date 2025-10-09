<?php
// api/login.php
require_once 'modelos.php';
header('Content-Type: application/json; charset=utf-8');

// Evitar que mensajes de warning rompan el JSON
ob_start();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['success' => false, 'message' => 'Método no permitido.']);
    ob_end_flush();
    exit;
}

// Recibimos y limpiamos los datos
$email_raw  = $_POST['email'] ?? '';
$password   = $_POST['password'] ?? '';

$email = strtolower(trim($email_raw));
$password = trim($password);

// Validación mínima
if ($email === '' || $password === '') {
    echo json_encode(['success' => false, 'message' => 'Email y contraseña son obligatorios.']);
    ob_end_flush();
    exit;
}

// Instanciamos el modelo y buscamos por email
$admin = new Modelo('administrador');

// Escapamos comillas sencillas en el email para evitar romper la consulta construida por setCriterio
$safe_email = str_replace("'", "\\'", $email); // simple escape, ideal sería usar prepared statements
$admin->setCriterio("LOWER(email) = '$safe_email'");

// Llamamos a seleccionar() y soportamos que devuelva JSON (string) o array
$raw = $admin->seleccionar();
$datos = [];

// Si viene un string (posible JSON mezclado con HTML), intentamos decodificar
if (is_string($raw)) {
    $decoded = json_decode($raw, true);
    if (is_array($decoded)) {
        $datos = $decoded;
    } else {
        // Intentamos extraer un array JSON dentro de HTML (por ejemplo si hay warnings de XDebug)
        if (preg_match('/(\[.*\])/s', $raw, $m)) {
            $maybe = json_decode($m[1], true);
            if (is_array($maybe)) $datos = $maybe;
        }
    }
} elseif (is_array($raw)) {
    $datos = $raw;
}

// Si no encontramos registros, devolvemos error genérico
if (empty($datos)) {
    echo json_encode(['success' => false, 'message' => 'Usuario o contraseña incorrectos.']);
    ob_end_flush();
    exit;
}

// Tomamos el primer usuario (expectativa: único por email)
$usuario = $datos[0];

// Aseguramos que exista el campo password
$hash = isset($usuario['password']) ? trim($usuario['password']) : '';

// Verificamos la contraseña
if ($hash !== '' && password_verify($password, $hash)) {
    // Login exitoso: devolvemos datos básicos del usuario (sin el hash)
    echo json_encode([
        'success' => true,
        'message' => 'Login exitoso',
        'usuario' => [
            'id' => $usuario['id'] ?? null,
            'nombre_completo' => $usuario['nombre_completo'] ?? '',
            'email' => $usuario['email'] ?? ''
        ]
    ]);
} else {
    echo json_encode(['success' => false, 'message' => 'Usuario o contraseña incorrectos.']);
}

ob_end_flush();
exit;
?>