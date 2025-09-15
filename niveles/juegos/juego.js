    const canvas = document.getElementById('gameCanvas');
        const ctx = canvas.getContext('2d');

        // Variables del juego
        const paddleWidth = 15, paddleHeight = 100;
        let leftPaddleY = canvas.height / 2 - paddleHeight / 2;
        let rightPaddleY = canvas.height / 2 - paddleHeight / 2;
        const paddleSpeed = 7;

        let ballX = canvas.width / 2, ballY = canvas.height / 2;
        let ballRadius = 10;
        let ballSpeedX = 5, ballSpeedY = 3;

        let leftScore = 0, rightScore = 0;

        // Controles
        let upPressed = false, downPressed = false;
        let wPressed = false, sPressed = false;

        // Pausa
        let pausado = false;
        const pausaBtn = document.getElementById('pausaBtn');
        pausaBtn.addEventListener('click', () => {
            pausado = !pausado;
            pausaBtn.textContent = pausado ? 'Reanudar' : 'Pausar';
            if (!pausado) gameLoop();
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowUp') upPressed = true;
            if (e.key === 'ArrowDown') downPressed = true;
            if (e.key === 'w' || e.key === 'W') wPressed = true;
            if (e.key === 's' || e.key === 'S') sPressed = true;
        });
        document.addEventListener('keyup', (e) => {
            if (e.key === 'ArrowUp') upPressed = false;
            if (e.key === 'ArrowDown') downPressed = false;
            if (e.key === 'w' || e.key === 'W') wPressed = false;
            if (e.key === 's' || e.key === 'S') sPressed = false;
        });

        function draw() {
            // Fondo
            ctx.fillStyle = '#111';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Centro
            ctx.strokeStyle = '#fff';
            ctx.beginPath();
            ctx.setLineDash([10, 10]);
            ctx.moveTo(canvas.width / 2, 0);
            ctx.lineTo(canvas.width / 2, canvas.height);
            ctx.stroke();
            ctx.setLineDash([]);

            // Paletas
            ctx.fillStyle = '#fff';
            ctx.fillRect(10, leftPaddleY, paddleWidth, paddleHeight);
            ctx.fillRect(canvas.width - 10 - paddleWidth, rightPaddleY, paddleWidth, paddleHeight);

            // Pelota
            ctx.beginPath();
            ctx.arc(ballX, ballY, ballRadius, 0, Math.PI * 2);
            ctx.fill();

            // Marcador
            ctx.font = '32px monospace';
            ctx.fillText(leftScore, canvas.width / 2 - 60, 40);
            ctx.fillText(rightScore, canvas.width / 2 + 40, 40);

            // Si está pausado, mostrar mensaje
            if (pausado) {
                ctx.fillStyle = 'rgba(0,0,0,0.6)';
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                ctx.fillStyle = '#fff';
                ctx.font = '48px Arial';
                ctx.textAlign = 'center';
                ctx.fillText('PAUSA', canvas.width / 2, canvas.height / 2);
                ctx.textAlign = 'start';
            }
        }

        function update() {
            if (pausado) return;
            // Movimiento jugador 2 (derecha)
            if (upPressed && rightPaddleY > 0) rightPaddleY -= paddleSpeed;
            if (downPressed && rightPaddleY < canvas.height - paddleHeight) rightPaddleY += paddleSpeed;

            // Movimiento jugador 1 (izquierda)
            if (wPressed && leftPaddleY > 0) leftPaddleY -= paddleSpeed;
            if (sPressed && leftPaddleY < canvas.height - paddleHeight) leftPaddleY += paddleSpeed;

            // Movimiento pelota
            ballX += ballSpeedX;
            ballY += ballSpeedY;

            // Rebote arriba/abajo
            if (ballY - ballRadius < 0 || ballY + ballRadius > canvas.height) ballSpeedY *= -1;

            // Rebote paletas
            // Derecha
            if (
                ballX + ballRadius > canvas.width - 10 - paddleWidth &&
                ballY > rightPaddleY &&
                ballY < rightPaddleY + paddleHeight
            ) {
                ballSpeedX *= -1;
            }
            // Izquierda
            if (
                ballX - ballRadius < 10 + paddleWidth &&
                ballY > leftPaddleY &&
                ballY < leftPaddleY + paddleHeight
            ) {
                ballSpeedX *= -1;
            }

            // Punto derecha
            if (ballX - ballRadius < 0) {
                rightScore++;
                resetBall();
            }
            // Punto izquierda
            if (ballX + ballRadius > canvas.width) {
                leftScore++;
                resetBall();
            }
        }

        function resetBall() {
            ballX = canvas.width / 2;
            ballY = canvas.height / 2;
            ballSpeedX = -ballSpeedX;
            ballSpeedY = 3 * (Math.random() > 0.5 ? 1 : -1);
        }

        function gameLoop() {
            update();
            draw();
            if (!pausado) {
                requestAnimationFrame(gameLoop);
            }
        }

        gameLoop();
