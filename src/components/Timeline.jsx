import './Timeline.css';

function Timeline({ selectedDate, appointments }) {
  // Show all 25 hours (0-24)
  const hours = Array.from({ length: 25 }, (_, i) => i);

  // Fake data for demonstration (covering 10h-24h)
  const fakeAppointments = [
    { name: 'Meeting', start: '10:00', end: '12:00', date: selectedDate.toISOString().split('T')[0] },
    { name: 'Lunch', start: '13:00', end: '14:00', date: selectedDate.toISOString().split('T')[0] },
    { name: 'Workshop', start: '15:00', end: '17:00', date: selectedDate.toISOString().split('T')[0] },
    { name: 'Late Task', start: '20:00', end: '23:00', date: selectedDate.toISOString().split('T')[0] },
    { name: 'Night Shift', start: '22:00', end: '24:00', date: selectedDate.toISOString().split('T')[0] },
  ];

  const filteredAppointments = fakeAppointments.filter(
    (appt) => appt.date === selectedDate.toISOString().split('T')[0]
  );

  const hourWidth = 80; // px
  const timelineMinWidth = hourWidth * 25; // 25 hours
  const rowHeight = 40;
  const timelineHeight = Math.max(filteredAppointments.length, 1) * rowHeight;

  return (
    <div
      style={{
        background: 'linear-gradient(135deg, #f3e5f5, #e1f5fe)',
        borderRadius: '12px',
        boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
        color: '#333',
        fontFamily: 'Arial, sans-serif',
        height: '100%',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        minWidth: 0,
        overflow: 'hidden',
        padding: 0,
      }}
    >
      <div
        style={{
          padding: '1rem',
          flex: '0 0 auto',
        }}
      >
        <h2 style={{ fontSize: '1.5rem', color: '#6a1b9a', fontWeight: 'bold', margin: 0 }}>
          Timeline
        </h2>
        <h3 style={{ margin: 0, color: '#4a148c', fontWeight: 400 }}>{selectedDate.toDateString()}</h3>
      </div>
      <div
        style={{
          flex: 1,
          minHeight: 0,
          minWidth: 0,
          width: '100%',
          height: '100%',
          overflow: 'auto', // scroll only in this main timeline area
          display: 'flex',
        }}
      >
        {/* Appointment labels */}
        <div
          style={{
            width: '120px',
            minWidth: '120px',
            display: 'flex',
            flexDirection: 'column',
            borderRight: '1px solid #ddd',
            background: 'rgba(255,255,255,0.8)',
            zIndex: 1,
            height: 'fit-content',
          }}
        >
          {filteredAppointments.length > 0 ? (
            filteredAppointments.map((appt, index) => (
              <div
                key={index}
                style={{
                  height: `${rowHeight}px`,
                  lineHeight: `${rowHeight}px`,
                  textAlign: 'center',
                  fontWeight: 'bold',
                  color: '#4a148c',
                  borderBottom: '1px solid #ddd',
                  background: 'rgba(255,255,255,0.8)',
                }}
              >
                {appt.name}
              </div>
            ))
          ) : (
            <div
              style={{
                height: `${rowHeight}px`,
                lineHeight: `${rowHeight}px`,
                textAlign: 'center',
                fontWeight: 'bold',
                color: '#4a148c',
                borderBottom: '1px solid #ddd',
                background: 'rgba(255,255,255,0.8)',
              }}
            >
              No Appointments
            </div>
          )}
        </div>
        {/* Timeline grid and scrollable area */}
        <div
          style={{
            flex: 1,
            minWidth: 0,
            position: 'relative',
            background: '#fff',
            borderRadius: '0 8px 8px 0',
            borderLeft: 'none',
            maxWidth: '100%',
            height: timelineHeight,
          }}
        >
          {/* Hour labels (sticky at top of scroll area) */}
          <div
            style={{
              position: 'sticky',
              top: 0,
              zIndex: 3,
              background: 'rgba(255,255,255,0.8)',
              borderBottom: '1px solid #ddd',
              minWidth: `${timelineMinWidth}px`,
              height: '20px',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            {hours.map((hour) => (
              <div
                key={hour}
                style={{
                  width: `${hourWidth}px`,
                  minWidth: `${hourWidth}px`,
                  textAlign: 'center',
                  fontWeight: 'bold',
                  color: '#4a148c',
                  fontSize: '0.9rem',
                  borderRight: hour !== 24 ? '1px solid #eee' : 'none',
                  position: 'relative',
                }}
              >
                {hour}:00
              </div>
            ))}
          </div>
          {/* Gantt grid and rows */}
          <div
            style={{
              position: 'relative',
              minWidth: `${timelineMinWidth}px`,
              background: 'rgba(255,255,255,0.8)',
              height: timelineHeight,

              maxWidth: '100%',
            }}
          >
            {/* Vertical grid lines */}
            {hours.map((hour) => (
              <div
                key={hour}
                style={{
                  position: 'absolute',
                  left: `${hour * hourWidth}px`,
                  top: 0,
                  width: '1px',
                  height: '100%',
                  background: '#ddd',
                  zIndex: 1,
                }}
              />
            ))}
            {/* Horizontal grid lines */}
            {Array.from({ length: Math.max(filteredAppointments.length, 1) + 1 }, (_, i) => (
              <div
                key={i}
                style={{
                  position: 'absolute',
                  left: 0,
                  top: `${i * rowHeight}px`,
                  width: '100%',
                  height: '1px',
                  background: '#ddd',
                  zIndex: 1,
                }}
              />
            ))}
            {/* Gantt bars */}
            {filteredAppointments.length > 0 ? (
              filteredAppointments.map((appt, index) => {
                const startHour = parseInt(appt.start.split(':')[0], 10);
                const endHour = parseInt(appt.end.split(':')[0], 10);
                const left = `${startHour * hourWidth}px`;
                const width = `${(endHour - startHour) * hourWidth}px`;
                return (
                  <div
                    key={index}
                    style={{
                      position: 'absolute',
                      top: `${index * rowHeight}px`,
                      left,
                      width,
                      height: `${rowHeight}px`,
                      background: '#ba68c8',
                      borderRadius: '4px',
                      color: 'white',
                      textAlign: 'center',
                      lineHeight: `${rowHeight}px`,
                      fontSize: '0.9rem',
                      fontWeight: 'bold',
                      zIndex: 2,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {appt.name}
                  </div>
                );
              })
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Timeline;
