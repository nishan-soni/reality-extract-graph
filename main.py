import os
from rembg import remove
from PIL import Image
from io import BytesIO
import base64
from flask import Flask, jsonify, request, render_template

app = Flask(__name__,  
            static_folder='static')

@app.route('/')
def home():
   return render_template('index.html')
  
@app.route("/removebg", methods = ['POST'])
def removebackground():

    #venv\Scripts\activate

    base64String = request.get_json()['base64img'].split(",")[1] # getting the image data from the string

    image = Image.open(BytesIO(base64.b64decode(base64String)))

    output_image = remove(image) # The Image object with a removed background

    image_buffer = BytesIO()
    output_image.save(image_buffer, format="png")
    return jsonify({"data": base64.b64encode(image_buffer.getvalue()).decode("utf-8")}) # The new image as a base64string

if __name__ == '__main__':
    app.run(port=int(os.getenv('PORT', 5000)), ssl_context='adhoc', host = "0.0.0.0")
 