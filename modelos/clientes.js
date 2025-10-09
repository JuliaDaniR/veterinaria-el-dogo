// modelos/clientes.js
const URL = "/julia-rodriguez/veterinaria-dogo/api/clientes.php";

/**
 * Selecciona todos los clientes
 */
export async function seleccionarClientes() {
  const res = await fetch(`${URL}`);
  const datos = await res.json();
  if (res.status !== 200) {
    throw Error("Los datos no se han podido recuperar");
  }
  return datos;
}

/**
 * Inserta un nuevo cliente
 */
export async function insertarClientes(formData) {
  const res = await fetch(`${URL}?accion=insertar`, {
    method: "POST",
    body: formData,
  });
  const data = await res.json();
  console.log("Insertar:", data);
  return data;
}

/**
 * Actualiza un cliente existente
 */
export async function actualizarClientes(formData, id) {
  const res = await fetch(`${URL}?accion=actualizar&id=${id}`, {
    method: "POST",
    body: formData,
  });
  const data = await res.json();
  console.log("Actualizar:", data);
  return data;
}

/**
 * Elimina un cliente por ID
 */
export async function eliminarClientes(id) {
  const res = await fetch(`${URL}?accion=eliminar&id=${id}`, {
    method: "POST",
  });
  const data = await res.json();
  console.log("Eliminar:", data);
  return data;
}
