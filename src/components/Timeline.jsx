import { useState } from 'react';
import styles from './Timeline.module.css';

function Timeline({ selectedDate, appointments, onUpdateAppointments, user }) {
  const hours = Array.from({ length: 25 }, (_, i) => i);
  const hourWidth = 40;
  const minRows = 10;
  const rowHeight = 40;
  const timelineWidth = hourWidth * 24;
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ name: '', start: '', end: '', members: '' });
  const [editIndex, setEditIndex] = useState(null);
  const [showDetail, setShowDetail] = useState(false);
  const [detailIndex, setDetailIndex] = useState(null);
  const [error, setError] = useState('');
  const [overlapInfo, setOverlapInfo] = useState(null);

  const selectedDateStr = selectedDate.toLocaleDateString('en-CA');

  // Chỉ hiển thị các lịch mà user là owner hoặc member
  const filteredAppointments = appointments.filter(
    (appt) =>
      appt.date === selectedDateStr &&
      (appt.owner === user || (appt.members && appt.members.includes(user)))
  );

  const handleOpenForm = () => {
    setShowForm(true);
    setEditIndex(null);
    setFormData({ name: '', start: '', end: '', members: '' });
    setError('');
    setOverlapInfo(null);
  };
  const handleCloseForm = () => {
    setShowForm(false);
    setEditIndex(null);
    setFormData({ name: '', start: '', end: '', members: '' });
    setError('');
    setOverlapInfo(null);
  };
  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  // Kiểm tra trùng thời gian
  const isTimeOverlap = (start1, end1, start2, end2) => {
    const parse = (str) => {
      const [h, m] = str.split(':').map(Number);
      return h + (m ? m / 60 : 0);
    };
    const s1 = parse(start1), e1 = parse(end1);
    const s2 = parse(start2), e2 = parse(end2);
    return Math.max(s1, s2) < Math.min(e1, e2);
  };

  // Xử lý thêm/sửa cuộc hẹn
  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setOverlapInfo(null);
    if (!formData.name || !formData.start || !formData.end) return;

    // Chuẩn hóa danh sách members (loại bỏ rỗng, loại bỏ user chủ)
    let membersArr = formData.members
      .split(',')
      .map((m) => m.trim())
      .filter((m) => m && m !== user);

    // Kiểm tra trùng thời gian với các lịch mà user là owner hoặc member
    const overlapIdx = appointments.findIndex((appt, idx) => {
      if (editIndex !== null && idx === editIndex) return false;
      if (appt.date !== selectedDateStr) return false;
      if (appt.owner === user || (appt.members && appt.members.includes(user))) {
        return isTimeOverlap(formData.start, formData.end, appt.start, appt.end);
      }
      return false;
    });

    if (overlapIdx !== -1 && overlapIdx !== undefined) {
      setOverlapInfo({
        idx: overlapIdx,
        appt: appointments[overlapIdx],
      });
      return;
    }

    // Kiểm tra đã có cuộc họp nhóm trùng (name, start, end, date, KHÔNG phải của user hiện tại)
    const groupMeetingIdx = appointments.findIndex(
      (appt) =>
        appt.date === selectedDateStr &&
        appt.name === formData.name &&
        appt.start === formData.start &&
        appt.end === formData.end &&
        appt.owner !== user &&
        (!appt.members || !appt.members.includes(user))
    );

    if (groupMeetingIdx !== -1) {
      // Hỏi xác nhận tham gia
      if (window.confirm('Đã có cuộc họp nhóm này. Bạn có muốn tham gia vào cuộc họp này không?')) {
        let newAppointments = [...appointments];
        const oldMembers = newAppointments[groupMeetingIdx].members || [];
        if (!oldMembers.includes(user)) {
          newAppointments[groupMeetingIdx] = {
            ...newAppointments[groupMeetingIdx],
            members: [...oldMembers, user],
          };
          onUpdateAppointments(newAppointments);
        }
        handleCloseForm();
        setShowDetail(false);
      } else {
        // Nếu không đồng ý, tạo mới appointment cho user hiện tại
        let newAppointments = [...appointments];
        newAppointments.push({
          owner: user,
          name: formData.name,
          start: formData.start,
          end: formData.end,
          date: selectedDateStr,
          members: membersArr,
        });
        onUpdateAppointments(newAppointments);
        handleCloseForm();
        setShowDetail(false);
      }
      return;
    }

    // Kiểm tra đã là chủ hoặc thành viên của cuộc hẹn này chưa
    const sameEventIdx = appointments.findIndex(
      (appt) =>
        appt.date === selectedDateStr &&
        appt.name === formData.name &&
        appt.start === formData.start &&
        appt.end === formData.end &&
        (appt.owner === user || (appt.members && appt.members.includes(user)))
    );
    if (sameEventIdx !== -1) {
      setError('Bạn đã tham gia cuộc hẹn này!');
      return;
    }

    // Thêm mới
    let newAppointments = [...appointments];
    newAppointments.push({
      owner: user,
      name: formData.name,
      start: formData.start,
      end: formData.end,
      date: selectedDateStr,
      members: membersArr,
    });
    onUpdateAppointments(newAppointments);
    handleCloseForm();
    setShowDetail(false);
  };

  // Thay thế cuộc hẹn cũ khi trùng thời gian
  const handleReplaceOld = () => {
    if (overlapInfo) {
      let newAppointments = [...appointments];
      newAppointments.splice(overlapInfo.idx, 1);
      newAppointments.push({
        owner: user,
        name: formData.name,
        start: formData.start,
        end: formData.end,
        date: selectedDateStr,
        members: formData.members
          .split(',')
          .map((m) => m.trim())
          .filter((m) => m && m !== user),
      });
      onUpdateAppointments(newAppointments);
      setOverlapInfo(null);
      handleCloseForm();
      setShowDetail(false);
    }
  };

  const handleChooseOtherTime = () => {
    setOverlapInfo(null);
    setError('');
  };

  const handleShowDetail = (index) => {
    setDetailIndex(index);
    setShowDetail(true);
  };
  const handleCloseDetail = () => {
    setShowDetail(false);
    setDetailIndex(null);
  };
  const handleDelete = (index) => {
    const globalIndex = appointments.findIndex(
      (appt) =>
        appt.date === selectedDateStr &&
        appt.name === filteredAppointments[index].name &&
        appt.start === filteredAppointments[index].start &&
        appt.end === filteredAppointments[index].end &&
        (appt.owner === user || (appt.members && appt.members.includes(user)))
    );
    if (globalIndex !== -1) {
      const updated = [...appointments];
      updated.splice(globalIndex, 1);
      onUpdateAppointments(updated);
      setShowDetail(false);
    }
  };
  const handleEdit = (index) => {
    setEditIndex(index);
    setFormData({
      name: filteredAppointments[index].name,
      start: filteredAppointments[index].start,
      end: filteredAppointments[index].end,
      members: (filteredAppointments[index].members || []).join(', '),
    });
    setShowForm(true);
    setShowDetail(false);
    setError('');
    setOverlapInfo(null);
  };

  const timelineHeight = Math.max(filteredAppointments.length, minRows) * rowHeight;

  return (
    <div className={styles.timelineContainer}>
      <div className={styles.header}>
        <div>
          <h2 className={styles.title}>Timeline of Appointments</h2>
          <h3 className={styles.date}>{selectedDate.toDateString()}</h3>
        </div>
        <button className={styles.addButton} onClick={handleOpenForm}>
          + Thêm cuộc hẹn
        </button>
      </div>
      {showForm && (
        <div className={styles.formContainer}>
          <h3>{editIndex !== null ? 'Sửa cuộc hẹn' : 'Thêm cuộc hẹn'}</h3>
          <form onSubmit={handleSubmit}>
            {error && <div style={{ color: 'red', marginBottom: 8 }}>{error}</div>}
            {overlapInfo && (
              <div style={{ color: 'red', marginBottom: 8 }}>
                <div>
                  Thời gian này bị trùng với cuộc hẹn:
                  <br />
                  <b>{overlapInfo.appt.name}</b> ({overlapInfo.appt.start} - {overlapInfo.appt.end})
                </div>
                <div style={{ marginTop: 8 }}>
                  <button type="button" onClick={handleReplaceOld} style={{ marginRight: 8 }}>
                    Thay thế cuộc hẹn cũ
                  </button>
                  <button type="button" onClick={handleChooseOtherTime}>
                    Chọn thời gian khác
                  </button>
                </div>
              </div>
            )}
            <div className={styles.inputGroup}>
              <input
                type="text"
                name="name"
                placeholder="Tên cuộc hẹn"
                value={formData.name}
                onChange={handleChange}
                required
                className={styles.input}
              />
            </div>
            <div className={styles.timeGroup}>
              <input
                type="time"
                name="start"
                value={formData.start}
                onChange={handleChange}
                required
                className={styles.timeInput}
              />
              <input
                type="time"
                name="end"
                value={formData.end}
                onChange={handleChange}
                required
                className={styles.timeInput}
              />
            </div>
            <div className={styles.inputGroup}>
              <input
                type="text"
                name="members"
                placeholder="Thành viên (cách nhau bởi dấu phẩy, không gồm bạn)"
                value={formData.members}
                onChange={handleChange}
                className={styles.input}
              />
            </div>
            <div className={styles.buttonGroup}>
              <button type="button" onClick={handleCloseForm} className={styles.cancelButton}>
                Hủy
              </button>
              <button type="submit" className={styles.saveButton}>
                Lưu
              </button>
            </div>
          </form>
        </div>
      )}
      {showDetail && detailIndex !== null && (
        <div className={styles.detailContainer}>
          <h3>Chi tiết cuộc hẹn</h3>
          <div><b>Tên:</b> {filteredAppointments[detailIndex].name}</div>
          <div><b>Bắt đầu:</b> {filteredAppointments[detailIndex].start}</div>
          <div><b>Kết thúc:</b> {filteredAppointments[detailIndex].end}</div>
          <div><b>Chủ cuộc hẹn:</b> {filteredAppointments[detailIndex].owner}</div>
          <div><b>Thành viên:</b> {(filteredAppointments[detailIndex].members || []).join(', ') || 'Không có'}</div>
          <div className={styles.detailButtonGroup}>
            <button onClick={() => handleEdit(detailIndex)} className={styles.editButton}>
              <span role="img" aria-label="edit">✏️</span> Sửa
            </button>
            <button onClick={() => handleDelete(detailIndex)} className={styles.deleteButton}>
              <span role="img" aria-label="delete">🗑️</span> Xóa
            </button>
            <button onClick={handleCloseDetail} className={styles.closeButton}>
              Đóng
            </button>
          </div>
        </div>
      )}
      <div className={styles.timeline}>
        <div className={styles.appointmentLabels}>
          <div className={styles.emptyCell} />
          {Array.from({ length: minRows }).map((_, index) => (
            <div key={index} className={styles.appointmentLabel}>
              {filteredAppointments[index]?.name || ''}
            </div>
          ))}
        </div>
        <div
          className={styles.timelineGrid}
          style={{
            height: timelineHeight,
            width: timelineWidth,
            minWidth: timelineWidth,
            overflowX: 'auto',
            position: 'relative'
          }}
        >
          {/* Grid giờ dọc */}
          {hours.map((hour) => (
            <div
              key={hour}
              className={styles.hourLine}
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
          {/* Label giờ */}
          {hours.map((hour) => (
            <div
              key={'label-' + hour}
              className={styles.hourLabel}
              style={{
                position: 'absolute',
                left: `${hour * hourWidth}px`,
                top: '0',
                width: `${hourWidth}px`,
                textAlign: 'center',
                color: '#4a148c',
                fontWeight: 'bold',
                fontSize: '0.8rem',
                zIndex: 2,
              }}
            >
              {hour}
            </div>
          ))}
          {/* Các bar cuộc hẹn */}
          {filteredAppointments.map((appt, index) => {
            const parseHour = (str) => {
              const [h, m] = str.split(':').map(Number);
              return h + (m ? m / 60 : 0);
            };
            const startHour = parseHour(appt.start);
            const endHour = parseHour(appt.end);
            const left = `${startHour * hourWidth}px`;
            const width = `${Math.max(0, (endHour - startHour) * hourWidth)}px`;
            return (
              <div
                key={index}
                className={styles.appointmentBar}
                style={{ left, width, top: `${index * rowHeight}px`, height: `${rowHeight}px` }}
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
  );
}

export default Timeline;