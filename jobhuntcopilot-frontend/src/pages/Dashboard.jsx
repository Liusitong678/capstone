import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Navbar from '../components/Navbar';
import '../styles/Dashboard.css';

const Dashboard = () => {
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  return (
    <>
      {/* Navbar */}
      <Navbar />

      {/* Main Container */}
      <div className="container my-5">
        {/* Big Card */}
        <div className="big-card shadow p-5 mx-auto">
          {/* Upload Section */}
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

          {/* Search & Filters */}
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

          {/* Job List & Match Summary */}
          <div className="row">
            {/* Job List */}
            <div className="col-lg-8 mb-4">
              <h5 className="section-title">Available Jobs</h5>
              <div className="job-list">
                {[1, 2, 3, 4].map((job) => (
                  <div key={job} className="job-card card mb-3 shadow-sm p-3 d-flex justify-content-between align-items-center flex-wrap">
                    <div className="d-flex align-items-center gap-3">
                      <div className="job-icon fs-3">📄</div>
                      <div>
                        <p className="job-title mb-1">Job Title {job}</p>
                        <p className="job-desc mb-0 text-muted">Brief description about the job role.</p>
                      </div>
                    </div>
                    <div className="d-flex gap-2 mt-2 mt-lg-0">
                      <button className="btn btn-outline-primary btn-sm">View Match</button>
                      <button className="btn btn-primary btn-sm">Apply</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Match Summary */}
            <div className="col-lg-4">
              <h5 className="section-title">Match Summary</h5>
              <div className="match-summary card shadow p-4">
                <p className="mb-2">Matched Skills: <span className="fw-bold">8</span></p>
                <p className="mb-3">Missing Skills: <span className="fw-bold">2</span></p>
                <div className="progress mb-2">
                  <div
                    className="progress-bar bg-primary"
                    role="progressbar"
                    style={{ width: '80%' }}
                    aria-valuenow="80"
                    aria-valuemin="0"
                    aria-valuemax="100"
                  >
                    80%
                  </div>
                </div>
                <p className="text-center mb-0 fw-bold">Overall Score</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );    
};

export default Dashboard;
