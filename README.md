ML House Price Predictor
A full-stack machine-learning project that serves house-value predictions through a React website. The frontend collects four model features, the FastAPI backend validates the request, and a trained scikit-learn pipeline returns an estimate.
Educational-use notice: This project uses the California Housing dataset. Its output is a dataset-level estimate, not a professional appraisal or a reliable valuation of an individual property.

Project overview
The project demonstrates an end-to-end ML application:
1. Explore and experiment with the dataset in a Jupyter Notebook.
2. Train and evaluate a model using a Python script.
3. Save the fitted model as a joblib artifact.
4. Load the artifact in a FastAPI backend.
5. Send prediction requests from a React frontend.
6. Display the returned estimate in the browser.
Tech stack
Component	Technology
Frontend	React, Vite, JavaScript
Backend/API	Python, FastAPI, Uvicorn
ML model	scikit-learn polynomial regression pipeline
Data processing	pandas, NumPy
Model persistence	joblib
Experimentation	Jupyter Notebook


Repository structure
The following structure is recommended. If your frontend folder is named frontend-new, use that name in place of frontend in the commands below.
ml-website/
├── README.md
├── .gitignore
├── backend/
│   ├── main.py
│   ├── requirements.txt
│   └── house_model.pkl
├── model-training/
│   ├── train_model.py
│   └── train_model.ipynb
└── frontend/
    ├── package.json
    ├── package-lock.json
    ├── index.html
    └── src/
        ├── App.jsx
        └── main.jsx
- model-training/train_model.ipynb: interactive experimentation, exploration, and model evaluation.
- model-training/train_model.py: repeatable training script for generating the model artifact.
- backend/house_model.pkl: serialized trained pipeline loaded by the API.
- backend/main.py: API routes, input validation, and prediction logic.
- frontend/src/App.jsx: React form and prediction result UI.
- README.md: project setup and usage guide.
Model details
The model is trained with scikit-learn's California Housing dataset using these four features:
Feature	Meaning
MedInc	Median income feature, in the dataset's units
HouseAge	Median house age in years
AveRooms	Average rooms per household
AveBedrms	Average bedrooms per household


The training pipeline applies:
1. PolynomialFeatures(degree=2, include_bias=False)
2. StandardScaler
3. LinearRegression
The dataset is split into training and test sets using an 80/20 split and random_state=42. The training script evaluates performance using R² and root mean squared error (RMSE), then saves the fitted pipeline with joblib.

The target variable in the California Housing dataset is measured in units of $100,000. If the API converts a prediction to dollars, that is a unit conversion, not a guarantee of a property's market value.

Important: These features are not the same as floor area in square feet, the actual bedroom count of one house, or its exact sale price. The project does not currently estimate a property price from square footage alone.
Why both .py and .ipynb?
Keep both files in GitHub if you want to show the complete machine-learning workflow:
- Notebook (.ipynb): useful for executing cells individually, visualizing data, recording experiments, and presenting evaluation results.
- Script (.py): useful for rerunning training consistently from a terminal or automation workflow.
Keep the model-training logic in sync between the notebook and script to avoid producing different model artifacts unintentionally. The API uses the saved .pkl file; it does not need to rerun training every time the website starts.
Prerequisites
Install:
- Python 3.10 or newer, using versions compatible with the dependencies used to train the model.
- Node.js and npm.
- VS Code (recommended) or another editor.
Installation and running locally
Start the backend and frontend in separate terminals.
1. Set up and start the backend
From the project root:
cd backend

python3 -m venv .venv
source .venv/bin/activate

python -m pip install -r requirements.txt
python -m uvicorn main:app --reload --host 127.0.0.1 --port 8000
If your virtual environment is at the project root rather than inside backend, activate it using the correct relative path, such as source ../.venv/bin/activate.

Keep the backend terminal open. The API should be available at http://127.0.0.1:8000.
2. Set up and start the frontend
Open a second terminal from the project root:
cd frontend
npm install
npm run dev
If the frontend directory is named frontend-new, run cd frontend-new instead. Open the exact local URL printed by Vite, for example http://localhost:5173 or http://localhost:5175.

The frontend origin, including protocol and port, must be included in the FastAPI CORS allow_origins list. If Vite uses a different port, update the allowed origin in backend/main.py and restart the backend.
3. Train the model again (optional)
The website can use the existing backend/house_model.pkl without retraining. To regenerate the model, activate the Python environment, install the training dependencies, and run:
python model-training/train_model.py
Ensure the script saves the model to the location expected by the backend, normally backend/house_model.pkl. If running the original Colab-generated script locally, remove Google Colab-only commands such as from google.colab import files and files.download(...).
4. Run the notebook (optional)
Open model-training/train_model.ipynb in VS Code, select a Python kernel with the required packages installed, and choose Run All or execute cells individually.
API endpoints
When the backend is running:
Method	Endpoint	Purpose
GET	/	Basic API status
GET	/health	Check whether the model is loaded
POST	/predict	Return a model prediction


Interactive documentation is available at http://127.0.0.1:8000/docs.
Example prediction request
POST /predict
{
  "MedInc": 5,
  "HouseAge": 20,
  "AveRooms": 5,
  "AveBedrms": 1
}
The API expects all four numeric fields. A request containing only area will not work with this model.

The response includes the input features and the predicted value. Exact output depends on the model artifact in use; example values should not be treated as a real property appraisal.
Troubleshooting
npm error Missing script: "dev"
- Confirm you are in the directory containing the intended frontend package.json.
- Run npm run to list available scripts.
- A Vite project normally includes "dev": "vite" in its scripts section.
- If package.json is missing or belongs to a different project, restore or recreate the Vite React setup.
Frontend displays Failed to fetch
1. Confirm Uvicorn is running on http://127.0.0.1:8000.
2. Open http://127.0.0.1:8000/health.
3. Test POST /predict in http://127.0.0.1:8000/docs.
4. Confirm the frontend calls http://127.0.0.1:8000/predict.
5. Check the browser Console and Network tabs.
6. Check that the exact frontend origin is allowed by CORS.
OPTIONS /predict returns 400 Bad Request
This can indicate a failed CORS preflight. Match the frontend origin exactly, including http versus https and the port number. Restart the backend after changing CORS configuration.
Model loading fails
- Check that backend/house_model.pkl exists.
- Make the model path relative to main.py, not the terminal's working directory.
- Use compatible scikit-learn versions when loading a model saved by joblib.
GitHub and reproducibility
Commit source files, dependency manifests, the README, and the training notebook/script. Do not commit local virtual environments, node_modules, secrets, or local logs. A .gitignore file should exclude these generated files.

The house_model.pkl artifact can be committed if it is within repository size limits and contains no sensitive data. For larger model files, consider Git LFS or a model-artifact hosting service. Pin Python package versions to improve reproducibility.
Limitations and possible improvements
- The model is for learning and demonstration, not property valuation decisions.
- The dataset represents California housing data and may not generalize to other locations.
- The model uses four census-derived features and does not take square footage as an input.
- Add automated API tests and model evaluation reports.
- Pin dependency versions and document the Python version used to train the artifact.
- If the desired input is a property's floor area, train and evaluate a model on suitable data containing area and sale price.
License
No license is specified. Add a LICENSE file if you intend to distribute the project under an open-source license.