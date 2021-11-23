const formulario = document.getElementById("form");
const inputs = document.querySelectorAll("#form input");
console.log(inputs)
const urlbase = "http://localhost:8080/api/user";

const expresiones = {
    usuario: /^[a-zA-Z0-9\_\-]{4,16}$/, // Letras, numeros, guion y guion_bajo
    name: /^[a-zA-ZÀ-ÿ\s]{1,40}$/, // Letras y espacios, pueden llevar acentos.
    password: /^.{4,12}$/, // 4 a 12 digitos.
    email: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/,
};

const campos = {
    name: false,
    email: false,
    password: false,
};
const validarFormulario = (e) => {
    switch (e.target.name) {
        case "txtname":
            validarCampo(expresiones.name, e.target, "name");
            break;
        case "txtemail":
            validarCampo(expresiones.email, e.target, "email");
            break;
        case "txtpassword":
            validarCampo(expresiones.password, e.target, "password");
            break;
        case "txtConfirmPassword":
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
    } else {
        $(`#group-${campo}`).addClass("form-group-incorrecto");
        $(`#group-${campo}`).removeClass("form-group-correcto");
        $(`#group-${campo} i`).addClass("far fa-times-circle");
        $(`#group-${campo} i`).removeClass("fas fa-check-circle");
        $(`#group-${campo} .form-error`).addClass("form-error-active");
    }
};

const confirmarPassword = () =>{
    const inputPassword = $("#txtpassword");
    const inputConfirmPassword = $("#txtConfirmPassword");

    if(inputPassword.value = inputConfirmPassword.value){
        $(`#group-conf-password`).addClass("form-group-incorrecto");
        $(`#group-conf-password`).removeClass("form-group-correcto");
        $(`#group-conf-password i`).addClass("far fa-times-circle");
        $(`#group-conf-password i`).removeClass("fas fa-check-circle");
        $(`#group-conf-password .form-error`).addClass("form-error-active");
    }
}

inputs.forEach((input) => {
    input.addEventListener("keyup", validarFormulario);
    input.addEventListener("blur", validarFormulario);
});

const showToast = (toastheader, toastbody, error) => {
    $("toast-header").html(toastheader);
    $("toast-body").html(toastbody);
    if (error) {
        //Como poner una imagen en el toast?
    } else {
        //
    }
    $("myToast").toast("show");
};

const registro = () => {
    const name = $("#txtname").val();
    const email = $("#txtemail").val();
    const password = $("#txtpassword").val();
    const confpasword = $("#txtConfirmPassword").val();
};
