document.addEventListener("DOMContentLoaded", function () {
    const loginForm = document.getElementById("loginForm");

    if (loginForm) {
        loginForm.addEventListener("submit", async function (e) {
            e.preventDefault();

            const username = document.getElementById("username").value.trim();
            const password = document.getElementById("password").value.trim();
            const errorMsg = document.getElementById("error-msg");

            errorMsg.style.display = "none"; // Ocultar mensaje de error al intentar nuevamente

            try {
                const response = await fetch("http://185.253.153.175/test/login", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ username, password })
                });

                const data = await response.json();

                if (response.ok && data.token) {
                    localStorage.setItem("token", data.token); // Guardar token
                    window.location.href = "./Pages/dashboard.html"; // Redirigir
                } else {
                    errorMsg.style.display = "block";
                    errorMsg.innerText = data.message || "Usuario o contraseña incorrectos";
                }
            } catch (error) {
                console.error("Error:", error);
                errorMsg.style.display = "block";
                errorMsg.innerText = "Error al conectar con el servidor";
            }
        });
    }
});
