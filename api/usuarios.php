<?php
require_once 'modelos.php';
header('Content-Type: application/json; charset=utf-8');
ob_start();

$usuario = new Modelo("usuarios");

// ===== POST: Crear / actualizar / eliminar =====
if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $accion = $_POST["accion"] ?? "insertar";

    $id = trim($_POST["id"] ?? '');
    $nombre = trim($_POST["nombre_completo"] ?? '');
    $email = trim($_POST["email"] ?? '');
    $password = trim($_POST["password"] ?? '');
    $rol = trim($_POST["rol"] ?? '');
    $direccion = trim($_POST["direccion"] ?? '');

    // ===================== ELIMINAR =====================
    if ($accion === "eliminar" && !empty($id)) {
        $resultado = $usuario->eliminar($id);
        echo json_encode($resultado
            ? ["success" => true, "message" => "Usuario eliminado correctamente."]
            : ["success" => false, "message" => "Error al eliminar usuario."]);
        ob_end_flush();
        exit;
    }

    // ===================== INSERTAR =====================
    if ($accion === "insertar") {
        if (empty($nombre) || empty($rol) || empty($email) || empty($password)) {
            echo json_encode(["success" => false, "message" => "Todos los campos son obligatorios."]);
            ob_end_flush(); exit;
        }

        // Verificar si el email ya existe
        $usuario->setCriterio("email = '$email'");
        $existe = $usuario->seleccionar();
        if (count($existe) > 0) {
            echo json_encode(["success" => false, "message" => "Ya existe un usuario con ese correo."]);
            ob_end_flush(); exit;
        }

        $hash = password_hash($password, PASSWORD_DEFAULT);
        $datos = [
            "nombre_completo" => $nombre,
            "email" => $email,
            "password" => $hash,
            "rol" => $rol,
            "direccion" => $direccion
        ];

        $resultado = $usuario->insertar($datos);

        echo json_encode($resultado > 0
            ? ["success" => true, "message" => "Usuario registrado correctamente."]
            : ["success" => false, "message" => "Error al registrar usuario."]);
        ob_end_flush(); exit;
    }

    // ===================== ACTUALIZAR =====================
    if ($accion === "actualizar" && !empty($id)) {
        if (empty($nombre) || empty($rol) || empty($email)) {
            echo json_encode(["success" => false, "message" => "Todos los campos son obligatorios."]);
            ob_end_flush(); exit;
        }

        $datos = [
            "nombre_completo" => $nombre,
            "email" => $email,
            "rol" => $rol,
            "direccion" => $direccion
        ];

        if (!empty($password)) {
            $datos["password"] = password_hash($password, PASSWORD_DEFAULT);
        }

        $resultado = $usuario->actualizar($datos, $id);

        echo json_encode($resultado
            ? ["success" => true, "message" => "Usuario actualizado correctamente."]
            : ["success" => false, "message" => "Error al actualizar usuario."]);
        ob_end_flush(); exit;
    }

    echo json_encode(["success" => false, "message" => "Acción no válida o falta ID."]);
    ob_end_flush();
    exit;
}

// ===== GET: Seleccionar usuarios =====
if ($_SERVER["REQUEST_METHOD"] === "GET") {
    $usuarios = $usuario->seleccionar();
    echo json_encode($usuarios);
    ob_end_flush();
    exit;
}
?>
