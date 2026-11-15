# MediBook – Hospital Appointment REST API (Express.js)
**Program 4 of 5** | Built with **Express.js, JWT, bcryptjs, and File System Persistence**

---

## 🎯 Project Overview

**MediBook Hospital Appointment REST API** is a secure, production-grade backend service built with **Express.js**. It features user authentication with password hashing, JSON Web Token (JWT) route protection, modular middleware architecture (logging, validation, error handling), and CRUD operations for hospital appointments persisted in local JSON storage.

---

## 📁 Project Structure

```text
Project4/
├── middleware/
│   ├── logger.js               # Logs HTTP method, URL, and timestamp
│   ├── validateAppointment.js  # Validates required appointment fields
│   ├── auth.js                 # Verifies JWT Bearer tokens
│   └── errorHandler.js         # Centralized 404 & error-handling middleware
├── routes/
│   ├── authRoutes.js           # User registration & login (/api/auth)
│   └── appointmentRoutes.js    # Protected appointment CRUD (/api/appointments)
├── data/
│   ├── appointments.json       # Persisted appointment records
│   └── users.json              # Persisted user credentials (hashed passwords)
├── server.js                   # Main Express application entry point
├── package.json                # Project dependencies & scripts
├── .env.example                # Template for environment variables
└── .env                        # Local environment configuration
```

---

## ⚙️ Middleware Architecture

1. **Request Logger (`middleware/logger.js`)**
   - Intercepts every incoming HTTP request.
   - Outputs: `[2026-11-15T09:45:00.000Z] POST /api/auth/register` to console.

2. **Appointment Validator (`middleware/validateAppointment.js`)**
   - Applied to `POST /api/appointments` and `PUT /api/appointments/:id`.
   - Validates `patientName` (min 3 chars), `age` (1–120), `doctor`, `appointmentDate` (YYYY-MM-DD), `appointmentTime`, and `reason` (min 5 chars).
   - Rejects invalid payloads with `400 Bad Request`.

3. **JWT Authentication (`middleware/auth.js`)**
   - Protects all 4 appointment CRUD endpoints.
   - Extracts and verifies token from the `Authorization: Bearer <token>` header.
   - Rejects unauthenticated requests with `401 Unauthorized`.

4. **Centralized Error Handling (`middleware/errorHandler.js`)**
   - Catches malformed JSON payloads (`400`), route not found errors (`404`), and unhandled exceptions (`500`).
   - Returns consistent, predictable JSON error responses.

---

## 📋 API Endpoints

### Authentication Routes (Public)
| Method | Endpoint | Description | Status Code |
| :--- | :--- | :--- | :--- |
| **POST** | `/api/auth/register` | Register new user account (hashes password with bcrypt) | `201 Created` |
| **POST** | `/api/auth/login` | Authenticate user & generate JWT token | `200 OK` |

### Appointment Routes (Protected by JWT)
| Method | Endpoint | Description | Status Code |
| :--- | :--- | :--- | :--- |
| **GET** | `/api/appointments` | Retrieve all appointments | `200 OK` |
| **POST** | `/api/appointments` | Create a new appointment | `201 Created` |
| **PUT** | `/api/appointments/:id` | Update an existing appointment by ID | `200 OK` |
| **DELETE** | `/api/appointments/:id` | Delete an appointment by ID | `200 OK` |

---

## 🚀 How to Run the Application

### 1. Install Dependencies
```bash
cd c:\Users\Tejas\Project\FSD_CA3\Project4
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env` (already created):
```bash
PORT=4000
JWT_SECRET=medibook_jwt_super_secret_key_2026_ca3
JWT_EXPIRES_IN=24h
```

### 3. Start the Server
```bash
node server.js
```
or
```bash
npm start
```
The server will start listening at `http://localhost:4000`.

---

## 🧪 Testing the API Step-by-Step

### Step 1: Register a New User
```bash
curl -X POST http://localhost:4000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username": "admin", "password": "password123"}'
```
*PowerShell:*
```powershell
$registerBody = @{ username = "admin"; password = "password123" } | ConvertTo-Json
Invoke-RestMethod -Uri http://localhost:4000/api/auth/register -Method POST -Body $registerBody -ContentType "application/json"
```

### Step 2: Login & Obtain JWT Token
```bash
curl -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username": "admin", "password": "password123"}'
```
*PowerShell (Saves token into `$token` variable):*
```powershell
$loginBody = @{ username = "admin"; password = "password123" } | ConvertTo-Json
$loginRes = Invoke-RestMethod -Uri http://localhost:4000/api/auth/login -Method POST -Body $loginBody -ContentType "application/json"
$token = $loginRes.token
Write-Host "JWT Token:" $token
```

### Step 3: Test Unauthenticated Request (Expect 401)
```bash
curl http://localhost:4000/api/appointments
```
*Output: HTTP 401 Unauthorized.*

### Step 4: Retrieve Appointments with JWT (GET)
```bash
curl http://localhost:4000/api/appointments \
  -H "Authorization: Bearer <YOUR_JWT_TOKEN>"
```
*PowerShell:*
```powershell
Invoke-RestMethod -Uri http://localhost:4000/api/appointments -Method GET -Headers @{ Authorization = "Bearer $token" }
```

### Step 5: Create a New Appointment with JWT (POST)
```bash
curl -X POST http://localhost:4000/api/appointments \
  -H "Authorization: Bearer <YOUR_JWT_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "patientName": "Aarav Patel",
    "age": 34,
    "doctor": "Dr. Rajesh Sharma",
    "appointmentDate": "2026-11-20",
    "appointmentTime": "11:00 AM",
    "reason": "Neurology consultation for chronic migraine"
  }'
```
*PowerShell:*
```powershell
$newAppt = @{
  patientName = "Aarav Patel"
  age = 34
  doctor = "Dr. Rajesh Sharma"
  appointmentDate = "2026-11-20"
  appointmentTime = "11:00 AM"
  reason = "Neurology consultation for chronic migraine"
} | ConvertTo-Json

Invoke-RestMethod -Uri http://localhost:4000/api/appointments -Method POST -Body $newAppt -ContentType "application/json" -Headers @{ Authorization = "Bearer $token" }
```

### Step 6: Update an Appointment with JWT (PUT)
```bash
curl -X PUT http://localhost:4000/api/appointments/1 \
  -H "Authorization: Bearer <YOUR_JWT_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "patientName": "Rahul Sharma",
    "age": 22,
    "doctor": "Dr. Sarah Jenkins",
    "appointmentDate": "2026-11-17",
    "appointmentTime": "10:30 AM",
    "reason": "Annual executive health checkup"
  }'
```

### Step 7: Delete an Appointment with JWT (DELETE)
```bash
curl -X DELETE http://localhost:4000/api/appointments/1 \
  -H "Authorization: Bearer <YOUR_JWT_TOKEN>"
```

