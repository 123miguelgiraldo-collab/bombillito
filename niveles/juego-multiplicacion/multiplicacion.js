const canvas = document.getElementById('multiCanvas');
const ctx = canvas.getContext('2d');
const puntosSpan = document.getElementById('puntos');
const vidasSpan = document.getElementById('vidas');
const pausaBtn = document.getElementById('pausaBtn');
const reiniciarBtn = document.getElementById('reiniciarBtn');
const pausaOverlay = document.getElementById('pausaOverlay');
const finOverlay = document.getElementById('finOverlay');
const finMensaje = document.getElementById('finMensaje');

let puntos = 0;
let vidas = 3;
let pausado = false;
let terminado = false;
let globos = [];
let velocidad = 3.5;
let frame = 0;

function crearGlobo() {
    // Multiplicación aleatoria
    const a = Math.floor(Math.random() * 10) + 2;
    const b = Math.floor(Math.random() * 10) + 2;
    const resultado = a * b;
    // ¿Es par?
    const esPar = resultado % 2 === 0;
    globos.push({
        x: Math.random() * (canvas.width - 80) + 40,
        y: canvas.height + 60,
        r: 40,
        a, b, resultado, esPar,
        explota: false,
        alpha: 1
    });
}

function actualizarGlobos() {
    for (let globo of globos) {
        if (!globo.explota) {
            globo.y -= velocidad;
        } else {
            globo.alpha -= 0.07;
        }
    }
    // Elimina globos explotados o fuera de pantalla
    globos = globos.filter(g => {
        if (g.explota && g.alpha <= 0) return false;
        if (!g.explota && g.y + g.r < 0) {
            if (g.esPar && !terminado && !pausado) {
                vidas--;
                revisarFin();
            }
            return false;
        }
        return true;
    });
}

function dibujarGlobos() {
    for (let globo of globos) {
        ctx.save();
        ctx.globalAlpha = globo.alpha;
        // Globo
        ctx.beginPath();
        ctx.arc(globo.x, globo.y, globo.r, 0, Math.PI * 2);
        ctx.fillStyle = globo.esPar ? "#fffb15ff" : "#ffbc03ff";
        ctx.fill();
        ctx.strokeStyle = "#ff5e00ff";
        ctx.lineWidth = 4;
        ctx.stroke();
        // Multiplicación
        ctx.fillStyle = "#000000ff";
        ctx.font = "bold 22px Arial";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(`${globo.a} × ${globo.b}`, globo.x, globo.y);
        ctx.restore();
        // Efecto explosión
        if (globo.explota) {
            ctx.save();
            ctx.globalAlpha = globo.alpha;
            ctx.strokeStyle = "#ff0000ff";
            ctx.lineWidth = 2;
            for (let i = 0; i < 8; i++) {
                let angle = (i / 8) * Math.PI * 2;
                ctx.beginPath();
                ctx.moveTo(globo.x, globo.y);
                ctx.lineTo(globo.x + Math.cos(angle) * (50 + 20 * (1 - globo.alpha)), globo.y + Math.sin(angle) * (50 + 20 * (1 - globo.alpha)));
                ctx.stroke();
            }
            ctx.restore();
        }
    }
}

function dibujar() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    dibujarGlobos();
}

canvas.addEventListener('click', function(e) {
    if (pausado || terminado) return;
    const rect = canvas.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;
    for (let globo of globos) {
        const dist = Math.sqrt((mx - globo.x) ** 2 + (my - globo.y) ** 2);
        if (dist < globo.r && !globo.explota) {
            if (globo.esPar) {
                puntos++;
                velocidad += 0.07;
                globo.explota = true;
            } else {
                vidas--;
                globo.explota = true;
                revisarFin();
            }
            puntosSpan.textContent = puntos;
            vidasSpan.textContent = vidas;
            break;
        }
    }
});

function revisarFin() {
    if (vidas <= 0 && !terminado) {
        terminado = true;
        finMensaje.textContent = `¡Juego terminado! Puntaje final: ${puntos}`;
        finOverlay.classList.add('active');
    }
}

function loop() {
    if (!pausado && !terminado) {
        frame++;
        if (frame % 60 === 0) crearGlobo();
        actualizarGlobos();
        dibujar();
        puntosSpan.textContent = puntos;
        vidasSpan.textContent = vidas;
        requestAnimationFrame(loop);
    } else {
        dibujar();
    }
}

pausaBtn.onclick = () => {
    if (terminado) return;
    pausado = !pausado;
    pausaOverlay.classList.toggle('active', pausado);
    pausaBtn.textContent = pausado ? 'Reanudar' : 'Pausar';
    if (!pausado) loop();
};

reiniciarBtn.onclick = () => reiniciarJuego();

function reiniciarJuego() {
    puntos = 0;
    vidas = 3;
    pausado = false;
    terminado = false;
    velocidad = 0.5;
    globos = [];
    frame = 0;
    pausaOverlay.classList.remove('active');
    finOverlay.classList.remove('active');
    pausaBtn.textContent = 'Pausar';
    puntosSpan.textContent = puntos;
    vidasSpan.textContent = vidas;
    dibujar();
    loop();
}

// Iniciar juego
reiniciarJuego();