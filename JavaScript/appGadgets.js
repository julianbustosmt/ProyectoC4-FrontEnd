const formulario = document.getElementById("form");
const inputs = document.querySelectorAll("#form input");
const resume_table = document.getElementById("resume_table");
let idBuscado = 0;

const urlbase = "http://localhost:8080/api/gadget";
const urlprod = "http://132.145.103.244:8080/api/gadget";

const expresiones = {
    brand: /^[a-zA-ZÀ-ÿ\s]{1,40}$/, // Letras y espacios, pueden llevar acentos.
    category: /^[a-zA-Z0-9\-\.\,\# ]{1,40}$/, // Letras, numeros, guion y guion_bajo
    name: /^[a-zA-Z0-9\-\.\,\# ]{1,40}$/, // Letras, numeros, guion y guion_bajo
    description: /^[a-zA-Z0-9\-\.\,\# ]{1,200}$/, // Letras, numeros, guion y guion_bajo
    price: /^.{1,19}$/, // hasta 19 digitos
    quantity: /^.{1,10}$/,
    photography: /^https?:\/\/[\w\-]+(\.[\w\-]+)+[/#?]?.*$/, // Letras, numeros, guion y guion_bajo
};

const campos = {
    brand: false,
    category: false,
    name: false,
    description: false,
    price: false,
    quantity: false,
    photography: false,
    availability: false,
};

const validarFormulario = (e) => {
    switch (e.target.name) {
        case "txtbrand":
            validarCampo(expresiones.brand, e.target, "brand");
            break;
        case "txtcategory":
            validarCampo(expresiones.category, e.target, "category");
            break;
        case "txtdescription":
            validarCampo(expresiones.description, e.target, "description");
            break;
        case "txtname":
            validarCampo(expresiones.name, e.target, "name");
            break;
        case "txtprice":
            validarCampo(expresiones.price, e.target, "price");
            break;
        case "txtquantity":
            validarCampo(expresiones.quantity, e.target, "quantity");
            break;
        case "txtphotography":
            validarCampo(expresiones.photography, e.target, "photography");
            break;
    }
};

const validarCampo = (expresion, input, campo) => {
    if (expresion.test(input.value)) {
        $(`#group-${campo}`).removeClass("form-group-incorrecto");
        $(`#group-${campo}`).addClass("form-group-correcto");
        $(`#group-${campo} i`).removeClass("far fa-times-circle");
        $(`#group-${campo} i`).addClass("fas fa-check-circle");
        $(`#group-${campo} .form-error`).removeClass("form-error-active");
        campos[campo] = true;
    } else {
        $(`#group-${campo}`).addClass("form-group-incorrecto");
        $(`#group-${campo}`).removeClass("form-group-correcto");
        $(`#group-${campo} i`).addClass("far fa-times-circle");
        $(`#group-${campo} i`).removeClass("fas fa-check-circle");
        $(`#group-${campo} .form-error`).addClass("form-error-active");
        campos[campo] = false;
    }
};

const confirmarSelectAvailability = () => {
    const value = $("#slcavailability").val();
    if (value == "null") {
        $("#group-availability").addClass("form-group-incorrecto");
        $("#group-availability").removeClass("form-group-correcto");
        $("#group-availability i").addClass("far fa-times-circle");
        $("#group-availability i").removeClass("fas fa-check-circle");
        $("#group-availability .form-error").addClass("form-error-active");
        campos["availability"] = false;
    } else {
        $("#group-availability").removeClass("form-group-incorrecto");
        $("#group-availability").addClass("form-group-correcto");
        $("#group-availability i").removeClass("far fa-times-circle");
        $("#group-availability i").addClass("fas fa-check-circle");
        $("#group-availability .form-error").removeClass("form-error-active");
        campos["availability"] = true;
    }
};

inputs.forEach((input) => {
    input.addEventListener("keyup", validarFormulario);
    input.addEventListener("blur", validarFormulario);
});


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
        url:`${urlbase}/all`,
        type:"GET",
        dataType:"json",
        success: function(response){
            $("#gadget-table").empty();
            response.forEach(element => {
                var row = $("<tr>");
                row.append($("<td data-titulo='MARCA:'>").text(element.brand));
                row.append($("<td data-titulo='NOMBRE:'style='width:10%'>").text(element.name));
                row.append($("<td data-titulo='DESCRIPCIÓN:'>").text(element.description));
                row.append($("<td data-titulo='PRECIO:'>").text(element.price));
                row.append($("<td data-titulo='DISPONIBILIDAD:'>").text(element.availability));
                row.append($("<td data-titulo='FOTO:'>").append($("<img>").attr("src", element.photography)));
                row.append($("<td class='accion'>").append('<button type="button" class="crud-button-details" onclick="mostrarDetalles('+element.id+')"><span><i class="icon ion-md-folder lead"></i></sapan></button>'));
                row.append($("<td class='accion'>").append('<button type="button" class="crud-button-edit" onclick="mostrarDetalles('+element.id+')"><span><i class="icon ion-md-create lead"></i></sapan></button><button type="button" class="crud-button-delete" onclick="borrarRegistro('+element.id+',\''+element.name+'\')"><span><i class="icon ion-md-trash lead"></i></sapan></button>'));
                $("#gadget-table").append(row);
            });
        },
        error: function(xhr,status){
            alert("Ocurrio un error en el consumo");
        },
    });
}

const registro = () => {
    if (
        campos.brand &&
        campos.category &&
        campos.name &&
        campos.description &&
        campos.price &&
        campos.quantity &&
        campos.photography &&
        campos.availability
    ) {
        $.ajax({
        url:`${urlbase}/all`,
        type:"GET",
        dataType:"json",
        success: function(response){
        if(response.length == 0){
            idMax = 0;
        }else{
            idMax = Math.max(...response.map(element => element.id));
        }
        const data = {
            id: idMax + 1,
            brand: $("#txtbrand").val(),
            name: $("#txtname").val(),
            category: $("#txtcategory").val(),
            description: $("#txtdescription").val(),
            quantity: $("#txtquantity").val(),
            photography: $("#txtphotography").val(),
            availability: $("#slcavailability").val(),
            price: $("#txtprice").val(),
        };
        console.log(data);
        $.ajax({
            url: `${urlbase}/new`,
            type: "POST",
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
                            "Registro exitoso",
                            "El usuario se registro correctamente",
                            "1 seg"
                        );
                    formulario.reset();
                    cargarTabla();
                },
            },
        });
        },
        });}else{
            showToast("Error", "Por favor diligencia correctamente el formulario", "Algo salio mal", true);
        }
}

const borrarRegistro = (id) => {
    $.ajax({
        url: `${urlbase}/${id}`,
        type: "DELETE",
        dataType: "json",
        success: (response) => {
            showToast(
                "Eliminado",
                "El usuario se elimino correctamente",
                "",true
            );
            cargarTabla();
        },
    });
}

const mostrarDetalles = (id) => {
    $.ajax({
        url: `${urlbase}/${id}`,
        type: "GET",
        dataType: "json",
        success: (response) => {
            idBuscado = response.id;
            $("#txtname").val(response.name),
            $("#txtbrand").val(response.brand),
            $("#txtdescription").val(response.description),
            $("#txtcategory").val(response.category),
            $("#txtprice").val(response.price),
            $("#slcavailability").val(response.availability),
            $("#txtquantity").val(response.quantity),
            $("#txtphotography").val(response.photography),
            showToast(
                "Datos listos",
                "Los datos fueron puestos en las celdas",
                "",
            );
            console.log(response);
        },
    });
}

const actualizarGatgets = () => {
    data = {
        id: idBuscado,
        name: $("#txtname").val(),
        brand: $("#txtbrand").val(),
        description: $("#txtdescription").val(),
        category: $("#txtcategory").val(),
        price: $("#txtprice").val(),
        availability: $("#slcavailability").val(),
        quantity: $("#txtquantity").val(),
        photography: $("#txtphotography").val(),
    };
            $.ajax({
                url: `${urlbase}/update`,
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
                                "Actualización exitoso",
                                "El usuario se actualizó correctamente",
                                "1 seg"
                            );
                            formulario.reset();
                            cargarTabla();
                    },
                },
            });
        };


$(document).ready(function () {
    cargarTabla();
})