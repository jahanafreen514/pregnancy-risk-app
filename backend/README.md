# GlowCare Backend

FastAPI backend for the pregnancy risk prediction frontend. It exposes the same authentication base URL already present in the React app: `http://localhost:5000/api/auth`.

## Start

```powershell
cd backend
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
Copy-Item .env.example .env
python run.py
```

Open `http://localhost:5000/docs` for interactive API documentation.

## Frontend integration

The existing `frontend/src/services/authService.jsx` works with `POST /api/auth/register` and `POST /api/auth/login`. Store `response.data.access_token` as the token and send it in later calls:

```js
axios.get("http://localhost:5000/api/predictions/latest", {
  headers: { Authorization: `Bearer ${getToken()}` }
});
```

Main route groups are `/api/users`, `/api/doctors`, `/api/admin`, `/api/predictions`, `/api/reports`, `/api/alerts`, and `/api/appointments`.

## Notes

- SQLite is the default so the project starts with no database server. Set `DATABASE_URL` to a production database before deployment.
- The prediction endpoint implements the exact risk weights used by the current frontend's `riskCalculator.jsx`; it also stores each result and creates an alert for medium/high risk.
- To use the optional scikit-learn training files, install `pandas`, `scikit-learn`, and `joblib`, place labelled data in `app/ml/dataset/cleaned_data.csv`, then run `python -m app.ml.train_model`.
- Set a unique, long `SECRET_KEY` in `.env` before deploying.