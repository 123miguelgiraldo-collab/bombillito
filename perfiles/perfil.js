window.onload = function() {
    const nombre = localStorage.getItem('usuario')
    const correo = localStorage.getItem('email')
    const edad = localStorage.getItem('number')
    const institucion = localStorage.getItem('text')

    document.getElementById('nombre-usuario').textContent = nombre || 'Invitado'
    document.getElementById('correo-usuario').textContent = correo || 'Invitado'
    document.getElementById('edad-usuario').textContent = edad || 'Invitado'
    document.getElementById('institucion-usuario').textContent = institucion || 'Invitado'
}