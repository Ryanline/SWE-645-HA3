# Ryan Brooks - SWE 645 Homework Assignment 3

Live application URL: `http://3.135.144.154:30081/`

Backend API docs: `http://3.135.144.154:30080/docs`

## Project Overview

This project is a full-stack Student Survey application built for SWE 645 Homework Assignment 3. The frontend is a React application created with Vite, and the backend is a FastAPI service using SQLModel/SQLAlchemy with SQLite for persistence. The application supports full CRUD operations for student surveys and is containerized with Docker and deployed to Kubernetes with Helm.

## Student Survey Features

- Create a new student survey with the required fields from the assignment
- View all saved surveys
- Open an existing survey in read-only mode
- Edit an existing survey
- Delete an existing survey
- Persist survey data through the backend API

## Assignment Requirements Coverage

- React frontend: completed in `frontend/`
- FastAPI backend: completed in `backend/`
- SQLModel/SQLAlchemy persistence layer: completed in `backend/main.py`
- CRUD operations: completed for create, read, update, and delete
- Docker containerization: completed for frontend and backend
- Kubernetes deployment: completed with a frontend Pod and backend Pod
- Helm chart: completed in `chart/`
- Public deployed URL in README: included above

## Repository Structure

- `frontend/` - React frontend source code, static assets, and Dockerfile
- `backend/` - FastAPI backend source code, requirements, and Dockerfile
- `chart/` - Helm chart files for Kubernetes deployment
- `video/` - local video assets used during development and recording

## Tools and Technologies Used

- React
- Vite
- JavaScript
- FastAPI
- SQLModel
- SQLAlchemy
- SQLite
- Docker
- Kubernetes
- Helm
- Ubuntu EC2
- k3s
- Git and GitHub
- VS Code
- Chrome DevTools

## Local Development Setup

### 1. Clone the repository

```powershell
git clone https://github.com/Ryanline/SWE-645-HA3.git
cd SWE-645-HA3
```

### 2. Backend setup

```powershell
cd backend
python -m venv .venv
.venv\Scripts\Activate.ps1
pip install -r requirements.txt
uvicorn main:app --reload
```

Local backend URLs:

- API root: `http://127.0.0.1:8000`
- Swagger docs: `http://127.0.0.1:8000/docs`

### 3. Frontend setup

Open a second terminal:

```powershell
cd frontend
npm install
npm run dev
```

Local frontend URL:

- `http://localhost:5173`

### 4. Local runtime configuration

The frontend reads the backend base URL from `frontend/public/config.js`.

Default local value:

```js
window.APP_CONFIG = {
  API_BASE_URL: 'http://127.0.0.1:8000',
}
```

## Backend API Endpoints

- `GET /` - health check route
- `POST /surveys` - create a new survey
- `GET /surveys` - get all surveys
- `GET /surveys/{survey_id}` - get one survey by id
- `PUT /surveys/{survey_id}` - update one survey by id
- `DELETE /surveys/{survey_id}` - delete one survey by id

## Docker Setup

Run these commands from the repository root.

### Backend Docker image

```powershell
docker build -t swe645-ha3-backend ./backend
docker run -p 8000:8000 swe645-ha3-backend
```

### Frontend Docker image

```powershell
docker build -t swe645-ha3-frontend ./frontend
docker run -p 8080:80 swe645-ha3-frontend
```

Docker test URLs:

- Frontend: `http://localhost:8080`
- Backend docs: `http://127.0.0.1:8000/docs`

## Kubernetes and Helm Deployment

This project was deployed publicly on an Ubuntu EC2 instance using `k3s` and Helm.

### 1. EC2 preparation

- Launch an Ubuntu EC2 instance with a public IP
- Open inbound security group rules for:
  - `22` for SSH
  - `30080` for backend NodePort
  - `30081` for frontend NodePort

### 2. Connect to the EC2 instance

```powershell
ssh -i "C:\path\to\your-key.pem" ubuntu@<EC2-PUBLIC-IP>
```

### 3. Install required packages on Ubuntu

```bash
sudo apt update
sudo apt install -y git docker.io
sudo systemctl enable docker
sudo systemctl start docker
sudo usermod -aG docker ubuntu
```

Reconnect after adding the Docker group, then verify:

```bash
docker version
```

### 4. Clone the repository on EC2

```bash
git clone https://github.com/Ryanline/SWE-645-HA3.git
cd SWE-645-HA3
```

### 5. Install k3s

```bash
curl -sfL https://get.k3s.io | sh -
mkdir -p ~/.kube
sudo cp /etc/rancher/k3s/k3s.yaml ~/.kube/config
sudo chown ubuntu:ubuntu ~/.kube/config
export KUBECONFIG=~/.kube/config
kubectl get nodes
```

### 6. Install Helm

```bash
curl https://raw.githubusercontent.com/helm/helm/main/scripts/get-helm-3 | bash
helm version
```

### 7. Build and import Docker images into k3s

```bash
docker build -t swe645-ha3-backend:latest ./backend
docker build -t swe645-ha3-frontend:latest ./frontend
docker save swe645-ha3-backend:latest -o backend.tar
docker save swe645-ha3-frontend:latest -o frontend.tar
sudo k3s ctr images import backend.tar
sudo k3s ctr images import frontend.tar
```

### 8. Configure Helm values

Edit `chart/values.yaml` and set:

- `frontend.image.repository`
- `frontend.image.tag`
- `frontend.service.nodePort`
- `frontend.apiBaseUrl`
- `backend.image.repository`
- `backend.image.tag`
- `backend.service.nodePort`

Example deployed value used for this project:

```yaml
frontend:
  image:
    repository: swe645-ha3-frontend
    tag: latest
  service:
    nodePort: 30081
  apiBaseUrl: "http://3.135.144.154:30080"

backend:
  image:
    repository: swe645-ha3-backend
    tag: latest
  service:
    nodePort: 30080
```

### 9. Install the Helm chart

```bash
helm upgrade --install swe645-ha3 ./chart
kubectl get pods
kubectl get services
kubectl get deployments
```

Expected Kubernetes resources:

- one frontend Deployment
- one backend Deployment
- one frontend Service
- one backend Service

### 10. Public deployment URLs

- Frontend: `http://3.135.144.154:30081/`
- Backend docs: `http://3.135.144.154:30080/docs`

## Demonstration of Working Code

The following flows were implemented and tested:

1. Create a new survey from the React frontend
2. View all stored surveys in the survey list tab
3. Open an existing survey in read-only mode
4. Edit an existing survey and save the changes
5. Delete an existing survey from the list view
6. Verify backend CRUD routes through FastAPI Swagger docs
7. Build and run both services through Docker
8. Deploy both services to Kubernetes using Helm
9. Access the deployed application through the public EC2 URL

## Files Most Relevant to the Assignment

- `backend/main.py` - FastAPI routes, SQLModel models, SQLite engine, and CRUD logic
- `backend/requirements.txt` - backend dependency list
- `backend/Dockerfile` - backend container build
- `frontend/src/App.jsx` - main React application and survey workflows
- `frontend/src/App.css` - frontend styling
- `frontend/index.html` - frontend entry HTML and runtime config loader
- `frontend/public/config.js` - runtime API URL configuration
- `frontend/Dockerfile` - frontend container build
- `chart/Chart.yaml` - Helm chart metadata
- `chart/values.yaml` - deployment values for images, ports, and API URL
- `chart/templates/*.yaml` - Kubernetes Deployments, Services, and ConfigMap

## Notes for Replication

- SQLite was used as the persistence layer because the assignment allows any database of choice.
- If this project is deployed on a different machine or cluster, update `frontend.apiBaseUrl` in `chart/values.yaml`.
- If `latest` images are rebuilt, redeploy or restart the affected Kubernetes Deployment after re-importing the image into `k3s`.
- The deployed application URL is included near the top of this README as required by the assignment.
