import {
  seleccionarClientes,
  insertarClientes,
  actualizarClientes,
  eliminarClientes,
} from "../modelos/clientes.js";
import { seleccionarMascotas } from "../modelos/mascotas.js"; 
import { showView } from "./main-principal.js";

export async function cargarClientes() {
  try {
    const [clientes, mascotas] = await Promise.all([
      seleccionarClientes(),
      seleccionarMascotas(), 
    ]);

    const tbody = document.getElementById("clientes-table-body");
    const searchValue =
      document.getElementById("cliente-search")?.value.toLowerCase() || "";
    tbody.innerHTML = "";

    const filtrados = clientes.filter(
      (c) =>
        c.nombre.toLowerCase().includes(searchValue) ||
        c.apellido.toLowerCase().includes(searchValue) ||
        c.telefono.includes(searchValue)
    );

    document
      .getElementById("no-clientes-found")
      .classList.toggle("hidden", filtrados.length > 0);

    filtrados.forEach((cliente) => {
      const mascotasCliente = mascotas.filter(
        (m) => String(m.cliente_id) === String(cliente.id)
      );

      const nombresMascotas =
        mascotasCliente.length > 0
          ? mascotasCliente.map((m) => m.nombre).join(", ")
          : "—";

      const row = tbody.insertRow();
      row.innerHTML = `
    <td>${cliente.nombre} ${cliente.apellido}</td>
    <td>${cliente.telefono || "—"}</td>
    <td>${nombresMascotas}</td>
    <td class="text-right">
      <button onclick="editarCliente(${
        cliente.id
      })" class="action-btn action-btn-blue">✏️ Editar</button>
      <button onclick="confirmarEliminarCliente(${cliente.id}, '${
        cliente.nombre
      } ${
        cliente.apellido
      }')" class="action-btn action-btn-red">🗑️ Baja</button>
    </td>
  `;

    });
  } catch (error) {
    console.error("Error cargando clientes:", error);
    alert("No se pudieron cargar los clientes.");
  }
}

export async function guardarCliente(event) {
  event.preventDefault();

  const guardarBtn = document.getElementById("btn-guardar-cliente");
  guardarBtn.disabled = true;
  guardarBtn.textContent = "Guardando...";

  const id = document.getElementById("cliente-id").value;
  const formData = new FormData();
  formData.append("nombre", document.getElementById("cliente-nombre").value);
  formData.append(
    "apellido",
    document.getElementById("cliente-apellido").value
  );
  formData.append(
    "telefono",
    document.getElementById("cliente-telefono").value
  );
  formData.append("email", document.getElementById("cliente-email").value);
  formData.append(
    "direccion",
    document.getElementById("cliente-direccion").value
  );

  try {
    const resultado = id
      ? await actualizarClientes(formData, id)
      : await insertarClientes(formData);

    if (resultado.success) {
      showView("clientes-list-view");
      await cargarClientes();
    } else {
      alert("❌ No se pudo guardar el cliente.");
    }
  } catch (error) {
    console.error("Error guardando cliente:", error);
    alert("❌ Error al guardar el cliente.");
  } finally {
    guardarBtn.disabled = false;
    guardarBtn.textContent = "💾 Guardar Cliente";
  }
}

export async function eliminarClienteUI(id) {
  try {
    await eliminarClientes(id);
    await cargarClientes();
  } catch (error) {
    console.error("Error eliminando cliente:", error);
    alert("No se pudo eliminar el cliente.");
  }
}

export async function editarCliente(id) {
  const form = document.getElementById("cliente-form");
  form.reset();
  document.getElementById("cliente-id").value = "";

  if (id) {
    const clientes = await seleccionarClientes();
    const cliente = clientes.find((c) => String(c.id) === String(id));
    if (cliente) {
      document.getElementById("cliente-form-title").textContent =
        "Modificar Cliente 👥";
      document.getElementById("cliente-id").value = cliente.id;
      document.getElementById("cliente-nombre").value = cliente.nombre;
      document.getElementById("cliente-apellido").value = cliente.apellido;
      document.getElementById("cliente-telefono").value = cliente.telefono;
      document.getElementById("cliente-email").value = cliente.email;
      document.getElementById("cliente-direccion").value = cliente.direccion;
    }
  } else {
    document.getElementById("cliente-form-title").textContent =
      "Nuevo Cliente ➕";
  }

  showView("cliente-form-view");
}

export function confirmarEliminarCliente(id, nombre) {
  showModal(
    "Confirmar Baja Irreversible",
    `¿Estás seguro de **eliminar** al cliente **${nombre}**?`,
    "Sí, Eliminar Cliente 🗑️",
    () => eliminarClienteUI(id)
  );
}
