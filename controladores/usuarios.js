// ===== Importaciones =====
import { seleccionarUsuarios, insertarUsuarios, actualizarUsuarios, eliminarUsuarios } from "../modelos/usuarios.js";

// ===== Modal y UI =====
const modal = document.getElementById("usuario-form-view");
const overlay = document.getElementById("usuario-modal-overlay");

function abrirUsuarioModal(titulo = "Nuevo Usuario") {
  if (!modal || !overlay) return;
  document.getElementById("usuario-form-title").textContent = titulo;
  modal.style.display = "block";
  overlay.style.display = "block";
}

function cerrarUsuarioModal() {
  if (!modal || !overlay) return;
  modal.style.display = "none";
  overlay.style.display = "none";
  document.getElementById("usuario-form")?.reset();
  document.getElementById("usuario-password-group").style.display = "block";
}

document.getElementById("btn-cancelar-usuario")?.addEventListener("click", cerrarUsuarioModal);
overlay?.addEventListener("click", cerrarUsuarioModal);

// ===== Cargar usuarios =====
export async function cargarUsuarios() {
  try {
    const usuarios = await seleccionarUsuarios();
    const tbody = document.getElementById("usuarios-table-body");
    if (!tbody) return;

    const searchValue = document.getElementById("usuario-search")?.value.toLowerCase() || "";
    tbody.innerHTML = "";

    const filtrados = usuarios.filter(u =>
      u.nombre_completo.toLowerCase().includes(searchValue) ||
      u.email.toLowerCase().includes(searchValue) ||
      u.rol.toLowerCase().includes(searchValue) ||
      (u.direccion || "").toLowerCase().includes(searchValue)
    );

    const mensaje = document.getElementById("no-usuarios-found");
    if (mensaje) mensaje.style.display = filtrados.length === 0 ? "block" : "none";

    filtrados.forEach(u => {
      const row = tbody.insertRow();
      row.innerHTML = `
        <td>${u.nombre_completo}</td>
        <td>${u.email}</td>
        <td>${u.rol}</td>
        <td>${u.direccion || ''}</td>
        <td class="text-right">
          <button onclick="editarUsuario(${u.id})" class="action-btn action-btn-blue">✏️ Editar</button>
          <button onclick="confirmarEliminarUsuario(${u.id}, '${u.nombre_completo}')" class="action-btn action-btn-red">🗑️ Eliminar</button>
        </td>
      `;
    });
  } catch (error) {
    console.error("Error cargando usuarios:", error);
  }
}

// ===== Guardar usuario =====
export async function guardarUsuario(event) {
  if (event) event.preventDefault();

  const id = document.getElementById("usuario-id")?.value || null;
  const nombre = document.getElementById("usuario-nombre")?.value.trim();
  const email = document.getElementById("usuario-email")?.value.trim();
  const rol = document.getElementById("usuario-rol")?.value;
  const direccion = document.getElementById("usuario-direccion")?.value.trim();
  const password = document.getElementById("usuario-password")?.value;
  const confirmar = document.getElementById("usuario-password-confirm")?.value;

  if (!nombre || !rol) { alert("❌ Todos los campos obligatorios."); return; }
  if (!id && (!email || !password)) { alert("❌ Email y contraseña son requeridos para nuevos usuarios."); return; }
  if (password && password !== confirmar) { alert("❌ Las contraseñas no coinciden."); return; }

  const formData = new FormData();
  formData.append("nombre_completo", nombre);
  formData.append("email", email);
  formData.append("rol", rol);
  formData.append("direccion", direccion);

  let resultado;

  if (id) {
    formData.append("accion", "actualizar");
    formData.append("id", id);
    if (password) formData.append("password", password);
    resultado = await actualizarUsuarios(formData);
  } else {
    formData.append("accion", "insertar");
    formData.append("password", password);
    resultado = await insertarUsuarios(formData);
  }

  if (resultado.success) {
    alert("✅ Usuario guardado correctamente");
    cerrarUsuarioModal();
    await cargarUsuarios();
  } else {
    alert("❌ Error: " + (resultado.message || ""));
  }
}

// ===== Editar usuario =====
export async function editarUsuario(id) {
  if (!id) {
    abrirUsuarioModal("Nuevo Usuario");
    document.getElementById("usuario-password-group").style.display = "block";
    return;
  }

  const usuarios = await seleccionarUsuarios();
  const u = usuarios.find(x => String(x.id) === String(id));
  if (!u) return;

  document.getElementById("usuario-id").value = u.id;
  document.getElementById("usuario-nombre").value = u.nombre_completo;
  document.getElementById("usuario-direccion").value = u.direccion || "";
  document.getElementById("usuario-email").value = u.email;
  document.getElementById("usuario-rol").value = u.rol;
  document.getElementById("usuario-password-group").style.display = "none";

  abrirUsuarioModal("Editar Usuario");
}

// ===== Eliminar usuario =====
export function confirmarEliminarUsuario(id, nombre) {
  if (confirm(`¿Seguro que deseas eliminar al usuario ${nombre}?`)) {
    eliminarUsuarioUI(id);
  }
}

export async function eliminarUsuarioUI(id) {
  const resultado = await eliminarUsuarios(id);
  if (resultado.success) await cargarUsuarios();
  else alert("No se pudo eliminar el usuario: " + (resultado.message || ""));
}