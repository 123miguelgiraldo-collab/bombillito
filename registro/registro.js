function Enviar(){
    alert('hola')
}

function Enviar(event){
    event.preventDefault()
    let nombre = document.getElementById('nombre').value
    let correo = document.getElementById('correo').value
    let contraseña = document.getElementById('contraseña').value
    let edad = document.getElementById('edad').value
    let institucion = document.getElementById('institucion').value

    console.log(nombre +  correo + contraseña + edad + institucion)

    localStorage.setItem('usuario',nombre)
    localStorage.setItem('email',correo)
    localStorage.setItem('password',contraseña)
    localStorage.setItem('number',edad)
    localStorage.setItem('text',institucion)


}

    function Enviar(event){
    event.preventDefault()
    let nombre = document.getElementById('nombre').value.trim()
    let correo = document.getElementById('correo').value.trim()
    let contraseña = document.getElementById('contraseña').value.trim()
    let edad = document.getElementById('edad').value.trim()
    let institucion = document.getElementById('institucion').value.trim()

    if (!nombre || !correo || !contraseña || !edad || !institucion) {
        alert('Por favor, completa todos los campos.')
        return
    }

    localStorage.setItem('usuario', nombre)
    localStorage.setItem('email', correo)
    localStorage.setItem('password', contraseña)
    localStorage.setItem('number',edad)
    localStorage.setItem('text',institucion)

    window.location.href = '../inicio de sesion/iniciar sesion.html'
}




