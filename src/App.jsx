import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import Calendar from './components/Calendar';
import Timeline from './components/Timeline';

function App() {
  const [user, setUser] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());

  // Fake data for demonstration (covering many days in months 4-7, 2025)
  const appointments = [
    // April 2025
    { name: 'Meeting', start: '10:30', end: '12:45', date: '2025-04-01' },
    { name: 'Lunch', start: '13:00', end: '15:50', date: '2025-04-01' },
    { name: 'Workshop', start: '15:00', end: '17:00', date: '2025-04-02' },
    { name: 'Late Task', start: '20:00', end: '23:00', date: '2025-04-02' },
    { name: 'Night Shift', start: '22:00', end: '24:00', date: '2025-04-03' },
    { name: 'Morning Brief', start: '08:00', end: '09:00', date: '2025-04-03' },
    { name: 'Team Sync', start: '09:30', end: '10:30', date: '2025-04-04' },
    { name: 'Design Review', start: '14:00', end: '15:00', date: '2025-04-04' },
    // May 2025
    { name: '1:1', start: '11:00', end: '11:30', date: '2025-05-05' },
    { name: 'Wrap Up', start: '16:00', end: '17:00', date: '2025-05-05' },
    { name: 'Planning', start: '09:00', end: '10:00', date: '2025-05-06' },
    { name: 'Retrospective', start: '15:00', end: '16:00', date: '2025-05-06' },
    { name: 'Demo', start: '13:00', end: '14:00', date: '2025-05-07' },
    { name: 'Support', start: '10:00', end: '12:00', date: '2025-05-08' },
    // June 2025
    { name: 'Check-in', start: '09:00', end: '09:30', date: '2025-06-09' },
    { name: 'Night Shift', start: '22:00', end: '24:00', date: '2025-06-10' },
    { name: 'Sprint Start', start: '09:00', end: '10:00', date: '2025-06-11' },
    { name: 'Code Review', start: '14:00', end: '15:30', date: '2025-06-12' },
    { name: 'Brainstorm', start: '11:00', end: '12:00', date: '2025-06-13' },
    // July 2025
    { name: 'Release', start: '10:00', end: '11:00', date: '2025-07-01' },
    { name: 'Hotfix', start: '15:00', end: '16:00', date: '2025-07-02' },
    { name: 'All Hands', start: '09:00', end: '10:30', date: '2025-07-03' },
    { name: 'Wrap Up', start: '16:00', end: '17:00', date: '2025-07-04' },
    { name: 'Night Shift', start: '22:00', end: '24:00', date: '2025-07-05' },
    { name: 'Morning Brief', start: '08:00', end: '09:00', date: '2025-07-06' },
    { name: 'Team Sync', start: '09:30', end: '10:30', date: '2025-07-07' },
    { name: 'Design Review', start: '14:00', end: '15:00', date: '2025-07-08' },
  ];

  const handleLogin = (username) => {
    setUser(username);
  };

  const handleDateClick = (date) => {
    setSelectedDate(date);
  };

  const filteredAppointments = appointments.filter(
    (appt) => appt.date === selectedDate.toISOString().split('T')[0]
  );

  return (
    <Router>
      <div
        style={{
          height: '100vh',
          width: '100vw',
          background: 'linear-gradient(135deg, #f3e5f5, #e1f5fe)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          overflow: 'hidden', // prevent scroll on the whole app
        }}
      >
        <Routes>
          <Route
            path="/"
            element={
              user ? (
                <div style={{ display: 'flex', height: '90vh', width: '100vw', maxWidth: '1600px', maxHeight: '900px', background: 'transparent' }}>
                  <div style={{ flex: 1, borderRight: '1px solid #ddd', padding: '1rem', minWidth: 0 }}>
                    <Calendar
                      onDateClick={handleDateClick}
                      appointments={appointments}
                      username={user}
                    />
                  </div>
                  <div style={{ flex: 2, padding: '1rem', minWidth: 0, height: '100%' }}>
                    <div
                      style={{
                        height: '100%',
                        width: '100%',
                        overflowX: 'auto',
                        overflowY: 'auto',
                        borderRadius: '12px',
                        background: 'transparent',
                        boxSizing: 'border-box',
                        display: 'flex',
                        flexDirection: 'column',
                      }}
                    >
                      <Timeline selectedDate={selectedDate} appointments={filteredAppointments} />
                    </div>
                  </div>
                </div>
              ) : (
                <Login onLogin={handleLogin} />
              )
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
