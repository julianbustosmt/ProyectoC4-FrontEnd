import { validarCampo, showToast} from "./funtions.js";

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
    email: false,
    password: false
};
const validarFormulario = (e) => {
    switch (e.target.name) {
        case "txtemail":
            validarCampo(expresiones.email, e.target, "email");
            break;
        case "txtpassword":
            validarCampo(expresiones.password, e.target, "password");
            break;
    }
};

inputs.forEach((input) => {
    input.addEventListener("keyup", validarFormulario);
    input.addEventListener("blur", validarFormulario);
});

export const acceder = () => {
    console.log(campos.password)
    console.log(campos.email)
    if(campos.password && campos.email){
        const email = $("#txtemail").val();
        const password = $("#txtpassword").val();
        console.log(email);
        console.log(password);

        $.ajax({
            url : `${urlprod}/${email}/${password}`,
            type: "GET",
            dataType: 'json',
            headers: {
                "Content-Type": "application/json"
            },
            success: function(response){
                if (response.id !== null){
                    form.reset();
                    document.querySelectorAll('.form-group-correcto').forEach((icono) =>{
                        icono.classList.remove('form-group-correcto');
                    });
                    showToast('BIENVENIDO!', 'En 1 segundo lo redireccionaremos','1 seg');
                    setTimeout(()=>{
                        window.location.href = 'html/usuario.html';
                    },2000);
                }else{
                    showToast('Error', 'Usuario o contraseña no coinciden', 'Algo salio mal', true);
                    setTimeout(()=>{
                        window.location.href = 'index.html';
                    },2000);
                }
            },
            error: function(){
                showToast('Error','Algo salio mal', 'ocurrio un error en el consumo', true)
            }
        });
    }else{
        showToast('Error', 'Por favor ingrese los datos correspondientes',"Algo salio mal", true);
    }
}   