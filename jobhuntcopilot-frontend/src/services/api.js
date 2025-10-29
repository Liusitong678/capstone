// method of interfaces that frontend call
export async function callScore(payload) {
    const res = await fetch('/api/ai/score', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    return res.json();
  }
  
  export async function createCoverLetter(payload) {
    const res = await fetch('/api/ai/cover-letter', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    return res.json();
  }

  export async function fetchJobs({ signal } = {}) {
    const res = await fetch('/api/jobs', { method: 'GET', signal });
    if (!res.ok) {
      const text = await res.text().catch(() => '');
      throw new Error(`GET /api/jobs ${res.status}: ${text || 'Request failed'}`);
    }
    const data = await res.json();
    const list = Array.isArray(data) ? data : (data.jobs || []);
    return list.map((j, idx) => ({ ...j, _uid: j._id || j.id || String(idx) }));
  }
  

  export async function fetchJobById(id, { signal } = {}) {
    const res = await fetch(`/api/jobs/${id}`, { method: 'GET', signal });
    if (!res.ok) {
      const text = await res.text().catch(() => '');
      throw new Error(`GET /api/jobs/${id} ${res.status}: ${text || 'Request failed'}`);
    }
    const obj = await res.json();
    return normalizeJob(obj);
  }
  

  
  