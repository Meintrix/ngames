from flask import Flask, render_template

app = Flask(__name__)

# صفحه اصلی
@app.route('/')
def index():
    return render_template('index.html')


# بازی فضایی
@app.route('/space')
def space():
    return render_template('space.html')


# بازی حدس عدد
@app.route('/guess')
def guess():
    return render_template('guess.html')


# بازی مار
@app.route('/snake')
def snake():
    return render_template('snake.html')


# بازی سنگ، کاغذ، قیچی
@app.route('/rps')
def rps():
    return render_template('rps.html')


# اطلاعات زمین
@app.route('/earth')
def earth():
    return render_template('earth.html')


# اجرای برنامه
if name == '__main__':
    app.run(debug=True)