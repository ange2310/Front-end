document.addEventListener("DOMContentLoaded", function () {
    actualizarResumen();
});

function actualizarResumen() {
    // Obtiene los productos y tareas del localStorage, si no existen, asigna un array vacío
    let productos = JSON.parse(localStorage.getItem("productos")) || [];
    let tareas = JSON.parse(localStorage.getItem("tareas")) || [];

    console.log("Productos en localStorage:", productos);
    console.log("Tareas en localStorage:", tareas);

    // Selecciona los elementos del Dashboard donde se mostrará la cantidad
    let productosBox = document.querySelector(".small-box.bg-primary .inner h3");
    let tareasBox = document.querySelector(".small-box.bg-warning .inner h3");

    // Si los elementos existen, actualiza los valores
    if (productosBox && tareasBox) {
        productosBox.textContent = productos.length; // Muestra la cantidad de productos
        tareasBox.textContent = tareas.length; // Muestra la cantidad de tareas
    } else {
        console.error("No se encontraron los elementos en el DOM.");
    }
}

// Función para actualizar los datos en localStorage cuando se agregan o eliminan elementos
function guardarProductos(productos) {
    localStorage.setItem("productos", JSON.stringify(productos));
    actualizarResumen(); // Actualiza el dashboard después de guardar
}

function guardarTareas(tareas) {
    localStorage.setItem("tareas", JSON.stringify(tareas));
    actualizarResumen(); // Actualiza el dashboard después de guardar
}
