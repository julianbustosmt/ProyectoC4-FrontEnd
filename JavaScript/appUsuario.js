

const formulario = document.getElementById("form");
const inputs = document.querySelectorAll("#form input");
console.log(inputs);
const urlbase = "http://localhost:8080/api/user";
const urlprod = "http://132.145.103.244:8080/api/user";

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
        console.log(campos[campo]);
    } else {
        $(`#group-${campo}`).addClass("form-group-incorrecto");
        $(`#group-${campo}`).removeClass("form-group-correcto");
        $(`#group-${campo} i`).addClass("far fa-times-circle");
        $(`#group-${campo} i`).removeClass("fas fa-check-circle");
        $(`#group-${campo} .form-error`).addClass("form-error-active");
        campos[campo] = false;
        console.log(campos[campo]);
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

const registro = () => {
    if (
        campos.name &&
        campos.password &&
        campos.email &&
        campos.identification &&
        campos.address &&
        campos.cellPhone
    ) {
        const identification = $("#txtidentification").val();
        const name = $("#txtname").val();
        const address = $("#txtaddress").val();
        const cellphone = $("#txtcellPhone").val();
        const email = $("#txtemail").val();
        const password = $("#txtpassword").val();
        const zone = $("#slczone").val();
        const type = $("#slctype").val();

        if (
            identification === null ||
            name === null ||
            address === null ||
            cellphone === null ||
            email === null ||
            password === null ||
            zone === null ||
            type === null
        ) {
            showToast("Error", "Campos vacios", "", true);
        } else {
            const data = {
                identification: identification,
                name: name,
                address: address,
                cellphone: cellphone,
                email: email,
                password: password,
            };
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
                        form.reset();
                        document
                            .querySelectorAll(".form-group-correcto")
                            .forEach((icono) => {
                                icono.classList.remove("form-group-correcto");
                            });
                        showToast(
                            "Registro exitoso",
                            "Su cuenta ha sido creada correctamente",
                            "1 seg"
                        );
                        setTimeout(() => {
                            window.location.href = "index.html";
                        }, 5000);
                    },
                },
            });
        }
    } else {
        showToast(
            "Error",
            "Por favor diligencia correctamente el formulario",
            "Algo salio mal",
            true
        );
    }
};
