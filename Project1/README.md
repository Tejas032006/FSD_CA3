# MediBook – Hospital Appointment Management System
**Program 1 of 5** | Built with **HTML5, CSS3, and Vanilla JavaScript**

---

## 🏥 Project Overview

**MediBook** is a responsive, browser-based Hospital Appointment Management System engineered with modern healthcare SaaS aesthetics. It allows hospital administrators, receptionists, and clinical coordinators to explore medical specialists, schedule patient consultations, track appointments, and update clinical visit statuses across departments.

The user interface follows a professional medical design system utilizing navy blue (`#0c2340`), clinical white (`#ffffff`), sky blue accents (`#0284c7`), subtle drop shadows, responsive layouts, and accessible typography.

---

## 📁 Project Structure

```
Project1/
├── css/
│   └── style.css          # Professional medical SaaS design tokens, layouts & components
├── js/
│   ├── doctors.js         # Fetch API doctor retrieval, card generation, search & filtering
│   ├── appointments.js    # Mock REST API service (GET/POST/PUT/DELETE), validation & table
│   └── app.js             # SPA navigation router, toast notifications & coordinator
├── doctors.json           # Clinical specialist dataset with qualifications & timings
├── index.html             # Semantic single-page application structure & dialogs
└── README.md              # Documentation and execution instructions
```

---

## ✨ Features & Sections

### 1. Clinical Dashboard (Section A)
- **Welcome Command Center:** Dynamic greeting with real-time date indicator and clinical notice.
- **KPI Statistics Cards:** Real-time counters for:
  - Total Appointments
  - Scheduled Appointments
  - Completed Appointments
  - Cancelled Appointments
- **Recent Bookings Table:** Live overview of the latest 5 patient consultations.
- **Active Specialty Clinics:** Quick view of active departments and room allocations.

### 2. Doctors Directory (Section B)
- **Asynchronous Data Loading:** Loaded dynamically from `doctors.json` using the Fetch API (`async/await`).
- **Rich Doctor Cards:** Displays doctor name, specialization, qualifications, years of experience, patient rating, consultation days, OPD timings, room number, and consultation fee.
- **Real-Time Search:** Live debounced search across doctor names, departments, and qualifications.
- **Specialization Filter:** Dropdown dynamically populated with available hospital specialties (Cardiology, Neurology, Pediatrics, Orthopedics, Dermatology, etc.).
- **Quick Booking Link:** "Book Appointment" button on each card automatically navigates to the booking form and pre-selects the chosen doctor.

### 3. Book Appointment Form (Section C)
- **Patient Registration Fields:**
  - Full Name (minimum 3 characters, alphabetic format).
  - Age (1 to 120 years).
  - Email Address (RFC-compliant email validation).
  - 10-Digit Mobile Number (Indian mobile format: starts with 6–9).
  - Doctor Selection (dynamically populated dropdown with doctor preview).
  - Appointment Date (past dates disabled dynamically; date picker restricted).
  - Appointment Time Slot (selectable clinical time slots).
  - Reason for Consultation (minimum 5 characters).
- **Client-Side Validation:** Real-time on-blur and on-submit error messages rendered beneath invalid fields.
- **Toast Notifications:** Feedback alerts on successful booking or validation issues.

### 4. Appointment Management (Section D)
- **Interactive Data Table:** Lists appointments with token reference IDs, patient demographics, doctor & department, date/slot, reason, and status badges.
- **Live Search & Filters:**
  - Search by patient name, phone number, doctor name, or token ID.
  - Filter by status (`All`, `Scheduled`, `Completed`, `Cancelled`).
  - Sort by date (earliest/latest), patient name (A–Z / Z–A), or status.
- **Action Capabilities:**
  - **View Details:** Opens a modal dialog with complete clinical information.
  - **Edit Record:** Update patient details, doctor, date, time slot, reason, or status via an edit modal (simulates `PUT`).
  - **Quick Status Toggle:** Change status directly from the table row dropdown (simulates `PUT`).
  - **Delete Record:** Permanent deletion with confirmation prompt (simulates `DELETE`).

---

## 🛠️ Technical Implementation

### 1. DOM Manipulation
- Doctor cards, appointment rows, and dashboard KPI statistics are generated entirely with vanilla JavaScript DOM APIs (`document.createElement`, `DocumentFragment`, `appendChild`, and template literals with HTML escaping).
- XSS prevention is enforced using custom character escaping for all dynamic data rendering.

### 2. Event Handling
- Event listeners (`addEventListener`) manage:
  - Form submission and real-time input validation (`submit`, `blur`, `input`).
  - Search inputs and filter dropdown changes (`input`, `change`).
  - Sorting and status updates (`change`).
  - Modal open/close actions and backdrop dismissals (`click`, `keydown` Escape).
  - SPA navigation and mobile hamburger toggle (`click`, `popstate`).

### 3. Fetch API & JSON
- Doctor data is fetched from `doctors.json` using native `fetch()` configured with `method: 'GET'`:
  ```javascript
  const response = await fetch('doctors.json', {
    method: 'GET',
    headers: { 'Accept': 'application/json' }
  });
  ```
- Graceful error handling is implemented with `try...catch`, showing loading spinners and retry states when network or fetch errors occur.

### 4. Mock REST API Service
To demonstrate RESTful API architectural principles locally within the browser:
- `AppointmentAPIService` implements a structured API service simulating standard HTTP methods:
  - **`GET /api/appointments`**: Retrieves appointment list.
  - **`GET /api/appointments/:id`**: Retrieves specific appointment by ID.
  - **`POST /api/appointments`**: Creates new appointment, assigns ID, persists data.
  - **`PUT /api/appointments/:id`**: Updates appointment details or status.
  - **`DELETE /api/appointments/:id`**: Removes record permanently.
- Returns structured HTTP-like JSON responses:
  ```json
  {
    "status": 200,
    "ok": true,
    "message": "Appointment updated successfully",
    "data": { ... }
  }
  ```
- Simulates realistic network latency asynchronously via `Promise` delays.

### 5. Data Persistence
- Appointments persist across page reloads using browser `localStorage` under the key `medibook_appointments`.
- Uses `JSON.parse()` and `JSON.stringify()` for serialization.
- Seeds 5 sample appointments on first visit so all dashboard metrics and management views are immediately testable.

---

## 🚀 How to Run the Application

Because modern web browsers block `fetch()` requests to local files (`file:///` protocol) under Cross-Origin Resource Sharing (CORS) security policies, **the application must be launched using a local web server**.

### Option A: VS Code Live Server (Recommended)
1. Open the project folder `c:\Users\Tejas\Project\FSD_CA3\Project1` in VS Code.
2. Right-click `index.html` and select **"Open with Live Server"**.
3. The app will open at `http://127.0.0.1:5500/index.html`.

### Option B: Python Built-In HTTP Server
Open PowerShell in the `Project1` directory and run:
```powershell
python -m http.server 8000
```
Then navigate to: [http://localhost:8000](http://localhost:8000)

### Option C: Node.js `npx serve` or `http-server`
```powershell
npx serve .
```

---

## 📋 Verification Checklist

- [x] Responsive layout tested for desktop, tablet, and mobile breakpoints.
- [x] Doctor data successfully fetched from `doctors.json`.
- [x] Doctor search and specialization filtering working seamlessly.
- [x] Client-side form validation active with error messages beneath fields.
- [x] Past dates prevented in date pickers.
- [x] Appointment creation (`POST`) saves to `localStorage` and updates stats.
- [x] Appointment search, filter, and sorting fully operational.
- [x] Appointment editing (`PUT`) and inline status toggling working.
- [x] Appointment deletion (`DELETE`) confirmed with confirmation dialog.
- [x] Dashboard KPI statistics update in real-time.
- [x] No external CSS or JS libraries used (pure HTML5, CSS3, Vanilla JS).

---

## ℹ️ Notes & Limitations
- This application simulates backend REST operations asynchronously in the client's browser using `localStorage`. No actual remote server or database is required.
- SMS and email confirmations are simulated via on-screen toast notifications and token generation.

