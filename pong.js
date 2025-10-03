window.onload = function() {
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
        thegod: 15
    };

    btn1p.onclick = () => {
        btn1p.style.display = 'none';
        btn2p.style.display = 'none';
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


    let paddleHeight = 80, paddleWidth = 12;
    let ballSize = 12;
    let p1Y, p2Y, ballX, ballY, ballVX, ballVY;
    let p1Score = 0, p2Score = 0;
    let playing = false;

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

    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        ctx.setLineDash([10, 10]);
        ctx.strokeStyle = "#fff";
        ctx.beginPath();
        ctx.moveTo(canvas.width/2, 0);
        ctx.lineTo(canvas.width/2, canvas.height);
        ctx.stroke();
        ctx.setLineDash([]);

 
        ctx.fillStyle = "#fff";
        ctx.fillRect(20, p1Y, paddleWidth, paddleHeight);
        ctx.fillRect(canvas.width-32, p2Y, paddleWidth, paddleHeight);

  
        ctx.beginPath();
        ctx.arc(ballX, ballY, ballSize, 0, Math.PI*2);
        ctx.fill();

   
        ctx.font = "40px Arial";
        ctx.fillText(p1Score, canvas.width/2 - 80, 50);
        ctx.fillText(p2Score, canvas.width/2 + 40, 50);
    }

    function movePaddles() {
     
        if (keys['z']) p1Y -= 6;
        if (keys['s']) p1Y += 6;
        p1Y = Math.max(0, Math.min(canvas.height-paddleHeight, p1Y));

        if (gameMode === '2p') {
        
            if (keys['arrowup']) p2Y -= 6;
            if (keys['arrowdown']) p2Y += 6;
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

       
        if (ballX - ballSize < 32 && ballY > p1Y && ballY < p1Y + paddleHeight) {
            ballVX *= -1.1;
            ballVY += (Math.random()-0.5)*2;
            ballX = 32 + ballSize;
        }
        
        if (ballX + ballSize > canvas.width-32 && ballY > p2Y && ballY < p2Y + paddleHeight) {
            ballVX *= -1.1;
            ballVY += (Math.random()-0.5)*2;
            ballX = canvas.width-32 - ballSize;
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
