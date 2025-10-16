const API_BASE = "/julia-rodriguez/veterinaria-dogo/api/";

export async function login() {
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;
  const errorElement = document.getElementById("login-error");
  errorElement.classList.add("hidden");

  try {
    const response = await fetch(`${API_BASE}login.php`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        email: email,
        password: password,
      }),
    });

    const result = await response.json();

    if (result.success) {
      window.location.href = "principal.html";
    } else {
      errorElement.textContent =
        result.message || "Usuario o contraseña incorrectos.";
      errorElement.classList.remove("hidden");
    }
  } catch (err) {
    errorElement.textContent = "❌ Error al conectar con el servidor.";
    errorElement.classList.remove("hidden");
  }
}
export function logout() {
  // Limpiar sesión / token
  localStorage.removeItem("authToken");
  // Redirigir al login
  if (window.location.pathname.includes("principal.html")) {
    window.location.href = "index.html";
  } else {
    showView("login-view");
  }
}
