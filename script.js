let proveedores = [];
let productos = [];

const provNombre = document.getElementById("prov-nombre");
const provContacto = document.getElementById("prov-contacto");
const provDireccion = document.getElementById("prov-direccion");
const btnAgregarProveedor = document.getElementById("btn-agregar-proveedor");
const listaProveedores = document.getElementById("lista-proveedores");

const prodNombre = document.getElementById("prod-nombre");
const prodDescripcion = document.getElementById("prod-descripcion");
const prodPrecio = document.getElementById("prod-precio");
const prodCantidad = document.getElementById("prod-cantidad");
const btnAgregarProducto = document.getElementById("btn-agregar-producto");
const listaProductos = document.getElementById("lista-productos");

const totalElem = document.getElementById("total");
const vistaImpresion = document.getElementById("vista-impresion");
const btnImprimir = document.getElementById("btn-imprimir");

function actualizarProveedores() {
  listaProveedores.innerHTML = "";
  proveedores.forEach(p => {
    const li = document.createElement("li");
    li.textContent = `${p.nombre} - ${p.contacto} - ${p.direccion}`;
    listaProveedores.appendChild(li);
  });
  actualizarVista();
}

function actualizarProductos() {
  listaProductos.innerHTML = "";
  productos.forEach((p, index) => {
    const li = document.createElement("li");
    li.textContent = `${p.nombre} - ${p.cantidad} x ${p.precio} Bs = ${p.cantidad * p.precio} Bs `;

    // Crear botón de borrar
    const btnEliminar = document.createElement("button");
    btnEliminar.textContent = "x";
    btnEliminar.style.marginLeft = "10px";
    btnEliminar.style.color = "white";
    btnEliminar.style.backgroundColor = "red";
    btnEliminar.style.border = "none";
    btnEliminar.style.borderRadius = "4px";
    btnEliminar.style.cursor = "pointer";

    btnEliminar.addEventListener("click", () => {
      productos.splice(index, 1); // elimina solo el producto en esa posición
      actualizarProductos();      // vuelve a renderizar la lista
    });

    li.appendChild(btnEliminar);
    listaProductos.appendChild(li);
  });
  actualizarVista();
}


function calcularTotal() {
  return productos.reduce((acc, p) => acc + p.precio * p.cantidad, 0);
}

function actualizarVista() {
  const total = calcularTotal();
  totalElem.textContent = `${total.toFixed(2)} Bs`;

  let html = `<header style="text-align:center; margin-bottom:20px;">
    <h1>Registro de Compras</h1>
    <p>Documento Nº: RC-${String(Date.now()).slice(-6)}</p>
    <p>Fecha: ${new Date().toLocaleString()}</p>
  </header>`;

  // Proveedores
  if (proveedores.length === 0) {
    html += "<p>No se ha registrado proveedor.</p>";
  } else {
    html += "<table><thead><tr><th>Nombre</th><th>Contacto</th><th>Dirección</th></tr></thead><tbody>";
    proveedores.forEach(p => {
      html += `<tr><td>${p.nombre}</td><td>${p.contacto}</td><td>${p.direccion}</td></tr>`;
    });
    html += "</tbody></table>";
  }

  // Productos
  if (productos.length === 0) {
    html += "<p>No se han registrado productos.</p>";
  } else {
    html += "<table><thead><tr><th>Producto</th><th>Descripción</th><th>Cantidad</th><th>Precio Unit.</th><th>Subtotal</th></tr></thead><tbody>";
    productos.forEach(p => {
      html += `<tr>
        <td>${p.nombre}</td>
        <td>${p.descripcion || "Sin descripción"}</td>
        <td>${p.cantidad}</td>
        <td>${p.precio.toFixed(2)}</td>
        <td>${(p.cantidad * p.precio).toFixed(2)}</td>
      </tr>`;
    });
    html += "</tbody></table>";
  }

  html += `<h3>Total Acumulado: ${total.toFixed(2)} Bs</h3>`;
  vistaImpresion.innerHTML = html;
}

btnAgregarProveedor.addEventListener("click", () => {
  if (!provNombre.value) return alert("Ingrese nombre del proveedor");
  
  proveedores.push({
    nombre: provNombre.value,
    contacto: provContacto.value,
    direccion: provDireccion.value
  });

  // Limpiar inputs
  provNombre.value = provContacto.value = provDireccion.value = "";

  // Actualizar lista
  actualizarProveedores();

  // --- NUEVO: ocultar formulario y desactivar botón ---
  document.querySelector("fieldset").style.display = "none"; // Oculta el fieldset de proveedor
  btnAgregarProveedor.disabled = true; // Desactiva botón
  btnAgregarProveedor.style.backgroundColor = "#95a5a6"; // Cambia color a gris
});


btnAgregarProducto.addEventListener("click", () => {
  const precio = parseFloat(prodPrecio.value);
  const cantidad = parseInt(prodCantidad.value);
  if (!prodNombre.value || !precio || !cantidad) return alert("Ingrese producto y cantidad válida");
  productos.push({
    nombre: prodNombre.value,
    descripcion: prodDescripcion.value,
    precio,
    cantidad
  });
  prodNombre.value = prodDescripcion.value = prodPrecio.value = prodCantidad.value = "";
  actualizarProductos();
});

btnImprimir.textContent = "Descargar PDF";

btnImprimir.addEventListener("click", () => {
  const { jsPDF } = window.jspdf;

  html2canvas(vistaImpresion, { scale: 2 }).then(canvas => {
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");

    const imgWidth = 190; // ancho dentro de la hoja (A4 ~210mm)
    const pageHeight = 295;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    let position = 10;
    pdf.addImage(imgData, "PNG", 10, position, imgWidth, imgHeight);

    pdf.save(`Registro_Compras_${Date.now()}.pdf`);
  });
});

