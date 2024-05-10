import pickle
import pandas as pd
from sklearn.preprocessing import StandardScaler
import json
import sys
import os

# Load the trained model from the pickle file
fetal_path = os.path.join(os.path.dirname(__file__), 'fetal_health.csv')
model_path = os.path.join(os.path.dirname(__file__), 'dt.pkl')

try:
    with open(model_path, "rb") as f:
        tree_clf = pickle.load(f)
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
def preprocess_input(data):
    scaler = StandardScaler()
    return scaler.fit_transform(data)

# Receive input data from stdin
input_data = json.loads(sys.argv[1])
x = [input_data]  # No need for .values()


try:
    X = df.drop(columns='fetal_health')
    X = preprocess_input(X)
    out = tree_clf.predict(x)
    prediction_result = {"prediction": out.tolist()}  # Convert prediction to list and create JSON object
    print(json.dumps(prediction_result))  # Print the JSON object
except Exception as e:
    error_message = {
        "error": str(e)
    }
    json_error_message = json.dumps(error_message)
    print(json_error_message)
