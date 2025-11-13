async function request(path, { method = 'GET', headers = {}, body, signal } = {}) {
  const res = await fetch(path, {
    method,
    headers: { 'Accept': 'application/json', ...headers },
    body,
    signal,
  });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`${method} ${path} ${res.status}: ${text || 'Request failed'}`);
  }

  // 204 No Content
  if (res.status === 204) return null;

  try {
    return await res.json();
  } catch {
    return null;
  }
}

const fmtDate = (iso) => {
  if (!iso) return '';
  try {
    const d = new Date(iso);
    return d.toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' });
  } catch {
    return '';
  }
};

function normalizeJob(j, idx = 0) {
  const href = j.url || j.applyUrl || ''; 
  if (!j || typeof j !== 'object') return null;
  return {
    _uid: j._id || j.id || String(idx),
    title: j.title || 'Untitled',
    company: j.company || 'Unknown company',
    description: j.description || '',
    skills: Array.isArray(j.skills) ? j.skills : [],
    location: j.location || '',
    // applyUrl: j.url || j.applyUrl || '',     // ★ use url instead of applyUrl
    applyUrl: href,
    url: href,
    source: j.source || '',                  // ★ from（JSearch/manual）
    date: fmtDate(j.postedAt || j.date),     // ★ data
    postedAt: j.postedAt || null,           
    raw: j,
  };
}

// ===== AI interface =====
export async function callScore(payload, opts = {}) {
  const data = await request('/api/ai/score', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
    ...opts,
  });
  return data; // { score, matched, missing }
}

export async function createCoverLetter(payload, opts = {}) {
  const data = await request('/api/ai/cover-letter', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
    ...opts,
  });
  return data; // { text }
}

// ===== Jobs list =====
export async function fetchJobs({ signal } = {}) {
  const data = await request('/api/jobs', { method: 'GET', signal });
  const list = Array.isArray(data) ? data : (data?.jobs || []);
  return list.map((j, idx) => normalizeJob(j, idx)).filter(Boolean);
}

// ===== Job details =====
export async function fetchJobById(id, { signal } = {}) {
  const obj = await request(`/api/jobs/${id}`, { method: 'GET', signal });
  return normalizeJob(obj);
}

export async function fetchSavedJobs() {
  const res = await fetch('/api/saved-jobs');
  if (!res.ok) throw new Error('Failed to fetch saved jobs');
  const ids = await res.json();        // ["jobId1","jobId2",...]
  return new Set(ids);
}

export async function saveJob(jobId) {
  const res = await fetch('/api/saved-jobs', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ jobId }),
  });
  if (!res.ok) throw new Error('Save failed');
}

export async function unsaveJob(jobId) {
  const res = await fetch(`/api/saved-jobs/${jobId}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Unsave failed');
}

  
  