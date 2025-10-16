import { insertarUsuarios } from "../modelos/usuarios.js";

export async function registerUser(event) {
  if (event) event.preventDefault();

  const nombre = document.getElementById("reg-nombre")?.value.trim();
  const email = document.getElementById("reg-username")?.value.trim();
  const rol = document.getElementById("reg-rol")?.value;
  const password = document.getElementById("reg-password")?.value;
  const confirmar = document.getElementById("reg-password-confirm")?.value;

  if (!nombre || !email || !rol || !password || !confirmar) return;

  if (password !== confirmar) {
    alert("Las contraseñas no coinciden");
    return;
  }

  const formData = new FormData();
  formData.append("nombre_completo", nombre);
  formData.append("email", email);
  formData.append("rol", rol);
  formData.append("password", password);

  const resultado = await insertarUsuarios(formData);

  if (resultado.success) {
    alert("Usuario registrado correctamente");
    window.showView("login-view");
  } else {
    alert("Error al registrar usuario: " + (resultado.message || ""));
  }
}
