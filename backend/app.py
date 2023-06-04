from flask import Flask, request, jsonify
from tensorflow.keras.models import load_model
import tensorflow as tf

app = Flask(__name__)

@app.route('/predict', methods=['POST'])
def predict():
    # Extract the input data from the request
    data = request.json

    # Load your Keras model
    model = load_model('model.h5')

    data = data[0]
    acc = data['accelerometer'] 
    gyro = data['gyroscope']
    lc = data['deviceMotion']
    # convert this to numpy array [1,100,9]

    data = []
    for i in range(100):
        if (gyro[i] == {}):
            gyro[i] = {'x': 0, 'y': 0, 'z': 0}
        if (acc[i] == {}):
            acc[i] = {'x': 0, 'y': 0, 'z': 0}
        if (lc[i] == {}):
            lc[i] = {'acceleration': {'x': 0, 'y': 0, 'z': 0}}
        data.append([acc[i]['x'], acc[i]['y'], acc[i]['z'], gyro[i]['x'], gyro[i]['y'], gyro[i]['z'], lc[i]['acceleration']['x'], lc[i]['acceleration']['y'], lc[i]['acceleration']['z']])
    
    data = [data]

    # Perform predictions using the model

    # convert array to tensor
    data = tf.convert_to_tensor(data, dtype=tf.float32)

    predictions = model.predict(data)

    classes = ['Downstairs', 'Jogging', 'Sitting', 'Standing', 'Upstairs', 'Walking']

    # get argmax
    predictions = tf.argmax(predictions, axis=1)

    action = classes[predictions[0].numpy()]

    return jsonify({'predictions': [action]})


@app.route('/classify', methods=['POST'])
def classify():
    pass

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=10101)
