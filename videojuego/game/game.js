const CONFIG = {
    PLAYER_MAX_HP: 100,
    ENEMY_MAX_HP: 100,
    BATTLE_TIME_LIMIT: 60, // segundos
    CANVAS_WIDTH: 900,
    CANVAS_HEIGHT: 500,
    GRAVITY: 0.8,
    JUMP_POWER: -14,
    MOVE_SPEED: 4.0,
  // expression difficulty: max number and allowed ops
    EXPR: {
    maxNumber: 4,
    operators: ['+', '-', '*', '/'] // division will produce integer if possible
    }
};
// ------------------------------------------------

/* ---------- Setup Canvas ---------- */
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
canvas.width = CONFIG.CANVAS_WIDTH;
canvas.height = CONFIG.CANVAS_HEIGHT;

let keys = {};
window.addEventListener('keydown', e => { keys[e.key.toLowerCase()] = true; if(["w","arrowup"," "].includes(e.key.toLowerCase())) e.preventDefault(); });
window.addEventListener('keyup', e => { keys[e.key.toLowerCase()] = false; });

/* ---------- Game State ---------- */
let game = {
    player: {
    x: 80, y: 350, vx:0, vy:0, width:34, height:48,
    crouchHeight:30,
    onGround:false,
    hp: CONFIG.PLAYER_MAX_HP,
    kills:0
    },
    platforms: [],
  enemies: [], // enemy objects in world
    inBattle: false,
    battleContext: null,
};

/* ---------- Simple level (platforms + ground) ---------- */
function createLevel(){
    game.platforms = [
    {x:0,y:440,w:900,h:60}, // ground
    {x:300,y:350,w:160,h:16},
    {x:520,y:300,w:140,h:16},
    {x:720,y:240,w:120,h:16},
    {x:120,y:300,w:110,h:16}
    ];
  // spawn some enemies (cuadernos) with positions
    game.enemies = [
    {id:1, x:340, y:300, w:34, h:36, hp: CONFIG.ENEMY_MAX_HP, active:true},
    {id:2, x:560, y:260, w:34, h:36, hp: CONFIG.ENEMY_MAX_HP, active:true},
    {id:3, x:760, y:200, w:34, h:36, hp: CONFIG.ENEMY_MAX_HP, active:true},
    {id:4, x:150, y:260, w:34, h:36, hp: CONFIG.ENEMY_MAX_HP, active:true}
    ];
}
createLevel();

/* ---------- Utility: rectangle collision ---------- */
function rectOverlap(a,b){
    return a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;
}

/* ---------- Player update & physics ---------- */
function updatePlayer(){
    const p = game.player;
  // horizontal movement
    let left = keys['a'] || keys['arrowleft'];
    let right = keys['d'] || keys['arrowright'];
    let up = keys['w'] || keys['arrowup'] || keys[' '];
    let down = keys['s'] || keys['arrowdown'];

    if(left) p.vx = -CONFIG.MOVE_SPEED;
    else if(right) p.vx = CONFIG.MOVE_SPEED;
    else p.vx = 0;

  // crouch: reduce height
    if(down && p.onGround){
    p.height = p.crouchHeight;
    } else {
    p.height = 48;
    }

  // jump
    if(up && p.onGround){
    p.vy = CONFIG.JUMP_POWER;
    p.onGround = false;
    }

  // apply gravity
    p.vy += CONFIG.GRAVITY;
    p.x += p.vx;
    p.y += p.vy;

  // basic world bounds
    if(p.x < 0) p.x = 0;
    if(p.x + p.width > canvas.width) p.x = canvas.width - p.width;
  if(p.y > canvas.height + 200) { // fell off screen: reset to spawn
    p.hp = Math.max(1, p.hp - 10);
    p.x = 80; p.y = 200; p.vy = 0;
    // small penalty for falling
    }

  // collisions with platforms: simple AABB resolution
    p.onGround = false;
    for(let plat of game.platforms){
    const pb = {x:plat.x, y:plat.y, w:plat.w, h:plat.h};
    const pr = {x:p.x, y:p.y, w:p.width, h:p.height};
    if(rectOverlap(pr,pb)){
      // assume collision from top
        if(p.vy > 0 && (p.y + p.height - p.vy) <= plat.y + 5){
        p.y = plat.y - p.height;
        p.vy = 0;
        p.onGround = true;
      } else if(p.vx > 0){ // hit from left
        p.x = plat.x - p.width;
      } else if(p.vx < 0){ // hit from right
        p.x = plat.x + plat.w;
        }
    }
    }

  // detect collision with enemies -> start battle
    for(let e of game.enemies){
    if(!e.active) continue;
    const er = {x:e.x, y:e.y - (e.h - e.h), w:e.w, h:e.h};
    const pr = {x:p.x, y:p.y, w:p.width, h:p.height};
    if(rectOverlap(pr,er)){
      // trigger battle if not already
        if(!game.inBattle) startBattle(e);
    }
    }
}



/* ---------- Rendering ---------- */
function draw(){

    const fondo = new Image();
    fondo.src = "../game/img/fondo-juego.jpg"; // pon aquí tu imagen
    // Fondo con pixel art
    if (fondo.complete) {
    ctx.imageSmoothingEnabled = false; // pixel art sin suavizado
    ctx.drawImage(fondo, 0, 30, canvas.width, canvas.height);
} else {
  // Fallback: cielo azul si el fondo no carga
    ctx.fillStyle = "#87ceeb";
    ctx.fillRect(0,0,canvas.width,canvas.height);
}

const plataformaImg = new Image();
    plataformaImg.src = "../game/img/plataforma-juego.png"; // ruta al archivo

    // Plataformas con textura
for (let plat of game.platforms) {
    if (plataformaImg.complete && plataformaImg.naturalWidth > 0) {
    ctx.imageSmoothingEnabled = false; // que se vea pixelado

    for (let x = 0; x < plat.w; x += 32) {
        ctx.drawImage(plataformaImg, x + plat.x, plat.y, 32, plat.h);
    }
    } else {
    // fallback marrón
    ctx.fillStyle = "#5c3a21";
    ctx.fillRect(plat.x, plat.y, plat.w, plat.h);
    }
}


  // draw enemies (cuadernos)
    for(let e of game.enemies){
    if(!e.active) continue;
    drawNotebook(e.x, e.y - e.h, e.w, e.h);
    // HP bar small
    ctx.fillStyle = "rgba(0,0,0,0.5)";
    ctx.fillRect(e.x, e.y - e.h - 10, e.w, 6);
    ctx.fillStyle = "#f44336";
    const w = Math.max(0, (e.hp / CONFIG.ENEMY_MAX_HP) * e.w);
    ctx.fillRect(e.x, e.y - e.h - 10, w, 6);
    }






  // player
    drawPlayer(game.player.x, game.player.y, game.player.width, game.player.height);

  // HUD: simple HP over canvas
    ctx.fillStyle = "rgba(0, 0, 0, 0.53)";
    ctx.fillRect(6,6,220,44);
    ctx.fillStyle = "#fff";
    ctx.font = "14px monospace";
    ctx.fillText("Jugador HP: " + game.player.hp.toFixed(0), 12, 26);
    ctx.fillStyle = "#1fb324ff";
  ctx.fillRect(12,30, Math.max(0, (game.player.hp/CONFIG.PLAYER_MAX_HP)) * 180 ,8);
}

// --- Cargar sprites ---
const spriteJugador = new Image();
spriteJugador.src = "../game/img/personaje-Photoroom.png"; // tu pixel art


// --- Reemplazo de drawPlayer ---
function drawPlayer(x, y, w, h) {
    if (spriteJugador.complete) {
    ctx.imageSmoothingEnabled = false; // mantener estilo pixelado
    ctx.drawImage(spriteJugador, x, y, w, h);
    } else {
    // Fallback por si la imagen no cargó
    ctx.fillStyle = "#1e88e5";
    ctx.fillRect(x, y, w, h);
    }
}

function drawNotebook(x,y,w,h){
  // notebook sprite: rectangle with spiral
    ctx.save();
    ctx.translate(x, y);
    ctx.fillStyle = "#fff";
    roundRect(ctx, 0, 0, w, h, 6, true, false);
  // cover edge
    ctx.fillStyle = "#e0e0e0";
    ctx.fillRect(0,0,8,h);
  // spiral rings
    ctx.fillStyle = "#999";
    for(let i=6;i<h;i+=8){
    ctx.fillRect(2, i, 4, 2);
    }
  // formula on cover
    ctx.fillStyle = "#000";
    ctx.font = "14px monospace";
    ctx.fillText("enemigos", 12, Math.min(h-8, 18));
    ctx.restore();
}

function roundRect(ctx, x, y, w, h, r, fill=true, stroke=true){
    if (typeof r === 'undefined') r = 5;
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
    if(fill) ctx.fill();
    if(stroke) ctx.stroke();
}

/* ---------- Main loop ---------- */
let lastTime = 0;
function loop(ts){
    const dt = ts - lastTime;
    lastTime = ts;
    if(!game.inBattle){
    updatePlayer();
    }
    draw();
    requestAnimationFrame(loop);
}
requestAnimationFrame(loop);

/* ---------- Battle System ---------- */
const overlay = document.getElementById('battleOverlay');
const equationEl = document.getElementById('equation');
const timerEl = document.getElementById('timer');
const answerInput = document.getElementById('answerInput');
const submitBtn = document.getElementById('submitAnswer');
const skipBtn = document.getElementById('skipAnswer');
const battleLog = document.getElementById('battleLog');
const playerBar = document.getElementById('playerBar');
const enemyBar = document.getElementById('enemyBar');
const playerHPdisplay = document.getElementById('playerHPdisplay');
const enemyHPdisplay = document.getElementById('enemyHPdisplay');
const hudHP = document.getElementById('hudHP');
const hudBar = document.getElementById('hudBar');
const hudKills = document.getElementById('hudKills');

let battleTimerInterval = null;

function evaluateExpression(expr){
  // simple parser: tokenise and compute with left-to-right respecting * and /
  // tokenise
    const tokens = expr.split(' ').filter(t=>t.trim());
  // first handle * and /
    let stack = [];
    let i = 0;
    stack.push(Number(tokens[i++])); 
    while(i < tokens.length){
    const op = tokens[i++]; const num = Number(tokens[i++]);
    if(op === '*'){
        const last = stack.pop();
      stack.push(last * num);
    } else if(op === '/'){
        const last = stack.pop();
      // integer division if exact, else round to nearest
        const val = (num === 0) ? 0 : (last / num);
      stack.push( Math.round(val*1000)/1000 ); // keep 3 decimals
    } else if(op === '+'){
        stack.push(op); stack.push(num);
    } else if(op === '-'){
        stack.push(op); stack.push(num);
    }
    }
  // now evaluate + and - left-to-right
    let result = stack[0];
    for(let j=1;j<stack.length;j+=2){
    const op = stack[j], num = stack[j+1];
    if(op === '+') result += num;
    if(op === '-') result -= num;
    }
  // round small floats to reasonable integer if near integer
    if(Math.abs(result - Math.round(result)) < 0.0001) result = Math.round(result);
    return result;
}

function startBattle(enemy){
    game.inBattle = true;
    game.battleContext = {
    enemy: enemy,
    enemyBackupHP: enemy.hp,
    playerHP: game.player.hp,
    enemyHP: enemy.hp
    };
  // setup UI
    overlay.style.visibility = 'visible';
    battleLog.innerHTML = "";
    answerInput.value = "";
    updateBattleHUD();
  // enemy starts by sending an equation
    nextEnemyTurn();
}

function updateBattleHUD(){
    const ctxB = game.battleContext;
    playerHPdisplay.textContent = `(${Math.max(0, Math.round(ctxB.playerHP))} HP)`;
    enemyHPdisplay.textContent = `(${Math.max(0, Math.round(ctxB.enemyHP))} HP)`;
    playerBar.style.width = Math.max(0, (ctxB.playerHP/CONFIG.PLAYER_MAX_HP)*100) + "%";
    enemyBar.style.width = Math.max(0, (ctxB.enemyHP/CONFIG.ENEMY_MAX_HP)*100) + "%";
    hudHP.textContent = Math.max(0, Math.round(game.player.hp));
    hudBar.style.width = Math.max(0, (game.player.hp/CONFIG.PLAYER_MAX_HP)*100) + "%";
}

function appendLog(text){
    const p = document.createElement('div');
    p.textContent = text;
    battleLog.appendChild(p);
    battleLog.scrollTop = battleLog.scrollHeight;
}

let currentExpression = null;
let timeLeft = CONFIG.BATTLE_TIME_LIMIT;

function nextEnemyTurn(){
  // generate expression
    currentExpression = generateExpression();
    equationEl.textContent = currentExpression.expr + " = ?";
    timeLeft = CONFIG.BATTLE_TIME_LIMIT;
    timerEl.textContent = timeLeft;
    answerInput.value = "";
    answerInput.focus();
    appendLog("Enemigo lanza una ecuación: " + currentExpression.expr);
  // start timer
    if(battleTimerInterval) clearInterval(battleTimerInterval);
    battleTimerInterval = setInterval(()=>{
    timeLeft--;
    timerEl.textContent = timeLeft;
    if(timeLeft <= 0){
        clearInterval(battleTimerInterval);
        onBattleTimeout();
    }
    }, 1000);
}

function onBattleTimeout(){
    appendLog("Se acabó el tiempo. Fallaste la respuesta.");
  // compute damage to player equal to absolute value of expression value
    const dmg = Math.max(1, Math.abs(currentExpression.value));
    applyPlayerDamage(dmg);
    checkBattleEndOrContinue();
}

function applyPlayerDamage(dmg){
    game.battleContext.playerHP -= dmg;
    appendLog(`El enemigo inflige ${dmg} de daño a ti.`);
    updateBattleHUD();
  // sync to main player HP
    game.player.hp = Math.max(0, game.battleContext.playerHP);
}

function applyEnemyDamage(dmg){
    game.battleContext.enemyHP -= dmg;
    appendLog(`Le infliges ${dmg} de daño al enemigo.`);
    updateBattleHUD();
  // sync enemy
    game.battleContext.enemy.hp = Math.max(0, game.battleContext.enemyHP);
}

function checkBattleEndOrContinue(){
    const ctx = game.battleContext;
    if(ctx.enemyHP <= 0){
    appendLog("¡Derrotaste al enemigo!");
    endBattle(true);
    } else if(ctx.playerHP <= 0){
    appendLog("Has sido derrotado...");
    endBattle(false);
    } else {
    // continue: enemy again (simple turn - enemy always gives next equation)
    setTimeout(()=> nextEnemyTurn(), 900);
    }
}

function endBattle(playerWon){
    if(battleTimerInterval) clearInterval(battleTimerInterval);
    game.inBattle = false;
    overlay.style.visibility = 'hidden';
    if(playerWon){
    // remove enemy from world
    const e = game.battleContext.enemy;
    e.active = false;
    game.player.kills += 1;
    hudKills.textContent = game.player.kills;
    // reward: small heal
    game.player.hp = Math.min(CONFIG.PLAYER_MAX_HP, game.player.hp + 6);
    hudHP.textContent = Math.round(game.player.hp);
    hudBar.style.width = (game.player.hp/CONFIG.PLAYER_MAX_HP*100) + "%";
    } else {
    // player lost: respawn
    game.player.hp = Math.max(1, Math.round(game.player.hp * 0.5));
    hudHP.textContent = Math.round(game.player.hp);
    hudBar.style.width = (game.player.hp/CONFIG.PLAYER_MAX_HP*100) + "%";
    }
    game.battleContext = null;
}

/* ---------- Player answering ---------- */
submitBtn.addEventListener('click', () => {
    if(!game.inBattle) return;
    if(battleTimerInterval) clearInterval(battleTimerInterval);
    const ansRaw = answerInput.value.trim();
    if(ansRaw === ""){
    appendLog("No respondiste.");
    onBattleTimeout();
    return;
}

// try to parse numeric answer
    const ans = Number(ansRaw.replace(',', '.'));
    if(isNaN(ans)){
    appendLog("Respuesta no válida.");
    onBattleTimeout();
    return;
}

// check correctness: we accept close enough for floats
    const correct = currentExpression.value;
    if(Math.abs(ans - correct) < 0.0001){
    // player hits enemy: damage = |correct|
    const dmg = Math.max(1, Math.round(Math.abs(correct)));
    applyEnemyDamage(dmg);
    } else {
    appendLog(`Respuesta incorrecta. La respuesta correcta es ${correct}.`);
    // penalty: enemy hits player for |correct|
    const dmg = Math.max(1, Math.round(Math.abs(correct)));
    applyPlayerDamage(dmg);
    }
    checkBattleEndOrContinue();
});

skipBtn.addEventListener('click', ()=>{
    if(!game.inBattle) return;
    if(battleTimerInterval) clearInterval(battleTimerInterval);
    appendLog("Te rendiste. El enemigo ataca.");
    const dmg = Math.max(1, Math.round(Math.abs(currentExpression.value)));
    applyPlayerDamage(dmg);
    checkBattleEndOrContinue();
});

// prevent closing overlay accidentally
document.getElementById('closeBattle').addEventListener('click', ()=>{
    appendLog("No puedes cerrar esto hasta terminar la pelea.");
});

// ----------------- Helpful: allow Enter key on input -----------------
answerInput.addEventListener('keydown', (e)=>{
    if(e.key === 'Enter') submitBtn.click();
});

function generateExpression() {
  // Elegir operación
    const operaciones = ["+", "-", "×", "÷"];
  const op = operaciones[Math.floor(Math.random() * operaciones.length)];

    let a, b, respuesta;

    if (op === "+") {
    // SUMA fácil (1 a 20)
    a = Math.floor(Math.random() * 20) + 1;
    b = Math.floor(Math.random() * 20) + 1;
    respuesta = a + b;

    } else if (op === "-") {
    // RESTA fácil (evita negativos)
    a = Math.floor(Math.random() * 20) + 1;
    b = Math.floor(Math.random() * a); 
    respuesta = a - b;

    } else if (op === "×") {
    // MULTIPLICACIÓN (tablas del 1 al 5)
    a = Math.floor(Math.random() * 5) + 1;
    b = Math.floor(Math.random() * 5) + 1;
    respuesta = a * b;

    } else if (op === "÷") {
    // DIVISIÓN exacta y pequeña
    b = Math.floor(Math.random() * 5) + 1;      // divisor 1–5
    respuesta = Math.floor(Math.random() * 5) + 1; // resultado 1–5
    a = b * respuesta; // asegura que la división sea exacta
    }

    return { expr: `${a} ${op} ${b}`, value: respuesta };
}