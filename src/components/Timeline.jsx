import './Timeline.css';

function Timeline({ selectedDate, appointments }) {
  const hours = Array.from({ length: 25 }, (_, i) => i); // Generate hours from 0 to 24

  // Fake data for demonstration
  const fakeAppointments = [
    { name: 'Meeting', start: '10:00', end: '12:00', date: selectedDate.toISOString().split('T')[0] },
    { name: 'Lunch', start: '13:00', end: '14:00', date: selectedDate.toISOString().split('T')[0] },
    { name: 'Workshop', start: '15:00', end: '17:00', date: selectedDate.toISOString().split('T')[0] },
  ];

  const filteredAppointments = fakeAppointments.filter(
    (appt) => appt.date === selectedDate.toISOString().split('T')[0]
  );

  const renderGanttRow = (appt) => {
    const startHour = parseInt(appt.start.split(':')[0], 10);
    const endHour = parseInt(appt.end.split(':')[0], 10);
    const left = `${(startHour / 24) * 100}%`;
    const width = `${((endHour - startHour) / 24) * 100}%`;

    return (
      <div
        key={appt.name}
        style={{
          position: 'absolute',
          left,
          width,
          height: '100%',
          background: '#ba68c8',
          borderRadius: '4px',
          color: 'white',
          textAlign: 'center',
          lineHeight: '40px',
          fontSize: '0.9rem',
          fontWeight: 'bold',
        }}
      >
        {appt.name}
      </div>
    );
  };

  return (
    <div
      style={{
        background: 'linear-gradient(135deg, #f3e5f5, #e1f5fe)',
        padding: '1rem',
        borderRadius: '12px',
        boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
        color: '#333',
        fontFamily: 'Arial, sans-serif',
      }}
    >
      <h2 style={{ fontSize: '1.5rem', color: '#6a1b9a', fontWeight: 'bold', marginBottom: '1rem' }}>
        Timeline
      </h2>
      <h3 style={{ marginBottom: '1rem', color: '#4a148c' }}>{selectedDate.toDateString()}</h3>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 12fr', // Add a column for appointment labels
          overflowX: 'auto',
          whiteSpace: 'nowrap',
          border: '1px solid #ddd',
          borderRadius: '8px',
          background: '#fff',
          position: 'relative',
        }}
      >
        {/* Render hour labels */}
        <div
          style={{
            gridColumn: '2 / -1',
            position: 'relative',
            height: '20px',
            display: 'flex',
            alignItems: 'center',
            borderBottom: '1px solid #ddd',
          }}
        >
          {hours.map((hour) => (
            <div
              key={hour}
              style={{
                position: 'absolute',
                left: `${(hour / 12) * 100}%`, // Adjusted to fit 12 hours in view
                transform: 'translateX(-50%)',
                fontWeight: 'bold',
                color: '#4a148c',
                fontSize: '0.9rem',
              }}
            >
              {hour}:00
            </div>
          ))}
        </div>

        {/* Render grid lines */}
        <div
          style={{
            gridColumn: '2 / -1',
            display: 'flex',
            position: 'relative',
            height: `${filteredAppointments.length * 40 || 40}px`,
            borderTop: '1px solid #ddd',
          }}
        >
          {hours.map((hour) => (
            <div
              key={hour}
              style={{
                flex: '0 0 8.33%', // Adjusted to fit 12 hours in view
                borderRight: hour !== 24 ? '1px solid #ddd' : 'none',
              }}
            ></div>
          ))}
        </div>

        {/* Render appointment labels */}
        <div
          style={{
            gridColumn: '1 / 2',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            borderRight: '1px solid #ddd',
            background: 'rgba(255, 255, 255, 0.8)',
          }}
        >
          {filteredAppointments.length > 0 ? (
            filteredAppointments.map((_, index) => (
              <div
                key={index}
                style={{
                  height: '40px',
                  lineHeight: '40px',
                  textAlign: 'center',
                  fontWeight: 'bold',
                  color: '#4a148c',
                }}
              >
                Appointment {index + 1}
              </div>
            ))
          ) : (
            <div
              style={{
                height: '40px',
                lineHeight: '40px',
                textAlign: 'center',
                fontWeight: 'bold',
                color: '#4a148c',
              }}
            >
              No Appointments
            </div>
          )}
        </div>

        {/* Render appointments */}
        <div
          style={{
            gridColumn: '2 / -1',
            position: 'relative',
            height: `${filteredAppointments.length * 40 || 40}px`,
          }}
        >
          {filteredAppointments.length > 0 ? (
            filteredAppointments.map((appt, index) => (
              <div
                key={index}
                style={{
                  position: 'absolute',
                  top: `${index * 40}px`,
                  width: '100%',
                  height: '40px',
                }}
              >
                {renderGanttRow(appt)}
              </div>
            ))
          ) : (
            <div
              style={{
                textAlign: 'center',
                lineHeight: '40px',
                color: '#4a148c',
                fontWeight: 'bold',
              }}
            >
              No Appointments
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Timeline;
