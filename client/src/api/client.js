const BASE = '';

async function handleResponse(res) {
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || `Erreur ${res.status}`);
  return data;
}

export const getBrands = () =>
  fetch(`${BASE}/api/brands`).then(handleResponse);

export const getBrand = (id) =>
  fetch(`${BASE}/api/brands/${id}`).then(handleResponse);

export const createOrder = (body) =>
  fetch(`${BASE}/api/orders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  }).then(handleResponse);

export const payOrder = (id) =>
  fetch(`${BASE}/api/orders/${id}/pay`, { method: 'PATCH' }).then(handleResponse);

export const getOrder = (id) =>
  fetch(`${BASE}/api/orders/${id}`).then(handleResponse);

// ── Brands CRUD (back office) ──────────────────────────────
export const createBrand = (body) =>
  fetch(`${BASE}/api/brands`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  }).then(handleResponse);

export const updateBrand = (id, body) =>
  fetch(`${BASE}/api/brands/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  }).then(handleResponse);

export const deleteBrand = (id) =>
  fetch(`${BASE}/api/brands/${id}`, { method: 'DELETE' }).then(handleResponse);

// ── Admin test logs ────────────────────────────────────────
export const getTestLogs = () =>
  fetch(`${BASE}/api/admin/test-logs`).then(handleResponse);

export const deleteTestLog = (id) =>
  fetch(`${BASE}/api/admin/test-logs/${id}`, { method: 'DELETE' }).then(handleResponse);

export const uploadImage = (file) => {
  const formData = new FormData();
  formData.append('image', file);
  return fetch(`${BASE}/api/upload`, { method: 'POST', body: formData }).then(handleResponse);
};
