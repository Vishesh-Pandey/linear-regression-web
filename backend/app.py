# app.py
from flask import Flask, request, jsonify
from flask_cors import CORS

import numpy as np
from sklearn.linear_model import LinearRegression

app = Flask(__name__)

CORS(app)

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
        
        x_list = []

        for i in input_data : 
            x_list.append(i[0])

        y_list = [] 

        for j in input_data : 
            y_list.append(j[1])

        X = np.array(x_list).reshape(-1, 1)
        y = np.array(y_list)

        # Create a new linear regression model
        model = LinearRegression()

        # Train the model
        model.fit(X, y)

        # Return the result as JSON
        return jsonify({'coeff': model.coef_.tolist(), 'intercept': model.intercept_.tolist()})
    
    except Exception as e:
        return jsonify({'error': str(e)})

if __name__ == '__main__':
    app.run(debug=True)
