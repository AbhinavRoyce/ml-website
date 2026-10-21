from pathlib import Path

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
import joblib
import pandas as pd

app = FastAPI(title="House Price Prediction API", description="API for predicting house prices based on area", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5175",
        "http://127.0.0.1:5175",
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

model = joblib.load("house_model.pkl")

class PredictionInput(BaseModel):
    MedInc: float = Field(gt=0)
    HouseAge: float = Field(gt=0)
    AveRooms: float = Field(gt=0)
    AveBedrms: float = Field(gt=0)

@app.get("/")
def home():
    return {"message": "ML prediction API is running"}

@app.get("/health")
def health():
    return {"status": "ok", "model_loader" : model is not None}

@app.post("/predict")
def predict(data: PredictionInput):
    features = pd.DataFrame(
        [{
            "MedInc": data.MedInc,
            "HouseAge": data.HouseAge,
            "AveRooms": data.AveRooms,
            "AveBedrms": data.AveBedrms
        }]
    )
    
    prediction =float(model.predict(features)[0])
    
    return {
        "input" : data.model_dump(),
        "predicted_value_100k_usd" : round(prediction, 4),
        "estimated_value_usd": round(prediction * 100000, 2),
        "note": (
            "Estimate based on the California Housing dataset; "
            "not an appraisal of an individual property."
        ),
    }