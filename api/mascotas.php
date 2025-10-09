<?php
require_once 'modelos.php';
header('Content-Type: application/json; charset=utf-8');

$modelo = new Modelo("mascotas");

try {
    $method = $_SERVER['REQUEST_METHOD'];
    $accion = $_GET['accion'] ?? '';

    // 🔍 GET: obtener todas o una por ID
    if ($method === 'GET') {
        if (isset($_GET['id'])) {
            $id = intval($_GET['id']);
            $modelo->setCriterio("id = $id");
            $mascotas = $modelo->seleccionar();
            echo json_encode($mascotas[0] ?? []);
        } else {
            $mascotas = $modelo->seleccionar();
            echo json_encode($mascotas);
        }
    }

    // 🆕 POST: insertar, actualizar o eliminar
    elseif ($method === 'POST') {
        if ($accion === 'insertar') {
            $datos = [
                "nombre" => $_POST['nombre'] ?? '',
                "especie" => $_POST['especie'] ?? '',
                "raza" => $_POST['raza'] ?? '',
                "edad" => $_POST['edad'] ?? '',
                "problemas_salud" => $_POST['problemas_salud'] ?? '',
                "cliente_id" => $_POST['cliente_id'] ?? ''
            ];
            $resultado = $modelo->insertar($datos);
            echo json_encode(["success" => $resultado]);
        }

        elseif ($accion === 'actualizar') {
            $id = intval($_GET['id'] ?? 0);
            if ($id > 0) {
                $datos = [
                    "nombre" => $_POST['nombre'] ?? '',
                    "especie" => $_POST['especie'] ?? '',
                    "raza" => $_POST['raza'] ?? '',
                    "edad" => $_POST['edad'] ?? '',
                    "problemas_salud" => $_POST['problemas_salud'] ?? '',
                    "cliente_id" => $_POST['cliente_id'] ?? ''
                ];
                $resultado = $modelo->actualizar($datos, $id);
                echo json_encode(["success" => $resultado]);
            } else {
                echo json_encode(["success" => false, "message" => "ID inválido para actualización"]);
            }
        }

        elseif ($accion === 'eliminar') {
            $id = intval($_GET['id'] ?? 0);
            if ($id > 0) {
                $resultado = $modelo->eliminar($id);
                echo json_encode(["success" => $resultado]);
            } else {
                echo json_encode(["success" => false, "message" => "ID inválido para eliminación"]);
            }
        }

        else {
            echo json_encode(["success" => false, "message" => "Acción POST no reconocida"]);
        }
    }

    // 🚫 Método no permitido
    else {
        http_response_code(405);
        echo json_encode(["error" => "Método no permitido"]);
    }

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["error" => $e->getMessage()]);
}
?>
