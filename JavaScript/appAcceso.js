/*import { validarCampo, showToast} from "./funtions.js";*/
const formulario = document.getElementById("form");
const inputs = document.querySelectorAll("#form input");
const urlbase = "http://localhost:8080/api/user";
const urlprod = "http://129.151.107.247:8080/api/user"

const expresiones = {
    usuario: /^[a-zA-Z0-9\_\-]{4,16}$/, // Letras, numeros, guion y guion_bajo
    name: /^[a-zA-ZÀ-ÿ\s]{1,40}$/, // Letras y espacios, pueden llevar acentos.
    password: /^.{4,12}$/, // 4 a 12 digitos.
    email: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/,
};

const campos = {
    email: false,
    password: false
};

const validarFormulario = (e) => {
    switch (e.target.name) {
        case "txtemail":
            validarCampo(expresiones.email, e.target, campos, "email");
            break;
        case "txtpassword":
            validarCampo(expresiones.password, e.target, campos, "password");
            break;
    }
};

const validarCampo = (expresion, input, campos, campo) => {
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

inputs.forEach((input) => {
    input.addEventListener("keyup", validarFormulario);
    input.addEventListener("blur", validarFormulario);
});


const showToast = (toastheader, toastbody, toastsmall, error) => {
    $("#toast-header").html(toastheader);
    $("#toast-body").html(toastbody);
    $("#toast-small").html(toastsmall)
    if (error) {
        //Como poner una imagen en el toast?
        $("#myToast").addClass("toast bg-warning")
        $("#myToast").removeClass("toast bg-success")
    } else {
        $("#myToast").addClass("toast bg-success")
        $("#myToast").removeClass("toast bg-warning")
    }
    $("#myToast").toast("show");
};

const acceder = () => {
    console.log(campos.password)
    console.log(campos.email)
    if (campos.password && campos.email) {
        const email = $("#txtemail").val();
        const password = $("#txtpassword").val();
        console.log(email);
        console.log(password);

        $.ajax({
            url: `${urlprod}/${email}/${password}`,
            type: "GET",
            dataType: 'json',
            headers: {
                "Content-Type": "application/json"
            },
            success: function (response) {
                console.log(response);
                if (response.id !== null) {
                    if (response.type === "ADM") {
                        form.reset();
                        document.querySelectorAll('.form-group-correcto').forEach((icono) => {
                            icono.classList.remove('form-group-correcto');
                        });
                        showToast('BIENVENIDO!', 'En 1 segundo lo redireccionaremos', '1 seg');
                        const user = JSON.stringify(response);
                        console.log(user);
                        sessionStorage.setItem("user", user);
                        setTimeout(() => {
                            window.location.href = '/../html/usuarios.html';
                        }, 2000);
                    } else if (response.type === "ASE") {
                        form.reset();
                        document.querySelectorAll('.form-group-correcto').forEach((icono) => {
                            icono.classList.remove('form-group-correcto');
                        });
                        showToast('BIENVENIDO!', 'En 1 segundo lo redireccionaremos', '1 seg');
                        const user = JSON.stringify(response);
                        console.log(user);
                        sessionStorage.setItem("user", user);
                        setTimeout(() => {
                            window.location.href = '/../html/orden.html';
                        }, 2000);
                    } else if (response.type === "COORD") {
                        form.reset();
                        document.querySelectorAll('.form-group-correcto').forEach((icono) => {
                            icono.classList.remove('form-group-correcto');
                            const user = JSON.stringify(response);
                            console.log(user);
                            sessionStorage.setItem("user", user);
                        });
                        showToast('BIENVENIDO!', 'En 1 segundo lo redireccionaremos', '1 seg');
                        setTimeout(() => {
                            window.location = 'html/revision.html';
                        }, 2000);
                    }
                } else {
                    showToast('Error', 'Usuario o contraseña no coinciden', 'Algo salio mal', true);
                }
            },
            error: function () {
                showToast('Error', 'Algo salio mal', 'ocurrio un error en el consumo', true)
            }
        });
    } else {
        showToast('Error', 'Por favor ingrese los datos correspondientes', "Algo salio mal", true);
    }
}


