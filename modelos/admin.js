const URL = "/julia-rodriguez/veterinaria-dogo/api/admin.php";

/**
 * Inserta un administrador
 */
export async function insertarAdministrador(datos) {
  try {
    const res = await fetch(URL, {
      method: "POST",
      body: datos,
    });
    const text = await res.text(); // <- usamos text en lugar de res.json

    // Intentamos parsear JSON
    try {
      return JSON.parse(text);
    } catch (err) {
      // Si no es JSON, devolvemos un objeto de error
      return { success: false, message: "Respuesta no válida del servidor" };
    }
  } catch (err) {
    console.error(err);
    return { success: false, message: err.message };
  }
}

/**
 * Selecciona los administradores
 */
export async function seleccionarAdministrador() {
  try {
    const res = await fetch(URL + "?accion=seleccionar");
    const text = await res.text(); // <- usamos text
    try {
      return JSON.parse(text);
    } catch (err) {
      return []; // Si no es JSON, devolvemos array vacío
    }
  } catch (err) {
    console.error(err);
    return [];
  }
}
