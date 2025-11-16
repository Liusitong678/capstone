import React, { useEffect, useState } from "react";
import { Spinner, Alert, Button, Card } from "react-bootstrap";
import { fetchLatestResume } from "../services/api";

const ResumeViewer = () => {
  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchResume = async () => {
      try {
        const data = await fetchLatestResume();
        if (data.length === 0) {
          setError("No resume found. Please upload your resume.");
        } else {
          setResume(data.resume);
        }
      } catch (err) {
        setError(err.message || "Failed to load resume.");
      } finally {
        setLoading(false);
      }
    };

    fetchResume();
  }, []);

  if (loading) {
    return <Spinner animation="border" variant="primary" />;
  }

  if (error) {
    return <Alert variant="warning">{error}</Alert>;
  }

  return (
    <Card className="p-4 shadow-sm">
      <h4>Your Latest Resume</h4>

      <p><strong>File:</strong> {resume.fileName}</p>
      <p><strong>Uploaded:</strong> {new Date(resume.uploadedAt).toLocaleString()}</p>

      <iframe
        src={resume.fileUrl}
        title="Resume PDF"
        width="100%"
        height="600px"
        style={{ border: "1px solid #ccc", borderRadius: "8px" }}
      />

      <div className="mt-3">
        <Button
          variant="primary"
          href={resume.fileUrl}
          target="_blank"
          rel="noopener noreferrer"
        >
          Download Resume
        </Button>
      </div>
    </Card>
  );
};

export default ResumeViewer;
