document.addEventListener('DOMContentLoaded', () => {
    const gameArea = document.getElementById('game-area');
    const scoreDisplay = document.getElementById('score');
    const timeDisplay = document.getElementById('time');
    const attemptsDisplay = document.getElementById('attempts');
    const statusDisplay = document.getElementById('status');
    
    // Set your single redirect URL here
    const redirectUrl = 'https://www.lilaq.ai/';
    
    let score = 0;
    let timeLeft = 30;
    let attemptsLeft = 3;
    let gameActive = false;
    let gameTimer;
    let eggTimer;
    let successTimer;
    let consecutiveSuccessTime = 0;
    const requiredSuccessTime = 20; // 20 seconds of continuous success
    
    function startGame() {
        gameArea.innerHTML = '';
        score = 0;
        timeLeft = 30;
        attemptsLeft = 3;
        consecutiveSuccessTime = 0;
        gameActive = true;
        
        scoreDisplay.textContent = score;
        timeDisplay.textContent = timeLeft;
        attemptsDisplay.textContent = attemptsLeft;
        statusDisplay.textContent = "Click the eggs as they appear!";
        statusDisplay.className = "status";
        
        gameTimer = setInterval(() => {
            timeLeft--;
            timeDisplay.textContent = timeLeft;
            
            if (timeLeft <= 0) {
                endGame();
            }
        }, 1000);
        
        spawnEgg();
    }
    
    function spawnEgg() {
        if (!gameActive) return;
        
        gameArea.innerHTML = '';
        
        const egg = document.createElement('div');
        egg.className = 'egg';
        
        const maxX = gameArea.offsetWidth - 50;
        const maxY = gameArea.offsetHeight - 60;
        const randomX = Math.floor(Math.random() * maxX);
        const randomY = Math.floor(Math.random() * maxY);
        
        egg.style.left = `${randomX}px`;
        egg.style.top = `${randomY}px`;
        
        egg.addEventListener('click', () => {
            if (!gameActive || egg.classList.contains('found')) return;
            
            egg.classList.add('found');
            score++;
            scoreDisplay.textContent = score;
            
            consecutiveSuccessTime = 0;
            statusDisplay.textContent = "Good! Keep clicking!";
            statusDisplay.classList.add("success");
            
            if (score >= 1) {
                if (successTimer) clearInterval(successTimer);
                successTimer = setInterval(() => {
                    consecutiveSuccessTime++;
                    if (consecutiveSuccessTime >= requiredSuccessTime) {
                        endGame(); // Success condition met
                    }
                }, 1000);
            }
            
            setTimeout(spawnEgg, 300);
        });
        
        gameArea.appendChild(egg);
        
        eggTimer = setTimeout(() => {
            if (!egg.classList.contains('found') && gameActive) {
                attemptsLeft--;
                attemptsDisplay.textContent = attemptsLeft;
                statusDisplay.textContent = "Missed an egg!";
                statusDisplay.classList.add("fail");
                
                if (successTimer) clearInterval(successTimer);
                consecutiveSuccessTime = 0;
                
                if (attemptsLeft <= 0) {
                    endGame(); // Failure condition met
                } else {
                    spawnEgg();
                }
            }
        }, 2000);
    }
    
    function endGame() {
        gameActive = false;
        clearInterval(gameTimer);
        clearTimeout(eggTimer);
        if (successTimer) clearInterval(successTimer);
        
        // Immediately redirect to the same URL regardless of success/failure
        window.location.href = redirectUrl;
    }
    
    // Start the game immediately
    startGame();
});