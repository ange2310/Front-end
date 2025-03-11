document.addEventListener("DOMContentLoaded", function () {
    const apiUrl = "http://185.253.153.175/test/products"; // URL de la API
    const authToken = localStorage.getItem("token"); // Token de autenticación
    let productos = [];

    // Renderizar productos en la tabla
    function renderizarProductos() {
        const tabla = document.getElementById("tablaProductos");
        tabla.innerHTML = "";

        productos.forEach((producto) => {
            const fila = document.createElement("tr");
            fila.setAttribute("data-id", producto.id || producto._id); // Verifica la clave correcta
            fila.innerHTML = `
                <td>${producto.id || producto._id}</td>
                <td>${producto.name}</td>
                <td>${producto.description}</td>
                <td>${producto.category}</td>
                <td>${producto.stock}</td>
                <td>$${parseFloat(producto.price).toFixed(2)}</td>
                <td>
                    <button class="btn btn-success btn-sm btn-editar"><i class="fas fa-pen"></i></button>
                    <button class="btn btn-danger btn-sm btn-eliminar"><i class="fas fa-times"></i></button>
                </td>
            `;
            tabla.appendChild(fila);
        });
    }

    // Obtener productos desde la API
    function cargarProductos() {
        fetch(apiUrl, {
            headers: { "Authorization": `Bearer ${authToken}` }
        })
        .then(response => {
            if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);
            return response.json();
        })
        .then(data => {
            console.log("Productos cargados:", data);
            productos = Array.isArray(data) ? data : [];
            renderizarProductos();
        })
        .catch(error => console.error("Error al cargar productos:", error));
    }

    // Agregar producto
    document.getElementById("formAgregar").addEventListener("submit", function (event) {
        event.preventDefault();

        const name = document.getElementById("nombre").value.trim();
        const description = document.getElementById("descripcion").value.trim();
        const category = document.getElementById("categoria").value.trim();
        const stock = document.getElementById("stock").value.trim();
        const price = document.getElementById("precio").value.trim();

        if (!name || !price || !description || !category || !stock) {
            alert("Todos los campos son obligatorios.");
            return;
        }

        const nuevoProducto = { name, description, price: parseFloat(price), category, stock: parseInt(stock) };

        fetch(apiUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${authToken}`
            },
            body: JSON.stringify(nuevoProducto)
        })
        .then(response => response.json())
        .then(data => {
            console.log("Producto agregado:", data);
            cargarProductos();
            $('#modalAgregar').modal('hide');
            document.getElementById("formAgregar").reset();
        })
        .catch(error => console.error("Error al agregar producto:", error));
    });

    // Eventos para editar y eliminar
    document.getElementById("tablaProductos").addEventListener("click", function (event) {
        const boton = event.target.closest("button");
        if (!boton) return;

        const fila = boton.closest("tr");
        const id = fila.getAttribute("data-id");

        if (boton.classList.contains("btn-eliminar")) {
            if (confirm("¿Seguro que deseas eliminar este producto?")) {
                fetch(`${apiUrl}/${id}`, { 
                    method: "DELETE",
                    headers: { "Authorization": `Bearer ${authToken}` }
                })
                .then(response => response.json())
                .then(data => {
                    console.log("Producto eliminado:", data);
                    cargarProductos();
                })
                .catch(error => console.error("Error al eliminar producto:", error));
            }
        } else if (boton.classList.contains("btn-editar")) {
            const producto = productos.find(p => (p.id || p._id) == id);
            if (!producto) {
                console.error("No se encontró el producto con ID:", id);
                return;
            }
            
            document.getElementById("edit-id").value = producto.id || producto._id;
            document.getElementById("edit-nombre").value = producto.name;
            document.getElementById("edit-descripcion").value = producto.description;
            document.getElementById("edit-categoria").value = producto.category;
            document.getElementById("edit-stock").value = producto.stock;
            document.getElementById("edit-precio").value = producto.price;

            $('#modalEditar').modal('show');
        }
    });

    // Guardar edición
    document.getElementById("formEditar").addEventListener("submit", function (event) {
        event.preventDefault();

        const id = document.getElementById("edit-id").value;
        const name = document.getElementById("edit-nombre").value.trim();
        const description = document.getElementById("edit-descripcion").value.trim();
        const category = document.getElementById("edit-categoria").value.trim();
        const stock = document.getElementById("edit-stock").value.trim();
        const price = document.getElementById("edit-precio").value.trim();

        const productoEditado = { name, description, price: parseFloat(price), category, stock: parseInt(stock) };

        fetch(`${apiUrl}/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${authToken}`
            },
            body: JSON.stringify(productoEditado)
        })
        .then(response => response.json())
        .then(data => {
            console.log("Producto editado:", data);
            cargarProductos();
            $('#modalEditar').modal('hide');
        })
        .catch(error => console.error("Error al editar producto:", error));
    });

    // Cargar productos al inicio
    cargarProductos();
});
