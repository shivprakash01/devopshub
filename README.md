# DevOpsHub 🚀
> **Cloud-Based Project Management & Automated CI/CD Platform**  
> Built with **React 18, Vite, Node.js, Express, MongoDB, Nginx, Docker & Docker Hub**.

> **GitHub Profile**: [@shivprakash01](https://github.com/shivprakash01)  
> **GitHub Repository**: [`shivprakash01/devopshub`](https://github.com/shivprakash01/devopshub)

---

## 🐳 Docker Hub Repository Details

- **Docker Hub Profile**: [`shivayadav70`](https://hub.docker.com/u/shivayadav70)
- **Frontend Image**: `shivayadav70/devopshub-client:latest`
- **Backend Image**: `shivayadav70/devopshub-server:latest`

---

## 📦 Quick Start with Docker Compose

### 1. Build and Start All Containers
```bash
# Build images and start client & server in detached mode
docker compose up -d --build
```

### 2. Access the Application
- **Frontend Application**: [http://localhost](http://localhost) (or [http://localhost:3000](http://localhost:3000))
- **Backend REST API**: [http://localhost:5000/api/projects](http://localhost:5000/api/projects)
- **Health Check Endpoint**: [http://localhost:5000/api/health](http://localhost:5000/api/health)

### 3. View Logs & Stop
```bash
# View real-time container logs
docker compose logs -f

# Stop and remove containers & networks
docker compose down
```

---

## 🛠️ Docker & Docker Hub CLI Commands

### Login to Docker Hub
```bash
docker login -u shivayadav70
```

### Build Images Locally
```bash
# Using npm shortcuts
npm run docker:build

# Or directly with Docker Compose
docker compose build
```

### Push Images to Docker Hub
```bash
# Using npm shortcut
npm run docker:push

# Or push individually:
docker push shivayadav70/devopshub-server:latest
docker push shivayadav70/devopshub-client:latest
```

### Pull and Run Directly Anywhere
```bash
# Run Backend Container
docker run -d -p 5000:5000 --name devopshub-server shivayadav70/devopshub-server:latest

# Run Frontend Container
docker run -d -p 80:80 --name devopshub-client shivayadav70/devopshub-client:latest
```

---

## 🔄 Automated CI/CD Pipeline (GitHub Actions)

This repository includes an automated GitHub Actions pipeline located at [`.github/workflows/docker-publish.yml`](.github/workflows/docker-publish.yml).

### To enable automated push on git commits:
1. Go to your GitHub repository -> **Settings** -> **Secrets and variables** -> **Actions**.
2. Add the following repository secrets:
   - `DOCKERHUB_USERNAME`: `shivayadav70`
   - `DOCKERHUB_TOKEN`: *(Create an Access Token in Docker Hub -> Account Settings -> Security)*
3. Any push to `main` will automatically:
   - Run automated test suite (`npm run test:server`).
   - Build multi-stage Docker images.
   - Tag with `latest` and commit SHA `${{ github.sha }}`.
   - Push to Docker Hub repositories `shivayadav70/devopshub-server` and `shivayadav70/devopshub-client`.

---

## ☸️ Kubernetes (K8s) Production Deployment

DevOpsHub includes full Kubernetes manifests located in the [`k8s/`](k8s/) directory, configured with **Kustomize**, **Horizontal Pod Autoscaling (HPA)**, **ConfigMaps**, **Secrets**, and **Ingress**.

### 1. Deploy the Complete Stack (Single Command)
```bash
# Using npm shortcut
npm run k8s:apply

# Or directly with kubectl
kubectl apply -k ./k8s
```

### 2. Check Deployment Status
```bash
# View all pods, services, deployments, and HPAs in the devopshub namespace
npm run k8s:status

# Or directly with kubectl
kubectl get all,hpa,ingress -n devopshub
```

### 3. Teardown Kubernetes Resources
```bash
npm run k8s:delete
# Or: kubectl delete -k ./k8s
```

---

## 🏗️ Architecture & Docker Strategy

| Component | Docker Base Image | Role & Optimizations |
| :--- | :--- | :--- |
| **Server** | `node:20-alpine` | Production dependencies, Express API, native health check on `/api/health`. |
| **Client** | `node:20-alpine` + `nginx:alpine` | Multi-stage build; compiles Vite SPA in Stage 1, serves optimized static assets with Gzip compression and `/api/` reverse proxy in Stage 2. |
| **Network** | `bridge` (Docker) / `ClusterIP` (K8s) | Isolated networking connecting client reverse-proxy to backend service `server:5000`. |
| **Autoscaler**| `autoscaling/v2` (HPA) | Dynamic scaling from 2 to 10 backend pods based on CPU and memory thresholds. |

---

## 📜 Available NPM Scripts

| Command | Action |
| :--- | :--- |
| `npm run dev` | Run client & server concurrently in development mode |
| `npm run test:server` | Run automated backend integration tests |
| `npm run docker:build` | Build Docker images for client & server |
| `npm run docker:up` | Spin up all containers in detached mode |
| `npm run docker:down` | Stop and teardown containers |
| `npm run docker:push` | Push images to Docker Hub (`shivayadav70`) |
| `npm run docker:build:push` | Build and push in a single command |
| `npm run k8s:apply` | Deploy full stack to Kubernetes cluster via Kustomize |
| `npm run k8s:status` | Check status of all K8s pods, services & HPAs |
| `npm run k8s:delete` | Teardown all Kubernetes resources |

