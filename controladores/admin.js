import { insertarAdministrador, seleccionarAdministrador } from "../modelos/admin.js";

// ================================
// Verifica si ya hay un admin registrado
// ================================
export async function checkAdminExists() {
  const admins = await seleccionarAdministrador();
  const registerView = document.getElementById("register-view");

  if (admins.length > 0) {
    registerView.innerHTML = `
      <p style="color:red; font-weight:bold; margin-top:2rem;">
        ⚠️ Ya existe un administrador registrado. No es posible crear otro.
      </p>
      <p>
        <a href="#" id="link-back-login">← Volver al login</a>
      </p>
    `;
    document.getElementById("link-back-login")?.addEventListener("click", (e) => {
      e.preventDefault();
      showView("login-view");
    });
    return true;
  }

  return false;
}


// ================================
// Función de registro
// ================================
export async function registerUser() {
  const nombre = document.getElementById("reg-nombre").value.trim();
  const email = document.getElementById("reg-username").value.trim();
  const password = document.getElementById("reg-password").value;
  const password2 = document.getElementById("reg-password-confirm").value;
  const errorElement = document.getElementById("register-error");

  errorElement.classList.add("hidden");

  if (!nombre || !email || !password || !password2) {
    errorElement.textContent = "Todos los campos son obligatorios.";
    errorElement.classList.remove("hidden");
    return;
  }

  if (password !== password2) {
    errorElement.textContent = "Las contraseñas no coinciden.";
    errorElement.classList.remove("hidden");
    return;
  }

  const formData = new FormData();
  formData.append("nombre_completo", nombre);
  formData.append("email", email);
  formData.append("password", password);
  formData.append("confirmar", password2);

  try {
    const resultado = await insertarAdministrador(formData);

    if (resultado.success) {
      alert("✅ Registro exitoso. Ahora puedes iniciar sesión.");
      showView("login-view");
    } else {
      errorElement.textContent = "⚠️ " + (resultado.message || "No se pudo registrar.");
      errorElement.classList.remove("hidden");
    }
  } catch (error) {
    console.error("Error en registro:", error);
    errorElement.textContent = "⚠️ Error inesperado. Intenta nuevamente.";
    errorElement.classList.remove("hidden");
  }
}

// ================================
// Funciones de navegación
// ================================
export function showView(viewId) {
  document.querySelectorAll(".view").forEach(v => v.classList.add("hidden"));
  const view = document.getElementById(viewId);
  if (view) view.classList.remove("hidden");
}

export function logout() {
  if (window.location.pathname.includes("principal.html")) {
    window.location.href = "index.html";
  } else {
    showView("login-view");
  }
}
