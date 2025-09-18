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

/* ===== Función de mensajes de error ===== */
function mostrarMensajeError(boton, mensaje) {
  let errorElem = boton.nextElementSibling;
  if (!errorElem || !errorElem.classList.contains("mensaje-error")) {
    errorElem = document.createElement("div");
    errorElem.className = "mensaje-error";
    boton.insertAdjacentElement("afterend", errorElem);
  }
  errorElem.textContent = mensaje;
  errorElem.style.display = "block";

  // Ocultar después de 3 segundos
  setTimeout(() => {
    errorElem.style.display = "none";
  }, 3000);
}

/* ===== Proveedores ===== */
function actualizarProveedores() {
  listaProveedores.innerHTML = "";
  proveedores.forEach((p) => {
    const li = document.createElement("li");
    li.textContent = `${p.nombre} - ${p.contacto} - ${p.direccion}`;
    listaProveedores.appendChild(li);
  });
  actualizarVista();
}

/* ===== Productos ===== */
function actualizarProductos() {
  listaProductos.innerHTML = "";
  productos.forEach((p, index) => {
    const li = document.createElement("li");
    li.style.display = "flex";
    li.style.justifyContent = "space-between";
    li.style.alignItems = "center";
    li.style.padding = "6px 10px";
    li.style.backgroundColor = index % 2 === 0 ? "#aefdf3ff" : "#d4ffbbff";

    const texto = document.createElement("span");
    texto.textContent = `${p.nombre} ➡ (${p.cantidad}) x (${p.precio}) = ${
      p.cantidad * p.precio
    } Bs`;

    const btnEliminar = document.createElement("button");
    btnEliminar.textContent = "borrar";
    btnEliminar.style.color = "white";
    btnEliminar.style.margin = "2px";
    btnEliminar.style.backgroundColor = "#ff0000";
    btnEliminar.style.border = "none";
    btnEliminar.style.borderRadius = "10px";
    btnEliminar.style.cursor = "pointer";

    btnEliminar.addEventListener("click", () => {
      productos.splice(index, 1);
      actualizarProductos();
    });

    li.appendChild(texto);
    li.appendChild(btnEliminar);

    listaProductos.appendChild(li);
  });
  actualizarVista();
}

/* ===== Calcular Totales ===== */
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

  if (proveedores.length === 0) {
    html += "<p>No se ha registrado proveedor.</p>";
  } else {
    html +=
      "<table><thead><tr><th>Nombre del Proveedor</th><th>Contacto</th><th>Dirección</th></tr></thead><tbody>";
    proveedores.forEach((p) => {
      html += `<tr><td>${p.nombre}</td><td>${p.contacto}</td><td>${p.direccion}</td></tr>`;
    });
    html += "</tbody></table>";
  }

  if (productos.length === 0) {
    html += "<p>No se han registrado productos.</p>";
  } else {
    html +=
      "<table><thead><tr><th>Producto</th><th>Descripción</th><th>Cantidad</th><th>Precio Unit.</th><th>Subtotal</th></tr></thead><tbody>";
    productos.forEach((p) => {
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

/* ===== Eventos ===== */
btnAgregarProveedor.addEventListener("click", () => {
  if (!provNombre.value) {
    return mostrarMensajeError(btnAgregarProveedor, "Ingrese nombre del proveedor");
  }

  proveedores.push({
    nombre: provNombre.value,
    contacto: provContacto.value,
    direccion: provDireccion.value,
  });

  provNombre.value = provContacto.value = provDireccion.value = "";

  actualizarProveedores();

  document.querySelector("fieldset").style.display = "none";
  btnAgregarProveedor.disabled = true;
  btnAgregarProveedor.style.backgroundColor = "#95a5a6";
});

btnAgregarProducto.addEventListener("click", () => {
  const precio = parseFloat(prodPrecio.value);
  const cantidad = parseInt(prodCantidad.value);

  if (!prodNombre.value || !precio || !cantidad) {
    return mostrarMensajeError(btnAgregarProducto, "Ingrese producto, precio y cantidad válida");
  }

  productos.push({
    nombre: prodNombre.value,
    descripcion: prodDescripcion.value,
    precio,
    cantidad,
  });

  prodNombre.value = prodDescripcion.value = prodPrecio.value = prodCantidad.value = "";

  actualizarProductos();
});

btnImprimir.textContent = "Descargar PDF";

btnImprimir.addEventListener("click", () => {
  if (!proveedores.length) {
    return mostrarMensajeError(btnImprimir, "Debe registrar al menos un proveedor");
  }
    if (!productos.length) {
    return mostrarMensajeError(btnImprimir, "Debe registrar al menos un producto");
  }

  const { jsPDF } = window.jspdf;

  html2canvas(vistaImpresion, { scale: 2 }).then((canvas) => {
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "letter");

    const imgWidth = 190;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    pdf.addImage(imgData, "PNG", 10, 10, imgWidth, imgHeight);
    pdf.save(`Registro_Compras_${Date.now()}.pdf`);
  });
});
