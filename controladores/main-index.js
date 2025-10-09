import { checkAdminExists, registerUser, showView } from "./admin.js";
import { login } from "./login.js";

document.addEventListener("DOMContentLoaded", async () => {
  await checkAdminExists();

  // Eventos de formularios
  document.getElementById("form-register")?.addEventListener("submit", (e) => {
    e.preventDefault();
    registerUser();
  });

  document.getElementById("form-login")?.addEventListener("submit", (e) => {
    e.preventDefault();
    login();
  });

  // Navegación entre vistas
  document
    .getElementById("link-register")
    ?.addEventListener("click", async (e) => {
      e.preventDefault();
      const yaExiste = await checkAdminExists();
      if (!yaExiste) {
        showView("register-view");
      }else{
        alert("⚠️ Ya existe un administrador registrado. Por favor, inicia sesión.");
      }
    });

  document.getElementById("link-back-login")?.addEventListener("click", (e) => {
    e.preventDefault();
    showView("login-view");
  });

  // Exponer función global si se usa en HTML
  window.showView = showView;
});
