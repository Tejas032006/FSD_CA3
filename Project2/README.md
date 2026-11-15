# MediBook – Hospital Appointment Management System (React.js)
**Program 2 of 5** | Built with **React.js, React Router DOM, and Pure CSS3**

---

## 🏥 Project Overview

**MediBook (React.js)** is a modern, responsive single-page web application (SPA) developed as part of the Full Stack Development CA3 assignment. It demonstrates core React concepts including functional components, JSX, props, state management with hooks (`useState`, `useEffect`), client-side form validation, conditional rendering, event handling, and client-side routing with `react-router-dom`.

The user interface follows a professional healthcare SaaS dashboard design with a navy blue (`#0c2340`), sky blue (`#0284c7`), and clinical white (`#ffffff`) palette.

---

## 📁 Project Structure

```text
Project2/
│
├── public/
│   └── favicon.svg              # Medical cross hospital favicon
│
├── src/
│   ├── components/
│   │   ├── Navbar.jsx           # Top header navigation & date badge
│   │   ├── Sidebar.jsx          # Collapsible sidebar with NavLinks
│   │   └── AppointmentList.jsx  # Reusable table listing with status selector
│   │
│   ├── pages/
│   │   ├── Dashboard.jsx        # Clinical overview & dynamic KPI statistics
│   │   ├── BookAppointment.jsx  # Controlled appointment entry form & validation
│   │   └── Appointments.jsx     # Records management, search, and status filtering
│   │
│   ├── App.jsx                  # Top-level state, routes, and layout shell
│   ├── App.css                  # Custom healthcare theme & responsive CSS3
│   ├── index.css                # CSS reset and custom design tokens
│   └── main.jsx                 # React DOM entry point
│
├── index.html                   # HTML5 shell
├── package.json                 # Project dependencies & Vite scripts
└── vite.config.js               # Vite bundler configuration
```

---

## 🚀 How to Run the Application

### 1. Install Dependencies
If running on a fresh machine:
```bash
npm install
```

### 2. Start the Development Server
```bash
npm run dev
```

### 3. Open in Browser
Visit:
```text
http://localhost:3000
```
*(or the local port provided in the terminal output)*

### 4. Production Build & Preview
To create and preview the production build:
```bash
npm run build
npm run preview
```

---

## 🧠 React Concepts Implemented

| React Concept | Implementation Details | File(s) |
| :--- | :--- | :--- |
| **Functional Components** | All components are built as modern functional components. | `App.jsx`, `Navbar.jsx`, `Sidebar.jsx`, `AppointmentList.jsx`, `Dashboard.jsx`, `BookAppointment.jsx`, `Appointments.jsx` |
| **JSX** | Clean, accessible JSX structuring forms, tables, icons, and cards without third-party UI libraries. | All `.jsx` files in `src/` |
| **Props** | Data and callback functions (`appointments`, `onUpdateStatus`, `onAddAppointment`, `onDelete`) passed cleanly from parent to child components. | `App.jsx`, `AppointmentList.jsx`, `Dashboard.jsx`, `Appointments.jsx`, `BookAppointment.jsx`, `Navbar.jsx`, `Sidebar.jsx` |
| **`useState` Hook** | Manages appointment records, controlled form fields, validation error objects, search query, status filters, sorting option, and mobile drawer toggle. | `App.jsx`, `BookAppointment.jsx`, `Appointments.jsx` |
| **`useEffect` Hook** | Loads initial data and synchronizes state changes to browser `localStorage` with a dependency array. | `App.jsx` |
| **Conditional Rendering** | Renders validation error messages beneath invalid fields, displays empty states, shows booking success alerts, and toggles active link styling. | `BookAppointment.jsx`, `AppointmentList.jsx`, `Sidebar.jsx` |
| **Event Handling** | `onChange` for inputs and select dropdowns, `onSubmit` for appointment booking, `onClick` for filters, resets, and navigation. | `BookAppointment.jsx`, `AppointmentList.jsx`, `Appointments.jsx`, `Navbar.jsx`, `Sidebar.jsx` |
| **React Router DOM** | Client-side routing with `BrowserRouter`, `Routes`, `Route`, `NavLink`, and `Link` for `/`, `/book`, and `/appointments`. | `App.jsx`, `Sidebar.jsx`, `Navbar.jsx`, `Dashboard.jsx`, `Appointments.jsx`, `AppointmentList.jsx` |
| **Lists & Keys** | Dynamic iteration with `.map()` on appointments and doctor options using unique `key={item.id}` attributes. | `AppointmentList.jsx`, `BookAppointment.jsx` |

---

## 📄 Pages & Features

### 1. Dashboard (`/`)
- Dynamic greeting and healthcare status header.
- **KPI Stat Cards:** Dynamically computed from state for:
  - Total Appointments
  - Scheduled Appointments
  - Completed Appointments
  - Cancelled Appointments
- **Recent Bookings:** Live preview of the last 5 registered consultations.
- **Active Specialty Clinics:** List of operational OPD rooms.

### 2. Book Appointment (`/book`)
- **Controlled Input Fields:**
  - Patient Full Name (minimum 3 characters, letters only)
  - Age (1 to 120 years)
  - Email Address (email pattern validation)
  - 10-Digit Mobile Number
  - Consulting Doctor (dropdown of 8 hospital specialists)
  - Appointment Date (past dates disabled dynamically; min set to today)
  - Time Slot (selectable clinical slots)
  - Reason for Consultation (minimum 5 characters)
- **Inline Error Feedback:** Displays clear red validation messages below invalid fields.
- **Form Reset:** Clears all fields and errors upon successful submission or when clicking "Clear Form".
- **Success Banner:** Confirms booking with newly generated reference token (`APT-XXXXXX`).

### 3. Appointments Management (`/appointments`)
- **Interactive Listing:** Displays all appointments using `<AppointmentList />`.
- **Search:** Real-time search by patient name, phone number, doctor name, or token ID.
- **Status Filter:** Filter by `All`, `Scheduled`, `Completed`, or `Cancelled`.
- **Sort Options:** Sort by Date (Earliest / Latest), Patient Name (A–Z / Z–A), or Status.
- **Inline Status Modification:** Change status between Scheduled, Completed, and Cancelled via dropdown selector.
- **Record Deletion:** Optional deletion button to remove records.
- **Empty State:** Friendly empty state graphic with quick CTA to schedule a visit when no records match.

