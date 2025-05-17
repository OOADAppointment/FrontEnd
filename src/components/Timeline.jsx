import { useState } from 'react';

function Timeline({ selectedDate }) {
  // Show all 25 hours (0-24)
  const hours = Array.from({ length: 25 }, (_, i) => i);

  // Fake data for demonstration (covering many days in months 4-7, 2025)
  const initialAppointments = [
    // ...existing appointments...
    { name: 'Meeting', start: '10:30', end: '12:45', date: '2025-04-01' },
    { name: 'Lunch', start: '13:00', end: '15:50', date: '2025-04-01' },
    { name: 'Workshop', start: '15:00', end: '17:00', date: '2025-04-02' },
    { name: 'Late Task', start: '20:00', end: '23:00', date: '2025-04-02' },
    { name: 'Night Shift', start: '22:00', end: '24:00', date: '2025-04-03' },
    { name: 'Morning Brief', start: '08:00', end: '09:00', date: '2025-04-03' },
    { name: 'Team Sync', start: '09:30', end: '10:30', date: '2025-04-04' },
    { name: 'Design Review', start: '14:00', end: '15:00', date: '2025-04-04' },
    { name: '1:1', start: '11:00', end: '11:30', date: '2025-05-05' },
    { name: 'Wrap Up', start: '16:00', end: '17:00', date: '2025-05-05' },
    { name: 'Planning', start: '09:00', end: '10:00', date: '2025-05-06' },
    { name: 'Retrospective', start: '15:00', end: '16:00', date: '2025-05-06' },
    { name: 'Demo', start: '13:00', end: '14:00', date: '2025-05-07' },
    { name: 'Support', start: '10:00', end: '12:00', date: '2025-05-08' },
    { name: 'Check-in', start: '09:00', end: '09:30', date: '2025-06-09' },
    { name: 'Night Shift', start: '22:00', end: '24:00', date: '2025-06-10' },
    { name: 'Sprint Start', start: '09:00', end: '10:00', date: '2025-06-11' },
    { name: 'Code Review', start: '14:00', end: '15:30', date: '2025-06-12' },
    { name: 'Brainstorm', start: '11:00', end: '12:00', date: '2025-06-13' },
    { name: 'Release', start: '10:00', end: '11:00', date: '2025-07-01' },
    { name: 'Hotfix', start: '15:00', end: '16:00', date: '2025-07-02' },
    { name: 'All Hands', start: '09:00', end: '10:30', date: '2025-07-03' },
    { name: 'Wrap Up', start: '16:00', end: '17:00', date: '2025-07-04' },
    { name: 'Night Shift', start: '22:00', end: '24:00', date: '2025-07-05' },
    { name: 'Morning Brief', start: '08:00', end: '09:00', date: '2025-07-06' },
    { name: 'Team Sync', start: '09:30', end: '10:30', date: '2025-07-07' },
    { name: 'Design Review', start: '14:00', end: '15:00', date: '2025-07-08' },
  ];

  // State quản lý danh sách cuộc hẹn
  const [appointments, setAppointments] = useState(initialAppointments);

  // State cho form thêm/sửa cuộc hẹn
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    start: '',
    end: '',
  });
  const [editIndex, setEditIndex] = useState(null);

  // State cho popup chi tiết
  const [showDetail, setShowDetail] = useState(false);
  const [detailIndex, setDetailIndex] = useState(null);

  const handleOpenForm = () => {
    setShowForm(true);
    setEditIndex(null);
    setFormData({ name: '', start: '', end: '' });
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditIndex(null);
    setFormData({ name: '', start: '', end: '' });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.start || !formData.end) return;
    if (editIndex !== null) {
      // Edit
      const updated = [...appointments];
      updated[editIndex] = {
        ...updated[editIndex],
        name: formData.name,
        start: formData.start,
        end: formData.end,
        date: selectedDate.toISOString().split('T')[0],
      };
      setAppointments(updated);
    } else {
      // Add
      setAppointments([
        ...appointments,
        {
          name: formData.name,
          start: formData.start,
          end: formData.end,
          date: selectedDate.toISOString().split('T')[0],
        },
      ]);
    }
    handleCloseForm();
    setShowDetail(false);
  };

  // Lọc cuộc hẹn theo ngày
  const selectedDateStr = selectedDate.toISOString().split('T')[0];
  const filteredAppointments = appointments.filter(
    (appt) => appt.date === selectedDateStr
  );

  const hourWidth = 40;
  const timelineMinWidth = hourWidth * 25;
  const rowHeight = 40;
  const minRows = 10;
  const timelineHeight = Math.max(filteredAppointments.length, minRows) * rowHeight;

  // Hiện popup chi tiết khi click vào bar
  const handleShowDetail = (index) => {
    setDetailIndex(index);
    setShowDetail(true);
  };

  const handleCloseDetail = () => {
    setShowDetail(false);
    setDetailIndex(null);
  };

  // Xoá cuộc hẹn
  const handleDelete = (index) => {
    const globalIndex = appointments.findIndex(
      (appt) =>
        appt.date === selectedDateStr &&
        appt.name === filteredAppointments[index].name &&
        appt.start === filteredAppointments[index].start &&
        appt.end === filteredAppointments[index].end
    );
    if (globalIndex !== -1) {
      const updated = [...appointments];
      updated.splice(globalIndex, 1);
      setAppointments(updated);
      setShowDetail(false);
    }
  };

  // Sửa cuộc hẹn
  const handleEdit = (index) => {
    setEditIndex(
      appointments.findIndex(
        (appt) =>
          appt.date === selectedDateStr &&
          appt.name === filteredAppointments[index].name &&
          appt.start === filteredAppointments[index].start &&
          appt.end === filteredAppointments[index].end
      )
    );
    setFormData({
      name: filteredAppointments[index].name,
      start: filteredAppointments[index].start,
      end: filteredAppointments[index].end,
    });
    setShowForm(true);
    setShowDetail(false);
  };

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
        position: 'relative',
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
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div>
          <h2 style={{ fontSize: '1.6rem', color: '#6a1b9a', fontWeight: 'bold', margin: 0, letterSpacing: '1px', textAlign: 'center' }}>
            Timeline of Appointments
          </h2>
          <h3 style={{ margin: '0.2rem 0 0 0', color: '#4a148c', fontWeight: 400, fontSize: '1.1rem', letterSpacing: '0.5px', textAlign: 'center' }}>
            {selectedDate.toDateString()}
          </h3>
        </div>
        <button
          style={{
            padding: '0.5rem 1rem',
            background: '#7e57c2',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            fontWeight: 'bold',
            cursor: 'pointer',
            fontSize: '1rem',
            marginLeft: '1rem',
          }}
          onClick={handleOpenForm}
        >
          + Thêm cuộc hẹn
        </button>
      </div>
      {/* Form thêm/sửa cuộc hẹn */}
      {showForm && (
        <div
          style={{
            position: 'absolute',
            top: '15%',
            left: '50%',
            transform: 'translate(-50%, 0)',
            background: 'white',
            padding: '2rem',
            borderRadius: '12px',
            boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
            zIndex: 100,
            minWidth: '320px',
          }}
        >
          <h3 style={{ marginTop: 0 }}>{editIndex !== null ? 'Sửa cuộc hẹn' : 'Thêm cuộc hẹn'}</h3>
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '1rem' }}>
              <input
                type="text"
                name="name"
                placeholder="Tên cuộc hẹn"
                value={formData.name}
                onChange={handleChange}
                required
                style={{ width: '100%', padding: '0.5rem' }}
              />
            </div>
            <div style={{ marginBottom: '1rem', display: 'flex', gap: '8px' }}>
              <input
                type="time"
                name="start"
                value={formData.start}
                onChange={handleChange}
                required
                style={{ width: '48%', padding: '0.5rem' }}
              />
              <input
                type="time"
                name="end"
                value={formData.end}
                onChange={handleChange}
                required
                style={{ width: '48%', padding: '0.5rem' }}
              />
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
              <button type="button" onClick={handleCloseForm} style={{ background: '#eee', border: 'none', borderRadius: '6px', padding: '0.5rem 1rem' }}>
                Hủy
              </button>
              <button type="submit" style={{ background: '#7e57c2', color: 'white', border: 'none', borderRadius: '6px', padding: '0.5rem 1rem' }}>
                Lưu
              </button>
            </div>
          </form>
        </div>
      )}
      {/* Popup chi tiết cuộc hẹn */}
      {showDetail && detailIndex !== null && (
        <div
          style={{
            position: 'absolute',
            top: '20%',
            left: '50%',
            transform: 'translate(-50%, 0)',
            background: 'white',
            padding: '2rem',
            borderRadius: '12px',
            boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
            zIndex: 200,
            minWidth: '320px',
          }}
        >
          <h3 style={{ marginTop: 0, marginBottom: '1rem' }}>Chi tiết cuộc hẹn</h3>
          <div style={{ marginBottom: '1rem' }}>
            <b>Tên:</b> {filteredAppointments[detailIndex].name}
          </div>
          <div style={{ marginBottom: '1rem' }}>
            <b>Bắt đầu:</b> {filteredAppointments[detailIndex].start}
          </div>
          <div style={{ marginBottom: '1rem' }}>
            <b>Kết thúc:</b> {filteredAppointments[detailIndex].end}
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1.5rem' }}>
            <button
              onClick={() => handleEdit(detailIndex)}
              style={{
                background: '#ffd54f',
                border: 'none',
                borderRadius: '6px',
                padding: '0.5rem 1rem',
                color: '#6a1b9a',
                fontWeight: 'bold',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                cursor: 'pointer',
              }}
            >
              <span role="img" aria-label="edit">✏️</span> Sửa
            </button>
            <button
              onClick={() => handleDelete(detailIndex)}
              style={{
                background: '#e57373',
                border: 'none',
                borderRadius: '6px',
                padding: '0.5rem 1rem',
                color: 'white',
                fontWeight: 'bold',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                cursor: 'pointer',
              }}
            >
              <span role="img" aria-label="delete">🗑️</span> Xóa
            </button>
            <button
              onClick={handleCloseDetail}
              style={{
                background: '#eee',
                border: 'none',
                borderRadius: '6px',
                padding: '0.5rem 1rem',
                color: '#333',
                fontWeight: 'bold',
                cursor: 'pointer',
              }}
            >
              Đóng
            </button>
          </div>
        </div>
      )}
      <div
        style={{
          flex: 1,
          minHeight: 0,
          minWidth: 0,
          width: '100%',
          height: '100%',
          overflow: 'auto',
          display: 'flex',
          background: 'rgba(255,255,255,0.85)',
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
                      cursor: 'pointer',
                    }}
                    onClick={() => handleShowDetail(index)}
                    title={appt.name}
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