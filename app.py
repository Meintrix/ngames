from flask import Flask, render_template, request, jsonify, session
import random

app = Flask(__name__)
app.secret_key = "supersecretkey"

# -------------------------------
# صفحه اصلی
# -------------------------------
@app.route('/')
def index():
    return render_template('index.html')

# -------------------------------
# بازی مار
# -------------------------------
@app.route('/snake')
def snake():
    return render_template('snake.html')

# -------------------------------
# بازی حدس عدد
# -------------------------------
@app.route('/guess')
def guess():
    session['number'] = random.randint(1, 100)
    return render_template('guess.html')

@app.route('/check_guess', methods=['POST'])
def check_guess():
    user_guess = int(request.form['guess'])
    number = session.get('number', None)

    if not number:
        return jsonify({'result': 'بازی شروع نشده!'})

    if user_guess < number:
        return jsonify({'result': 'بزرگ‌تر حدس بزن 😄'})
    elif user_guess > number:
        return jsonify({'result': 'کوچیک‌تر حدس بزن 🤔'})
    else:
        return jsonify({'result': 'آفرین درست حدس زدی 🎉'})

# -------------------------------
# سنگ کاغذ قیچی
# -------------------------------
@app.route('/rps')
def rps():
    return render_template('RPS.html')

@app.route('/play_rps', methods=['POST'])
def play_rps():
    choices = ['سنگ', 'کاغذ', 'قیچی']
    user = request.form['choice']
    computer = random.choice(choices)

    if user == computer:
        result = 'مساوی شد 😐'
    elif (user == 'سنگ' and computer == 'قیچی') or \
         (user == 'کاغذ' and computer == 'سنگ') or \
         (user == 'قیچی' and computer == 'کاغذ'):
        result = 'بردی! 🎉'
    else:
        result = 'باختی 😢'

    return jsonify({'computer': computer, 'result': result})

if name == "__main__":
    app.run()