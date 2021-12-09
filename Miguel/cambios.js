const formulario = document.getElementById("form");
const inputs = document.querySelectorAll("#form input");
const resume_table = document.getElementById("resume_table");

const urlbase = "http://localhost:8080/api/user";
const urlprod = "http://129.151.107.247:8080/api/user";

const expresiones = {
    identification: /^.{6,10}$/, //  4 a 12 digitos.
    name: /^[a-zA-ZÀ-ÿ\s]{1,40}$/, // Letras y espacios, pueden llevar acentos.
    address: /^[a-zA-Z0-9\-\.\,\# ]{1,20}$/, // Letras, numeros, guion y guion_bajo
    cellphone: /^[0-9]{10}$/, // 11 digitos
    email: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/, // Email
    password: /^.{4,12}$/, // 4 a 12 digitos.
};

const campos = {
    identification: false,
    name: false,
    address: false,
    cellPhone: false,
    email: false,
    password: false,
    type: false,
    zone: false
};

const validarFormulario = (e) => {
    switch (e.target.name) {
        case "txtidentification":
            validarCampo(expresiones.identification, e.target, "identification");
            break;
        case "txtname":
            validarCampo(expresiones.name, e.target, "name");
            break;
        case "txtaddress":
            validarCampo(expresiones.address, e.target, "address");
            break;
        case "txtcellPhone":
            validarCampo(expresiones.cellphone, e.target, "cellPhone");
            break;
        case "txtemail":
            validarCampo(expresiones.email, e.target, "email");
            break;
        case "txtpassword":
            validarCampo(expresiones.password, e.target, "password");
            confirmarPassword();
            break;
        case "txtconfpassword":
            confirmarPassword();
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

const confirmarPassword = () => {
    password1 = $("#txtpassword").val();
    password2 = $("#txtconfpassword").val();

    if (password1 !== password2) {
        $("#group-confpassword").addClass("form-group-incorrecto");
        $("#group-confpassword").removeClass("form-group-correcto");
        $("#group-confpassword i").addClass("far fa-times-circle");
        $("#group-confpassword i").removeClass("fas fa-check-circle");
        $("#group-confpassword .form-error").addClass("form-error-active");
        campos["password"] = false;
    } else {
        $("#group-confpassword").removeClass("form-group-incorrecto");
        $("#group-confpassword").addClass("form-group-correcto");
        $("#group-confpassword i").removeClass("far fa-times-circle");
        $("#group-confpassword i").addClass("fas fa-check-circle");
        $("#group-confpassword .form-error").removeClass("form-error-active");
        campos["password"] = true;
    }
};

const confirmarSelectType = () => {
    const value = $("#slctype").val();
    console.log(value);
    console.log(typeof value);
    if (value == "null") {
        console.log("entro");
        $("#group-type .form-error").addClass("form-error-active");
    } else {
        $(`#group-type .form-error`).removeClass("form-error-active");
        campos["type"] = true;
    }
};

const confirmarSelectZone = () => {
    const value = $("#slczone").val();
    console.log(value);
    console.log(typeof value);
    if (value == "null") {
        console.log("entro");
        $("#group-zone .form-error").addClass("form-error-active");
    } else {
        $(`#group-zone .form-error`).removeClass("form-error-active");
    }
    campos["zone"] = true;
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
        url:`${urlprod}/all`,
        type:"GET",
        dataType:"json",
        success: function(response){
            $("#user-table").empty();
            response.forEach(element => {
                var row = $("<tr>");
                row.append($("<td data-titulo='ID:'>").text(element.identification));
                row.append($("<td data-titulo='NOMBRE:'>").text(element.name));
                row.append($("<td data-titulo='CELULAR:'>").text(element.cellPhone));
                row.append($("<td data-titulo='TIPO:'>").text(element.type));
                row.append($("<td data-titulo='ZONA:'>").text(element.zone));
                row.append($("<td class='accion'>").append('<button type="button" class="crud-button-details" onclick="mostrarDetalles('+element.id+')"><span><i class="icon ion-md-folder lead"></i></sapan></button>'));
                row.append($("<td class='accion'>").append('<button type="button" class="crud-button-edit" onclick="mostrarDetalles('+element.id+')"><span><i class="icon ion-md-create lead></i></sapan></button><button type="button" class="crud-button-delete" onclick="borrarRegistro('+element.id+',\''+element.name+'\')"><span><i class="icon ion-md-trash lead"></i></sapan></button>'));
                $("#user-table").append(row);
            });
        },
        error: function(xhr,status){
            alert("Ocurrio un error en el consumo");
        },
    });
}

const registro = (emailexist) => {
    emailexist = $("#txtemail").val();
    $.ajax({
        url: urlprod + "/emailexist/" + emailexist,
        type: "GET",
        dataType: "json",
        success: (response) => {
            if (response) {
                showToast(
                    "Error",
                    "El correo ya existe",
                    "Por favor ingrese otro correo",
                    true
                );
            } else {
                if (
                    campos.name &&
                    campos.password &&
                    campos.email &&
                    campos.identification &&
                    campos.address &&
                    campos.cellPhone &&
                    campos.type &&
                    campos.zone
                ) {
                        $.ajax({
                            url:`${urlprod}/all`,
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
                                    identification: $("#txtidentification").val(),
                                    name: $("#txtname").val(),
                                    address: $("#txtaddress").val(),
                                    cellPhone: $("#txtcellPhone").val(),
                                    email: $("#txtemail").val(),
                                    password: $("#txtpassword").val(),
                                    zone: $("#slczone").val(),
                                    type: $("#slctype").val(),
                                };
                                console.log(data);
                                $.ajax({
                                    url: `${urlprod}/new`,
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
                        });
                } else {
                    showToast(
                        "Error",
                        "Por favor diligencia correctamente el formulario",
                        "Algo salio mal",
                        true
                    );
                }
            }
        },
    })
}

const borrarRegistro = (id) => {
    $.ajax({
        url: `${urlprod}/${id}`,
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
        url: `${urlprod}/${id}`,
        type: "GET",
        dataType: "json",
        success: (response) => {
            $("#txtidentification").val(response.identification),
            $("#txtname").val(response.name),
            $("#txtaddress").val(response.address),
            $("#txtcellPhone").val(response.cellPhone),
            $("#txtemail").val(response.email),
            $("#txtpassword").val(response.password),
            $("#slczone").val(response.zone),
            $("#slctype").val(response.type);
        },
    });
}

$(document).ready(function () {
    cargarTabla();
})