let perfilGlobal;

const urlbase = "http://localhost:8080/api/gadget";
const urlgadgets = "http://132.145.103.244:8080/api/gadget";
const urlorders = "http://132.145.103.244:8080/api/order";

const mostrarUsuario = () =>{
    const user = JSON.parse(sessionStorage.getItem('user'));
    console.log(user);
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
        url : `${urlgadgets}/all`,
        type : 'GET',
        dataType : 'json',
        success : function(response) {
            console.log(response);
            llenarTablaProductos(response);
        },
        error : function(error) {
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

    for(let i = 0; i<productos.length; i++){
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

const seleccionarProducto = (indexProducto)=>{
    detalle.push(productos[indexProducto]);
    $("#myModal").modal('hide');
    actualizarTablaPedido();
}

const actualizarTablaPedido = ()=>{
let tabla;
    for(let i = 0; i<detalle.length; i++){
        tabla += `
            <tr>
            <td data-titulo= 'NOMBRE:'>${detalle[i].name}</td>
            <td data-titulo= 'PRECIO:'>${detalle[i].price}</td>
            <td><img src="${detalle[i].photography}"></td>
            <td><button type="button" class="btn btn-dark id="cantidad" onclick="abrirModal()">Agregar cantidad</button></td>
            </tr>`;
    }
    console.log(tabla);
    $("#pedido").html(tabla);
}

const abrirModal = ()=>{
    $("#myModalQ").modal('show');
}

const guardarCantidad = ()=>{
    const quantitie = $("#cantidad").val();
    cantidades.push(quantitie);
    console.log(cantidades);
}

const guardar = ()=>{
    $.ajax({
        url : `${urlorders}/all`,
        type : 'GET',
        dataType : 'json',
        success : function(response) {
            if (response.length == 0) {
                idMax = 0;
            } else {
                idMax = Math.max(...response.map(element => element.id));
            }
            const tiempoTranscurrido = Date.now();
            
            let pedido = {
                id: idMax + 1,
                registerDay: new Date(tiempoTranscurrido),
                status:'Pendiente',
                salesMan: perfilGlobal,
                products: {},
                quantities: {}
            };
            for(let i = 0; i<detalle.length; i++){
                pedido.products[i+1] = detalle[i]; 
            }

            for(let i = 0; i<cantidades.length; i++){
                pedido.quantities[i+1] = cantidades[i];
            }
            console.log(pedido);
            
            $.ajax({
                url : `${urlorders}/new`,
                type : 'POST',
                dataType : 'json',
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
                    },
                }
            });
        }

    });

    
}



$(document).ready(() => {
    mostrarUsuario();
})