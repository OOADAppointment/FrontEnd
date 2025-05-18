import { useState, useEffect } from 'react';
import styles from './Timeline.module.css';
import {
  createAppointment,
  updateAppointment,
  deleteAppointment as apiDeleteAppointment,
  joinGroupMeeting,
} from '../services/appointment';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Timeline({ selectedDate, appointments, onUpdateAppointments, user }) {
  const hours = Array.from({ length: 25 }, (_, i) => i);
  const hourWidth = 40;
  const minRows = 10;
  const rowHeight = 40;
  const labelHeight = 28;
  const timelineWidth = hourWidth * 24;
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    id: null,
    name: '',
    location: '',
    date: '',
    start: '',
    end: '',
    isGroupMeeting: false,
    members: ''
  });
  const [reminderTimes, setReminderTimes] = useState(['']);
  const [editIndex, setEditIndex] = useState(null);
  const [showDetail, setShowDetail] = useState(false);
  const [detailIndex, setDetailIndex] = useState(null);
  const [error, setError] = useState('');
  const [overlapInfo, setOverlapInfo] = useState(null);
  const [groupMeetingPrompt, setGroupMeetingPrompt] = useState(null);

  const selectedDateStr = selectedDate.toLocaleDateString('en-CA');

  // Hiển thị các lịch của ngày đang chọn
  const filteredAppointments = Array.isArray(appointments)
    ? appointments.filter(
        (appt) =>
          appt.date === selectedDateStr &&
          (appt.owner === user || (Array.isArray(appt.members) && appt.members.includes(user)))
      )
    : [];

  // Nhắc nhở bằng toast nếu đến thời gian reminder
  useEffect(() => {
    const now = new Date();
    if (Array.isArray(appointments)) {
      appointments.forEach(appt => {
        if (appt.reminderTimes && Array.isArray(appt.reminderTimes)) {
          appt.reminderTimes.forEach(reminder => {
            const reminderDate = new Date(reminder);
            if (
              reminderDate > now &&
              reminderDate - now < 60000
            ) {
              toast.info(`Sắp đến lịch: ${appt.name} lúc ${appt.start}`);
            }
          });
        }
      });
    }
  }, [appointments]);

  const handleOpenForm = () => {
    setShowForm(true);
    setEditIndex(null);
    setFormData({
      id: null,
      name: '',
      location: '',
      date: '',
      start: '',
      end: '',
      isGroupMeeting: false,
      members: ''
    });
    setReminderTimes(['']);
    setError('');
    setOverlapInfo(null);
    setGroupMeetingPrompt(null);
  };
  const handleCloseForm = () => {
    setShowForm(false);
    setEditIndex(null);
    setFormData({
      id: null,
      name: '',
      location: '',
      date: '',
      start: '',
      end: '',
      isGroupMeeting: false,
      members: ''
    });
    setReminderTimes(['']);
    setError('');
    setOverlapInfo(null);
    setGroupMeetingPrompt(null);
  };
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

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
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setOverlapInfo(null);
    setGroupMeetingPrompt(null);
    if (!formData.name || !formData.date || !formData.start || !formData.end) return;

    let membersArr = [];
    if (formData.isGroupMeeting) {
      membersArr = formData.members
        .split(',')
        .map((m) => m.trim())
        .filter((m) => m && m !== user);
    }

    const reminderArr = reminderTimes.filter(Boolean);

    // Kiểm tra trùng thời gian với các lịch mà user là owner hoặc member
    const overlapIdx = Array.isArray(appointments)
      ? appointments.findIndex((appt, idx) => {
          if (editIndex !== null && appt.id === formData.id) return false;
          if (appt.date !== formData.date) return false;
          if (appt.owner === user || (Array.isArray(appt.members) && appt.members.includes(user))) {
            return isTimeOverlap(formData.start, formData.end, appt.start, appt.end);
          }
          return false;
        })
      : -1;

    if (overlapIdx !== -1 && overlapIdx !== undefined) {
      setOverlapInfo({
        idx: overlapIdx,
        appt: appointments[overlapIdx],
      });
      return;
    }

    const appointmentData = {
      title: formData.name,
      location: formData.location,
      startTime: `${formData.date}T${formData.start}:00`,
      endTime: `${formData.date}T${formData.end}:00`,
      isGroupMeeting: formData.isGroupMeeting,
      members: membersArr,
      owner: user,
      reminderTimes: reminderArr
    };

    try {
      if (editIndex !== null && formData.id) {
        // Đang sửa
        await updateAppointment(formData.id, appointmentData);
      } else {
        // Đang thêm mới
        const res = await createAppointment(appointmentData);
        // Nếu là họp nhóm và API trả về status GROUP_MEETING_EXISTS
        if (res && res.status === 'GROUP_MEETING_EXISTS' && res.appointmentId) {
          setShowForm(false);
          setGroupMeetingPrompt({
            appointmentId: res.appointmentId,
            title: res.title,
            location: res.location,
            startTime: res.startTime,
            endTime: res.endTime,
            participants: res.participants || [],
          });
          return;
        }
      }
      if (typeof onUpdateAppointments === 'function') {
        onUpdateAppointments();
      }
      handleCloseForm();
      setShowDetail(false);
    } catch (err) {
      setError('Lỗi khi lưu cuộc hẹn!');
    }
  };

  // Xác nhận tham gia họp nhóm
  const handleJoinGroupMeeting = async () => {
    if (!groupMeetingPrompt) return;
    try {
      await joinGroupMeeting({
        username: user,
        id: groupMeetingPrompt.appointmentId,
      });
      toast.success('Bạn đã tham gia cuộc họp nhóm!');
      setGroupMeetingPrompt(null);
      if (typeof onUpdateAppointments === 'function') {
        onUpdateAppointments();
      }
      handleCloseForm();
      setShowDetail(false);
    } catch (err) {
      setError('Lỗi khi tham gia cuộc họp nhóm!');
    }
  };

  // Thay thế cuộc hẹn cũ khi trùng thời gian
  const handleReplaceOld = async () => {
    if (overlapInfo) {
      let membersArr = [];
      if (formData.isGroupMeeting) {
        membersArr = formData.members
          .split(',')
          .map((m) => m.trim())
          .filter((m) => m && m !== user);
      }
      const reminderArr = reminderTimes.filter(Boolean);
      const appointmentData = {
        title: formData.name,
        location: formData.location,
        startTime: `${formData.date}T${formData.start}:00`,
        endTime: `${formData.date}T${formData.end}:00`,
        isGroupMeeting: formData.isGroupMeeting,
        members: membersArr,
        owner: user,
        reminderTimes: reminderArr
      };
      try {
        await apiDeleteAppointment(overlapInfo.appt.id);
        await createAppointment(appointmentData);
        if (typeof onUpdateAppointments === 'function') {
          onUpdateAppointments();
        }
        setOverlapInfo(null);
        handleCloseForm();
        setShowDetail(false);
      } catch (err) {
        setError('Lỗi khi thay thế cuộc hẹn!');
      }
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
  const handleDelete = async (index) => {
    const appt = filteredAppointments[index];
    if (!appt.id) return;
    try {
      await apiDeleteAppointment(appt.id);
      if (typeof onUpdateAppointments === 'function') {
        onUpdateAppointments();
      }
      setShowDetail(false);
    } catch (err) {
      setError('Lỗi khi xóa cuộc hẹn!');
    }
  };
  const handleEdit = (index) => {
    const appt = filteredAppointments[index];
    setEditIndex(index);
    setFormData({
      id: appt.id,
      name: appt.name,
      location: appt.location || '',
      date: appt.date,
      start: appt.start,
      end: appt.end,
      isGroupMeeting: !!appt.isGroupMeeting,
      members: (appt.members || []).join(', ')
    });
    setReminderTimes(appt.reminderTimes && appt.reminderTimes.length ? appt.reminderTimes : ['']);
    setShowForm(true);
    setShowDetail(false);
    setError('');
    setOverlapInfo(null);
    setGroupMeetingPrompt(null);
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
      {groupMeetingPrompt && (
        <div className={styles.formContainer} style={{ background: '#fffbe7', border: '1px solid #ffb300', marginBottom: 16 }}>
          <h3>Đã tồn tại cuộc họp nhóm này</h3>
          <div>
            <b>{groupMeetingPrompt.title}</b> ({groupMeetingPrompt.startTime.slice(11, 16)} - {groupMeetingPrompt.endTime.slice(11, 16)})<br />
            Địa điểm: {groupMeetingPrompt.location}<br />
            Thành viên: {groupMeetingPrompt.participants.join(', ')}
          </div>
          <div style={{ marginTop: 12 }}>
            <button onClick={handleJoinGroupMeeting} style={{ marginRight: 8 }}>
              Tham gia cuộc họp nhóm này
            </button>
            <button onClick={() => {
              setGroupMeetingPrompt(null);
              setShowForm(true); // Mở lại form tạo mới nếu muốn
            }}>
              Hủy
            </button>
          </div>
        </div>
      )}
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
            <div className={styles.inputGroup}>
              <input
                type="text"
                name="location"
                placeholder="Địa điểm"
                value={formData.location}
                onChange={handleChange}
                className={styles.input}
              />
            </div>
            <div className={styles.inputGroup}>
              <input
                type="date"
                name="date"
                value={formData.date}
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
              <label>
                <input
                  type="checkbox"
                  name="isGroupMeeting"
                  checked={formData.isGroupMeeting}
                  onChange={handleChange}
                />{' '}
                Cuộc họp nhóm
              </label>
            </div>
            {formData.isGroupMeeting && (
              <div className={styles.inputGroup}>
                <input
                  type="text"
                  name="members"
                  placeholder="Thành viên (username, cách nhau bởi dấu phẩy, không gồm bạn)"
                  value={formData.members}
                  onChange={handleChange}
                  className={styles.input}
                />
              </div>
            )}
            <div className={styles.inputGroup}>
              <label>Nhắc nhở:</label>
              {reminderTimes.map((reminder, idx) => (
                <div key={idx} style={{ display: 'flex', alignItems: 'center', marginBottom: 4 }}>
                  <input
                    type="datetime-local"
                    value={reminder}
                    onChange={e => {
                      const arr = [...reminderTimes];
                      arr[idx] = e.target.value;
                      setReminderTimes(arr);
                    }}
                    className={styles.input}
                  />
                  {reminderTimes.length > 1 && (
                    <button type="button" onClick={() => {
                      setReminderTimes(reminderTimes.filter((_, i) => i !== idx));
                    }} style={{ marginLeft: 4 }}>X</button>
                  )}
                </div>
              ))}
              <button type="button" onClick={() => setReminderTimes([...reminderTimes, ''])}>
                + Thêm nhắc nhở
              </button>
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
          <div><b>Địa điểm:</b> {filteredAppointments[detailIndex].location || 'Không có'}</div>
          <div><b>Ngày:</b> {filteredAppointments[detailIndex].date}</div>
          <div><b>Bắt đầu:</b> {filteredAppointments[detailIndex].start}</div>
          <div><b>Kết thúc:</b> {filteredAppointments[detailIndex].end}</div>
          <div><b>Chủ cuộc hẹn:</b> {filteredAppointments[detailIndex].owner}</div>
          <div><b>Nhóm:</b> {filteredAppointments[detailIndex].isGroupMeeting ? 'Có' : 'Không'}</div>
          <div><b>Thành viên:</b> {(filteredAppointments[detailIndex].members || []).join(', ') || 'Không có'}</div>
          <div><b>Nhắc nhở:</b> {(filteredAppointments[detailIndex].reminderTimes || []).join(', ') || 'Không có'}</div>
          <div className={styles.detailButtonGroup}>
            {filteredAppointments[detailIndex].owner === user && (
              <>
                <button onClick={() => handleEdit(detailIndex)} className={styles.editButton}>
                  <span role="img" aria-label="edit">✏️</span> Sửa
                </button>
                <button onClick={() => handleDelete(detailIndex)} className={styles.deleteButton}>
                  <span role="img" aria-label="delete">🗑️</span> Xóa
                </button>
              </>
            )}
            <button onClick={handleCloseDetail} className={styles.closeButton}>
              Đóng
            </button>
          </div>
        </div>
      )}
      <div className={styles.timeline} >
        <div className={styles.appointmentLabels}>
          <div className={styles.emptyCell} style={{ height: labelHeight }} />
          <div className={styles.emptyCell} style={{ height: labelHeight }} />
          {Array.from({ length: minRows }).map((_, index) => (
            <div key={index} className={styles.appointmentLabel} style={{ height: rowHeight}}>
              {filteredAppointments[index]?.name || ''}
            </div>
          ))}
        </div>
        <div
          className={styles.timelineGrid}
          style={{
            height: timelineHeight + labelHeight,
            width: timelineWidth,
            minWidth: timelineWidth,
            overflowX: 'auto',
            position: 'relative',
            paddingTop: labelHeight,
            background: '#fff'
          }}
        >
          {/* Label giờ */}
          {hours.map((hour) => (
            <div
              key={'label-' + hour}
              className={styles.hourLabel}
              style={{
                position: 'absolute',
                left: `${hour * hourWidth}px`,
                top: 0,
                width: `${hourWidth}px`,
                height: `${labelHeight}px`,
                textAlign: 'center',
                color: '#4a148c',
                fontWeight: 'bold',
                fontSize: '0.8rem',
                zIndex: 2,
                background: '#fff'
              }}
            >
              {hour}
            </div>
          ))}
          {/* Grid dọc */}
          {hours.map((hour) => (
            <div
              key={hour}
              className={styles.hourLine}
              style={{
                position: 'absolute',
                left: `${hour * hourWidth}px`,
                top: labelHeight,
                width: '1px',
                height: timelineHeight,
                background: '#e0e0e0',
                zIndex: 1,
              }}
            />
          ))}
          {/* Grid ngang */}
          {Array.from({ length: Math.max(filteredAppointments.length, minRows) + 1 }).map((_, rowIdx) => (
            <div
              key={'row-' + rowIdx}
              style={{
                position: 'absolute',
                left: 0,
                top: `${labelHeight + rowIdx * rowHeight}px`,
                width: timelineWidth,
                height: '1px',
                background: '#e0e0e0',
                zIndex: 1,
              }}
            />
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
                style={{
                  left,
                  width,
                  top: `${labelHeight + index * rowHeight}px`,
                  height: `${rowHeight}px`
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
      <ToastContainer />
    </div>
  );
}

export default Timeline;