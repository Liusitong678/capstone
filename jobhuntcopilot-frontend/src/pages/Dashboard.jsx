import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Navbar from '../components/Navbar';
import '../styles/Dashboard.css';
import { fetchJobs, callScore } from '../services/api';

const Dashboard = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [aiScores, setAiScores] = useState({}); // store AI score per job

  useEffect(() => {
    const ac = new AbortController();
    (async () => {
      try {
        const list = await fetchJobs({ signal: ac.signal });
        setJobs(list);
      } catch (e) {
        if (e.name !== "AbortError") setErr(e.message || "Failed to load jobs");
      } finally {
        setLoading(false);
      }
    })();
    return () => ac.abort();
  }, []);

  const handleFileChange = (e) => setSelectedFile(e.target.files[0]);

  // === Check AI Score ===
  const handleCheckScore = async (jobId) => {
    try {
      const job = jobs.find(j => j._uid === jobId);
      if (!job) return;

      const payload = { jobTitle: job.title, description: job.description };
      const result = await callScore(payload);

      setAiScores(prev => ({ ...prev, [jobId]: result }));
    } catch (err) {
      console.error("Error fetching AI score:", err);
      alert("Failed to fetch AI score");
    }
  };

  return (
    <>
      <Navbar />

      <div className="container my-5">
        {/* Resume Upload Section */}
        <div className="big-card shadow p-5 mx-auto mb-5">
          <div className="upload-section mb-5">
            <div className="d-flex flex-wrap gap-3 align-items-center">
              <input
                type="file"
                className="form-control-file"
                accept=".pdf,.doc,.docx"
                onChange={handleFileChange}
              />
              <button className="btn btn-primary">Upload Resume</button>
            </div>
          </div>

          {/* Search Section */}
          <div className="search-section mb-5">
            <h5 className="section-title">Search Jobs</h5>
            <div className="row g-3">
              <div className="col-md-4">
                <input type="text" className="form-control" placeholder="Search by Keywords" />
              </div>
              <div className="col-md-4">
                <select className="form-select">
                  <option value="">Select Location</option>
                  <option value="newyork">New York</option>
                  <option value="toronto">Toronto</option>
                  <option value="london">London</option>
                </select>
              </div>
              <div className="col-md-4">
                <select className="form-select">
                  <option value="">Job Type</option>
                  <option value="fulltime">Full-time</option>
                  <option value="parttime">Part-time</option>
                  <option value="internship">Internship</option>
                </select>
              </div>
            </div>
          </div>

          {/* Job List + AI Score */}
          <div className="row">
            <div className="col-lg-12 mb-4">
              <h5 className="section-title">Available Jobs</h5>
              {loading && <p>Loading jobs...</p>}
              {err && <p className="text-danger">{err}</p>}
              {!loading && !err && jobs.length === 0 && <p>No positions available</p>}

              <div className="job-list">
                {jobs.map((job) => {
                  const scoreData = aiScores[job._uid] || null;
                  return (
                    <div key={job._uid} className="job-card card mb-3 p-3 shadow-sm">
                      <div className="d-flex justify-content-between align-items-center flex-wrap">
                        <div>
                          <p className="job-title mb-1">{job.title || 'Unnamed position'}</p>
                          <p className="text-muted mb-1">{job.company || 'Unknown company'}</p>
                          <p className="job-desc mb-1">{job.description?.slice(0, 50)}...</p>
                        </div>
                        <div className="d-flex gap-2">
                          {/* Check AI Score Button */}
                          <button
                            className="btn btn-outline-primary btn-sm"
                            onClick={() => handleCheckScore(job._uid)}
                          >
                            Check AI Score
                          </button>

                          <a
                            className={`btn btn-primary btn-sm ${!job.applyUrl ? 'disabled' : ''}`}
                            href={job.applyUrl || '#'}
                            target="_blank"
                            rel="noreferrer"
                            onClick={e => { if (!job.applyUrl) e.preventDefault(); }}
                          >
                            Apply
                          </a>
                        </div>
                      </div>

                      {/* Display AI Score dynamically */}
                      {scoreData && (
                        <div className="mt-3 p-2 border rounded bg-light">
                          <p className="mb-1">
                            <strong>AI Score:</strong> {(scoreData.score * 100).toFixed(2)}%
                          </p>
                          <p className="mb-1">
                            <strong>Matched Skills:</strong> {scoreData.matchedSkills?.join(', ') || 'No skills matched'}
                          </p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
