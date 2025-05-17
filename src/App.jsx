import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import Calendar from './components/Calendar';
import Timeline from './components/Timeline';

function App() {
  const [user, setUser] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [appointments, setAppointments] = useState([
    {
      owner: 'alice',
      name: 'Meeting',
      start: '10:30',
      end: '12:45',
      date: '2025-04-01',
      members: ['bob']
    },
    {
      owner: 'alice',
      name: 'Lunch',
      start: '13:00',
      end: '15:50',
      date: '2025-04-01',
      members: []
    },
    {
      owner: 'bob',
      name: 'Lunch',
      start: '13:00',
      end: '15:50',
      date: '2025-05-17',
      members: ['alice']
    },
    {
      owner: 'bob',
      name: 'Design Review',
      start: '14:00',
      end: '15:00',
      date: '2025-07-08',
      members: []
    }
  ]);

  const handleLogin = (username) => setUser(username);
  const handleDateClick = (date) => setSelectedDate(date);
  const handleUpdateAppointments = (newAppointments) => setAppointments(newAppointments);

  // Lọc lịch của user hiện tại (là owner hoặc là thành viên)
  const userAppointments = appointments.filter(
    appt => appt.owner === user || (appt.members && appt.members.includes(user))
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
          overflow: 'hidden',
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
                      appointments={userAppointments}
                      username={user}
                    />
                  </div>
                  <div style={{ flex: 3, padding: '1rem', minWidth: 0, height: '100%' }}>
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
                      <Timeline
  selectedDate={selectedDate}
  appointments={appointments} // truyền toàn bộ!
  onUpdateAppointments={handleUpdateAppointments}
  user={user}
/>
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