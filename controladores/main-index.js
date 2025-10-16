import { registerUser } from "./registro.js";
import { login } from "./login.js";

// ===== showView =====
export function showView(viewId) {
  document.querySelectorAll(".view").forEach(v => {
    v.classList.add("hidden");
    v.classList.remove("active");
  });

  const view = document.getElementById(viewId);
  if(view) view.classList.remove("hidden");
  if(view) view.classList.add("active");
}

// ===== Inicialización =====
document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("form-register")?.addEventListener("submit", registerUser);
  document.getElementById("form-login")?.addEventListener("submit", (e) => { e.preventDefault(); login(); });

  document.getElementById("link-register")?.addEventListener("click", (e) => {
    e.preventDefault();
    showView("register-view");
  });

  document.getElementById("link-back-login")?.addEventListener("click", (e) => {
    e.preventDefault();
    showView("login-view");
  });

  window.showView = showView;
});
