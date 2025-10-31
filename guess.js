// guess.js
(() => {
    const guessInput = document.getElementById('guessInput');
    const guessBtn = document.getElementById('guessBtn');
    const newGameBtn = document.getElementById('newGameBtn');
    const msg = document.getElementById('guessMsg');
    const attemptsEl = document.getElementById('attempts');

    let secret = Math.floor(Math.random()*100) + 1;
    let attempts = 0;

    function newGame(){
        secret = Math.floor(Math.random()*100) + 1;
        attempts = 0;
        attemptsEl.textContent = attempts;
        msg.textContent = "بزن بریم! عددی بین 1 تا 100 انتخاب شده.";
        guessInput.value = '';
    }

    guessBtn.addEventListener('click', () => {
        const val = Number(guessInput.value);
        if (!val || val < 1 || val > 100){
            msg.textContent = "لطفاً عددی بین 1 تا 100 وارد کن.";
            return;
        }
        attempts++;
        attemptsEl.textContent = attempts;

        if (val === secret){
            msg.textContent = آفرین! درست حدس زدی 🎉 — عدد ${secret} بود. تلاش‌ها: ${attempts};
        } else if (val < secret){
            msg.textContent = "عدد بیشتر است ▲";
        } else {
            msg.textContent = "عدد کمتر است ▼";
        }
    });

    newGameBtn.addEventListener('click', newGame);

    // شروع
    newGame();
})();