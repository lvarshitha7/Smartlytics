# Analytiq — AI-Powered Analytics Platform

A full-stack MERN application that lets you upload CSV/Excel datasets and uses OpenAI GPT-4o to automatically generate analytics dashboards with KPIs, charts, and deep insights.

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)
- OpenAI API key

### 1. Clone & Install

```bash
# Install all dependencies at once
npm run install:all
```

Or manually:
```bash
npm install
cd backend && npm install
cd ../frontend && npm install
```

### 2. Configure Environment

Edit `backend/.env`:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/analytiq
JWT_SECRET=your_super_secret_jwt_key_change_this
OPENAI_API_KEY=sk-your-openai-api-key-here
NODE_ENV=development
```

### 3. Run Development Servers

```bash
# From root — runs both backend and frontend
npm run dev
```

- Backend: http://localhost:5000
- Frontend: http://localhost:3000

---

## 📁 Project Structure

```
analytiq/
├── backend/
│   ├── controllers/
│   │   ├── aiController.js          # OpenAI GPT-4o integration
│   │   ├── authController.js        # JWT auth
│   │   ├── dashboardController.js   # Dashboard CRUD + data compute
│   │   └── datasetController.js     # File upload & processing
│   ├── middleware/
│   │   ├── auth.js                  # JWT middleware
│   │   └── upload.js                # Multer file upload
│   ├── models/
│   │   ├── User.js
│   │   ├── Dataset.js
│   │   └── Dashboard.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── datasets.js
│   │   ├── dashboards.js
│   │   └── ai.js
│   ├── utils/
│   │   └── dataProcessor.js         # CSV/Excel parsing & stats
│   └── server.js
│
└── frontend/
    ├── public/
    │   └── index.html
    └── src/
        ├── components/
        │   ├── charts/
        │   │   └── ChartComponents.js   # All Chart.js components
        │   ├── layout/
        │   │   ├── AppLayout.js         # Sidebar + layout
        │   │   └── AppLayout.module.css
        │   └── ui/
        │       ├── Button.js
        │       ├── UIComponents.js      # Card, Modal, Badge, Input, KpiCard
        │       └── *.module.css
        ├── contexts/
        │   └── AuthContext.js
        ├── pages/
        │   ├── LandingPage.js           # Marketing homepage
        │   ├── AuthPages.js             # Login + Register
        │   ├── DashboardsPage.js        # Dashboard list
        │   ├── DatasetsPage.js          # Dataset upload + management
        │   ├── NewDashboardPage.js      # AI dashboard generation
        │   └── DashboardViewPage.js     # Dashboard viewer
        ├── services/
        │   └── api.js                   # Axios API client
        ├── styles/
        │   └── globals.css
        ├── App.js
        └── index.js
```

---

## ✨ Features

### Data Upload
- Drag & drop CSV, XLSX, XLS files (up to 50MB)
- Auto column type detection (numeric, categorical, date, text)
- Descriptive statistics computation
- Preview data table

### AI Dashboard Generation (GPT-4o)
- Upload data → AI analyzes schema and stats
- 3 AI-suggested dashboard types to choose from
- Custom KPI inputs (e.g. "Total Revenue", "Average Order Value")
- Free-text prompt for custom instructions
- Generates 5-8 KPI cards + 6-10 charts automatically

### Dashboard View
- KPI cards with color themes
- Bar, Line, Area, Pie, Doughnut, Scatter, Histogram charts
- "Ask AI" — natural language Q&A about your data
- Refresh data computation

### Authentication
- JWT-based auth
- Register / Login
- Protected routes

---

## 🔧 API Endpoints

### Auth
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET  /api/auth/me`

### Datasets
- `POST /api/datasets/upload`       — Upload file
- `GET  /api/datasets`              — List datasets
- `GET  /api/datasets/:id`          — Get dataset
- `GET  /api/datasets/:id/preview`  — Get data preview + stats
- `DELETE /api/datasets/:id`

### Dashboards
- `POST /api/dashboards`            — Create dashboard
- `GET  /api/dashboards`            — List dashboards
- `GET  /api/dashboards/:id`        — Get dashboard
- `PUT  /api/dashboards/:id`        — Update dashboard
- `DELETE /api/dashboards/:id`
- `POST /api/dashboards/:id/compute` — Compute widget data

### AI
- `POST /api/ai/generate-dashboard` — Generate dashboard with GPT-4o
- `POST /api/ai/suggestions`        — Get dashboard type suggestions
- `POST /api/ai/ask`                — Ask a natural language question

---

## 🛠 Tech Stack

**Backend:** Node.js, Express, MongoDB, Mongoose, JWT, Multer, PapaParse, SheetJS, OpenAI SDK

**Frontend:** React 18, React Router 6, Chart.js 4, React-Chartjs-2, React-Dropzone, React-Toastify, Axios

---

## 📝 Notes

- Make sure MongoDB is running before starting the backend
- OpenAI API key must have GPT-4o access
- The `uploads/` folder is created automatically in the backend directory
- In production, set `NODE_ENV=production` and serve the React build statically
