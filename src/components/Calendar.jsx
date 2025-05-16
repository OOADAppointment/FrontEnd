import { useState } from 'react';

function Calendar({ onDateClick, appointments, username }) {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const handlePrevMonth = () => {
    setCurrentMonth(new Date(currentMonth.setMonth(currentMonth.getMonth() - 1)));
  };

  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.setMonth(currentMonth.getMonth() + 1)));
  };

  const renderDays = () => {
    const days = [];
    const startOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
    const endOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0);

    // Determine the day of week for the first day (0=Sunday, 1=Monday,...)
    let startDay = startOfMonth.getDay();
    // Adjust so that Monday is the first column (0=Monday, 6=Sunday)
    startDay = (startDay + 6) % 7;

    // Add empty cells for days before the first of the month
    for (let i = 0; i < startDay; i++) {
      days.push(<div key={`empty-${i}`} />);
    }

    for (let day = new Date(startOfMonth); day <= endOfMonth; day.setDate(day.getDate() + 1)) {
      const dayStr = day.toISOString().split('T')[0];
      const dayAppointments = appointments.filter(
        (appt) => appt.date === dayStr
      );

      days.push(
        <div
          key={day.toISOString()}
          style={{
            background: 'rgba(255, 255, 255, 0.8)',
            border: '1px solid #ccc',
            borderRadius: '8px',
            padding: '0.5rem',
            textAlign: 'center',
            position: 'relative',
            cursor: 'pointer',
            boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
            minWidth: '20px',
            minHeight: '20px',
            maxWidth: '60px',
            maxHeight: '60px',
            width: '70%',
            aspectRatio: '1 / 1',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto',
            transition: 'background 0.2s, box-shadow 0.2s',
          }}
          onClick={() => onDateClick(new Date(dayStr))}
        >
          <div
            style={{
              fontSize: '1.2rem',
              fontWeight: 'bold',
              color: '#4a148c',
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              height: '28px',
            }}
          >
            {day.getDate()}
          </div>
          {/* Appointment count below day number, smaller and closer */}
          <div
            style={{
              fontSize: '0.7rem',
              color: '#ba68c8',
              marginTop: '1px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.1rem',
              width: '100%',
              minHeight: '14px',
              lineHeight: '1',
            }}
          >
            {dayAppointments.length > 0 && (
              <>
                {dayAppointments.length}
                <span style={{ fontSize: '0.85rem', marginLeft: '2px' }} title="Appointments">📅</span>
              </>
            )}
          </div>
        </div>
      );
    }
    return days;
  };

  // Days of week header (Monday to Sunday)
  const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  return (
    <div
      style={{
        background: 'linear-gradient(135deg, #f3e5f5, #e1f5fe)',
        padding: '1rem',
        borderRadius: '12px',
        color: '#333',
        fontFamily: 'Arial, sans-serif',
        boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
      }}
    >
      <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
        <h2 style={{ fontSize: '2rem', color: '#6a1b9a', fontWeight: 'bold' }}>Calendar</h2>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            margin: '0.5rem 0',
            fontSize: '1rem',
            color: '#4a148c',
          }}
        >
          <span>
            Username: <b>{username}</b>
          </span>
          <span>Today: {new Date().toLocaleDateString()}</span>
        </div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <button
            onClick={handlePrevMonth}
            style={{
              background: '#ba68c8',
              border: 'none',
              padding: '0.5rem 1rem',
              cursor: 'pointer',
              borderRadius: '8px',
              color: 'white',
              fontWeight: 'bold',
            }}
          >
            Previous
          </button>
          <h3>{currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' })}</h3>
          <button
            onClick={handleNextMonth}
            style={{
              background: '#ba68c8',
              border: 'none',
              padding: '0.5rem 1rem',
              cursor: 'pointer',
              borderRadius: '8px',
              color: 'white',
              fontWeight: 'bold',
            }}
          >
            Next
          </button>
        </div>
      </div>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(7, 1fr)',
          gap: '0.5rem',
          marginTop: '1rem',
        }}
      >
        {/* Days of week header */}
        {weekDays.map((wd) => (
          <div
            key={wd}
            style={{
              fontWeight: 'bold',
              color: '#6a1b9a',
              background: 'rgba(255,255,255,0.95)',
              borderRadius: '8px',
              textAlign: 'center',
              padding: '0.3rem 0',
              border: '1px solid #eee',
              minHeight: '40px',
            }}
          >
            {wd}
          </div>
        ))}
        {renderDays()}
      </div>
    </div>
  );
}

export default Calendar;
