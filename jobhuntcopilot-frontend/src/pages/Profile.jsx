import React from "react";
import ResumeUpload from "../components/ResumeUpload";
import { Edit2, Save, Mail, MapPin } from "lucide-react"; // optional icons
import "../styles/profile.css";

const Profile = () => {
  return (
    <div className="container mt-5">
      <div className="row">
        {/* Left profile section */}
        <div className="col-md-4 mb-4">
          <div className="card p-3 shadow-sm">
            <div className="text-center">
              <img
                src="https://via.placeholder.com/120"
                alt="Profile"
                className="rounded-circle mb-3"
              />
              <h4>Aswathy Chandran</h4>
              <p>
                <Mail size={16} className="me-1" /> aswathy@example.com
              </p>
              <p>
                <MapPin size={16} className="me-1" /> Waterloo, Ontario
              </p>
            </div>
          </div>
        </div>

        {/* Right section */}
        <div className="col-md-8">
          <div className="card p-3 shadow-sm mb-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5>Profile Details</h5>
              <button className="btn btn-sm btn-outline-primary">
                <Edit2 size={16} className="me-1" />
                Edit
              </button>
            </div>
            <div>
              <p><strong>Full Name:</strong> Aswathy Chandran</p>
              <p><strong>Email:</strong> aswathy@example.com</p>
              <p><strong>Location:</strong> Waterloo, Ontario</p>
            </div>
          </div>

          {/* Resume Upload Section */}
          <ResumeUpload />
        </div>
      </div>
    </div>
  );
};

export default Profile;
