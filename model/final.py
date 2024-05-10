import pickle
import pandas as pd
from sklearn.preprocessing import StandardScaler
import json
import os
model_path = os.path.join(os.path.dirname(__file__), 'dt.pkl')
fetal_path = os.path.join(os.path.dirname(__file__), 'fetal_health.csv')
# Load the trained model from the pickle file
try:
   
    with open(model_path, "rb") as f:
        e = pickle.load(f)
except FileNotFoundError:
    error_message = {
        "error": "The model file 'dt.pkl' was not found."
    }
    json_error_message = json.dumps(error_message)
    print(json_error_message)
    exit()

# Load the dataset
try:
    df = pd.read_csv(fetal_path)
except FileNotFoundError:
    error_message = {
        "error": "The CSV file 'fetal_health.csv' was not found."
    }
    json_error_message = json.dumps(error_message)
    print(json_error_message)
    exit()

# Drop NaN values
df = df.dropna()

# Prepare the input data for prediction
x = [134.0,0.001,0.0,0.013,0.008,0.0,0.003,29.0,6.3,0.0,0.0,150.0,50.0,200.0,6.0,3.0,71.0,107.0,106.0,215.0,0.0,]

# Feature scaling
scaler = StandardScaler()
X = scaler.fit_transform(df.drop(columns='fetal_health'))

# Make predictions
# Make predictions
try:
    out = e.predict(X[-1:])
    prediction_result = {"prediction": out.tolist()}  # Convert prediction to list and create JSON object
    print(json.dumps(prediction_result))  # Print the JSON object
except Exception as e:
    error_message = {
        "error": str(e)
    }
    json_error_message = json.dumps(error_message)
    print(json_error_message)
