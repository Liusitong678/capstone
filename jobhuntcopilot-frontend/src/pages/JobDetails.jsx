import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import { Button, Container, Badge, Stack, Spinner, Modal } from "react-bootstrap";
import { fetchJobById } from "../services/api";
import { useAuth } from "../firebase/useAuth";
import { AuthContext } from "../firebase/AuthContext";


export default function JobDetails() {
  const { firebaseUser } = useContext(AuthContext);
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [coverLoading, setCoverLoading] = useState(false);
  const [coverLetter, setCoverLetter] = useState("");  // store generated text
  const [showModal, setShowModal] = useState(false);  // modal visibility

  const token = localStorage.getItem("token");

  useEffect(() => {
    (async () => {
      try {
        const data = await fetchJobById(id);
        setJob(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  const generateCoverLetter = async () => {
    if (!job) return;

    try {
      setCoverLoading(true);
      
      const res = await fetch("http://localhost:4000/api/ai/coverLetter", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${firebaseUser.accessToken}` },
        body: JSON.stringify({
          jobTitle: job.title,
          jobDescription: job.description
        }),
      });
      const data = await res.json();

      setCoverLetter(data.text?.content);  // save response
      setShowModal(true);          // open modal
    } catch (err) {
      console.error(err);
      alert("Failed to generate cover letter.");
    } finally {
      setCoverLoading(false);
    }
  };

  if (loading) return <div className="p-4">Loading...</div>;
  if (!job) return <div className="p-4">Job not found.</div>;

  return (
    <Container className="py-4">
      <h3>{job.title}</h3>
      <h6 className="text-muted mb-3">{job.company}</h6>

      <Stack direction="horizontal" gap={2} className="flex-wrap mb-3">
        {job.location && <Badge bg="light" text="dark">{job.location}</Badge>}
        {job.level && <Badge bg="light" text="dark">{job.level}</Badge>}
        {Array.isArray(job.skills) &&
          job.skills.map((s, i) => (
            <Badge key={i} bg="light" text="dark">{s}</Badge>
          ))}
      </Stack>

      <p style={{ whiteSpace: "pre-wrap" }}>{job.description}</p>

      <div className="mt-4">
        <Button variant="primary" onClick={generateCoverLetter} disabled={coverLoading}>
          {coverLoading ? (
            <>
              <Spinner animation="border" size="sm" className="me-2" /> Generating...
            </>
          ) : (
            "Generate Cover Letter"
          )}
        </Button>
      </div>

      {/* Modal for Cover Letter */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>Generated Cover Letter</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <pre style={{ whiteSpace: "pre-wrap" }}>{coverLetter}</pre>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}
