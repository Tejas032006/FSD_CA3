# MediBook – Hospital Appointment Management Server-Side Utility
**Program 3 of 5** | Built with **Native Node.js (No Express / No External Frameworks)**

---

## 🎯 Project Aim & Overview

The **MediBook Server-Side Utility** is a lightweight, backend REST API developed for hospital appointment scheduling. It is implemented purely using **Node.js built-in modules** without third-party frameworks like Express, Fastify, or NestJS.

The utility uses:
- The **`http`** module to create an HTTP server handling REST endpoints on port 3000.
- The **`path`** module to safely resolve file system locations across operating systems.
- The **`fs`** module to reliably read and persist appointment records in `data/appointments.json`.
- The **`stream`** module (`Writable` stream) to process incoming request bodies in stream chunks with size limits and error handling.
- The **`events`** module (`EventEmitter`) to broadcast and log appointment creation, update, and cancellation notifications.

---

## 📁 Required Folder Structure

```text
Project3/
├── data/
│   └── appointments.json      # JSON persistence storage for appointment records
├── server.js                  # Native HTTP server, stream parser, and route handlers
├── package.json               # Node.js project manifest
└── README.md                  # Documentation and API testing guide
```

---

## ⚙️ Built-In Node.js Modules Used

1. **`http`**
   - Creates the server instance with `http.createServer()`.
   - Listens on port 3000 (`server.listen(3000)`).
   - Handles HTTP methods (`GET`, `POST`, `PUT`, `DELETE`, `OPTIONS`).
   - Sets headers (`Content-Type: application/json; charset=utf-8`, CORS).
   - Dispatches appropriate status codes (`200 OK`, `201 Created`, `400 Bad Request`, `404 Not Found`, `413 Payload Too Large`, `500 Server Error`).

2. **`fs` (File System)**
   - Checks directory and file existence using `fs.existsSync()`.
   - Safely creates directory with `fs.mkdirSync(..., { recursive: true })`.
   - Reads stored appointment records with `fs.readFileSync()`.
   - Persists formatted JSON records with `fs.writeFileSync()`.
   - Initializes storage with an empty array `[]` if the file does not exist.

3. **`path`**
   - Uses `path.join(__dirname, 'data', 'appointments.json')` to generate safe absolute file system paths regardless of the host operating system (Windows / POSIX).

4. **`stream`**
   - Implements a custom `Writable` stream (`new Writable(...)`) to ingest incoming HTTP request body chunks (`req.pipe(bodyStream)`).
   - Monitors chunk sizes, prevents memory overflow, and handles stream errors before JSON parsing.

5. **`events` (`EventEmitter`)**
   - `AppointmentNotifier` class emits audit events (`created`, `updated`, `deleted`) to notify hospital systems and print real-time server logs.

---

## 📋 REST API Endpoints

| Method | Endpoint | Description | Success Status |
| :--- | :--- | :--- | :--- |
| **GET** | `/appointments` | Retrieve all hospital appointment records | `200 OK` |
| **POST** | `/appointments` | Create a new appointment record | `201 Created` |
| **PUT** | `/appointments/:id` | Update an existing appointment by ID | `200 OK` |
| **DELETE** | `/appointments/:id` | Delete an appointment record by ID | `200 OK` |

### Required Appointment Data Fields
- `id` *(number or string, auto-generated)*
- `patientName` *(string, required)*
- `age` *(number 1–120, required)*
- `doctor` *(string, required)*
- `appointmentDate` *(string YYYY-MM-DD, required)*
- `appointmentTime` *(string e.g. "10:00 AM", required)*
- `reason` *(string, required)*

---

## 🚀 How to Run the Server

### 1. Start Server
Open your terminal in `Project3/` and run:
```bash
node server.js
```
or
```bash
npm start
```

The server will start listening at:
```text
http://localhost:3000
```

---

## 🧪 Testing the API

You can test all endpoints using `curl` or PowerShell `Invoke-RestMethod`:

### 1. Retrieve All Appointments (GET)
```bash
curl http://localhost:3000/appointments
```
*PowerShell:*
```powershell
Invoke-RestMethod -Uri http://localhost:3000/appointments -Method GET
```

### 2. Create a New Appointment (POST)
```bash
curl -X POST http://localhost:3000/appointments \
  -H "Content-Type: application/json" \
  -d '{"patientName": "Aarav Patel", "age": 34, "doctor": "Dr. Rajesh Sharma", "appointmentDate": "2026-11-18", "appointmentTime": "11:30 AM", "reason": "Persistent migraine consultation"}'
```
*PowerShell:*
```powershell
$body = @{
  patientName = "Aarav Patel"
  age = 34
  doctor = "Dr. Rajesh Sharma"
  appointmentDate = "2026-11-18"
  appointmentTime = "11:30 AM"
  reason = "Persistent migraine consultation"
} | ConvertTo-Json

Invoke-RestMethod -Uri http://localhost:3000/appointments -Method POST -Body $body -ContentType "application/json"
```

### 3. Update an Existing Appointment (PUT)
```bash
curl -X PUT http://localhost:3000/appointments/1 \
  -H "Content-Type: application/json" \
  -d '{"patientName": "Rahul Sharma", "age": 22, "doctor": "Dr. Sarah Jenkins", "appointmentDate": "2026-11-17", "appointmentTime": "10:30 AM", "reason": "Annual executive health checkup"}'
```
*PowerShell:*
```powershell
$body = @{
  patientName = "Rahul Sharma"
  age = 22
  doctor = "Dr. Sarah Jenkins"
  appointmentDate = "2026-11-17"
  appointmentTime = "10:30 AM"
  reason = "Annual executive health checkup"
} | ConvertTo-Json

Invoke-RestMethod -Uri http://localhost:3000/appointments/1 -Method PUT -Body $body -ContentType "application/json"
```

### 4. Delete an Appointment (DELETE)
```bash
curl -X DELETE http://localhost:3000/appointments/1
```
*PowerShell:*
```powershell
Invoke-RestMethod -Uri http://localhost:3000/appointments/1 -Method DELETE
```

### 5. Testing Validation & Error Handling
Sending missing fields returns `400 Bad Request`:
```bash
curl -X POST http://localhost:3000/appointments \
  -H "Content-Type: application/json" \
  -d '{"patientName": "Jane Doe"}'
```
Accessing an unknown appointment returns `404 Not Found`:
```bash
curl -X PUT http://localhost:3000/appointments/9999 \
  -H "Content-Type: application/json" \
  -d '{"patientName": "Test", "age": 30, "doctor": "Dr. A", "appointmentDate": "2026-11-20", "appointmentTime": "10:00 AM", "reason": "Check"}'
```

