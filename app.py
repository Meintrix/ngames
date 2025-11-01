from flask import Flask, render_template, request, redirect, url_for

app = Flask(__name__)

@app.route('/')
def home():
    return render_template('index.html')

# بقیه‌ی روت‌ها و بازی‌ها و...

# ⚠️ این قسمت خیلی مهمه:
# نباید app.run() در انتها فعال باشه!
# یعنی یا حذفش کن یا بذار داخل if شرطی زیر:
if name == "__main__":
    app.run()