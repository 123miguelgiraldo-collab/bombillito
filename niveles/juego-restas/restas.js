let puntos = 0;
let vidas = 3;
let pausado = false;
let terminado = false;

const tablero = document.getElementById('tablero');
const respuestasDiv = document.getElementById('respuestas');
const puntosSpan = document.getElementById('puntos');
const vidasSpan = document.getElementById('vidas');
const pausaBtn = document.getElementById('pausaBtn');
const reiniciarBtn = document.getElementById('reiniciarBtn');
const pausaOverlay = document.getElementById('pausaOverlay');
const finOverlay = document.getElementById('finOverlay');
const finMensaje = document.getElementById('finMensaje');

let tarjetas = [];
let respuestas = [];

function generarRondas() {
    tarjetas = [];
    respuestas = [];
    for (let i = 0; i < 3; i++) {
        let a = Math.floor(Math.random() * 15) + 6;
        let b = Math.floor(Math.random() * (a - 1)) + 1;
        tarjetas.push({a, b, resultado: a - b, estado: null});
        respuestas.push(a - b);
    }
    // Agrega respuestas incorrectas
    while (respuestas.length < 6) {
        let falsa = Math.floor(Math.random() * 20) + 1;
        if (!respuestas.includes(falsa)) respuestas.push(falsa);
    }
    // Mezcla respuestas
    respuestas = respuestas.sort(() => Math.random() - 0.5);
}

function render() {
    tablero.innerHTML = '';
    respuestasDiv.innerHTML = '';
    tarjetas.forEach((t, idx) => {
        const div = document.createElement('div');
        div.className = 'tarjeta' + (t.estado ? ' ' + t.estado : '');
        div.textContent = `${t.a} - ${t.b}`;
        div.dataset.idx = idx;
        div.ondragover = e => {
            if (pausado || terminado) return;
            e.preventDefault();
            div.style.borderColor = '#f38b02ff';
        };
        div.ondragleave = () => {
            div.style.borderColor = t.estado === 'correcta' ? '#2abb2fff' : t.estado === 'incorrecta' ? '#e21c18ff' : '#71c4cfff';
        };
        div.ondrop = e => {
            if (pausado || terminado) return;
            e.preventDefault();
            const valor = Number(e.dataTransfer.getData('text'));
            if (valor === t.resultado && !t.estado) {
                t.estado = 'correcta';
                puntos++;
            } else if (!t.estado) {
                t.estado = 'incorrecta';
                vidas--;
            }
            actualizarEstado();
        };
        tablero.appendChild(div);
    });
    respuestas.forEach(valor => {
        const btn = document.createElement('div');
        btn.className = 'respuesta';
        btn.textContent = valor;
        btn.draggable = true;
        btn.ondragstart = e => {
            if (pausado || terminado) return;
            btn.classList.add('dragging');
            e.dataTransfer.setData('text', valor);
        };
        btn.ondragend = () => btn.classList.remove('dragging');
        respuestasDiv.appendChild(btn);
    });
    puntosSpan.textContent = puntos;
    vidasSpan.textContent = vidas;
}

function actualizarEstado() {
    render();
    if (tarjetas.every(t => t.estado)) {
        setTimeout(() => {
            if (vidas > 0) {
                generarRondas();
                render();
            }
        }, 700);
    }
    if (vidas <= 0) {
        terminado = true;
        finMensaje.textContent = `¡Juego terminado! Puntaje final: ${puntos}`;
        finOverlay.classList.add('active');
    }
}

pausaBtn.onclick = () => {
    if (terminado) return;
    pausado = !pausado;
    pausaOverlay.classList.toggle('active', pausado);
    pausaBtn.textContent = pausado ? 'Reanudar' : 'Pausar';
};

reiniciarBtn.onclick = () => reiniciarJuego();

function reiniciarJuego() {
    puntos = 0;
    vidas = 3;
    pausado = false;
    terminado = false;
    pausaOverlay.classList.remove('active');
    finOverlay.classList.remove('active');
    pausaBtn.textContent = 'Pausar';
    generarRondas();
    render();
}

// Iniciar juego
generarRondas();
render();