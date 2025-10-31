// rps.js
(() => {
    const buttons = document.querySelectorAll('.rps-btn');
    const playerMoveEl = document.getElementById('playerMove');
    const computerMoveEl = document.getElementById('computerMove');
    const outcomeEl = document.getElementById('rpsOutcome');
    const scoreEl = document.getElementById('rpsScore');
    const resetBtn = document.getElementById('rpsReset');

    let score = 0;
    const choices = ['rock','paper','scissors'];

    function computerPick(){
        return choices[Math.floor(Math.random()*choices.length)];
    }

    function decide(player, comp){
        if (player === comp) return 'مساوی';
        if (
            (player==='rock' && comp==='scissors') ||
            (player==='paper' && comp==='rock') ||
            (player==='scissors' && comp==='paper')
        ) return 'برد';
        return 'باخت';
    }

    buttons.forEach(btn => {
        btn.addEventListener('click', () => {
            const player = btn.getAttribute('data-move');
            const comp = computerPick();
            const res = decide(player, comp);

            playerMoveEl.textContent = btn.textContent;
            computerMoveEl.textContent = comp === 'rock' ? '✊ سنگ' : comp==='paper' ? '✋ کاغذ' : '✌️ قیچی';
            outcomeEl.textContent = res;

            if (res === 'برد') score++;
            else if (res === 'باخت') score = Math.max(0, score-1);

            scoreEl.textContent = score;
        });
    });

    resetBtn.addEventListener('click', () => {
        score = 0;
        scoreEl.textContent = score;
        playerMoveEl.textContent = '-';
        computerMoveEl.textContent = '-';
        outcomeEl.textContent = '-';
    });
})();