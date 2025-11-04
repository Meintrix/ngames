from flask import Flask, render_template, request, redirect, url_for, session
import random

app = Flask(__name__)
app.secret_key = "super_secret_key_987"

# -------------------- صفحه ورود --------------------
@app.route('/', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        name = request.form.get('name')
        lastname = request.form.get('lastname')
        if name and lastname:
            session['user'] = f"{name} {lastname}"
            session['score'] = 0
            return redirect(url_for('menu'))
    return render_template('login.html')

# -------------------- منوی اصلی --------------------
@app.route('/menu')
def menu():
    if 'user' not in session:
        return redirect(url_for('login'))
    return render_template('index.html', username=session['user'], score=session.get('score', 0))

# -------------------- بازی شلیک فضایی --------------------
@app.route('/space')
def space():
    if 'user' not in session:
        return redirect(url_for('login'))
    return render_template('space.html')

@app.route('/update_score', methods=['POST'])
def update_score():
    new_score = int(request.form['score'])
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