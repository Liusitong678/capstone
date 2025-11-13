// src/pages/Profile.jsx
import React, { useState, useEffect } from 'react';
import { Upload, Mail, MapPin, Briefcase, Award, FileText, Settings, Edit2, Save, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { fetchSavedJobs } from '../services/api';
import "../styles/profile.css";

const ProfilePage = () => {
  const [editMode, setEditMode] = useState(false);
  const [showResumeModal, setShowResumeModal] = useState(false);
  const [savedCount, setSavedCount] = useState(0);      // ⭐ 真实 Saved Jobs 数量
  const navigate = useNavigate();

  const [profileData, setProfileData] = useState({
    name: 'John Doe',
    email: 'john.doe@example.com',
    location: 'Cambridge, Ontario',
    title: 'Full Stack Developer',
    bio: 'Passionate software developer with 5+ years of experience building scalable web applications. Specialized in React, Node.js, and cloud technologies.',
    experience: '5+ years',
    education: 'Computer Science, Conestoga College',
    resumeUploaded: true,
    resumeName: 'John_Doe_Resume.pdf',
    profileCompletion: 85
  });

  const skills = [
    { name: 'React', level: 90 },
    { name: 'Node.js', level: 85 },
    { name: 'JavaScript', level: 95 },
    { name: 'TypeScript', level: 80 },
    { name: 'MongoDB', level: 75 },
    { name: 'Express.js', level: 85 }
  ];

  const [preferences, setPreferences] = useState({
    jobTypes: ['Full-time', 'Remote'],
    industries: ['Technology', 'Fintech', 'E-commerce'],
    salaryRange: '$70k - $100k',
    willingToRelocate: false
  });

  const applications = [
    { company: 'Tech Corp', position: 'Senior Developer', status: 'Interview', date: '2 days ago', color: '#0d6efd' },
    { company: 'StartupXYZ', position: 'Full Stack Engineer', status: 'Applied', date: '5 days ago', color: '#198754' },
    { company: 'MegaCorp Inc', position: 'React Developer', status: 'Reviewing', date: '1 week ago', color: '#ffc107' }
  ];

  const handleInputChange = (field, value) => {
    setProfileData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => setEditMode(false);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileData(prev => ({
        ...prev,
        resumeUploaded: true,
        resumeName: file.name
      }));
      setShowResumeModal(false);
    }
  };

  // ⭐ 组件加载时，从 /api/saved-jobs 拿真实收藏数量
  useEffect(() => {
    let ignore = false;
    (async () => {
      try {
        const set = await fetchSavedJobs();   // 返回的是 new Set([...ids])
        if (!ignore) setSavedCount(set.size);
      } catch (e) {
        console.error('Failed to fetch saved jobs count', e);
      }
    })();
    return () => {
      ignore = true;
    };
  }, []);

  return (
    <div className="profile-root">
      {/* Toolbar */}
      <div className="profile-toolbar">
        <div className="profile-container">
          <div className="toolbar-content">
            <h4 className="toolbar-title">My Profile</h4>
            <div className="toolbar-buttons">
              {!editMode ? (
                <button className="btn btn-edit" onClick={() => setEditMode(true)}>
                  <Edit2 size={16} /> Edit Profile
                </button>
              ) : (
                <>
                  <button className="btn btn-cancel" onClick={() => setEditMode(false)}>
                    <X size={16} /> Cancel
                  </button>
                  <button className="btn btn-save" onClick={handleSave}>
                    <Save size={16} /> Save Changes
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="profile-container">
        <div className="profile-content">
          <div className="profile-grid">
            {/* Sidebar */}
            <aside className="profile-sidebar">
              {/* Profile Card */}
              <div className="profile-card">
                <div className="profile-header">
                  <div className="avatar">J</div>
                  {editMode ? (
                    <>
                      <input className="input-name" value={profileData.name} onChange={e => handleInputChange('name', e.target.value)} />
                      <input className="input-title" value={profileData.title} onChange={e => handleInputChange('title', e.target.value)} placeholder="Job Title" />
                    </>
                  ) : (
                    <>
                      <h2 className="profile-name">{profileData.name}</h2>
                      <p className="profile-role">{profileData.title}</p>
                    </>
                  )}
                </div>

                <div className="completion-section">
                  <div className="completion-label">
                    <span>Profile Completion</span>
                    <span className="completion-value">{profileData.profileCompletion}%</span>
                  </div>
                  <div className="progress-bar-bg">
                    <div className="progress-fill" style={{ width: `${profileData.profileCompletion}%` }}></div>
                  </div>
                </div>

                <div className="stats-grid">
                  <div className="stat">
                    <div className="stat-number">24</div>
                    <div className="stat-label">Applications</div>
                  </div>
                  <div className="stat">
                    <div className="stat-number">8</div>
                    <div className="stat-label">Interviews</div>
                  </div>

                  {/* ⭐ Saved Jobs：数量用真实值 & 点击跳转 Saved 页面 */}
                  <div
                    className="stat stat-clickable"
                    onClick={() => navigate('/saved')}
                  >
                    <div className="stat-number">{savedCount}</div>
                    <div className="stat-label">Saved Jobs</div>
                  </div>
                </div>
              </div>

              {/* Contact Info */}
              <div className="profile-card">
                <div className="card-header">
                  <Settings size={18} className="icon" />
                  <h3>Contact Information</h3>
                </div>
                <div className="contact-list">
                  <div className="contact-item">
                    <Mail size={16} className="icon" />
                    {editMode ? <input className="input-contact" value={profileData.email} onChange={e => handleInputChange('email', e.target.value)} /> : <span>{profileData.email}</span>}
                  </div>
                  <div className="contact-item">
                    <MapPin size={16} className="icon" />
                    {editMode ? <input className="input-contact" value={profileData.location} onChange={e => handleInputChange('location', e.target.value)} /> : <span>{profileData.location}</span>}
                  </div>
                  <div className="contact-item">
                    <Briefcase size={16} className="icon" />
                    {editMode ? <input className="input-contact" value={profileData.experience} onChange={e => handleInputChange('experience', e.target.value)} /> : <span>{profileData.experience}</span>}
                  </div>
                  <div className="contact-item">
                    <Award size={16} className="icon" />
                    {editMode ? <input className="input-contact" value={profileData.education} onChange={e => handleInputChange('education', e.target.value)} /> : <span>{profileData.education}</span>}
                  </div>
                </div>
              </div>

              {/* Resume */}
              <div className="profile-card">
                <div className="card-header">
                  <FileText size={18} className="icon" />
                  <h3>Resume</h3>
                </div>
                {profileData.resumeUploaded ? (
                  <div className="resume-box">
                    <div className="resume-info">
                      <FileText size={20} className="icon" />
                      <span>{profileData.resumeName}</span>
                    </div>

                    <div className="resume-actions">
                      <button className="btn-outline" onClick={() => setShowResumeModal(true)}>Update</button>
                      <button className="btn-outline-secondary">View</button>
                    </div>
                  </div>
                ) : (
                  <button className="btn-upload" onClick={() => setShowResumeModal(true)}>
                    <Upload size={16} /> Upload Resume
                  </button>
                )}
              </div>
            </aside>

            {/* Main Content */}
            <main className="profile-main">
              {/* About Me */}
              <div className="profile-card">
                <h3>About Me</h3>
                {editMode ? (
                  <textarea className="bio-textarea" rows={4} value={profileData.bio} onChange={e => handleInputChange('bio', e.target.value)} />
                ) : (
                  <p className="bio-text">{profileData.bio}</p>
                )}
              </div>

              {/* Skills */}
              <div className="profile-card">
                <div className="section-header">
                  <h3>Skills & Expertise</h3>
                  {editMode && <button className="btn-add">Add Skill</button>}
                </div>
                <div className="skills-grid">
                  {skills.map(skill => (
                    <div key={skill.name} className="skill-item">
                      <div className="skill-labels">
                        <span className="skill-name">{skill.name}</span>
                        <span className="skill-percent">{skill.level}%</span>
                      </div>
                      <div className="progress-bar-bg">
                        <div className="progress-fill" style={{ width: `${skill.level}%` }}></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Job Preferences */}
              <div className="profile-card">
                <h3>Job Preferences</h3>
                <div className="preferences-grid">
                  <div>
                    <label>Job Types</label>
                    <div className="tags">
                      {preferences.jobTypes.map(t => <span key={t} className="tag tag-primary">{t}</span>)}
                    </div>
                  </div>
                  <div>
                    <label>Industries</label>
                    <div className="tags">
                      {preferences.industries.map(i => <span key={i} className="tag tag-info">{i}</span>)}
                    </div>
                  </div>
                  <div>
                    <label>Desired Salary</label>
                    {editMode ? (
                      <input className="input-salary" value={preferences.salaryRange} onChange={e => setPreferences(p => ({ ...p, salaryRange: e.target.value }))} />
                    ) : (
                      <div className="salary-display">{preferences.salaryRange}</div>
                    )}
                  </div>
                  <div>
                    <label>Willing to Relocate</label>
                    {editMode ? (
                      <label className="checkbox">
                        <input type="checkbox" checked={preferences.willingToRelocate} onChange={e => setPreferences(p => ({ ...p, willingToRelocate: e.target.checked }))} />
                        <span>Yes</span>
                      </label>
                    ) : (
                      <div className="relocate-display">{preferences.willingToRelocate ? 'Yes' : 'No'}</div>
                    )}
                  </div>
                </div>
              </div>

              {/* Recent Applications */}
              <div className="profile-card">
                <h3>Recent Applications</h3>
                <div className="applications">
                  {applications.map(app => (
                    <div key={app.company} className="application-item">
                      <div className="app-avatar" style={{ backgroundColor: `${app.color}20`, color: app.color }}>
                        {app.company[0]}
                      </div>
                      <div className="app-details">
                        <div className="app-position">{app.position}</div>
                        <div className="app-company">{app.company}</div>
                      </div>
                      <div className="app-status">
                        <span className="status-badge">{app.status}</span>
                        <div className="app-date">{app.date}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </main>
          </div>
        </div>
      </div>

      {/* Resume Modal */}
      {showResumeModal && (
        <div className="modal-overlay" onClick={() => setShowResumeModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Upload Resume</h3>
              <button className="close-btn" onClick={() => setShowResumeModal(false)}><X size={24} /></button>
            </div>
            <div className="modal-body">
              <div className="upload-zone">
                <Upload size={48} className="upload-icon" />
                <h4>Drop your resume here or click to browse</h4>
                <p>Supported formats: PDF, DOC, DOCX (Max 5MB)</p>
                <input type="file" accept=".pdf,.doc,.docx" onChange={handleFileUpload} id="file-upload" hidden />
                <label htmlFor="file-upload" className="btn-upload">Choose File</label>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
