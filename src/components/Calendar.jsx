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

    for (let day = startOfMonth; day <= endOfMonth; day.setDate(day.getDate() + 1)) {
      const dayAppointments = appointments.filter(
        (appt) => appt.date === day.toISOString().split('T')[0]
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
          }}
          onClick={() => onDateClick(new Date(day))}
        >
          <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#4a148c' }}>
            {day.getDate()}
          </div>
          {dayAppointments.map((appt, index) => (
            <div
              key={index}
              style={{
                fontSize: '0.8rem',
                marginTop: '0.2rem',
                color: '#6a1b9a',
              }}
            >
              {appt.name} ({appt.start}: {appt.end})
            </div>
          ))}
        </div>
      );
    }
    return days;
  };

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
        {renderDays()}
      </div>
    </div>
  );
}

export default Calendar;
