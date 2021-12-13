const formulario = document.getElementById("form");
const inputs = document.querySelectorAll("#form input");
const resume_table = document.getElementById("resume_table");

const urlprod = "http://129.151.107.247:8080/api/order";

let perfilGlobal;

const mostrarUsuario = () =>{
    const user = JSON.parse(sessionStorage.getItem('user'));
    console.log(user);
    if (user == null){
        alert("Necesita iniciar sesión");
        setTimeout(() => {
            window.location = '../index.html';
        }, 2000);
    }
    perfilGlobal = user;

    const tipo = user.type === 'ASE' ? 'Asesor Comercial' :
        user.type === 'COORD' ? 'Coordinador de Zona' : 'Administrador';

    const nombre = user.name;

    const perfil = `
    <li class="dropdown-item">
        Identificación: ${user.identification}
    </li>
    <li class="dropdown-item">
        Nombre: ${user.name}
    </li>
    <li class="dropdown-item">
        Tipo: ${user.type}
    </li >
    <li class="dropdown-item">
        Email: ${user.email}
    </li>
    <li class="dropdown-item">
        Zona: ${user.zone}
    </li>
    `
    $('#perfil').html(perfil);
    $(`#nombrePerfil`).html(nombre);
}

$(document).ready(() => {
    mostrarUsuario();
})

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

const cargarTabla = () => {
    $.ajax({
        url:`${urlprod}/all`,
        type:"GET",
        dataType:"json",
        success: function(response){
            $("#ordenes-table").empty();
            response.forEach(element => {
                const user = JSON.parse(sessionStorage.getItem('user'));
                if(element.salesMan.zone == user.zone){
                if(element.status == "Pendiente"){
                    var row = $("<tr>");
                    let fecha = new Date(element.registerDay);
                    
                    row.append($("<td data-titulo='ID:'>").text(element.id));
                    row.append($("<td data-titulo='FECHA:'>").text(fecha.toLocaleDateString("es-MX",{ weekday:'long', day:'numeric', month:'long', year:'numeric' })));
                    row.append($("<td data-titulo='ASESOR:'>").text(element.salesMan.name));
                    row.append($("<td class='DETALLE'>").append('<button type="button" class="btn btn-default" data-bs-toggle="modal" data-bs-target="#modalpedido" onclick="VerOrdenes('+element.id+')"><span><i class="icon ion-md-folder"></i></span></button>'));
                    row.append($("<td class='OPCIONES'>").append('<button type="button" class="btn btn-outline-success" onclick="aprobar(' + element.id + ',\'' + element.registerDay + '\')"><span><i class="icon ion-md-checkmark"></i></sapan></button><button type="button" class="btn btn-outline-danger" onclick="rechazar(' + element.id + ',\'' + element.registerDay + '\')"><span><i class="icon ion-md-close"></i></sapan></button>'));
                    $("#ordenes-table").append(row);};};
            });
        },
        error: function(xhr,status){
            alert("Ocurrio un error en el consumo");
        },
    });
}

const VerOrdenes = (id) => {
    $.ajax({
        url:`${urlprod}/${id}`,
        type:"GET",
        dataType:"json",
        success: function(response){
            console.log(response);
            $("#pedidos-table").empty();
            if(response.status=="Pendiente"){
                let map = new Map(Object.entries(response.products));
                for(let itera of map.keys()){
                    var row = $("<tr>");
                    row.append($("<td data-titulo='PRODUCTO:'>").text(response.products[itera].name));
                    row.append($("<td data-titulo='CANTIDAD:'>").text(response.quantities[itera]));
                    row.append($("<td data-titulo='FOTO:'>").append($("<img>").attr("src", response.products[itera].photography)));                    $("#pedidos-table").append(row);
                }
                }
        },
        error: function(xhr,status){
            alert("Ocurrio un error en el consumo");
        },
    });
}

const aprobar = (id, registro) => {
    data = {id: id, registerDay: registro, status: "Aprobada"};
    $.ajax({
        url: `${urlprod}/update`,
        type: "PUT",
        dataType: "json",
        headers: {
            "Content-Type": "application/json",
        },
        data: JSON.stringify(data),
        statusCode: {
            201: function () {
                document
                    .querySelectorAll(".form-group-correcto")
                    .forEach((icono) => {
                        icono.classList.remove("form-group-correcto");
                    });
                    showToast(
                        "Aprobación exitosa",
                        "La orden ha sido aceptada",
                        "1 seg"
                    );
                    cargarTabla();
            },
        }
    });
}

const rechazar = (id, registro) => {
    data = {id: id, registerDay: registro, status: "Rechazada"};
    $.ajax({
        url: `${urlprod}/update`,
        type: "PUT",
        dataType: "json",
        headers: {
            "Content-Type": "application/json",
        },
        data: JSON.stringify(data),
        statusCode: {
            201: function () {
                document
                    .querySelectorAll(".form-group-correcto")
                    .forEach((icono) => {
                        icono.classList.remove("form-group-correcto");
                    });
                    showToast(
                        "Aprobación exitosa",
                        "La orden ha sido aceptada",
                        "1 seg"
                    );
                    cargarTabla();
            },
        }
    });
}

$(document).ready(() => {
    cargarTabla();
})