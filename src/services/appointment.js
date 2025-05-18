const BASE_URL = 'http://localhost:8080/api/appointments';

export async function getAppointments() {
  const response = await fetch(BASE_URL);
  if (!response.ok) {
    throw new Error('Failed to fetch appointments');
  }
  return response.json();
}

export async function createAppointment(appointment) {
  const response = await fetch(`${BASE_URL}/check-or-create`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(appointment),
  });
  if (!response.ok) {
    throw new Error('Failed to create appointment');
  }
  return response.json();
}

export async function updateAppointment(id, appointment) {
  const response = await fetch(`${BASE_URL}/update/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(appointment),
  });
  if (!response.ok) {
    throw new Error('Failed to update appointment');
  }
  return response.json();
}

export async function deleteAppointment(id) {
  const response = await fetch(`${BASE_URL}/delete/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    throw new Error('Failed to delete appointment');
  }
  return response.json();
}

export async function joinGroupMeeting({ username, id }) {
  return fetch(`${BASE_URL}/join-group-meeting`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, id }),
  }).then(res => res.json());
}