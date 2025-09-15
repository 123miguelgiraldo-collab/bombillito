const canvas = document.getElementById('sumasCanvas');
const ctx = canvas.getContext('2d');

let score = 0;
let lives = 3;
let bubbles = [];
let currentSum = {};
let gameOver = false;
let speed = 1.5;

// Genera una suma aleatoria y la respuesta correcta
function newSum() {
    const a = Math.floor(Math.random() * 10) + 1;
    const b = Math.floor(Math.random() * 10) + 1;
    currentSum = { a, b, result: a + b };
}

// Genera burbujas con respuestas (una correcta y otras incorrectas)
function createBubbles() {
    bubbles = [];
    const correctIndex = Math.floor(Math.random() * 4);
    for (let i = 0; i < 4; i++) {
        let value;
        if (i === correctIndex) {
            value = currentSum.result;
        } else {
            do {
                value = Math.floor(Math.random() * 19) + 2;
            } while (value === currentSum.result || bubbles.some(b => b.value === value));
        }
        bubbles.push({
            x: Math.random() * (canvas.width - 80) + 40,
            y: Math.random() * (canvas.height - 200) + 120,
            r: 40,
            value,
            dx: (Math.random() - 0.5) * speed * 2,
            dy: (Math.random() - 0.5) * speed * 2
        });
    }
}

// Dibuja todo
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Suma
    ctx.font = '32px Arial';
    ctx.fillStyle = '#222';
    ctx.fillText(`¿Cuánto es ${currentSum.a} + ${currentSum.b}?`, 30, 50);

    // Puntos y vidas
    ctx.font = '20px Arial';
    ctx.fillStyle = '#007700';
    ctx.fillText(`Puntos: ${score}`, 30, 90);
    ctx.fillStyle = '#bb2222';
    ctx.fillText(`Vidas: ${lives}`, canvas.width - 120, 90);

    // Burbujas
    bubbles.forEach(b => {
        ctx.beginPath();
        ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
        ctx.fillStyle = '#ffd900';
        ctx.fill();
        ctx.strokeStyle = '#ff9100';
        ctx.lineWidth = 4;
        ctx.stroke();
        ctx.fillStyle = '#222';
        ctx.font = '28px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(b.value, b.x, b.y);
    });

    if (gameOver) {
        ctx.fillStyle = 'rgba(0,0,0,0.7)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#fff';
        ctx.font = '48px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('¡Juego Terminado!', canvas.width / 2, canvas.height / 2 - 20);
        ctx.font = '32px Arial';
        ctx.fillText(`Puntaje final: ${score}`, canvas.width / 2, canvas.height / 2 + 30);
        ctx.textAlign = 'start';
    }
}

// Mueve las burbujas
function update() {
    if (gameOver) return;
    bubbles.forEach(b => {
        b.x += b.dx;
        b.y += b.dy;
        // Rebote en los bordes
        if (b.x - b.r < 0 || b.x + b.r > canvas.width) b.dx *= -1;
        if (b.y - b.r < 100 || b.y + b.r > canvas.height) b.dy *= -1;
    });
}

// Detecta clic en burbuja
canvas.addEventListener('click', function(e) {
    if (gameOver) return;
    const rect = canvas.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;
    for (let b of bubbles) {
        const dist = Math.sqrt((mx - b.x) ** 2 + (my - b.y) ** 2);
        if (dist < b.r) {
            if (b.value === currentSum.result) {
                score++;
                speed += 0.2;
                newSum();
                createBubbles();
            } else {
                lives--;
                if (lives <= 0) {
                    gameOver = true;
                }
            }
            break;
        }
    }
});

// Bucle principal
function loop() {
    update();
    draw();
    if (!gameOver) requestAnimationFrame(loop);
}

function startGame() {
    score = 0;
    lives = 3;
    speed = 1.5;
    gameOver = false;
    newSum();
    createBubbles();
    loop();
}

// Iniciar juego al cargar
window.onload = () => {
    startGame();
};


