let perfilGlobal;

const mostrarUsuario = () =>{
    const user = JSON.parse(sessionStorage.getItem('user'));
    console.log(user);
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
    console.log(perfil)
}



$(document).ready(() => {
    mostrarUsuario();
})