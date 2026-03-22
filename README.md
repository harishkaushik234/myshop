# SUNIL KHAD BEEJ BHANDER

Full-stack MERN web app for a pesticide and fertilizer shop with JWT auth, role-based dashboards, rewards, real-time chat, order management, and free AI-assisted crop disease screening.

## Stack

- Frontend: React + Vite + Tailwind CSS
- Backend: Node.js + Express.js + Socket.io
- Database: MongoDB Atlas
- Auth: JWT
- Uploads: Cloudinary
- AI: TensorFlow.js MobileNet + local image analysis heuristic

## Folder Structure

```text
myshop/
  backend/
    scripts/
    src/
      config/
      controllers/
      middleware/
      models/
      routes/
      services/
      utils/
  frontend/
    public/
    src/
      api/
      components/
      context/
      hooks/
      pages/
```

## Features

- User registration and login
- Admin and client roles
- Product add, edit, delete, browse, search, and filter
- Cart and order placement without payment gateway
- Admin order management
- Real-time one-to-one chat with Socket.io
- Reward points and badges
- Crop image upload with AI-assisted disease screening
- Admin crop scan review
- Basic admin analytics

## Local Setup

### 1. Clone and install

```bash
cd backend && npm install
cd frontend && npm install
```

### 2. Configure environment

Copy these files and update values:

- `backend/.env.example` -> `backend/.env`
- `frontend/.env.example` -> `frontend/.env`

Backend values:

- `MONGODB_URI`: MongoDB Atlas connection string
- `JWT_SECRET`: any long random secret
- `CLIENT_URL=http://localhost:5173`
- `ADMIN_INVITE_CODE`: needed only when registering a new admin/shopkeeper account
- `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`: Cloudinary credentials
- `ENABLE_REQUEST_LOGS=false`: keeps backend dev terminal quiet

Frontend values:

- `VITE_API_URL=http://localhost:5000/api`
- `VITE_SOCKET_URL=http://localhost:5000`

### 3. Seed sample data

```bash
cd backend
npm run seed
```

### 4. Run the app

Backend:

```bash
cd backend
npm run dev
```

Frontend:

```bash
cd frontend
npm run dev
```

Open `http://localhost:5173`

## AI Note

The crop detection flow is fully free and runs without paid APIs. It uses a local TensorFlow.js MobileNet model to identify plant-related context and combines that with local image color analysis to produce a lightweight disease screening result. This is suitable for demo and MVP use. For production-grade agronomy accuracy, you can later swap `backend/src/services/diseaseService.js` with a stronger open-source plant disease model.

## Training-Ready AI Pipeline

There is now a local training scaffold in `backend/ai/` for building your own crop disease classifier without paid services.

### Prepare your dataset

Put images into label folders like:

```text
backend/ai/data/raw/Healthy/
backend/ai/data/raw/Leaf Blight/
backend/ai/data/raw/Early Blight/
backend/ai/data/raw/Nitrogen Deficiency/
backend/ai/data/raw/Rust Infection/
```

### Generate dataset manifest

```bash
cd backend
npm run ai:prepare
```

### Train the lightweight custom model

```bash
cd backend
npm run ai:train
```

This creates:

```text
backend/src/ai/customCropDiseaseModel.json
```

It also creates:

```text
backend/ai/data/processed/training-report.json
```

The report includes train/validation counts, overall validation accuracy, and per-label accuracy when there are enough labeled images.

When that file exists, the backend will automatically use it during crop scans. If it does not exist, the app falls back to the built-in heuristic detector.

## Deployment

### Render for backend

- Create a new Web Service from the `backend` folder
- Build command: `npm install`
- Start command: `npm start`
- Add backend environment variables from `backend/.env.example`
- Set `CLIENT_URL` to your deployed Vercel frontend URL

### Vercel for frontend

- Import the repo and set the root directory to `frontend`
- Build command: `npm run build`
- Output directory: `dist`
- Add:
  - `VITE_API_URL=https://your-render-service.onrender.com/api`
  - `VITE_SOCKET_URL=https://your-render-service.onrender.com`

## Cloudinary Setup

1. Create a free Cloudinary account.
2. Open the dashboard and copy:
   - Cloud name
   - API key
   - API secret
3. Put them into `backend/.env`.

All product images and crop scans are uploaded directly to Cloudinary and the saved MongoDB records store the Cloudinary URLs.
