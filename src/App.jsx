import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import Calendar from './components/Calendar';
import Timeline from './components/Timeline';
import { getAppointments } from './services/appointment';

function App() {
  // Lưu user vào localStorage để giữ đăng nhập
  const [user, setUser] = useState(() => localStorage.getItem('user') || null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [appointments, setAppointments] = useState([]);

  // Lưu user vào localStorage mỗi khi thay đổi
  useEffect(() => {
    if (user) {
      localStorage.setItem('user', user);
    } else {
      localStorage.removeItem('user');
    }
  }, [user]);

  // Hàm reload lại từ API
  const reloadAppointments = () => {
    getAppointments()
      .then((data) => {
        const mapped = Array.isArray(data) ? data.map(item => ({
          id: item.id,
          owner: item.owner,
          name: item.title,
          location: item.location,
          date: item.startTime.slice(0, 10),
          start: item.startTime.slice(11, 16),
          end: item.endTime.slice(11, 16),
          isGroupMeeting: item.isGroupMeeting,
          members: item.members || [],
          reminderTimes: item.reminderTimes || []
        })) : [];
        setAppointments(mapped);
      })
      .catch(() => setAppointments([]));
  };

  // Lấy dữ liệu từ API khi load app
  useEffect(() => {
    reloadAppointments();
  }, []);

  const handleLogin = (username) => setUser(username);
  const handleDateClick = (date) => setSelectedDate(date);

  // Lọc lịch của user hiện tại (là owner hoặc là thành viên)
  const userAppointments = user && Array.isArray(appointments)
    ? appointments.filter(
        appt =>
          appt.owner === user ||
          (Array.isArray(appt.members) && appt.members.includes(user))
      )
    : [];

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
                        appointments={appointments}
                        onUpdateAppointments={reloadAppointments}
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