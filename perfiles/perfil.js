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

    const perfilInput = document.getElementById("perfilInput");
    const fondoInput = document.getElementById("fondoInput");
    const perfilPreview = document.getElementById("perfilPreview");
    const fondoPreview = document.getElementById("fondoPreview");

    perfilInput.addEventListener("change", function() {
        const file = this.files[0];
        if (file) {
        const reader = new FileReader();
        reader.onload = e => perfilPreview.src = e.target.result;
        reader.readAsDataURL(file);
        }
});

    fondoInput.addEventListener("change", function() {
        const file = this.files[0];
        if (file) {
        const reader = new FileReader();
        reader.onload = e => fondoPreview.src = e.target.result;
        reader.readAsDataURL(file);
        }
    });
