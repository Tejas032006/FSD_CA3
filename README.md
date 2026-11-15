# Full Stack Development CA3 – MediBook Healthcare System

A comprehensive Full Stack Development CA3 repository demonstrating the progressive evolution of a healthcare appointment management application across five distinct architectural milestones: from foundational browser technologies to modern single-page applications, native server-side utilities, authenticated REST APIs, and a complete full-stack deployment with a relational database.

---

## Table of Contents

1. [Project Overview](#project-overview)
2. [Live Deployment Links (Project 5)](#live-deployment-links-project-5)
3. [Repository Structure](#repository-structure)
4. [Technologies Used](#technologies-used)
5. [Program-wise Documentation](#program-wise-documentation)
   - [Project 1 – Hospital Appointment Management System (HTML5, CSS3, Vanilla JS)](#project-1--hospital-appointment-management-system-html5-css3-vanilla-js)
   - [Project 2 – Hospital Appointment Management System (React.js SPA)](#project-2--hospital-appointment-management-system-reactjs-spa)
   - [Project 3 – Hospital Appointment Server-Side Utility (Native Node.js)](#project-3--hospital-appointment-server-side-utility-native-nodejs)
   - [Project 4 – Hospital Appointment REST API (Express.js & JWT)](#project-4--hospital-appointment-rest-api-expressjs--jwt)
   - [Project 5 – Hospital Appointment Full Stack Application (React, Express & PostgreSQL)](#project-5--hospital-appointment-full-stack-application-react-express--postgresql)
6. [Prerequisites](#prerequisites)
7. [Installation and Setup](#installation-and-setup)
8. [How to Run Each Program](#how-to-run-each-program)
9. [Deployment Information (Project 5)](#deployment-information-project-5)
10. [Author and Academic Information](#author-and-academic-information)

---

## Project Overview

**MediBook** is a healthcare appointment scheduling and management platform built as part of the Full Stack Development Continuous Assessment 3 (CA3). The repository is organized into five standalone projects that reflect a real-world software engineering progression:

- **Milestone 1 (Project 1):** Responsive client-side interface built strictly with semantic HTML5, pure CSS3, and Vanilla JavaScript, implementing client-side validation, dynamic data loading, and a simulated REST service over `localStorage`.
- **Milestone 2 (Project 2):** Component-based Single-Page Application (SPA) built using React.js and Vite, featuring functional components, hooks (`useState`, `useEffect`), client-side routing (`react-router-dom`), and controlled forms.
- **Milestone 3 (Project 3):** Server-side HTTP utility built using **native Node.js built-in modules only** (no Express or third-party packages), demonstrating raw stream parsing, asynchronous file system persistence, and event-driven logging with `EventEmitter`.
- **Milestone 4 (Project 4):** Production-structured REST API built using Express.js, featuring modular routing, custom middleware (logging, input validation, centralized error handling), user registration and login with bcrypt password hashing, and JWT bearer token authentication.
- **Milestone 5 (Project 5):** End-to-end full-stack integration connecting the React frontend with the Express backend, persisting records in a PostgreSQL database via Sequelize ORM, with complete cloud deployment on Render and Vercel.

---

## Live Deployment Links (Project 5)

| Component | Platform | Live URL / Endpoint | Status |
| :--- | :--- | :--- | :--- |
| **Frontend Application** | Vercel | [https://fsd-ca-3-six.vercel.app](https://fsd-ca-3-six.vercel.app) | **Live** |
| **Backend Web Service** | Render | [https://medibook-backend-gd0k.onrender.com](https://medibook-backend-gd0k.onrender.com) | **Live** |
| **API Appointments Endpoint** | Render | [https://medibook-backend-gd0k.onrender.com/api/appointments](https://medibook-backend-gd0k.onrender.com/api/appointments) | **Live** |

---

## Repository Structure

```text
FSD_CA3/
│
├── Project1/                               # Program 1: Pure HTML5, CSS3 & Vanilla JavaScript
│   ├── css/
│   │   └── style.css                       # Medical SaaS design tokens, layouts & responsive CSS
│   ├── js/
│   │   ├── app.js                          # SPA router, notifications & UI coordinator
│   │   ├── appointments.js                 # Mock REST API service, validation & table management
│   │   └── doctors.js                      # Fetch API specialist retrieval, search & filtering
│   ├── doctors.json                        # Clinical specialist dataset
│   ├── index.html                          # Semantic HTML5 single-page application shell
│   └── README.md                           # Project 1 detailed documentation
│
├── Project2/                               # Program 2: React.js & Vite Single-Page Application
│   ├── public/
│   │   └── favicon.svg                     # Medical cross favicon
│   ├── src/
│   │   ├── components/
│   │   │   ├── AppointmentList.jsx         # Reusable appointments table with status controls
│   │   │   ├── Navbar.jsx                  # Header navigation bar & live date display
│   │   │   └── Sidebar.jsx                 # Responsive navigation sidebar
│   │   ├── pages/
│   │   │   ├── Appointments.jsx            # Appointment records management & search
│   │   │   ├── BookAppointment.jsx         # Controlled booking form with inline validation
│   │   │   └── Dashboard.jsx               # Clinical metrics & dynamic KPI statistics
│   │   ├── App.css                         # Healthcare theme styles & component classes
│   │   ├── App.jsx                         # Root application component, state & route shell
│   │   ├── index.css                       # Global styles and CSS custom properties
│   │   └── main.jsx                        # React DOM mounting entry point
│   ├── index.html                          # HTML5 template
│   ├── package.json                        # Frontend dependencies & Vite scripts
│   ├── vite.config.js                      # Vite bundler configuration (port 3000)
│   └── README.md                           # Project 2 detailed documentation
│
├── Project3/                               # Program 3: Native Node.js Server-Side Utility
│   ├── data/
│   │   └── appointments.json               # JSON file system persistence storage
│   ├── package.json                        # Node.js project manifest
│   ├── server.js                           # Raw HTTP server, Stream parsing & EventEmitter
│   └── README.md                           # Project 3 documentation & API test guide
│
├── Project4/                               # Program 4: Express.js REST API with JWT Auth
│   ├── data/
│   │   ├── appointments.json               # File system storage for appointments
│   │   └── users.json                      # File system storage for users (bcrypt hashes)
│   ├── middleware/
│   │   ├── auth.js                         # JWT Bearer token verification middleware
│   │   ├── errorHandler.js                 # Centralized 404 & error-handling pipeline
│   │   ├── logger.js                       # HTTP request logging middleware
│   │   └── validateAppointment.js          # Appointment payload validation middleware
│   ├── routes/
│   │   ├── appointmentRoutes.js            # Protected appointment CRUD endpoints (/api/appointments)
│   │   └── authRoutes.js                   # Public user auth endpoints (/api/auth)
│   ├── .env.example                        # Safe template for environment variables
│   ├── package.json                        # Backend dependencies (Express, bcryptjs, JWT)
│   ├── server.js                           # Express server entry point & middleware chain
│   └── README.md                           # Project 4 documentation & curl test guide
│
├── Project5/                               # Program 5: Full Stack React + Express + PostgreSQL
│   ├── backend/                            # Express.js REST API with Sequelize ORM
│   │   ├── config/
│   │   │   └── database.js                 # Sequelize PostgreSQL connection & SSL pool
│   │   ├── middleware/
│   │   │   ├── errorHandler.js             # Centralized 404 & server error handler
│   │   │   └── validateAppointment.js      # Input validation middleware
│   │   ├── models/
│   │   │   ├── Appointment.js              # Sequelize Appointment model schema
│   │   │   └── index.js                    # Model registry and Sequelize export
│   │   ├── routes/
│   │   │   └── appointmentRoutes.js        # RESTful appointment CRUD routes
│   │   ├── .env.example                    # Backend environment variables template
│   │   ├── package.json                    # Backend dependencies (Express, Sequelize, pg)
│   │   ├── render.yaml                     # Render Blueprint infrastructure as code
│   │   └── server.js                       # Backend server entry point
│   ├── frontend/                           # React.js + Vite Frontend Application
│   │   ├── public/
│   │   │   └── favicon.svg                 # Application favicon
│   │   ├── src/
│   │   │   ├── components/                 # Navbar, Sidebar, AppointmentList
│   │   │   │   ├── AppointmentList.jsx     # Reusable appointments table
│   │   │   │   ├── Navbar.jsx              # Header navigation bar
│   │   │   │   └── Sidebar.jsx             # Responsive navigation sidebar
│   │   │   ├── pages/                      # Dashboard, BookAppointment, Appointments
│   │   │   │   ├── Appointments.jsx        # Records management, search & filters
│   │   │   │   ├── BookAppointment.jsx     # Validated appointment booking form
│   │   │   │   └── Dashboard.jsx           # Live KPI stats from PostgreSQL
│   │   │   ├── services/
│   │   │   │   └── api.js                  # Centralized fetch API service layer
│   │   │   ├── App.css                     # Custom healthcare styling
│   │   │   ├── App.jsx                     # Route coordinator & backend data integration
│   │   │   ├── index.css                   # Global resets & design tokens
│   │   │   └── main.jsx                    # React DOM entry point
│   │   ├── .env.example                    # Frontend environment variables template
│   │   ├── index.html                      # HTML5 shell
│   │   ├── package.json                    # Frontend dependencies (React 18, React Router)
│   │   ├── vercel.json                     # Vercel SPA client-side routing rewrites
│   │   └── vite.config.js                  # Vite configuration
│   └── README.md                           # Project 5 documentation & deployment guide
│
├── .gitignore                              # Git exclusion rules (node_modules, .env, dist)
└── README.md                               # Root repository documentation (this file)
```

---

## Technologies Used

| Program | Core Technologies | Modules & Libraries | Persistence / Database | Architecture / Role |
| :--- | :--- | :--- | :--- | :--- |
| **Project 1** | HTML5, CSS3, JavaScript (ES6+) | Native DOM APIs, Native Fetch API | Browser `localStorage` | Client-Side SPA (Vanilla) |
| **Project 2** | React.js 18, JSX, CSS3 | Vite, React Router DOM (v6) | Browser `localStorage` | Frontend SPA (React) |
| **Project 3** | Node.js (Core Runtime) | Built-in: `http`, `fs`, `path`, `stream`, `events` | JSON file (`fs` module) | Server-Side Utility (No Frameworks) |
| **Project 4** | Node.js, Express.js (v4) | `jsonwebtoken`, `bcryptjs`, `dotenv` | JSON files (`fs` module) | Authenticated REST API |
| **Project 5** | Full Stack: React 18 & Express.js | Sequelize ORM, `pg`, `cors`, React Router | PostgreSQL relational database | Full Stack Cloud-Ready System |

---

## Program-wise Documentation

### Project 1 – Hospital Appointment Management System (HTML5, CSS3, Vanilla JS)

#### Objective
Develop a professional, responsive browser-based hospital appointment management system using pure semantic HTML5, CSS3, and Vanilla JavaScript without external CSS or JS frameworks.

#### Technologies Used
- **HTML5:** Semantic document structuring, dialog modals, forms with native input types.
- **CSS3:** Custom healthcare theme (navy blue `#0c2340`, clinical white `#ffffff`, sky blue `#0284c7`), CSS Grid, Flexbox, transitions, and media queries for responsive layouts.
- **Vanilla JavaScript (ES6+):** Async/await, Arrow functions, Template literals, DOM manipulation, custom event handling.
- **Web APIs:** Fetch API (`fetch()`), Web Storage API (`localStorage`).

#### Main Features
- **Clinical Dashboard:** Real-time KPI statistics cards (Total, Scheduled, Completed, Cancelled appointments), recent consultations table, and active specialty clinic indicators.
- **Doctors Directory:** Dynamic asynchronous loading of specialist profiles from `doctors.json`, debounced search bar, department dropdown filter, and direct "Book Appointment" links.
- **Appointment Booking:** Form with comprehensive client-side validation (minimum name length, age boundary 1–120, email pattern, 10-digit mobile number, past-date restriction, and reason length).
- **Appointment Management:** Filterable, searchable, and sortable table with status badges, view details modal, edit record modal, inline status dropdown, and deletion with confirmation.

#### Important Implementation Details
- Uses native `fetch('doctors.json')` to dynamically populate clinical specialist cards.
- Simulates an asynchronous REST API service (`AppointmentAPIService`) with artificial network latency using JavaScript `Promise` delays.
- Persists all appointment updates, additions, and deletions across page reloads in `localStorage` under the key `medibook_appointments`.
- Uses custom character escaping routines to prevent Cross-Site Scripting (XSS).

#### Folder Structure
```text
Project1/
├── css/style.css
├── js/
│   ├── app.js
│   ├── appointments.js
│   └── doctors.js
├── doctors.json
├── index.html
└── README.md
```

#### How to Run Locally
Because modern browsers restrict local `fetch()` calls under the `file:///` protocol, run using a local HTTP server:
```bash
# Option 1: Python built-in server
cd Project1
python -m http.server 8000

# Option 2: Node.js npx serve
cd Project1
npx serve .
```
Open your browser at `http://localhost:8000` (or `http://localhost:3000`).

---

### Project 2 – Hospital Appointment Management System (React.js SPA)

#### Objective
Develop a modular, functional Single-Page Application (SPA) in React.js using Vite and pure CSS3, demonstrating modern React concepts without external UI libraries or component kits.

#### Technologies Used
- **React.js 18:** Modern functional components and JSX architecture.
- **React Router DOM (v6):** Declarative client-side routing (`BrowserRouter`, `Routes`, `Route`, `NavLink`).
- **React Hooks:** `useState` for UI and form state management, `useEffect` for data synchronization.
- **Vite:** Rapid development bundler and build tool.
- **CSS3:** Custom responsive layout and medical design system.

#### Main Features
- **Dashboard View (`/`):** Dynamic greeting, real-time KPI metrics derived from application state, preview of the latest 5 bookings, and operational department overview.
- **Booking Interface (`/book`):** Fully controlled form with field-by-field validation, inline error messaging, date limits preventing historical selections, form reset functionality, and booking confirmation tokens.
- **Appointments Management View (`/appointments`):** Interactive listing with multi-field search, status filtering (`All`, `Scheduled`, `Completed`, `Cancelled`), multi-criteria sorting, inline status modification, and record removal.

#### Important Implementation Details
- **Component Decomposition:** Clear hierarchy with reusable components (`Navbar`, `Sidebar`, `AppointmentList`) and dedicated view pages (`Dashboard`, `BookAppointment`, `Appointments`).
- **Unidirectional Data Flow:** State is managed at the top level in `App.jsx` and passed down with callback functions via props (`onAddAppointment`, `onUpdateStatus`, `onDelete`).
- **Persistent State:** Synchronizes appointment records to `localStorage` via a `useEffect` hook.
- **Zero Framework Dependency:** Styled completely using standard CSS without Tailwind, Bootstrap, or component libraries.

#### Folder Structure
```text
Project2/
├── public/favicon.svg
├── src/
│   ├── components/
│   │   ├── AppointmentList.jsx
│   │   ├── Navbar.jsx
│   │   └── Sidebar.jsx
│   ├── pages/
│   │   ├── Appointments.jsx
│   │   ├── BookAppointment.jsx
│   │   └── Dashboard.jsx
│   ├── App.css
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
├── index.html
├── package.json
├── vite.config.js
└── README.md
```

#### How to Run Locally
```bash
cd Project2
npm install
npm run dev
```
Open your browser at `http://localhost:3000`.

---

### Project 3 – Hospital Appointment Server-Side Utility (Native Node.js)

#### Objective
Build a server-side hospital appointment utility using **only Node.js built-in modules** without Express or third-party web frameworks, exposing RESTful endpoints and utilizing streams and event emitters.

#### Technologies Used
- **Node.js Built-In Modules Only:**
  - `http`: Server instantiation (`http.createServer`) and HTTP request/response management.
  - `fs`: File system directory creation, synchronous file reading, and atomic writing.
  - `path`: Cross-platform path resolution for file persistence.
  - `stream`: Custom `Writable` stream parsing incoming request chunks safely.
  - `events`: Custom `EventEmitter` implementation for audit logging.

#### Main Features
- **Full REST API on Port 3000:**
  - `GET /appointments` – Retrieve all stored appointments.
  - `POST /appointments` – Create a new appointment record.
  - `PUT /appointments/:id` – Update an existing record by identifier.
  - `DELETE /appointments/:id` – Delete an appointment record.
- **File System Persistence:** Records are persisted in `data/appointments.json`. Missing files and directories are initialized automatically.
- **Stream-Based Body Ingestion:** Implements a custom `Writable` stream (`req.pipe(bodyStream)`) with a 1 MB payload size limit to prevent memory exhaustion attacks.
- **Event-Driven Notifications:** An `AppointmentNotifier` class extends `EventEmitter` to emit `created`, `updated`, and `deleted` audit logs to the console.

#### Important Implementation Details
- Standardized HTTP status codes: `200 OK`, `201 Created`, `400 Bad Request`, `404 Not Found`, `413 Payload Too Large`, `500 Server Error`.
- Proper HTTP headers: `Content-Type: application/json; charset=utf-8` and basic CORS headers for cross-origin testing.
- Input validation ensures required fields (`patientName`, `age`, `doctor`, `appointmentDate`, `appointmentTime`, `reason`) are present and valid before saving.

#### Folder Structure
```text
Project3/
├── data/
│   └── appointments.json
├── package.json
├── server.js
└── README.md
```

#### How to Run Locally
```bash
cd Project3
npm start
```
*(or run `node server.js` directly)*

The server listens at `http://localhost:3000`.

---

### Project 4 – Hospital Appointment REST API (Express.js & JWT)

#### Objective
Develop a structured, secure backend REST API for hospital appointments using Node.js and Express.js, featuring user authentication, password hashing, JWT route protection, and modular middleware.

#### Technologies Used
- **Node.js & Express.js (v4):** Web framework and routing pipeline.
- **bcryptjs:** Salt generation and one-way password hashing for registered users.
- **jsonwebtoken (JWT):** Token signing and verification for stateless authentication.
- **dotenv:** Environment variable configuration.
- **fs & path:** File system operations for persisting `users.json` and `appointments.json`.

#### Main Features
- **Public Authentication Endpoints (`/api/auth`):**
  - `POST /api/auth/register` – Creates a user account with a bcrypt-hashed password.
  - `POST /api/auth/login` – Validates credentials and returns a signed JWT Bearer token.
- **Protected Appointment CRUD Endpoints (`/api/appointments`):**
  - `GET /api/appointments` – Returns all appointment records (requires JWT).
  - `POST /api/appointments` – Validates and creates a new appointment (requires JWT).
  - `PUT /api/appointments/:id` – Validates and updates an appointment (requires JWT).
  - `DELETE /api/appointments/:id` – Removes an appointment record (requires JWT).
- **Middleware Pipeline:**
  - `logger.js`: Custom request logger recording method, URL, and timestamp.
  - `validateAppointment.js`: Payload validation ensuring valid patient data on `POST` and `PUT`.
  - `auth.js`: Token verification extracting Bearer tokens from the `Authorization` header.
  - `errorHandler.js`: Centralized handler capturing malformed JSON (`400`), unknown routes (`404`), and uncaught errors (`500`).

#### Important Implementation Details
- Clear separation of concerns across `middleware/`, `routes/`, and `data/`.
- Passwords are never stored in plaintext; comparison is performed securely using `bcrypt.compare`.
- Unauthenticated requests to protected endpoints immediately receive `401 Unauthorized`.

#### Folder Structure
```text
Project4/
├── data/
│   ├── appointments.json
│   └── users.json
├── middleware/
│   ├── auth.js
│   ├── errorHandler.js
│   ├── logger.js
│   └── validateAppointment.js
├── routes/
│   ├── appointmentRoutes.js
│   └── authRoutes.js
├── .env.example
├── package.json
├── server.js
└── README.md
```

#### Environment Variables (`Project4/.env.example`)
```env
PORT=4000
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRES_IN=24h
```

#### How to Run Locally
```bash
cd Project4
npm install
npm start
```
*(or run `node server.js` directly)*

The server listens at `http://localhost:4000`.

---

### Project 5 – Hospital Appointment Full Stack Application (React, Express & PostgreSQL)

#### Objective
Develop a production-ready, full-stack hospital appointment management system by integrating the React frontend from Project 2 with an Express.js backend and a PostgreSQL relational database managed by Sequelize ORM.

#### Technologies Used
- **Frontend (`Project5/frontend`):**
  - React.js 18, Vite 6, React Router DOM 6.
  - Native Fetch API service layer with dynamic base URL resolution (`api.js`).
  - Vercel SPA rewrite configuration (`vercel.json`).
- **Backend (`Project5/backend`):**
  - Node.js, Express.js 4, CORS middleware, dotenv.
  - PostgreSQL database with Sequelize ORM (`sequelize`, `pg`, `pg-hstore`).
  - Render Blueprint deployment configuration (`render.yaml`).

#### Live Deployment Links
- **Frontend Application (Vercel):** [https://fsd-ca-3-six.vercel.app](https://fsd-ca-3-six.vercel.app)
- **Backend Web Service (Render):** [https://medibook-backend-gd0k.onrender.com](https://medibook-backend-gd0k.onrender.com)
- **API Appointments Endpoint:** [https://medibook-backend-gd0k.onrender.com/api/appointments](https://medibook-backend-gd0k.onrender.com/api/appointments)

#### Main Features
- **End-to-End Database Integration:** Completely replaces client-side `localStorage` with real HTTP calls to the Express API, saving records in PostgreSQL.
- **Relational Data Model (`Appointment`):** Defines strict column data types, nullability constraints, string length validations, and status defaults (`Scheduled`, `Completed`, `Cancelled`).
- **Live Database-Driven Dashboard:** KPI metrics on the dashboard automatically reflect real-time counts from PostgreSQL.
- **Centralized API Client:** Frontend requests pass through `src/services/api.js`, which normalizes base URLs, manages headers, and formats error responses.
- **Production Cloud Deployment:** Deployed live on Render (Express API & PostgreSQL database) and Vercel (React Vite SPA).

#### PostgreSQL Database Schema (`appointments`)
| Column | Type | Attributes | Description |
| :--- | :--- | :--- | :--- |
| `id` | `INTEGER` | Primary Key, Auto-Increment | Unique identifier |
| `patientName` | `VARCHAR(255)` | Not Null, Min 3 chars | Full patient name |
| `age` | `INTEGER` | Not Null, Range: 1–120 | Patient age |
| `email` | `VARCHAR(255)` | Not Null, Email format | Contact email |
| `mobile` | `VARCHAR(255)` | Not Null, 10 digits | Mobile contact number |
| `doctor` | `VARCHAR(255)` | Not Null | Consulting doctor |
| `appointmentDate` | `VARCHAR(255)` | Not Null | Consultation date |
| `appointmentTime` | `VARCHAR(255)` | Not Null | Scheduled time slot |
| `reason` | `TEXT` | Not Null, Min 5 chars | Reason for consultation |
| `status` | `VARCHAR(255)` | Default: `'Scheduled'` | `'Scheduled'`, `'Completed'`, `'Cancelled'` |
| `createdAt` | `TIMESTAMP` | Auto-managed by Sequelize | Record creation time |
| `updatedAt` | `TIMESTAMP` | Auto-managed by Sequelize | Last update timestamp |

#### Folder Structure
```text
Project5/
├── backend/
│   ├── config/
│   │   └── database.js
│   ├── middleware/
│   │   ├── errorHandler.js
│   │   └── validateAppointment.js
│   ├── models/
│   │   ├── Appointment.js
│   │   └── index.js
│   ├── routes/
│   │   └── appointmentRoutes.js
│   ├── .env.example
│   ├── package.json
│   ├── render.yaml
│   └── server.js
├── frontend/
│   ├── public/
│   │   └── favicon.svg
│   ├── src/
│   │   ├── components/
│   │   │   ├── AppointmentList.jsx
│   │   │   ├── Navbar.jsx
│   │   │   └── Sidebar.jsx
│   │   ├── pages/
│   │   │   ├── Appointments.jsx
│   │   │   ├── BookAppointment.jsx
│   │   │   └── Dashboard.jsx
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── App.css
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   ├── .env.example
│   ├── index.html
│   ├── package.json
│   ├── vercel.json
│   └── vite.config.js
└── README.md
```

#### Environment Variables

**Backend (`Project5/backend/.env.example`):**
```env
PORT=5000
NODE_ENV=development
DB_NAME=medibook_db
DB_USER=your_postgres_username
DB_PASSWORD=your_postgres_password
DB_HOST=localhost
DB_PORT=5432
CLIENT_URL=http://localhost:3000
# DATABASE_URL=postgres://user:password@host:5432/medibook_db?sslmode=require
```

**Frontend (`Project5/frontend/.env.example`):**
```env
# Live Deployed Render Backend URL
VITE_API_URL=https://medibook-backend-gd0k.onrender.com
```

> **Note on URL Normalization:** The frontend API service (`src/services/api.js`) automatically normalizes the configured `VITE_API_URL` by removing any trailing slashes and appending `/api` if it is not already included. Both `https://medibook-backend-gd0k.onrender.com` and `https://medibook-backend-gd0k.onrender.com/api` are valid and resolve to the correct endpoint.

#### How to Run Locally

1. **Create the PostgreSQL Database:**
   ```sql
   CREATE DATABASE medibook_db;
   ```

2. **Start the Express Backend:**
   ```bash
   cd Project5/backend
   npm install
   # Create .env based on .env.example with your database credentials
   npm start
   ```
   *(or run `node server.js` directly)*  
   *The backend starts at `http://localhost:5000`, verifies the database connection, and syncs tables.*

3. **Start the React Frontend:**
   ```bash
   cd Project5/frontend
   npm install
   npm run dev
   ```
   *The frontend starts at `http://localhost:3000` connected to the backend API.*

---

## Prerequisites

Before running the applications in this repository, ensure the following software is installed on your workstation:

| Requirement | Recommended Version | Purpose |
| :--- | :--- | :--- |
| **Node.js** | v18.x or v20.x LTS | Runtime for Project 2, Project 3, Project 4, and Project 5 |
| **npm** | v9.x or v10.x | Package manager for dependencies and scripts |
| **PostgreSQL** | v14.x, v15.x, or v16.x | Relational database for Project 5 |
| **Web Browser** | Latest Chrome, Edge, Firefox | Client-side execution of Project 1, Project 2, Project 5 |
| **Python 3** *(Optional)* | v3.8+ | Convenient static HTTP server for Project 1 (`python -m http.server`) |

---

## Installation and Setup

### 1. Clone the Repository
```bash
git clone https://github.com/Tejas032006/FSD_CA3.git
cd FSD_CA3
```

### 2. Install Project Dependencies
Run `npm install` inside each project directory that contains external dependencies:

```bash
# Project 2 (React Frontend)
cd Project2
npm install
cd ..

# Project 3 (Native Node.js - uses core modules only; no external dependencies required)

# Project 4 (Express REST API with Auth)
cd Project4
npm install
cd ..

# Project 5 Backend (Express + Sequelize + PostgreSQL)
cd Project5/backend
npm install
cd ../..

# Project 5 Frontend (React + Vite)
cd Project5/frontend
npm install
cd ../..
```

---

## How to Run Each Program

Use the following exact commands and working directories to run each program locally:

| Program | Working Directory | Command | Local Address |
| :--- | :--- | :--- | :--- |
| **Project 1** (HTML/JS) | `Project1/` | `python -m http.server 8000`<br>*(or `npx serve .`)* | `http://localhost:8000` |
| **Project 2** (React SPA) | `Project2/` | `npm run dev` | `http://localhost:3000` |
| **Project 3** (Node Utility) | `Project3/` | `npm start`<br>*(or `node server.js`)* | `http://localhost:3000` |
| **Project 4** (Express API) | `Project4/` | `npm start`<br>*(or `node server.js`)* | `http://localhost:4000` |
| **Project 5** (Backend) | `Project5/backend/` | `npm start`<br>*(or `node server.js`)* | `http://localhost:5000` |
| **Project 5** (Frontend) | `Project5/frontend/` | `npm run dev` | `http://localhost:3000` |

---

## Deployment Information (Project 5)

Project 5 is deployed live and configured using **Render** (PostgreSQL database and Express Web Service) and **Vercel** (React Vite frontend).

### Live Production Deployments
| Component | Platform | Live URL / Endpoint |
| :--- | :--- | :--- |
| **Frontend Application** | Vercel | [https://fsd-ca-3-six.vercel.app](https://fsd-ca-3-six.vercel.app) |
| **Backend Web Service** | Render | [https://medibook-backend-gd0k.onrender.com](https://medibook-backend-gd0k.onrender.com) |
| **API Appointments Endpoint** | Render | [https://medibook-backend-gd0k.onrender.com/api/appointments](https://medibook-backend-gd0k.onrender.com/api/appointments) |

---

### 1. Render PostgreSQL Database
- **Service Type:** PostgreSQL
- **Database Name:** `medibook_db`
- **Database User:** `medibook_app`
- **Region:** `Singapore`
- **Plan:** Free
- Provides an internal connection string used directly by the Render web service without egress charges.

### 2. Render Express Web Service
- **Service Type:** Web Service (Node.js runtime)
- **Root Directory:** `Project5/backend`
- **Build Command:** `npm install`
- **Start Command:** `node server.js`
- **Blueprint Config:** Automated via `Project5/backend/render.yaml`
- **Environment Variables:**
  - `NODE_ENV`: `production`
  - `PORT`: `5000`
  - `DATABASE_URL`: Connection string provided by Render PostgreSQL (with SSL enabled)
  - `CLIENT_URL`: `https://fsd-ca-3-six.vercel.app`

### 3. Vercel Frontend Deployment
- **Platform:** Vercel
- **Root Directory:** `Project5/frontend`
- **Framework Preset:** `Vite`
- **Build Command:** `npm run build`
- **Output Directory:** `dist`
- **Client-Side Routing:** Configured via `Project5/frontend/vercel.json` with rewrites (`/(.*)` &rarr; `/index.html`) to support browser refreshes on deep routes.
- **Environment Variable:**
  - `VITE_API_URL`: `https://medibook-backend-gd0k.onrender.com`
  *(The frontend API service automatically normalizes the URL and appends `/api` when necessary)*

---

## Author and Academic Information

- **Course:** Full Stack Development
- **Coursework:** Continuous Assessment 3 (CA3)
- **Project Name:** MediBook – Hospital Appointment Management System
- **Repository:** [https://github.com/Tejas032006/FSD_CA3](https://github.com/Tejas032006/FSD_CA3)
- **Student Name:** *[Your Name]*
- **Registration / Roll Number:** *[Your Registration Number]*
- **Institution:** *[Your Institution / University Name]*
- **Academic Term:** 2026
