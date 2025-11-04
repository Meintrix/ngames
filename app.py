from flask import Flask, render_template, request, redirect, url_for, session, jsonify
import random

app = Flask(__name__)
app.secret_key = "super_secret_key_987"  # اینو در پروژت تغییر بده برای امنیت

# -------------------- صفحه ورود --------------------
@app.route('/', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        name = request.form.get('name', '').strip()
        lastname = request.form.get('lastname', '').strip()
        if name and lastname:
            session['user'] = f"{name} {lastname}"
            # ذخیره رکورد پایه برای این جلسه (می‌تونی DB بذاری بعداً)
            session['score'] = session.get('score', 0)
            return redirect(url_for('menu'))
        else:
            return render_template('login.html', error="نام و نام‌خانوادگی را وارد کنید.")
    return render_template('login.html')


# -------------------- منوی اصلی --------------------
@app.route('/menu')
def menu():
    if 'user' not in session:
        return redirect(url_for('login'))
    return render_template('index.html', username=session['user'], score=session.get('score', 0))


# -------------------- بازی‌ها --------------------
@app.route('/space')
def space():
    if 'user' not in session:
        return redirect(url_for('login'))
    return render_template('space.html')

@app.route('/snake')
def snake():
    if 'user' not in session:
        return redirect(url_for('login'))
    return render_template('snake.html')

@app.route('/guess', methods=['GET', 'POST'])
def guess():
    if 'user' not in session:
        return redirect(url_for('login'))

    # برای سادگی از session برای بازی حدس عدد (سرور ساید)
    if 'guess_number' not in session:
        session['guess_number'] = random.randint(1, 100)
        session['guess_tries'] = 0

    message = ""
    if request.method == 'POST':
        try:
            g = int(request.form.get('guess'))
        except:
            message = "لطفاً عدد وارد کن."
            return render_template('guess.html', message=message)

        session['guess_tries'] = session.get('guess_tries', 0) + 1
        number = session['guess_number']
        if g < number:
            message = "عدد بزرگ‌تره ⬆️"
        elif g > number:
            message = "عدد کوچک‌تره ⬇️"
        else:
            tries = session.get('guess_tries', 1)
            message = f"آفرین! عدد {number} بود — در {tries} تلاش!"
            # امتیازدهی: مثال 100 - tries
            gained = max(1, 100 - tries)
            session['score'] = max(session.get('score', 0), session.get('score', 0))  # no overwrite
            # پاکسازی بازی
            session.pop('guess_number', None)
            session.pop('guess_tries', None)

    return render_template('guess.html', message=message)


@app.route('/rps', methods=['GET', 'POST'])
def rps():
    if 'user' not in session:
        return redirect(url_for('login'))

    result = None
    user_choice = None
    computer_choice = None
    choices = ["سنگ", "کاغذ", "قیچی"]

    if request.method == 'POST':
        user_choice = request.form.get('choice')
        computer_choice = random.choice(choices)
        if user_choice == computer_choice:
            result = "مساوی شد 😐"
        elif (user_choice == "سنگ" and computer_choice == "قیچی") or \
             (user_choice == "کاغذ" and computer_choice == "سنگ") or \
             (user_choice == "قیچی" and computer_choice == "کاغذ"):
            result = "بردی 😎"
            # مثال: دادن 1 امتیاز برای برد
            session['score'] = session.get('score', 0) + 1
        else:
            result = "باختی 😢"
    return render_template('rps.html', result=result, user_choice=user_choice, computer_choice=computer_choice)


@app.route('/earth_map')
def earth_map():
    if 'user' not in session:
        return redirect(url_for('login'))
    return render_template('earth_map.html')
    # -------------------- بروزرسانی رکورد در session --------------------
@app.route('/update_score', methods=['POST'])
def update_score():
    # این نقطه برای دریافت امتیاز از کلاینت (JSON یا form-url-encoded)
    try:
        if request.is_json:
            data = request.get_json()
            new_score = int(data.get('score', 0))
        else:
            new_score = int(request.form.get('score', 0))
    except:
        return ('Bad Request', 400)

    # ذخیره در session فقط اگر بیشتر از رکورد قبلی بود
    if new_score > session.get('score', 0):
        session['score'] = new_score
    return ('', 204)


# -------------------- خروج --------------------
@app.route('/logout')
def logout():
    session.clear()
    return redirect(url_for('login'))


if __name__ == "__main__":
    app.run(debug=True)