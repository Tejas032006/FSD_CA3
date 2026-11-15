import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import Sidebar from './components/Sidebar.jsx';
import Dashboard from './pages/Dashboard.jsx';
import BookAppointment from './pages/BookAppointment.jsx';
import Appointments from './pages/Appointments.jsx';

/**
 * Initial sample appointment records for first-time launch demonstration.
 * Ensures the dashboard and appointment listing are not initially empty.
 */
const INITIAL_SAMPLE_APPOINTMENTS = [
  {
    id: 'APT-100201',
    patientName: 'Eleanor Vance',
    age: 38,
    email: 'eleanor.vance@example.com',
    phone: '9876541200',
    doctorName: 'Dr. Sarah Jenkins (Cardiology)',
    appointmentDate: '2026-11-18',
    appointmentTime: '10:00 AM',
    reason: 'Follow-up consultation for blood pressure stabilization and annual ECG review.',
    status: 'Scheduled',
    createdAt: '2026-11-14T08:30:00.000Z'
  },
  {
    id: 'APT-100202',
    patientName: 'Marcus Sterling',
    age: 52,
    email: 'marcus.sterling@example.com',
    phone: '9812345678',
    doctorName: 'Dr. Rajesh Sharma (Neurology)',
    appointmentDate: '2026-11-16',
    appointmentTime: '11:30 AM',
    reason: 'Recurring migraine episodes and persistent tension headaches over 3 weeks.',
    status: 'Scheduled',
    createdAt: '2026-11-14T09:15:00.000Z'
  },
  {
    id: 'APT-100203',
    patientName: 'Aarav Sharma',
    age: 7,
    email: 'sharma.family@example.com',
    phone: '9823456789',
    doctorName: 'Dr. Priya Nair (Pediatrics)',
    appointmentDate: '2026-11-12',
    appointmentTime: '09:30 AM',
    reason: 'Routine childhood immunization booster shot and developmental checkup.',
    status: 'Completed',
    createdAt: '2026-11-10T10:00:00.000Z'
  },
  {
    id: 'APT-100204',
    patientName: 'Rohit Verma',
    age: 44,
    email: 'rohit.verma@example.com',
    phone: '9765432109',
    doctorName: 'Dr. Michael Chang (Orthopedics)',
    appointmentDate: '2026-11-11',
    appointmentTime: '02:00 PM',
    reason: 'Right knee arthroscopy follow-up and physical therapy progress assessment.',
    status: 'Completed',
    createdAt: '2026-11-09T14:20:00.000Z'
  },
  {
    id: 'APT-100205',
    patientName: 'Natasha Gupta',
    age: 29,
    email: 'natasha.gupta@example.com',
    phone: '9988776655',
    doctorName: 'Dr. Ananya Sengupta (Dermatology)',
    appointmentDate: '2026-11-10',
    appointmentTime: '03:30 PM',
    reason: 'Patient had emergency travel; requested cancellation and rescheduling for next month.',
    status: 'Cancelled',
    createdAt: '2026-11-08T11:10:00.000Z'
  }
];

const LOCAL_STORAGE_KEY = 'medibook_react_appointments';

/**
 * Main App Component – Application Layout and State Management
 * Demonstrates:
 * - Functional Components
 * - React Router (BrowserRouter, Routes, Route)
 * - useState for appointment state and mobile drawer state
 * - useEffect for loading initial data and local storage synchronization
 * - Props passing to child components
 */
function App() {
  // 1. Appointments State: load from localStorage if available, otherwise use initial sample data
  const [appointments, setAppointments] = useState(() => {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.error('Failed to load appointments from localStorage:', e);
    }
    return INITIAL_SAMPLE_APPOINTMENTS;
  });

  // 2. Mobile Sidebar Drawer State
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // 3. useEffect: Synchronize appointment data to localStorage whenever appointments state updates
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(appointments));
    } catch (e) {
      console.error('Failed to save appointments to localStorage:', e);
    }
  }, [appointments]);

  // Handler: Add new appointment
  const handleAddAppointment = (newAppointment) => {
    setAppointments((prev) => [newAppointment, ...prev]);
  };

  // Handler: Update appointment status (Scheduled, Completed, Cancelled)
  const handleUpdateStatus = (id, newStatus) => {
    setAppointments((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, status: newStatus } : item
      )
    );
  };

  // Handler: Delete appointment record
  const handleDeleteAppointment = (id) => {
    setAppointments((prev) => prev.filter((item) => item.id !== id));
  };

  // Mobile drawer handlers
  const handleToggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  const handleCloseSidebar = () => {
    setIsSidebarOpen(false);
  };

  return (
    <BrowserRouter>
      <div className="app-container">
        {/* Navigation Sidebar */}
        <Sidebar isOpen={isSidebarOpen} onClose={handleCloseSidebar} />

        {/* Main Application Area */}
        <div className="app-main">
          {/* Top Navbar */}
          <Navbar onToggleSidebar={handleToggleSidebar} />

          {/* Router Content Container */}
          <main className="content-area">
            <Routes>
              {/* Route 1: Dashboard (/) */}
              <Route
                path="/"
                element={
                  <Dashboard
                    appointments={appointments}
                    onUpdateStatus={handleUpdateStatus}
                  />
                }
              />

              {/* Route 2: Book Appointment (/book) */}
              <Route
                path="/book"
                element={
                  <BookAppointment onAddAppointment={handleAddAppointment} />
                }
              />

              {/* Route 3: Appointments Listing (/appointments) */}
              <Route
                path="/appointments"
                element={
                  <Appointments
                    appointments={appointments}
                    onUpdateStatus={handleUpdateStatus}
                    onDelete={handleDeleteAppointment}
                  />
                }
              />
            </Routes>
          </main>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;

