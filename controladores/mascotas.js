import {
  seleccionarMascotas,
  insertarMascotas,
  actualizarMascotas,
  eliminarMascotas,
} from "../modelos/mascotas.js";

import { seleccionarClientes } from "../modelos/clientes.js";
// Obtiene el nombre completo del dueño
async function getClientName(clienteId) {
  const clientes = await seleccionarClientes();
  const cliente = clientes.find((c) => c.id === clienteId);
  return cliente
    ? `${cliente.nombre} ${cliente.apellido}`
    : "Dueño Desconocido ❓";
}

// Rellena el selector de propietarios
export async function populateClienteSelect() {
  const select = document.getElementById("mascota-cliente-id");
  if (!select) return;

  select.innerHTML = "";
  const clientes = await seleccionarClientes();

  select.add(new Option("Selecciona un Propietario", "", true, true));
  select.options[0].disabled = true;

  clientes.forEach((c) => {
    select.add(new Option(`${c.nombre} ${c.apellido} (${c.telefono})`, c.id));
  });
}
export async function cargarMascotas() {
  try {
    const mascotas = await seleccionarMascotas();
    const clientes = await seleccionarClientes();
    const tbody = document.getElementById("mascotas-table-body");
    const searchValue =
      document.getElementById("mascota-search")?.value.toLowerCase().trim() ||
      "";
    tbody.innerHTML = "";

    const getOwnerName = (id) => {
      const cliente = clientes.find((c) => String(c.id) === String(id));
      return cliente
        ? `${cliente.nombre} ${cliente.apellido}`
        : "Dueño Desconocido ❓";
    };

    const filtradas = mascotas.filter((mascota) => {
      const nombre = mascota.nombre?.toLowerCase() || "";
      const especie = mascota.especie?.toLowerCase() || "";
      const propietario = getOwnerName(mascota.cliente_id).toLowerCase();
      return (
        nombre.includes(searchValue) ||
        especie.includes(searchValue) ||
        propietario.includes(searchValue)
      );
    });

    filtradas.forEach((mascota) => {
      const ownerName = getOwnerName(mascota.cliente_id);
      const row = tbody.insertRow();
      row.innerHTML = `
        <td>${mascota.nombre}</td>
        <td class="sm-hidden">${mascota.especie}</td>
        <td>${ownerName}</td>
        <td class="text-right">
          <button onclick="editarMascota('${mascota.id}')" class="action-btn action-btn-green">✏️ Editar</button>
          <button onclick="confirmarEliminarMascota('${mascota.id}', '${mascota.nombre}')" class="action-btn action-btn-red">🗑️ Baja</button>
        </td>
      `;
    });

    document
      .getElementById("no-mascotas-found")
      .classList.toggle("hidden", filtradas.length > 0);
  } catch (error) {
    console.error("Error cargando mascotas:", error);
    alert("No se pudieron cargar los pacientes.");
  }
}

export async function editarMascota(id) {
  const form = document.getElementById("mascota-form");
  form.reset();
  document.getElementById("mascota-id").value = "";

  await populateClienteSelect();

  const changeOwnerBtn = document.getElementById("cambio-dueno-container");
  if (changeOwnerBtn) changeOwnerBtn.classList.add("hidden");

  if (id) {
    const mascotas = await seleccionarMascotas();
    const mascota = mascotas.find((m) => String(m.id) === String(id));
    if (mascota) {
      document.getElementById("mascota-form-title").textContent =
        "Modificar Mascota 🐾";
      document.getElementById("mascota-id").value = mascota.id;
      document.getElementById("mascota-nombre").value = mascota.nombre;
      document.getElementById("mascota-especie").value = mascota.especie;
      document.getElementById("mascota-raza").value = mascota.raza;
      document.getElementById("mascota-edad").value = mascota.edad;
      document.getElementById("mascota-salud").value = mascota.problemas_salud;
      document.getElementById("mascota-cliente-id").value = mascota.cliente_id;
      if (changeOwnerBtn) changeOwnerBtn.classList.remove("hidden");
    }
  } else {
    document.getElementById("mascota-form-title").textContent =
      "Nueva Mascota ➕";
  }

  showView("mascota-form-view");
}
export async function guardarMascota(event) {
  event.preventDefault();
  const id = document.getElementById("mascota-id").value;

  const formData = new FormData();
  formData.append("nombre", document.getElementById("mascota-nombre").value);
  formData.append("especie", document.getElementById("mascota-especie").value);
  formData.append("raza", document.getElementById("mascota-raza").value);
  formData.append("edad", document.getElementById("mascota-edad").value || "");
  formData.append(
    "problemas_salud",
    document.getElementById("mascota-salud").value
  );
  formData.append(
    "cliente_id",
    document.getElementById("mascota-cliente-id").value
  );

  try {
    if (id) {
      await actualizarMascotas(formData, id);
    } else {
      await insertarMascotas(formData);
    }
    showView("mascotas-list-view");
    cargarMascotas();
  } catch (error) {
    console.error("Error guardando mascota:", error);
    alert("No se pudo guardar la mascota.");
  }
}
export async function confirmarCambioDueno(mascotaId) {
  const newOwnerId = parseInt(
    document.getElementById("new-owner-select").value
  );
  if (!newOwnerId) return;

  const formData = new FormData();
  formData.append("cliente_id", newOwnerId);

  try {
    await actualizarMascotas(formData, mascotaId);
    showView("mascotas-list-view");
    cargarMascotas();
    hideModal();
    alert("Transferencia realizada correctamente.");
  } catch (error) {
    console.error("Error cambiando dueño:", error);
    alert("No se pudo transferir la mascota.");
  }
}

export async function eliminarMascotaUI(id) {
  try {
    const resultado = await eliminarMascotas(id);
    if (resultado?.success) {
      await cargarMascotas();
    } else {
      alert("❌ No se pudo eliminar la mascota.");
    }
  } catch (error) {
    console.error("Error eliminando mascota:", error);
    alert("❌ Error al eliminar la mascota.");
  }
}


export function confirmarEliminarMascota(id, nombre) {
  showModal(
    "Confirmar Baja Irreversible",
    `¿Estás segura de eliminar permanentemente a la paciente **${nombre}**?`,
    "Sí, Eliminar Paciente 🗑️",
    () => eliminarMascotaUI(id)
  );
}
