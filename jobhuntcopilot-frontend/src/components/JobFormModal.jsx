import { useEffect, useState } from "react";
import { Modal, Form, Button, Row, Col } from "react-bootstrap";

const emptyForm = () => ({
  title: "",
  company: "",
  location: "",
  url: "",
  source: "JSearch",
  postedAt: new Date().toISOString().slice(0, 10),
  skillsText: "",
  description: "",
});

export default function JobFormModal({
  show,
  mode = "add",
  initialJob = null,
  saving = false,
  onHide,
  onSubmit,
}) {
  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    if (!show) return;

    if (initialJob) {
      setForm({
        title: initialJob.title || "",
        company: initialJob.company || "",
        location: initialJob.location || "",
        url: initialJob.url || initialJob.applyUrl || "",
        source: initialJob.source || "JSearch",
        postedAt: initialJob.postedAt
          ? new Date(initialJob.postedAt).toISOString().slice(0, 10)
          : new Date().toISOString().slice(0, 10),
        skillsText: Array.isArray(initialJob.skills)
          ? initialJob.skills.join(", ")
          : "",
        description: initialJob.description || "",
      });
    } else {
      // ✅ Add 模式：清空成默认
      setForm(emptyForm());
    }
  }, [show, initialJob]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = (e) => {
    e.preventDefault();

    const skillsArr = form.skillsText
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    const payload = {
      title: form.title,
      company: form.company || "Unknown",
      description: form.description || "",
      skills: skillsArr,
      location: form.location || "Unknown",
      url: form.url,
      postedAt: form.postedAt ? new Date(form.postedAt) : new Date(),
      source: form.source || "JSearch",
    };

    onSubmit && onSubmit(payload);
  };

  return (
    <Modal show={show} onHide={onHide} centered backdrop="static" size="lg">
      <Form onSubmit={handleSave}>
        <Modal.Header closeButton>
          <Modal.Title>
            {mode === "edit" ? "Edit Job" : "Add Job"}
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Row>
            {/* LEFT column  */}
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Title *</Form.Label>
                <Form.Control
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  placeholder={mode === "add" ? "Front-end Developer" : ""}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Company</Form.Label>
                <Form.Control
                  name="company"
                  value={form.company}
                  onChange={handleChange}
                  placeholder={mode === "add" ? "Amazon" : ""}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Location</Form.Label>
                <Form.Control
                  name="location"
                  value={form.location}
                  onChange={handleChange}
                  placeholder={mode === "add" ? "Toronto, ON" : ""}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Job Url</Form.Label>
                <Form.Control
                  name="url"
                  value={form.url}
                  onChange={handleChange}
                  placeholder={mode === "add" ? "https://..." : ""}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Posted At</Form.Label>
                <Form.Control
                  type="date"
                  name="postedAt"
                  value={form.postedAt}
                  onChange={handleChange}
                  placeholder={mode === "add" ? "React, Node, AWS" : ""}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Source</Form.Label>
                <Form.Control
                  name="source"
                  value={form.source}
                  onChange={handleChange}
                  placeholder={
                    mode === "add"
                      ? "Write a short job summary here..."
                      : ""
                  }
                />
              </Form.Group>
            </Col>

            {/* RIGHT column */}
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Skills (comma separated)</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  name="skillsText"
                  value={form.skillsText}
                  onChange={handleChange}
                  placeholder={
                    mode === "add"
                      ? "React, JavaScript, Node.js, REST APIs"
                      : ""
                  }
                />
              </Form.Group>

              <Form.Group className="mb-0">
                <Form.Label>Description</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={6}
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  placeholder={
                    mode === "add"
                      ? `Add a short summary of the job role here.`
                      : ""
                  }
                />
              </Form.Group>
            </Col>
          </Row>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={onHide} disabled={saving}>
            Cancel
          </Button>
          <Button variant="primary" type="submit" disabled={saving}>
            {saving ? "Saving..." : mode === "edit" ? "Save Changes" : "Create"}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}