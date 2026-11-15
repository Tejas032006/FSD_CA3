import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import Sidebar from './components/Sidebar.jsx';
import Dashboard from './pages/Dashboard.jsx';
import BookAppointment from './pages/BookAppointment.jsx';
import Appointments from './pages/Appointments.jsx';
import {
  getAppointments,
  createAppointment,
  updateAppointmentStatus,
  deleteAppointment
} from './services/api.js';

/**
 * Main App Component – Full Stack Application Shell
 * Connects React frontend to Express.js & PostgreSQL backend via REST API.
 */
function App() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Load appointments from Express & PostgreSQL backend on component mount
  const fetchAppointments = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getAppointments();
      setAppointments(data);
    } catch (err) {
      console.error('[API ERROR] Failed to load appointments:', err.message);
      setError(err.message || 'Unable to connect to the backend server.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  // Handler: Add new appointment (POST to PostgreSQL via backend API)
  const handleAddAppointment = async (appointmentData) => {
    try {
      const created = await createAppointment(appointmentData);
      setAppointments((prev) => [created, ...prev]);
      return { success: true, data: created };
    } catch (err) {
      console.error('[API ERROR] Failed to create appointment:', err.message);
      return { success: false, error: err.message };
    }
  };

  // Handler: Update status (PUT to PostgreSQL via backend API)
  const handleUpdateStatus = async (id, newStatus) => {
    try {
      const updated = await updateAppointmentStatus(id, newStatus);
      setAppointments((prev) =>
        prev.map((item) => (item.id === id ? { ...item, status: newStatus } : item))
      );
      return { success: true, data: updated };
    } catch (err) {
      console.error('[API ERROR] Failed to update status:', err.message);
      // Revert or inform user
      fetchAppointments();
      return { success: false, error: err.message };
    }
  };

  // Handler: Delete appointment (DELETE from PostgreSQL via backend API)
  const handleDeleteAppointment = async (id) => {
    try {
      await deleteAppointment(id);
      setAppointments((prev) => prev.filter((item) => item.id !== id));
      return { success: true };
    } catch (err) {
      console.error('[API ERROR] Failed to delete appointment:', err.message);
      return { success: false, error: err.message };
    }
  };

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

        {/* Main Application Content Area */}
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
                    loading={loading}
                    error={error}
                    onRefresh={fetchAppointments}
                    onUpdateStatus={handleUpdateStatus}
                  />
                }
              />

              {/* Route 2: Book Appointment (/book) */}
              <Route
                path="/book"
                element={
                  <BookAppointment
                    onAddAppointment={handleAddAppointment}
                  />
                }
              />

              {/* Route 3: Appointments Listing (/appointments) */}
              <Route
                path="/appointments"
                element={
                  <Appointments
                    appointments={appointments}
                    loading={loading}
                    error={error}
                    onRefresh={fetchAppointments}
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
