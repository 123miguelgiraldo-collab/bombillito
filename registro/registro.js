function Enviar(){
    alert('hola')
}

function Enviar(event){
    event.preventDefault()
    let nombre = document.getElementById('nombre').value
    let correo = document.getElementById('correo').value
    let contraseña = document.getElementById('contraseña').value

    console.log(nombre +  correo + contraseña)

    localStorage.setItem('usuario',nombre)
    localStorage.setItem('email',correo)
    localStorage.setItem('password',contraseña)

    window.location.href = '../inicio de sesion/iniciar sesion.html'
}



