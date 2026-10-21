
import { useState } from "react";

export default function App() {
  const [features, setFeatures] = useState({
    MedInc: "5",
    HouseAge: "20",
    AveRooms: "5",
    AveBedrms: "1",
  });

  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function handleChange(event) {
    const { name, value } = event.target;

    setFeatures((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  async function getPrediction(event) {
    event.preventDefault();
    setError("");
    setResult(null);
    setLoading(true);

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/predict",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            MedInc: Number(features.MedInc),
            HouseAge: Number(features.HouseAge),
            AveRooms: Number(features.AveRooms),
            AveBedrms: Number(features.AveBedrms),
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.detail
            ? JSON.stringify(data.detail)
            : "Prediction request failed"
        );
      }

      setResult(data);
    } catch (err) {
      setError(
        `${err.message}. Check that the Python API is running.`
      );
    } finally {
      setLoading(false);
    }
  }

  const fields = [
    {
      name: "MedInc",
      label: "Median income (dataset units)",
    },
    {
      name: "HouseAge",
      label: "Median house age (years)",
    },
    {
      name: "AveRooms",
      label: "Average rooms per household",
    },
    {
      name: "AveBedrms",
      label: "Average bedrooms per household",
    },
  ];

  return (
    <main
      style={{
        maxWidth: 560,
        margin: "50px auto",
        padding: 24,
        fontFamily: "Arial, sans-serif",
      }}
    >
      <h1>ML House Price Predictor</h1>

      <p>
        Enter the four features expected by your trained
        California Housing model.
      </p>

      <form onSubmit={getPrediction}>
        {fields.map((field) => (
          <div key={field.name} style={{ marginBottom: 16 }}>
            <label
              htmlFor={field.name}
              style={{ display: "block", marginBottom: 6 }}
            >
              {field.label}
            </label>

            <input
              id={field.name}
              name={field.name}
              type="number"
              step="any"
              required
              value={features[field.name]}
              onChange={handleChange}
              style={{ width: "100%", padding: 10 }}
            />
          </div>
        ))}

        <button type="submit" disabled={loading}>
          {loading ? "Predicting..." : "Predict Price"}
        </button>
      </form>

      {error && (
        <p role="alert" style={{ color: "red" }}>
          {error}
        </p>
      )}

      {result && (
        <section>
          <h2>Prediction Result</h2>

          <p>
            Estimated value:{" "}
            <strong>
              {result.estimated_value_usd.toLocaleString(
                "en-US",
                {
                  style: "currency",
                  currency: "USD",
                  maximumFractionDigits: 2,
                }
              )}
            </strong>
          </p>

          <p>
            Model output: {result.predicted_value_100k_usd} in
            units of $100,000
          </p>

          <small>{result.note}</small>
        </section>
      )}
    </main>
  );
}
