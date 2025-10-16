import {
  cargarUsuarios,
  editarUsuario,
  confirmarEliminarUsuario,
  guardarUsuario,
} from "./usuarios.js";

import { logout } from "./login.js";
import {
  cargarClientes as renderClientes,
  guardarCliente,
  editarCliente,
  confirmarEliminarCliente,
} from "./clientes.js";
import {
  cargarMascotas as renderMascotas,
  guardarMascota,
  editarMascota,
  confirmarEliminarMascota,
  populateClienteSelect as populateClientesMascotas,
} from "./mascotas.js";

// ===== showView =====
export function showView(viewId) {
  document.querySelectorAll(".view").forEach((v) => {
    v.classList.add("hidden");
    v.classList.remove("active");
  });

  const view = document.getElementById(viewId);
  if (view) view.classList.remove("hidden");
  if (view) view.classList.add("active");
}

// ===== Safe fetch helper =====
async function safeFetchJson(endpoint) {
  try {
    const res = await fetch(
      `/julia-rodriguez/veterinaria-dogo/api/${endpoint}`
    );
    const text = await res.text();
    try {
      return JSON.parse(text);
    } catch {
      return [];
    }
  } catch (err) {
    console.error("Error en fetch:", err);
    return [];
  }
}

// ===== Wrappers =====
async function cargarClientes() {
  const clientes = await safeFetchJson("clientes.php");
  await renderClientes(clientes);
}

async function cargarMascotas() {
  const mascotas = await safeFetchJson("mascotas.php");
  await renderMascotas(mascotas);
  await populateClientesMascotas();
}

// ===== Inicialización =====
document.addEventListener("DOMContentLoaded", async () => {
  document.getElementById("app-header")?.classList.remove("hidden");

  await cargarClientes();
  await cargarMascotas();
  await cargarUsuarios(); 

  // Eventos generales
  document.getElementById("btn-logout")?.addEventListener("click", logout);
  document
    .getElementById("btn-dashboard")
    ?.addEventListener("click", async () => {
      await cargarClientes();
      await cargarMascotas();
      await cargarUsuarios();
      showView("dashboard-view");
    });

  document
    .getElementById("btn-clientes")
    ?.addEventListener("click", () => showView("clientes-list-view"));
  document
    .getElementById("btn-mascotas")
    ?.addEventListener("click", () => showView("mascotas-list-view"));

  // Clientes
  document
    .getElementById("cliente-form")
    ?.addEventListener("submit", guardarCliente);
  document
    .getElementById("cliente-search")
    ?.addEventListener("keyup", cargarClientes);
  document
    .getElementById("btn-nuevo-cliente")
    ?.addEventListener("click", () => editarCliente(null));
  document
    .getElementById("btn-cancelar-cliente")
    ?.addEventListener("click", () => {
      showView("clientes-list-view");
    });

  // Mascotas
  document
    .getElementById("mascota-form")
    ?.addEventListener("submit", guardarMascota);
  document
    .getElementById("btn-nueva-mascota")
    ?.addEventListener("click", () => editarMascota(null));
  document
    .getElementById("mascota-search")
    ?.addEventListener("keyup", cargarMascotas);
  document
    .getElementById("btn-cancelar-mascota")
    ?.addEventListener("click", () => {
      showView("mascotas-list-view");
    });
  // Usuarios
  document
    .getElementById("usuario-form")
    ?.addEventListener("submit", guardarUsuario);
  document
    .getElementById("usuario-search")
    ?.addEventListener("keyup", cargarUsuarios);
  document
    .getElementById("btn-nuevo-usuario")
    ?.addEventListener("click", () => editarUsuario(null));

  // Exponer funciones globales para botones dentro de tabla
  window.editarUsuario = editarUsuario;
  window.confirmarEliminarUsuario = confirmarEliminarUsuario;
  window.editarCliente = editarCliente;
  window.confirmarEliminarCliente = confirmarEliminarCliente;
  window.editarMascota = editarMascota;
  window.confirmarEliminarMascota = confirmarEliminarMascota;
});
