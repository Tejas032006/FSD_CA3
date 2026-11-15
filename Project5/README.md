# MediBook – Hospital Appointment Full Stack Application
**Program 5 of 5** | Built with **React.js, Express.js, PostgreSQL, and Sequelize ORM**

---

## 🏥 Project Overview & Architecture

**MediBook Full Stack Application** integrates the React frontend from Program 2 with a scalable Node.js/Express REST API backend and a **PostgreSQL** relational database managed via **Sequelize ORM**.

All appointment bookings, status updates, listings, and deletions are saved directly to PostgreSQL. The application is production-ready and configured for deployment on **Render** (Backend & PostgreSQL) and **Vercel** (Frontend).

```
   ┌────────────────────────────────┐         REST API (JSON over CORS)        ┌──────────────────────────────┐
   │         React Frontend         │ ◄──────────────────────────────────────► │      Express.js Backend      │
   │  - Vite + React Router DOM     │          GET, POST, PUT, DELETE          │  - CORS & Error Handling     │
   │  - Controlled Forms            │                                          │  - Input Validation          │
   │  - Configured for Vercel       │                                          │  - Configured for Render     │
   └────────────────────────────────┘                                          └──────────────┬───────────────┘
                                                                                              │
                                                                                              │ Sequelize ORM
                                                                                              ▼
                                                                               ┌──────────────────────────────┐
                                                                               │     PostgreSQL Database      │
                                                                               │  Table: appointments         │
                                                                               │  Auto-migration & Pooling    │
                                                                               └──────────────────────────────┘
```

---

## 📁 Project Structure

```text
Project5/
├── frontend/
│   ├── public/
│   │   └── favicon.svg              # Medical cross emblem
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx           # Top header navigation
│   │   │   ├── Sidebar.jsx          # Collapsible navigation drawer
│   │   │   └── AppointmentList.jsx  # Table rendering with status updates
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx        # Live KPI stats from PostgreSQL
│   │   │   ├── BookAppointment.jsx  # Validated appointment booking form
│   │   │   └── Appointments.jsx     # Records management, search & filters
│   │   ├── services/
│   │   │   └── api.js               # Centralized fetch API service layer
│   │   ├── App.jsx                  # Main router and API state coordinator
│   │   ├── App.css                  # Custom healthcare theme CSS3
│   │   ├── index.css                # Global CSS reset & variables
│   │   └── main.jsx                 # React DOM mount point
│   ├── index.html                   # HTML5 template
│   ├── package.json                 # Frontend dependencies (React, Vite, React Router)
│   ├── vite.config.js               # Vite bundler configuration
│   ├── vercel.json                  # Vercel SPA routing rewrite configuration
│   ├── .env.example                 # Frontend environment variables template
│   └── .env                         # Local frontend environment config
│
├── backend/
│   ├── config/
│   │   └── database.js              # Sequelize PostgreSQL connection & pool
│   ├── models/
│   │   ├── index.js                 # Central database & model export
│   │   └── Appointment.js           # Sequelize Appointment model definition
│   ├── routes/
│   │   └── appointmentRoutes.js     # RESTful CRUD routes (/api/appointments)
│   ├── middleware/
│   │   ├── validateAppointment.js   # Input validation middleware
│   │   └── errorHandler.js          # Centralized 404 & error-handling pipeline
│   ├── server.js                    # Express application entry point
│   ├── package.json                 # Backend dependencies (Express, Sequelize, pg)
│   ├── render.yaml                  # Render Blueprint deployment configuration
│   ├── .env.example                 # Backend environment variables template
│   └── .env                         # Local backend environment config
│
└── README.md                        # Documentation & deployment guide
```

---

## 🗄️ PostgreSQL Database Schema (`appointments`)

Managed via Sequelize ORM with automatic schema synchronization:

| Column | Data Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | `INTEGER` | Primary Key, Auto-Increment | Unique appointment ID |
| `patientName` | `VARCHAR(255)` | Not Null, Min 3 characters | Full name of patient |
| `age` | `INTEGER` | Not Null, Range: 1–120 | Patient age in years |
| `email` | `VARCHAR(255)` | Not Null, Email format | Patient email address |
| `mobile` | `VARCHAR(255)` | Not Null, 10 digits | Mobile contact number |
| `doctor` | `VARCHAR(255)` | Not Null | Consulting doctor & specialty |
| `appointmentDate` | `VARCHAR(255)` | Not Null | Scheduled consultation date |
| `appointmentTime` | `VARCHAR(255)` | Not Null | Consultation time slot |
| `reason` | `TEXT` | Not Null, Min 5 characters | Medical symptoms or notes |
| `status` | `VARCHAR(255)` | Default: `'Scheduled'` | `'Scheduled'`, `'Completed'`, or `'Cancelled'` |
| `createdAt` | `TIMESTAMP` | Auto-generated | Timestamp of creation |
| `updatedAt` | `TIMESTAMP` | Auto-generated | Timestamp of last update |

---

## 🔌 REST API Endpoints

Base URL: `http://localhost:5000/api/appointments`

| Method | Endpoint | Description | Request Body | Response Status |
| :--- | :--- | :--- | :--- | :--- |
| **GET** | `/api/appointments` | Retrieve all appointments | None | `200 OK` |
| **GET** | `/api/appointments/:id` | Retrieve single appointment | None | `200 OK` (or `404`) |
| **POST** | `/api/appointments` | Create new appointment in PostgreSQL | Full appointment JSON | `201 Created` |
| **PUT** | `/api/appointments/:id` | Update appointment or change status | Updated fields or status | `200 OK` (or `404`) |
| **DELETE** | `/api/appointments/:id` | Remove appointment from PostgreSQL | None | `200 OK` (or `404`) |

---

## 🚀 Running the Full Stack App Locally

### 1. Set Up PostgreSQL Database
Create a database named `medibook_db` in PostgreSQL:
```sql
CREATE DATABASE medibook_db;
```

### 2. Configure Backend Environment
In `Project5/backend/.env`:
```env
PORT=5000
NODE_ENV=development
DB_NAME=medibook_db
DB_USER=postgres
DB_PASSWORD=your_postgres_password
DB_HOST=localhost
DB_PORT=5432
CLIENT_URL=http://localhost:3000
```

### 3. Start the Backend Server
```bash
cd c:\Users\Tejas\Project\FSD_CA3\Project5\backend
npm install
node server.js
```
The server will connect to PostgreSQL, synchronize tables, seed initial sample records if the table is empty, and listen at `http://localhost:5000`.

### 4. Configure & Start the Frontend
In another terminal:
```bash
cd c:\Users\Tejas\Project\FSD_CA3\Project5\frontend
npm install
npm run dev
```
The React application will launch at `http://localhost:3000` connected to `http://localhost:5000/api`.

---

## ☁️ Deployment Preparation

> **Notice:** Per instructions, the project is configured and prepared for deployment. Do not trigger live deployment without explicit confirmation.

### A. Backend Deployment on Render
1. Create a **PostgreSQL Database** on Render:
   - Name: `medibook-postgres`
   - Database: `medibook_db`
   - Copy the provided **Internal Database URL** (or External URL).
2. Create a new **Web Service** on Render connected to your Git repository:
   - Root Directory: `Project5/backend`
   - Runtime: `Node`
   - Build Command: `npm install`
   - Start Command: `node server.js`
3. Add Environment Variables on Render:
   - `NODE_ENV`: `production`
   - `PORT`: `5000`
   - `DATABASE_URL`: *(Your Render PostgreSQL Connection String with `?sslmode=require`)*
   - `CLIENT_URL`: `https://your-frontend-app.vercel.app`
4. The backend automatically handles SSL connections when `DATABASE_URL` or `NODE_ENV=production` is detected.

### B. Frontend Deployment on Vercel
1. Import the repository into **Vercel**.
2. Set Project Settings:
   - Root Directory: `Project5/frontend`
   - Framework Preset: `Vite`
   - Build Command: `npm run build`
   - Output Directory: `dist`
3. Add Environment Variable:
   - `VITE_API_URL`: `https://your-backend-app.onrender.com/api`
4. The included `vercel.json` ensures that deep-linking and browser page refreshes work smoothly without 404 errors by rewriting routes to `/index.html`.

---

## 🧪 Verification Checklist

- [x] React frontend successfully communicates with Express backend API.
- [x] Appointment booking (`POST`) stores records in PostgreSQL via Sequelize.
- [x] Appointment listing (`GET`) retrieves records from PostgreSQL.
- [x] Status updates (`PUT`) modify records in PostgreSQL in real time.
- [x] Deletion (`DELETE`) removes records from PostgreSQL.
- [x] Input validation blocks invalid inputs with HTTP 400.
- [x] CORS middleware allows frontend cross-origin requests.
- [x] Environment variables configured with `.env.example` templates.
- [x] Production build of frontend succeeds (`vite build`).
- [x] Deployment preparation for Render and Vercel completed.

