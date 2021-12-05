export const validarCampo = (expresion, input, campos, campo) => {
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

export const confirmarPassword = () =>{
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

export const showToast = (toastheader, toastbody, toastsmall,error) => {
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