let perfilGlobal;

const urlbase = "http://localhost:8080/api/gadget";
const urlgadgets = "http://129.151.107.247:8080/api/gadget";
const urlorders = "http://129.151.107.247:8080/api/order";

const mostrarUsuario = () => {
    const user = JSON.parse(sessionStorage.getItem('user'));
    console.log(user);
    if (user == null) {
        alert("Necesita iniciar sesión");
        setTimeout(() => {
            window.location = '../index.html';
        }, 500);
    }
    perfilGlobal = user;

    const tipo = user.type === 'ASE' ? 'Asesor Comercial' :
        user.type === 'COORD' ? 'Coordinador de Zona' : 'Administrador';

    const nombre = user.name;

    const perfil = `
    <li class="dropdown-item">
        ID: ${user.identification}
    </li>
    <li class="dropdown-item">
        ${tipo}
    </li >
    <li class="dropdown-item">
        ${user.email}
    </li>
    <li class="dropdown-item">
        ${user.zone}
    </li>
    `
    $('#perfil').html(perfil);
    $(`#nombrePerfil`).html(nombre);
    console.log(perfil)
}

const showToast = (toastheader, toastbody, toastsmall, error) => {
    $("#toast-header").html(toastheader);
    $("#toast-body").html(toastbody);
    $("#toast-small").html(toastsmall);
    if (error) {
        //Como poner una imagen en el toast?
        $("#myToast").addClass("toast bg-warning");
        $("#myToast").removeClass("toast bg-success");
    } else {
        $("#myToast").addClass("toast bg-success");
        $("#myToast").removeClass("toast bg-warning");
    }
    $("#myToast").toast("show");
};


const buscarProductos = () => {
    $.ajax({
        url: `${urlgadgets}/all`,
        type: 'GET',
        dataType: 'json',
        success: function (response) {
            console.log(response);
            llenarTablaProductos(response);
        },
        error: function (error) {
            showToast('Error', 'No hay productos registrados', '', true);
        }
    });
}

const detalle = [];
let productos = [];
let cantidades = [];

const llenarTablaProductos = (response) => {
    productos = response;

    let tabla = `
        <table class="table">
        <thead class="table-dark"><tr><th>ID</th><th>MARCA</th><th>CATEGORIA</th>
        <th>NOMBRE</th><th>PRECIO</th><th>Accion</th></tr>
        <body></thead>
    `;

    for (let i = 0; i < productos.length; i++) {
        tabla += `
            <tr>
                <td data-titulo= 'ID:' ">${productos[i].id}</td>
                <td data-titulo= 'MARCA:'>${productos[i].brand}</td>
                <td data-titulo= 'CATEGORIA:'>${productos[i].category}</td>
                <td data-titulo= 'NOMBRE:'>${productos[i].name}</td>
                <td data-titulo= 'PRECIO:'>${productos[i].price}</td>
                <td><button class="btn btn-dark "onclick="seleccionarProducto(${i})">Seleccionar</button></td>
            </tr>
        `;
    }
    $("#modal-body").html(tabla);
    $("#myModal").modal('show');
}

let lista = [];
const seleccionarProducto = (indexProducto) => {
    if (detalle.length == 0) {
        lista.push(productos[indexProducto].id);
        detalle.push(productos[indexProducto]);
        $("#myModal").modal('hide');
        actualizarTablaPedido();
    } else {
        if (!lista.includes(productos[indexProducto].id)) {
            lista.push(productos[indexProducto].id);
            detalle.push(productos[indexProducto]);
            $("#myModal").modal('hide');}
            actualizarTablaPedido();
    }
}

const actualizarTablaPedido = () => {
    let tabla;
    for (let i = 0; i < detalle.length; i++) {
        tabla += `
            <tr id="fila${[i]}">
            <td data-titulo= 'NOMBRE:'>${detalle[i].name}</td>
            <td data-titulo= 'PRECIO:'>${detalle[i].price}</td>
            <td><img src="${detalle[i].photography}"></td>
            <td><button type="button" class="btn btn-dark id="cantidad" onclick="abrirModal()">Agregar cantidad</button></td>
            <td><button type="button" class="btn btn-outline-danger" onclick="quitar('${[i]}')"><span><i class="icon ion-md-close"></i></sapan></button></td>
            </tr>`;
    }
    console.log(tabla);
    $("#pedido").html(tabla);
}

const quitar = (i) => {
    $("#fila" + [i]).remove();
    var ind = parseInt(i);
    detalle.splice([ind], 1);
}

const abrirModal = () => {
    $("#myModalQ").modal('show');
}

const guardarCantidad = () => {
    if ($("#cantidad").val() != "") {
        const quantitie = $("#cantidad").val();
        cantidades.push(quantitie);
        showToast("Cantidad valida", "Se registrará", "");
        $("#cantidad").val("");
    } else {
        showToast('Error', 'Ingrese un número, por favor', '', true);
    }
}

const guardar = () => {
    $.ajax({
        url: `${urlorders}/all`,
        type: 'GET',
        dataType: 'json',
        success: function (response) {
            if (response.length == 0) {
                idMax = 0;
            } else {
                idMax = Math.max(...response.map(element => element.id));
            }
            const tiempoTranscurrido = Date.now();

            let pedido = {
                id: idMax + 1,
                registerDay: new Date(tiempoTranscurrido),
                status: 'Pendiente',
                salesMan: perfilGlobal,
                products: {},
                quantities: {}
            };
            for (let i = 0; i < detalle.length; i++) {
                pedido.products[i + 1] = detalle[i];
            }

            for (let i = 0; i < cantidades.length; i++) {
                pedido.quantities[i + 1] = cantidades[i];
            }
            console.log(pedido);
            if (cantidades.length == document.getElementById("pedido").rows.length) {
                $.ajax({
                    url: `${urlorders}/new`,
                    type: 'POST',
                    dataType: 'json',
                    headers: {
                        "Content-Type": "application/json",
                    },
                    data: JSON.stringify(pedido),
                    statusCode: {
                        201: function () {

                            showToast(
                                "Registro exitoso",
                                "Su pedido se registro correctamente",
                                ""
                            );
                            location.reload();
                        },
                    }
                });
            } else { showToast('Error', 'Usted no ha ingresado cantidades', '', true); }
        }

    });


}



$(document).ready(() => {
    mostrarUsuario();
})