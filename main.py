import os
from flask import Flask, render_template

app = Flask(__name__,  
            static_folder='static') # Static files

@app.route('/') # 
def home():
   return render_template('index.html')

if __name__ == '__main__':
    app.run(port=int(os.getenv('PORT', 5000)), ssl_context='adhoc', host = "0.0.0.0") # Hosting on HTTPS