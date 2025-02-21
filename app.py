from flask import Flask, request, jsonify
import numpy as np
import cv2
import base64
from flask_cors import CORS
import mysql.connector

app = Flask(__name__)
CORS(app)

# Connect to MySQL
db = mysql.connector.connect(
    host="localhost",
    user="root",
    password="yourpassword",
    database="facego"
)
cursor = db.cursor()

@app.route("/process-face", methods=["POST"])
def process_face():
    try:
        data = request.json["image"]
        image_data = base64.b64decode(data)
        np_arr = np.frombuffer(image_data, np.uint8)
        img = cv2.imdecode(np_arr, cv2.IMREAD_COLOR)

        # Simulate face encoding (Replace with real face recognition)
        face_encoding = np.random.rand(128).tolist()

        return jsonify({"success": True, "face_encoding": face_encoding})
    except Exception as e:
        return jsonify({"success": False, "error": str(e)})

if __name__ == "__main__":
    app.run(port=5000, debug=True)
