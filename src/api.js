const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

async function handleResponse(res) {
  if (!res.ok) {
    const data = await res.json().catch(() => ({}))
    throw new Error(data.detail || 'Ошибка запроса')
  }
  return res.json()
}

export const api = {
  getResources: () => fetch(`${API_URL}/api/resources`).then(handleResponse),

  getBookings: (date) =>
    fetch(`${API_URL}/api/bookings?date=${date}`).then(handleResponse),

  createBooking: (payload) =>
    fetch(`${API_URL}/api/bookings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    }).then(handleResponse),

  updateBookingStatus: (id, status) =>
    fetch(`${API_URL}/api/bookings/${id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    }).then(handleResponse),
}
