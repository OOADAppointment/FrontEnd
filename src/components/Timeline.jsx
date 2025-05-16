function Timeline({ selectedDate, appointments }) {
  // Show all 25 hours (0-24)
  const hours = Array.from({ length: 25 }, (_, i) => i);

  // Fake data for demonstration (covering many days in months 4-7, 2025)
  const fakeAppointments = [
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

  // Use selectedDate to filter
  const selectedDateStr = selectedDate.toISOString().split('T')[0];
  const filteredAppointments = fakeAppointments.filter(
    (appt) => appt.date === selectedDateStr
  );

  const hourWidth = 40; // px (smaller grid)
  const timelineMinWidth = hourWidth * 25; // 25 hours
  const rowHeight = 40;
  const minRows = 10;
  const timelineHeight = Math.max(filteredAppointments.length, minRows) * rowHeight;

  return (
    <div
      style={{
        background: 'linear-gradient(135deg, #f3e5f5, #e1f5fe)', // hologram background
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
          padding: '1.2rem 1.5rem 0.5rem 1.5rem',
          flex: '0 0 auto',
          borderBottom: '1px solid #e0e0e0',
          background: 'rgba(255,255,255,0.7)',
          borderTopLeftRadius: '12px',
          borderTopRightRadius: '12px',
          textAlign: 'center', // center align header and date
        }}
      >
        <h2 style={{ fontSize: '1.6rem', color: '#6a1b9a', fontWeight: 'bold', margin: 0, letterSpacing: '1px', textAlign: 'center' }}>
          Timeline of Appointments
        </h2>
        <h3 style={{ margin: '0.2rem 0 0 0', color: '#4a148c', fontWeight: 400, fontSize: '1.1rem', letterSpacing: '0.5px', textAlign: 'center' }}>
          {selectedDate.toDateString()}
        </h3>
      </div>
      <div
        style={{
          flex: 1,
          minHeight: 0,
          minWidth: 0,
          width: '100%',
          height: '100%',
          overflow: 'auto',
          display: 'flex',
          background: 'rgba(255,255,255,0.85)', // keep small timeline grid white, but outer is hologram
          borderBottomLeftRadius: '12px',
          borderBottomRightRadius: '12px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
          alignItems: 'flex-start',
        }}
      >
        {/* Appointment labels */}
        <div
          style={{
            width: '120px',
            minWidth: '120px',
            display: 'grid',
            gridTemplateRows: `20px repeat(${minRows}, ${rowHeight}px)`,
            borderRight: '1px solid #ddd',
            background: 'rgba(255,255,255,0.95)',
            zIndex: 1,
            borderBottomLeftRadius: '12px',
            boxShadow: '2px 0 6px -4px #b39ddb1a',
            height: timelineHeight + 20,
          }}
        >
          {/* Empty cell for hour label row */}
          <div style={{ height: '20px', background: 'transparent' }} />
          {Array.from({ length: minRows }).map((_, index) => (
            <div
              key={index}
              style={{
                height: `${rowHeight}px`,
                lineHeight: `${rowHeight}px`,
                textAlign: 'center',
                fontWeight: filteredAppointments[index] ? 'bold' : 'normal',
                color: '#4a148c',
                borderBottom: '1px solid #eee',
                background: filteredAppointments[index] ? 'rgba(186,104,200,0.08)' : 'rgba(255,255,255,0.8)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: 0,
                fontSize: '1rem',
                letterSpacing: '0.5px',
              }}
            >
              {filteredAppointments[index]?.name || ''}
            </div>
          ))}
        </div>
        {/* Timeline grid and scrollable area */}
        <div
          style={{
            flex: 1,
            minWidth: 0,
            position: 'relative',
            background: '#fff',
            borderRadius: '0 0 12px 0',
            borderLeft: 'none',
            maxWidth: '100%',
            height: timelineHeight,
            boxShadow: '-2px 0 6px -4px #b39ddb1a',
          }}
        >
          {/* Hour labels ON vertical lines */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: `${timelineMinWidth}px`,
              height: '20px',
              zIndex: 4,
              pointerEvents: 'none',
            }}
          >
            {hours.map((hour) => (
              <div
                key={hour}
                style={{
                  position: 'absolute',
                  left: `${hour * hourWidth}px`,
                  top: 0,
                  width: '1px',
                  height: '20px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  color: '#4a148c',
                  fontWeight: 'bold',
                  fontSize: '0.8rem',
                  userSelect: 'none',
                  pointerEvents: 'none',
                  zIndex: 4,
                  transform: 'translateX(-50%)',
                }}
              >
                <span style={{
                  position: 'absolute',
                  top: 0,
                  left: '50%',
                  transform: 'translate(-50%, 0)',
                  whiteSpace: 'nowrap',
                  background: 'rgba(255,255,255,0.95)',
                  padding: '0 2px',
                  fontSize: '0.8rem',
                  fontWeight: 'bold',
                  color: '#4a148c',
                  zIndex: 5,
                  borderRadius: '4px',
                }}>
                  {hour}
                </span>
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
              marginTop: '20px',
              borderBottomRightRadius: '12px',
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
                  background: '#e0e0e0',
                  zIndex: 1,
                }}
              />
            ))}
            {/* Horizontal grid lines */}
            {Array.from({ length: Math.max(filteredAppointments.length, minRows) + 1 }, (_, i) => (
              <div
                key={i}
                style={{
                  position: 'absolute',
                  left: 0,
                  top: `${i * rowHeight}px`,
                  width: '100%',
                  height: '1px',
                  background: '#e0e0e0',
                  zIndex: 1,
                }}
              />
            ))}
            {/* Gantt bars */}
            {filteredAppointments.length > 0 &&
              filteredAppointments.map((appt, index) => {
                // Parse start and end time as float hour (e.g. 10:30 -> 10.5)
                const parseHour = (str) => {
                  const [h, m] = str.split(':').map(Number);
                  return h + (m ? m / 60 : 0);
                };
                const startHour = parseHour(appt.start);
                const endHour = parseHour(appt.end);
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
                      boxShadow: '0 2px 6px 0 #b39ddb33',
                      transition: 'left 0.2s, width 0.2s',
                    }}
                  >
                    {appt.name}
                  </div>
                );
              })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Timeline;
