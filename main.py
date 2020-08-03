from flask import Flask, render_template, url_for


app = Flask(__name__)


@app.route('/')
def index():
    return render_template('index.html')


@app.route('/game')
def design():
    return render_template('game-page.html')


def main():
    app.run(debug=True)


if __name__ == '__main__':
    main()

