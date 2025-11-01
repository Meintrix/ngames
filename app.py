from flask import Flask, render_template, request, redirect, url_for, session
import random

app = Flask(__name__, template_folder='Templates', static_folder='Static')
app.secret_key = "meintrix_secret_key"

# ----- صفحه اصلی -----
@app.route('/')
def home():
    return render_template('index.html')

# ----- صفحه رأی‌گیری -----
votes = {"کال آف دیوتی": 0, "پابجی": 0, "وارتاندر": 0, "ماینکرفت": 0}

@app.route('/vote', methods=['POST'])
def vote():
    if 'user' not in session:
        return redirect(url_for('register'))

    choice = request.form.get('choice')
    if choice in votes and not session.get('voted', False):
        votes[choice] += 1
        session['voted'] = True
    return redirect(url_for('results'))

@app.route('/results')
def results():
    return render_template('results.html', votes=votes)

@app.route('/unvote')
def unvote():
    if session.get('voted', False):
        session['voted'] = False
    return redirect(url_for('home'))

# ----- صفحه ثبت‌نام -----
@app.route('/register', methods=['GET', 'POST'])
def register():
    if request.method == 'POST':
        name = request.form.get('name')
        family = request.form.get('family')
        if name and family:
            session['user'] = f"{name} {family}"
            return redirect(url_for('home'))
    return render_template('register.html')

# ----- بازی حدس عدد -----
@app.route('/guess', methods=['GET', 'POST'])
def guess():
    if 'number' not in session:
        session['number'] = random.randint(1, 20)
    message = ""
    if request.method == 'POST':
        try:
            guess = int(request.form['guess'])
            if guess < session['number']:
                message = "عدد بزرگ‌تره 😅"
            elif guess > session['number']:
                message = "عدد کوچک‌تره 😏"
            else:
                message = "درست حدس زدی 🎉"
                session.pop('number', None)
        except:
            message = "عدد وارد کن 😅"
    return render_template('guess.html', message=message)

# ----- بازی سنگ کاغذ قیچی -----
@app.route('/rps', methods=['GET', 'POST'])
def rps():
    choices = ["سنگ", "کاغذ", "قیچی"]
    user_choice = ""
    result = ""
    if request.method == 'POST':
        user_choice = request.form.get('choice')
        comp_choice = random.choice(choices)
        if user_choice == comp_choice:
            result = f"مساوی شد! هر دو {user_choice} انتخاب کردین 😅"
        elif (user_choice == "سنگ" and comp_choice == "قیچی") or \
             (user_choice == "کاغذ" and comp_choice == "سنگ") or \
             (user_choice == "قیچی" and comp_choice == "کاغذ"):
            result = f"بردی! کامپیوتر {comp_choice} آورد 🎉"
        else:
            result = f"باختی 😢 کامپیوتر {comp_choice} آورد"
    return render_template('rps.html', result=result, user_choice=user_choice)

# ----- بازی مار -----
@app.route('/snake')
def snake():
    return render_template('snake.html')

# ----- اجرای محلی (در Vercel لازم نیست) -----
if __name__ == "__main__":
    app.run()