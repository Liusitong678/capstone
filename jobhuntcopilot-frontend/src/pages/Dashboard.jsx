// src/pages/JobBoard.jsx
import { useEffect, useMemo, useState } from 'react';
import { fetchJobs } from '../services/api';
import '../styles/dashboard.css';

export default function JobBoard() {
  const [jobs, setJobs] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState('');

  useEffect(() => {
    const ac = new AbortController();
  
    (async () => {
      try {
        const list = await fetchJobs({ signal: ac.signal });
        setJobs(list);
        setSelectedId(list[0]?._uid ?? null);
      } catch (e) {
        if (e.name !== "AbortError") {
          setErr(e.message || "Load fail");
        }
      } finally {
        setLoading(false);
      }
    })();
  
    return () => ac.abort();
  }, []);
  

  const selected = useMemo(
    () => jobs.find(j => j._uid === selectedId) || null,
    [jobs, selectedId]
  );

  if (loading) {
    return (
      <div className="board-root">
        <div className="center-tip">Loading job positions...</div>
      </div>
    );
  }
  if (err) {
    return (
      <div className="board-root">
        <div className="center-tip error">{err}</div>
      </div>
    );
  }
  if (!jobs.length) {
    return (
      <div className="board-root">
        <div className="center-tip">No positions available</div>
      </div>
    );
  }

  return (
    <div className="board-root">
      <div className="board-wrap">
        {/* left */}
        <aside className="list-pane">
          {jobs.map((j) => {
            const active = j._uid === selectedId;
            return (
              <button
                key={j._uid}
                className={`list-item ${active ? 'active' : ''}`}
                onClick={() => setSelectedId(j._uid)}
              >
                <div className="list-row">
                  <div className="list-title">
                    {j.title || 'Unnamed position'}
                  </div>
                </div>

                <div className="meta-line">
                  {j.location && <span className="meta-pill">{j.location}</span>}
                  {j.exp && <span className="meta-pill">{j.exp}</span>}
                  {j.edu && <span className="meta-pill">{j.edu}</span>}
                </div>

                <div className="company-line">
                  {j.company || 'Unknown company'}
                </div>
              </button>
            );
          })}
        </aside>

        {/* right */}
        <main className="detail-pane">
          {selected ? (
            <>
              <header className="detail-header">
                <div>
                  <div className="detail-title">{selected.title || 'Unnamed position'}</div>
                  <div className="detail-sub">{selected.company || 'Unknown company'}</div>
                  <div className="meta-line mt8">
                    {selected.location && <span className="meta-pill">{selected.location}</span>}
                    {selected.exp && <span className="meta-pill">{selected.exp}</span>}
                    {selected.edu && <span className="meta-pill">{selected.edu}</span>}
                  </div>
                </div>
              </header>

              {/* Skills/Labels */}
              {Array.isArray(selected.skills) && selected.skills.length > 0 && (
                <section className="detail-section">
                  <div className="chips">
                    {selected.skills.map((s, i) => (
                      <span key={i} className="chip">{s}</span>
                    ))}
                  </div>
                </section>
              )}

              {/* describe */}
              {selected.description && (
                <section className="detail-section">
                  <div className="section-title">Job Description</div>
                  <p className="desc" style={{ whiteSpace: 'pre-wrap' }}>
                    {selected.description}
                  </p>
                </section>
              )}

              {/* other field */}
              <section className="detail-section grid-2">
                {selected.responsibility && (
                  <div>
                    <div className="section-title">responsibility</div>
                    <div className="desc">{selected.responsibility}</div>
                  </div>
                )}
                {selected.requirements && (
                  <div>
                    <div className="section-title">requirements</div>
                    <div className="desc">{selected.requirements}</div>
                  </div>
                )}
              </section>

              <div className="detail-actions">
                <a
                  className={`btn-primary ${!selected.applyUrl ? 'disabled' : ''}`}
                  href={selected.applyUrl || '#'}
                  target="_blank"
                  rel="noreferrer"
                  onClick={e => { if (!selected.applyUrl) e.preventDefault(); }}
                >
                Apply
                </a>
                {/* <button className="btn-ghost">subscrib</button> */}
              </div>
            </>
          ) : (
            <div className="center-tip">Please select the position on the left to view details</div>
          )}
        </main>
      </div>
    </div>
  );
}
