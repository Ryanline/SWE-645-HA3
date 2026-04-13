# SWE 645 Homework Assignment 3

This repository contains a full-stack Student Survey application for SWE 645 Homework Assignment 3. The frontend uses React with Vite, and the backend uses FastAPI with SQLModel/SQLAlchemy and SQLite for persistence during local development.

## Project Structure

- `frontend/`: React frontend for creating, viewing, editing, and deleting survey records
- `backend/`: FastAPI backend exposing CRUD survey APIs
- `video/`: local video assets created during development

## Features

- Create a new student survey
- View all saved surveys
- Review an existing survey in read-only mode
- Edit an existing survey
- Delete a survey
- Persist survey data in SQLite through SQLModel/SQLAlchemy

## Local Development

### Backend

1. Open a terminal in `backend/`
2. Create and activate a virtual environment if needed
3. Install dependencies:

```powershell
pip install -r requirements.txt
```

4. Start the API:

```powershell
uvicorn main:app --reload
```

The API runs at `http://127.0.0.1:8000` and Swagger docs are available at `http://127.0.0.1:8000/docs`.

### Frontend

1. Open a terminal in `frontend/`
2. Install dependencies if needed:

```powershell
npm install
```

3. Start the frontend:

```powershell
npm run dev
```

The frontend runs at `http://localhost:5173`.

## Backend API Endpoints

- `GET /`: health check
- `POST /surveys`: create a survey
- `GET /surveys`: get all surveys
- `GET /surveys/{survey_id}`: get a single survey
- `PUT /surveys/{survey_id}`: update a survey
- `DELETE /surveys/{survey_id}`: delete a survey

## Docker

### Backend

Build:

```powershell
docker build -t swe645-ha3-backend ./backend
```

Run:

```powershell
docker run -p 8000:8000 swe645-ha3-backend
```

### Frontend

Build:

```powershell
docker build -t swe645-ha3-frontend ./frontend
```

Run:

```powershell
docker run -p 8080:80 swe645-ha3-frontend
```

Then open `http://localhost:8080`.

## Runtime Frontend Configuration

- The frontend now reads its API base URL from `frontend/public/config.js`.
- Local development defaults to `http://127.0.0.1:8000`.
- In Kubernetes, Helm replaces that file with a ConfigMap so the frontend can target the deployed backend without rebuilding the React app.

## Helm / Kubernetes

The repository includes a Helm chart in `chart/`.

Important values in `chart/values.yaml`:

- `frontend.image.repository`
- `frontend.image.tag`
- `frontend.apiBaseUrl`
- `frontend.service.nodePort`
- `backend.image.repository`
- `backend.image.tag`
- `backend.service.nodePort`

Example install:

```powershell
helm install swe645-ha3 ./chart
```

This chart creates:

- frontend Deployment
- frontend Service
- frontend runtime ConfigMap
- backend Deployment
- backend Service

## Notes

- The default frontend runtime config points to `http://127.0.0.1:8000`.
- SQLite is used for fast local development and assignment progress.
- The Helm chart exposes frontend and backend through NodePort by default for a straightforward classroom-cluster setup.
