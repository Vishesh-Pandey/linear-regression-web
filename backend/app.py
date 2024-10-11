# app.py
from flask import Flask, request, jsonify
import numpy as np
from sklearn.linear_model import LinearRegression
from flask_cors import CORS


app = Flask(__name__)
CORS(app)

# Load or train your ML model (example: linear regression)
model = LinearRegression()

# Dummy data for training (X: Features, y: Target)
X = np.array([[1, 2], [2, 3], [3, 4]])
y = np.array([3, 5, 7])

# Train the model
model.fit(X, y)

@app.route('/predict', methods=['POST'])
def predict():
    try:
        # Get the input data from the client
        input_data = request.json['data']
        input_array = np.array(input_data)

        # Use the model to make a prediction
        prediction = model.predict([input_array])

        # Return the result as JSON
        return jsonify({'prediction': prediction.tolist()})
    
    except Exception as e:
        return jsonify({'error': str(e)})
    
@app.route('/bestfitline', methods=['POST'])
def bestfitline():
    '''
    takes the input data and trains a linear regression model using that and then returns coeff_ and intercept_ of the model
    Example of how the data should be passed in the body of the request:
    {
        "data": [
            [x1, y1],
            [x2, y2],
            ...
        ]
    }
    '''
    try:
        # Get the input data from the client
        input_data = request.json['data']
        X = np.array([x[0] for x in input_data]).reshape(-1, 1)
        y = np.array([x[1] for x in input_data])

        # Create a new linear regression model
        new_model = LinearRegression()

        # Train the model
        new_model.fit(X, y)

        # Return the result as JSON
        return jsonify({'coeff': new_model.coef_.tolist(), 'intercept': new_model.intercept_.tolist()})
    
    except Exception as e:
        return jsonify({'error': str(e)})

if __name__ == '__main__':
    app.run(debug=True)
