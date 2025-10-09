// URL para acceder a la api
const URL = "/julia-rodriguez/veterinaria-dogo/api/mascotas.php?tabla=mascotas";

/**
 * Selecciona las mascotas de la base de datos
 */
export async function seleccionarMascotas() {
  let res = await fetch(`${URL}&accion=seleccionar`);
  let datos = await res.json();
  if (res.status !== 200) {
    throw Error("Los datos no se han podido recuperar");
  }
  return datos;
}

/**
 * Inserta una mascota de la base de datos
 * @param datos de la mascota a insertar
 */
export function insertarMascotas(datos) {
  fetch(`${URL}&accion=insertar`, {
    method: "POST",
    body: datos,
  })
    .then((res) => res.json())
    .then((data) => {
      console.log(data);
      return data;
    });
}
/**
 * Actualiza una mascota de la base de datos
 * @param datos de la mascota a actualizar
 * @param id de la mascota a actualizar
 */
export const actualizarMascotas = (datos, id) => {
  fetch(`${URL}&accion=actualizar&id=${id}`, {
    method: "POST",
    body: datos,
  })
    .then((res) => res.json())
    .then((data) => {
      console.log(data);
      return data;
    });
};

/**
 * Elimina una mascota de la base de datos
 * @param id de la mascota a eliminar
 */
export const eliminarMascotas = async (id) => {
  try {
    const res = await fetch(`${URL}&accion=eliminar&id=${id}`, {
      method: "POST"
    });
    const data = await res.json();
    console.log("Respuesta de eliminación:", data);
    return data;
  } catch (error) {
    console.error("Error en fetch eliminarMascotas:", error);
    return { success: false, error: error.message };
  }
};

