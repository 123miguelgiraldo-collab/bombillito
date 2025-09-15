function Enviar(){
    alert('hola')
}

function Enviar(event){
    event.preventDefault()
    let correo = document.getElementById('correo').value
    let contraseña = document.getElementById('contraseña').value

    console.log(correo + contraseña)

    let email = localStorage.getItem('email')
    let contra = localStorage.getItem('password')

    if(correo==email && contraseña==contra){
        alert('inicio sesion')
        window.location.href ='../paginainiciada.html'
    }else{
        alert('Error')
    }
}