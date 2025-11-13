import React, { useState } from "react";
import axios from "axios";

const ResumeUpload = () => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");
  const [alertType, setAlertType] = useState("");

  // Handle file selection
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setMessage("");
    setAlertType("");
  };

  // Handle file upload
  const handleUpload = async () => {
    if (!file) {
      setMessage("Please select a file first!");
      setAlertType("danger");
      return;
    }

    const formData = new FormData();
    formData.append("resume", file);

    try {
      setUploading(true);
      setMessage("");
      setAlertType("");

      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/resume/upload`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      setMessage("✅ Resume uploaded successfully!");
      setAlertType("success");
      setFile(null); // Reset file input
    } catch (error) {
      console.error("Upload error:", error);
      setMessage("❌ Upload failed. Please try again.");
      setAlertType("danger");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="card p-3 mb-4 shadow-sm">
      <h5 className="card-title mb-3">Upload Your Resume</h5>

      {message && (
        <div className={`alert alert-${alertType}`} role="alert">
          {message}
        </div>
      )}

      <div className="mb-3">
        <input
          type="file"
          className="form-control"
          onChange={handleFileChange}
          accept=".pdf,.doc,.docx"
        />
      </div>

      <button
        className="btn btn-primary"
        onClick={handleUpload}
        disabled={uploading}
      >
        {uploading ? (
          <>
            <span
              className="spinner-border spinner-border-sm me-2"
              role="status"
              aria-hidden="true"
            ></span>
            Uploading...
          </>
        ) : (
          "Upload Resume"
        )}
      </button>
    </div>
  );
};

export default ResumeUpload;
