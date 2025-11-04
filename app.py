from flask import Flask, render_template, request, redirect, url_for, session
import random

app = Flask(__name__)
app.secret_key = "secret_key_123"

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/guess', methods=['GET','POST'])
def guess():
    message = ""
    if request.method == 'POST':
        try:
            g = int(request.form.get('guess',''))
        except:
            message = "لطفاً یک عدد وارد کن."
            return render_template('guess.html', message=message)
        # ساده: عدد رندوم برای هر بار فرم ارسال میشه
        number = random.randint(1,100)
        if g < number:
            message = f"عدد بزرگ‌تره! (هدف: {number})"
        elif g > number:
            message = f"عدد کوچک‌تره! (هدف: {number})"
        else:
            message = f"آفرین! درست بود — {number}"
    return render_template('guess.html', message=message)

@app.route('/rps', methods=['GET','POST'])
def rps():
    result = None
    user_choice = None
    computer_choice = None
    choices = ["سنگ","کاغذ","قیچی"]
    if request.method == 'POST':
        user_choice = request.form.get('choice')
        computer_choice = random.choice(choices)
        if user_choice == computer_choice:
            result = "مساوی شد"
        elif (user_choice=="سنگ" and computer_choice=="قیچی") or \
             (user_choice=="کاغذ" and computer_choice=="سنگ") or \
             (user_choice=="قیچی" and computer_choice=="کاغذ"):
            result = "بردی"
        else:
            result = "باختی"
    return render_template('rps.html', result=result, user_choice=user_choice, computer_choice=computer_choice)

@app.route('/snake')
def snake():
    return render_template('snake.html')

@app.route('/space')
def space():
    return render_template('space.html')

@app.route('/earth')
def earth():
    return render_template('earth_map.html')

if __name__ == '__main__':
    app.run(debug=True)