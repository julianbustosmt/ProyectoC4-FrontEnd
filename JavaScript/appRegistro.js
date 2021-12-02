const formulario = document.getElementById("form");
const inputs = document.querySelectorAll("#form input");
const urlbase = "http://localhost:8080/api/user";
const urlprod = "http://132.145.103.244:8080/api/user"

const expresiones = {
    usuario: /^[a-zA-Z0-9\_\-]{4,16}$/, // Letras, numeros, guion y guion_bajo
    name: /^[a-zA-ZÀ-ÿ\s]{1,40}$/, // Letras y espacios, pueden llevar acentos.
    password: /^.{4,12}$/, // 4 a 12 digitos.
    email: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/,
};

const campos = {
    name: false,
    email: false,
    password: false
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
            confirmarPassword();
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

const confirmarPassword = () =>{
    password1 = $("#txtpassword").val();
    password2 = $("#txtConfirmPassword").val();

    if(password1 !== password2){
        $("#group-confpassword").addClass("form-group-incorrecto");
        $("#group-confpassword").removeClass("form-group-correcto");
        $("#group-confpassword i").addClass("far fa-times-circle");
        $("#group-confpassword i").removeClass("fas fa-check-circle");
        $("#group-confpassword .form-error").addClass("form-error-active");
        campos["password"] = false; 
    }else{
        $("#group-confpassword").removeClass("form-group-incorrecto");
        $("#group-confpassword").addClass("form-group-correcto");
        $("#group-confpassword i").removeClass("far fa-times-circle");
        $("#group-confpassword i").addClass("fas fa-check-circle");
        $("#group-confpassword .form-error").removeClass("form-error-active");
        campos["password"] = true;
    }
}

inputs.forEach((input) => {
    input.addEventListener("keyup", validarFormulario);
    input.addEventListener("blur", validarFormulario);
});

const showToast = (toastheader, toastbody, toastsmall,error) => {
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

const registro = () => {

    if(campos.name && campos.password && campos.email && campos.name){
        const name = $("#txtname").val();
        const email = $("#txtemail").val();
        const password = $("#txtpassword").val();

        const data = {
            name:name,
            email:email,
            password:password,
        }
        $.ajax({
            url: `${urlprod}/new`,
            type: "POST",
            dataType: 'json',
            headers: {
                "Content-Type": "application/json"
            },
            data: JSON.stringify(data),
            statusCode: {
                201: function () {
                    form.reset();
                    document.querySelectorAll('.form-group-correcto').forEach((icono) =>{
                        icono.classList.remove('form-group-correcto');
                    });
                    showToast('Registro exitoso', 'Su cuenta ha sido creada correctamente','1 seg');
                    setTimeout(()=>{
                        window.location.href = 'index.html';
                    }, 5000);
                }
            },
        });
    }else{
        showToast('Error','Por favor diligencia correctamente el formulario','Algo salio mal', true);
    }
};


