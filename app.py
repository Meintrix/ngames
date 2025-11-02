from flask import Flask, render_template, request, session
import random

app = Flask(__name__)
app.secret_key = "meintrix_secret_key_2025"

# -------------------------------
# صفحه اصلی
# -------------------------------
@app.route('/')
def index():
    return render_template('index.html')

# -------------------------------
# بازی حدس عدد
# -------------------------------
@app.route('/guess', methods=['GET', 'POST'])
def guess():
    if 'number' not in session:
        session['number'] = random.randint(1, 100)
        session['tries'] = 0

    message = ""
    if request.method == 'POST':
        try:
            guess = int(request.form['guess'])
        except:
            message = "لطفاً فقط عدد وارد کن 😅"
            return render_template('guess.html', message=message)

        session['tries'] += 1
        number = session['number']

        if guess < number:
            message = "عدد بزرگ‌تره ⬆️"
        elif guess > number:
            message = "عدد کوچک‌تره ⬇️"
        else:
            message = f"آفرین 🎉 عدد {number} بود! در {session['tries']} تلاش حدس زدی!"
            session.pop('number')
            session.pop('tries')

    return render_template('guess.html', message=message)

# -------------------------------
# بازی مار
# -------------------------------
@app.route('/snake')
def snake():
    return render_template('snake.html')

# -------------------------------
# بازی سنگ، کاغذ، قیچی
# -------------------------------
@app.route('/rps', methods=['GET', 'POST'])
def rps():
    result = ""
    user_choice = ""
    computer_choice = ""
    choices = ["سنگ", "کاغذ", "قیچی"]

    if request.method == 'POST':
        user_choice = request.form["choice"]
        computer_choice = random.choice(choices)

        if user_choice == computer_choice:
            result = "مساوی شد 😐"
        elif (user_choice == "سنگ" and computer_choice == "قیچی") or \
             (user_choice == "کاغذ" and computer_choice == "سنگ") or \
             (user_choice == "قیچی" and computer_choice == "کاغذ"):
            result = "بردی 😎"
        else:
            result = "باختی 😢"

    return render_template('rps.html', result=result, user_choice=user_choice, computer_choice=computer_choice)

# -------------------------------
# بازی شلیک فضایی
# -------------------------------
@app.route('/space')
def space():
    return render_template('space.html')

# -------------------------------
# اجرای برنامه (برای لوکال یا Vercel)
# -------------------------------
if __name__ == "__main__":
    app.run(debug=True)