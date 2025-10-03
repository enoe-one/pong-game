const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const menu = document.getElementById('menu');
const btn1p = document.getElementById('btn-1p');
const btn2p = document.getElementById('btn-2p');
const difficultySelect = document.getElementById('difficulty-select');
const difficultyButtons = document.querySelectorAll('.difficulty');

let gameMode = null; // '1p' ou '2p'
let difficulty = 'noob';

const DIFFICULTY_SPEED = {
    noob: 2,
    faible: 3,
    modere: 4,
    fort: 5,
    excellent: 6,
    thegod: 8
};

btn1p.onclick = () => {
    difficultySelect.style.display = 'block';
};

difficultyButtons.forEach(btn => {
    btn.onclick = () => {
        difficulty = btn.getAttribute('data-level');
        startGame('1p');
    };
});

btn2p.onclick = () => {
    startGame('2p');
};

function startGame(mode) {
    menu.style.display = 'none';
    canvas.style.display = 'block';
    gameMode = mode;
    resetGame();
    window.requestAnimationFrame(gameLoop);
}

// Variables du jeu
let paddleHeight = 80, paddleWidth = 12;
let ballSize = 12;
let p1Y, p2Y, ballX, ballY, ballVX, ballVY;
let p1Score = 0, p2Score = 0;

function resetGame() {
    // Paddle positions
    p1Y = canvas.height / 2 - paddleHeight / 2;
    p2Y = canvas.height / 2 - paddleHeight / 2;
    // Ball position & speed
    ballX = canvas.width / 2;
    ballY = canvas.height / 2;
    ballVX = (Math.random() > 0.5 ? 1 : -1) * 5;
    ballVY = (Math.random() > 0.5 ? 1 : -1) * 3;
    p1Score = 0;
    p2Score = 0;
}

// Contrôles
let keys = {};
window.addEventListener('keydown', e => { keys[e.key.toLowerCase()] = true; });
window.addEventListener('keyup', e => { keys[e.key.toLowerCase()] = false; });

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw middle line
    ctx.setLineDash([10, 10]);
    ctx.strokeStyle = "#fff";
    ctx.beginPath();
    ctx.moveTo(canvas.width/2, 0);
    ctx.lineTo(canvas.width/2, canvas.height);
    ctx.stroke();
    ctx.setLineDash([]);

    // Draw paddles
    ctx.fillStyle = "#fff";
    ctx.fillRect(20, p1Y, paddleWidth, paddleHeight);
    ctx.fillRect(canvas.width-32, p2Y, paddleWidth, paddleHeight);

    // Draw ball
    ctx.beginPath();
    ctx.arc(ballX, ballY, ballSize, 0, Math.PI*2);
    ctx.fill();


function movePaddles() {
    // Joueur 1 (flèches bas/haut)
    if (keys['arrowup']) p1Y -= 6;
    if (keys['arrowdown']) p1Y += 6;
    p1Y = Math.max(0, Math.min(canvas.height-paddleHeight, p1Y));

    if (gameMode === '2p') {
        // Joueur 2 (z/s)
        if (keys['z']) p2Y -= 6;
        if (keys['s']) p2Y += 6;
        p2Y = Math.max(0, Math.min(canvas.height-paddleHeight, p2Y));
    } else {
        // IA
        let iaSpeed = DIFFICULTY_SPEED[difficulty];
        if (ballY < p2Y + paddleHeight/2) p2Y -= iaSpeed;
        if (ballY > p2Y + paddleHeight/2) p2Y += iaSpeed;
        p2Y = Math.max(0, Math.min(canvas.height-paddleHeight, p2Y));
    }
}

function moveBall() {
    ballX += ballVX;
    ballY += ballVY;

    // Rebond haut/bas
    if (ballY - ballSize < 0 || ballY + ballSize > canvas.height) ballVY *= -1;

    // Paddle gauche
    if (ballX - ballSize < 32 && ballY > p1Y && ballY < p1Y + paddleHeight) {
        ballVX *= -1.1;
        ballVY += (Math.random()-0.5)*2;
        ballX = 32 + ballSize;
    }
    // Paddle droit
    if (ballX + ballSize > canvas.width-32 && ballY > p2Y && ballY < p2Y + paddleHeight) {
        ballVX *= -1.1;
        ballVY += (Math.random()-0.5)*2;
        ballX = canvas.width-32 - ballSize;
    }



function resetBall(direction) {
    ballX = canvas.width / 2;
    ballY = canvas.height / 2;
    ballVX = direction * 5;
    ballVY = (Math.random() > 0.5 ? 1 : -1) * 3;
}

function gameLoop() {
    movePaddles();
    moveBall();
    draw();
    window.requestAnimationFrame(gameLoop);
}