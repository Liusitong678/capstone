// src/components/ResumeViewer.jsx
import React from "react";
import { Card, Button } from "react-bootstrap";

// Minimal modern resume viewer
const ResumeViewer = ({ url }) => {
  if (!url) {
    return (
      <div className="text-muted p-3 text-center">
        No resume uploaded.
      </div>
    );
  }

  // Get file name from URL
  const fileName = url.split("/").pop();

  return (
    <Card className="p-3 resume-viewer-card">
      {/* Header */}
      <h5 className="resume-title mb-3">Resume Preview</h5>

      {/* File Name */}
      <p className="resume-file mb-2">
        <strong>File:</strong> {fileName}
      </p>

      {/* PDF Frame */}
      <iframe
        src={url}
        title="Resume"
        className="resume-frame"
      />

      {/* Download */}
      <div className="mt-3">
        <Button
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="download-btn"
        >
          Download Resume
        </Button>
      </div>
    </Card>
  );
};

export default ResumeViewer;
