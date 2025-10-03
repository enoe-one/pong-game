window.onload = function() {
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');

    const menu = document.getElementById('menu');
    const btn1p = document.getElementById('btn-1p');
    const btn2p = document.getElementById('btn-2p');
    const difficultySelect = document.getElementById('difficulty-select');
    const difficultyButtons = document.querySelectorAll('.difficulty');

   
    menu.style.opacity = "0";
    setTimeout(() => { menu.style.opacity = "1"; menu.style.transition = "opacity 1.2s"; }, 150);

    let gameMode = null;
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
        btn1p.style.display = 'none';
        btn2p.style.display = 'none';
        difficultySelect.style.display = 'block';
        difficultySelect.style.animation = "fade-in 0.7s";
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

  
    let paddleHeight = 90, paddleWidth = 16;
    let ballSize = 14;
    let p1Y, p2Y, ballX, ballY, ballVX, ballVY;
    let p1Score = 0, p2Score = 0;
    let playing = false;
    let bgParticles = [];

    function initParticles() {
        bgParticles = [];
        for(let i=0; i<32; i++) {
            bgParticles.push({
                x: Math.random()*canvas.width,
                y: Math.random()*canvas.height,
                r: Math.random()*2 + 1.5,
                vx: (Math.random()-0.5)*0.7,
                vy: (Math.random()-0.5)*0.7,
                color: `rgba(0,255,255,${Math.random()*0.5+0.3})`
            });
        }
    }

    function resetGame() {
        p1Y = canvas.height / 2 - paddleHeight / 2;
        p2Y = canvas.height / 2 - paddleHeight / 2;
        ballX = canvas.width / 2;
        ballY = canvas.height / 2;
        ballVX = (Math.random() > 0.5 ? 1 : -1) * 5;
        ballVY = (Math.random() > 0.5 ? 1 : -1) * 3;
        p1Score = 0;
        p2Score = 0;
        playing = true;
        initParticles();
    }

    function startGame(mode) {
        gameMode = mode;
        menu.style.display = 'none';
        canvas.style.display = 'block';
        difficultySelect.style.display = 'none';
        resetGame();
        window.requestAnimationFrame(gameLoop);
    }

    let keys = {};
    window.addEventListener('keydown', e => { keys[e.key.toLowerCase()] = true; });
    window.addEventListener('keyup', e => { keys[e.key.toLowerCase()] = false; });

    function drawBg() {
        let grd = ctx.createRadialGradient(canvas.width/2, canvas.height/2, 60, canvas.width/2, canvas.height/2, canvas.width/2);
        grd.addColorStop(0, "rgba(0,255,255,0.09)");
        grd.addColorStop(1, "rgba(30,25,60,0.9)");
        ctx.fillStyle = grd;
        ctx.fillRect(0, 0, canvas.width, canvas.height);


        for(let p of bgParticles) {
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.r, 0, Math.PI*2);
            ctx.fillStyle = p.color;
            ctx.fill();

            p.x += p.vx;
            p.y += p.vy;
            if(p.x < 0) p.x = canvas.width;
            if(p.x > canvas.width) p.x = 0;
            if(p.y < 0) p.y = canvas.height;
            if(p.y > canvas.height) p.y = 0;
        }
    }

    function draw() {
        drawBg();


        for(let i=0; i<canvas.height; i+=32) {
            ctx.save();
            ctx.globalAlpha = 0.11 + (i%64==0 ? 0.18 : 0);
            ctx.fillStyle = "#00fff0";
            ctx.fillRect(canvas.width/2 - 2, i, 4, 22);
            ctx.restore();
        }


        ctx.save();
        ctx.shadowColor = "#00fff0";
        ctx.shadowBlur = 18;
        ctx.fillStyle = "#00fff0";
        ctx.fillRect(28, p1Y, paddleWidth, paddleHeight);
        ctx.fillRect(canvas.width-28-paddleWidth, p2Y, paddleWidth, paddleHeight);
        ctx.restore();

        ctx.save();
        ctx.shadowColor = "#fff";
        ctx.shadowBlur = 12;
        ctx.fillStyle = "#fff";
        ctx.beginPath();
        ctx.arc(ballX, ballY, ballSize, 0, Math.PI*2);
        ctx.fill();
        ctx.restore();


        ctx.save();
        ctx.font = "bold 55px Orbitron, Arial";
        ctx.textAlign = "center";
        ctx.fillStyle = "#00fff0";
        ctx.shadowColor = "#fff";
        ctx.shadowBlur = 10;
        ctx.fillText(p1Score, canvas.width/2 - 90, 65);
        ctx.fillText(p2Score, canvas.width/2 + 90, 65);
        ctx.restore();


        ctx.save();
        ctx.font = "18px Orbitron, Arial";
        ctx.fillStyle = "#fff";
        ctx.globalAlpha = 0.7;
        ctx.fillText("Joueur 1: ↑ ↓", 105, canvas.height-18);
        if(gameMode === '2p')
            ctx.fillText("Joueur 2: Z S", canvas.width-105, canvas.height-18);
        ctx.restore();
    }

    function movePaddles() {

        if (keys['arrowup']) p1Y -= 7;
        if (keys['arrowdown']) p1Y += 7;
        p1Y = Math.max(0, Math.min(canvas.height-paddleHeight, p1Y));

        if (gameMode === '2p') {

            if (keys['z']) p2Y -= 7;
            if (keys['s']) p2Y += 7;
            p2Y = Math.max(0, Math.min(canvas.height-paddleHeight, p2Y));
        } else {

            let iaSpeed = DIFFICULTY_SPEED[difficulty];
            if (ballY < p2Y + paddleHeight/2) p2Y -= iaSpeed;
            if (ballY > p2Y + paddleHeight/2) p2Y += iaSpeed;
            p2Y = Math.max(0, Math.min(canvas.height-paddleHeight, p2Y));
        }
    }

    function moveBall() {
        ballX += ballVX;
        ballY += ballVY;

        if (ballY - ballSize < 0 || ballY + ballSize > canvas.height) ballVY *= -1;

        if (ballX - ballSize < 28 + paddleWidth && ballY > p1Y && ballY < p1Y + paddleHeight && ballVX < 0) {
            ballVX *= -1.1;
            ballVY += (Math.random()-0.5)*2.5;
            ballX = 28 + paddleWidth + ballSize;
        }
        
        if (ballX + ballSize > canvas.width-28-paddleWidth && ballY > p2Y && ballY < p2Y + paddleHeight && ballVX > 0) {
            ballVX *= -1.1;
            ballVY += (Math.random()-0.5)*2.5;
            ballX = canvas.width-28-paddleWidth - ballSize;
        }

       
        if (ballX < 0) { p2Score++; resetBall(-1); }
        if (ballX > canvas.width) { p1Score++; resetBall(1); }
    }

    function resetBall(direction) {
        ballX = canvas.width / 2;
        ballY = canvas.height / 2;
        ballVX = direction * 5;
        ballVY = (Math.random() > 0.5 ? 1 : -1) * 3;
    }

    function gameLoop() {
        if (!playing) return;
        movePaddles();
        moveBall();
        draw();
        window.requestAnimationFrame(gameLoop);
    }
};
