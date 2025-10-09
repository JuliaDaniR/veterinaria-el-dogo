import { logout } from "./admin.js";
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

// ===== Safe Fetch desde la API real =====
async function safeFetchJson(endpoint) {
  try {
    const res = await fetch(`/julia-rodriguez/veterinaria-dogo/api/${endpoint}`);
    const text = await res.text();
    try {
      return JSON.parse(text);
    } catch (err) {
      console.error("Respuesta no es JSON válido:", text);
      return [];
    }
  } catch (err) {
    console.error("Error en fetch:", err);
    return [];
  }
}

// ===== Wrappers para cargar datos =====
async function cargarClientes() {
  try {
    const clientes = await safeFetchJson("clientes.php");
    await renderClientes(clientes);
  } catch (err) {
    console.error("Error cargando clientes:", err);
  }
}

async function cargarMascotas() {
  try {
    const mascotas = await safeFetchJson("mascotas.php");
    await renderMascotas(mascotas);
    await populateClientesMascotas();
  } catch (err) {
    console.error("Error cargando mascotas:", err);
  }
}

// ===== Cambio de vistas =====
function showView(viewId) {
  document.querySelectorAll(".view").forEach(v => {
    v.classList.remove("active");
    v.classList.add("hidden");
  });

  const view = document.getElementById(viewId);
  if (view) {
    view.classList.add("active");
    view.classList.remove("hidden");
  }

  if (viewId === "clientes-list-view") cargarClientes();
  if (viewId === "mascotas-list-view") cargarMascotas();
}

window.showModal = function(titulo, mensaje, textoBoton, accionConfirmar) {
  if (confirm(`${titulo}\n\n${mensaje}`)) {
    accionConfirmar();
  }
};


// ===== Inicialización =====
document.addEventListener("DOMContentLoaded", () => {
  showView("dashboard-view");
  document.getElementById("app-header")?.classList.remove("hidden");

  // Eventos generales
  document.getElementById("btn-logout")?.addEventListener("click", logout);
  document.getElementById("btn-dashboard")?.addEventListener("click", () => showView("dashboard-view"));

  // Clientes
  document.getElementById("cliente-form")?.addEventListener("submit", guardarCliente);
  document.getElementById("cliente-search")?.addEventListener("keyup", cargarClientes);
  document.getElementById("btn-nuevo-cliente")?.addEventListener("click", () => editarCliente(null));
  document.getElementById("btn-cancelar-cliente")?.addEventListener("click", () => showView("clientes-list-view"));

  // Mascotas
  document.getElementById("mascota-form")?.addEventListener("submit", guardarMascota);
  document.getElementById("btn-nueva-mascota")?.addEventListener("click", () => editarMascota(null));
  document.getElementById("mascota-search")?.addEventListener("keyup", cargarMascotas);

  // Exponer funciones globales si se usan en HTML
  window.showView = showView;
  window.editarCliente = editarCliente;
  window.confirmarEliminarCliente = confirmarEliminarCliente;
  window.editarMascota = editarMascota;
  window.confirmarEliminarMascota = confirmarEliminarMascota;
});
