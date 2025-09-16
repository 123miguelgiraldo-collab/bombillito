const userIcon = document.querySelector('.user-icon');
const menu = document.querySelector('.dropdown-menu')

userIcon.addEventListener('click', () => {
    menu.classList.toggle('open-menu');
})

window.onload = function() {
    const nombre = localStorage.getItem('usuario')
    if (nombre) {
        document.getElementById('nombre-usuario').textContent = nombre
    } else {
        document.getElementById('nombre-usuario').textContent = 'Invitado'
    }

    const edad = localStorage.getItem('usuario')
    if (edad) {
        document.getElementById('edad-usuario').textContent = edad
    } else {
        document.getElementById('edad-usuario').textContent = 'Invitado'
    }

    const institucion = localStorage.getItem('usuario')
    if (institucion) {
        document.getElementById('institucion-usuario').textContent = institucion
    } else {
        document.getElementById('institucion-usuario').textContent = 'Invitado'
    }
}