const codigo = document.getElementById('codigo');
const producto = document.getElementById('producto');
const cantidad = document.getElementById('cantidad');
const precio = document.getElementById('precio');
const categoria = document.getElementById('categoria');

const btnGuardar = document.getElementById('btnGuardar');
const btnLimpiar = document.getElementById('btnLimpiar');
const btnPDF = document.getElementById('btnPDF');

const tablaProductos = document.getElementById('tablaProductos');
const totalInventario = document.getElementById('totalInventario');

let productos = [];
let indiceEditar = null;

btnGuardar.addEventListener('click', function () {
    if (codigo.value.trim() === '' ||
        producto.value.trim() === '' || 
        cantidad.value.trim() === '' ||
        precio.value.trim() === '' ||
        categoria.value.trim() === '') {
        alert('Por favor, complete todos los campos');
        return;
    }
    
    if (Number(precio.value) <= 0 || Number(cantidad.value) <= 0) {
        alert("EL PRECIO Y LA CANTIDAD DEBEN SER MAYORES A CERO.");
        return;
    }

    const nuevoProducto = {
        codigo: codigo.value.trim(),
        nombre: producto.value.trim(),
        cantidad: Number(cantidad.value),
        precio: Number(precio.value),
        categoria: categoria.value
    };

    if (indiceEditar !== null) {
        productos[indiceEditar] = nuevoProducto;
        indiceEditar = null;
        btnGuardar.textContent = 'Guardar producto';
    } else {
        productos.push(nuevoProducto);
    }

    mostrarProductos();
    limpiarFormulario();
});

function mostrarProductos() {
    tablaProductos.innerHTML = '';
    let sumaInventario = 0;

    productos.forEach(function (prod, index) {
        let totalProducto = prod.precio * prod.cantidad;
        sumaInventario += totalProducto;

        let fila = document.createElement('tr');
        fila.innerHTML = `
            <td>${prod.codigo}</td>
            <td>${prod.nombre}</td>
            <td>${prod.categoria}</td>
            <td>L. ${prod.precio.toFixed(2)}</td>
            <td>${prod.cantidad}</td>
            <td>L. ${totalProducto.toFixed(2)}</td>
            <td>
                <button class="btnEditar" onclick="cargarParaEditar(${index})" style="margin-right: 5px;">Editar</button>
                <button class="btnEliminar" onclick="eliminarProducto(${index})">Eliminar</button>
            </td>
        `;
        tablaProductos.appendChild(fila);
    });

    totalInventario.textContent = sumaInventario.toFixed(2);
}

btnPDF.addEventListener('click', function () {
    if (productos.length === 0) {
        alert('No hay productos en el inventario para generar un reporte.');
        return;
    }

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    
    doc.setFontSize(18);
    doc.text('REPORTE GENERAL DE INVENTARIO', 14, 20);
    
    doc.setFontSize(10);
    const fechaActual = new Date().toLocaleString();
    doc.text(`Fecha de emisión: ${fechaActual}`, 14, 28);

    const filasTabla = [];
    let granTotal = 0;

    productos.forEach(prod => {
        const totalProducto = prod.precio * prod.cantidad;
        granTotal += totalProducto;
        
        filasTabla.push([
            prod.codigo,
            prod.nombre,
            prod.categoria,
            prod.cantidad,
            `L. ${prod.precio.toFixed(2)}`,
            `L. ${totalProducto.toFixed(2)}`
        ]);
    });

    const columnasTabla = ["Código", "Descripción", "Categoría", "Cant.", "Precio Unit.", "Total"];

    doc.autoTable({
        startY: 35,
        head: [columnasTabla],
        body: filasTabla,
        theme: 'grid',
        headStyles: { fillColor: [41, 128, 185] }
    });

    const finalY = doc.lastAutoTable.finalY;
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text(`Valor Total del Inventario: L. ${granTotal.toFixed(2)}`, 14, finalY + 15);

    doc.save('Reporte_Inventario.pdf');
});

function cargarParaEditar(index) {
    indiceEditar = index;
    const prod = productos[index];
    
    codigo.value = prod.codigo;
    producto.value = prod.nombre;
    cantidad.value = prod.cantidad;
    precio.value = prod.precio;
    categoria.value = prod.categoria;
    
    btnGuardar.textContent = 'Actualizar';
}

function eliminarProducto(index) {
    if (confirm('¿Está seguro de que desea eliminar este producto?')) {
        productos.splice(index, 1);
        if (indiceEditar === index) {
            indiceEditar = null;
            btnGuardar.textContent = 'Guardar producto';
            limpiarFormulario();
        }
        mostrarProductos();
    }
}

function limpiarFormulario() {
    codigo.value = '';
    producto.value = '';
    cantidad.value = '';
    precio.value = '';
    categoria.value = '';
}

btnLimpiar.addEventListener('click', function() {
    limpiarFormulario();
    indiceEditar = null;
    btnGuardar.textContent = 'Guardar producto';
});