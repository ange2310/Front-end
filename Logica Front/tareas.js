document.addEventListener("DOMContentLoaded", function () {
    const apiUrl = "http://185.253.153.175/test/tasks"; // URL de la API
    const authToken = localStorage.getItem("token"); // Obtener el token de autenticación
    let tareas = [];

    if (!authToken) {
        alert("No hay token de autenticación. Inicia sesión.");
        return;
    }

    // Función para renderizar las tareas en la tabla
    function renderizarTareas() {
        const tabla = document.getElementById("tablaTareas");
        tabla.innerHTML = "";

        tareas.forEach((tarea, index) => {
            const fila = document.createElement("tr");
            const tareaId = tarea.id || tarea._id;
            
            fila.setAttribute("data-id", tareaId);
            fila.innerHTML = `
                <td>${index + 1}</td>
                <td>${tarea.title}</td>
                <td>${tarea.description}</td>
                <td>${tarea.status}</td>
                <td>${tarea.priority}</td>
                <td>${new Date(tarea.due_date).toLocaleDateString()}</td>
            `;
            tabla.appendChild(fila);
        });
    }

    // Función para obtener tareas desde la API
    async function cargarTareas() {
        try {
            const response = await fetch(apiUrl, {
                headers: { "Authorization": `Bearer ${authToken}` }
            });

            if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);

            const data = await response.json();
            console.log("Tareas cargadas:", data);
            tareas = Array.isArray(data) ? data : [];
            renderizarTareas();
        } catch (error) {
            console.error("Error al cargar tareas:", error);
        }
    }

    // Cargar tareas al inicio
    cargarTareas();
});