import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import Calendar from './components/Calendar';
import Timeline from './components/Timeline';

function App() {
  const [user, setUser] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [appointments, setAppointments] = useState([
    { date: '2023-11-01', name: 'Meeting', start: '10:00 AM', end: '11:00 AM', location: 'Room A' },
    { date: '2023-11-01', name: 'Lunch', start: '12:00 PM', end: '1:00 PM', location: 'Cafeteria' },
  ]);

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
        }}
      >
        <Routes>
          <Route
            path="/"
            element={
              user ? (
                <div style={{ display: 'flex', height: '100%', width: '100%' }}>
                  <div style={{ flex: 1, borderRight: '1px solid #ddd', padding: '1rem' }}>
                    <Calendar
                      onDateClick={handleDateClick}
                      appointments={appointments}
                      username={user}
                    />
                  </div>
                  <div style={{ flex: 2, padding: '1rem' }}>
                    <Timeline selectedDate={selectedDate} appointments={filteredAppointments} />
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
