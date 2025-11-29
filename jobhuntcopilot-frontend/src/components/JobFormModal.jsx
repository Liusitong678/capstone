import { useEffect, useState } from "react";
import { Modal, Form, Button } from "react-bootstrap";

export default function JobFormModal({
  show,
  mode = "add",          // "add" | "edit"
  initialJob = null,     // AdminDashboard 传进来的 job
  saving = false,        // 正在保存的 loading 状态
  onHide,
  onSubmit,              // (formValues) => void | Promise
}) {
  const [form, setForm] = useState({
    title: "",
    company: "",
    location: "",
    url: "",
    source: "",
    postedAt: "",   // yyyy-mm-dd
    skillsText: "", // 用逗号分隔显示
    description: "",
  });

  // 打开弹窗 / 切换编辑对象时，初始化表单
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
          : "",
        skillsText: Array.isArray(initialJob.skills)
          ? initialJob.skills.join(", ")
          : "",
        description: initialJob.description || "",
      });
    } else {
      // Add 模式：清空
      setForm({
        title: "",
        company: "",
        location: "",
        url: "",
        source: "JSearch",
        postedAt: new Date().toISOString().slice(0, 10),
        skillsText: "",
        description: "",
      });
    }
  }, [show, initialJob]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // 按你给的结构组装 payload
    const skillsArr = form.skillsText
      ? form.skillsText
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean)
      : [];

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
    <Modal show={show} onHide={onHide} centered backdrop="static">
      <Form onSubmit={handleSubmit}>
        <Modal.Header closeButton>
          <Modal.Title>
            {mode === "edit" ? "Edit Job" : "Add Job"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group className="mb-3" controlId="jobTitle">
            <Form.Label>Title *</Form.Label>
            <Form.Control
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              required
              placeholder="Frontend Developer"
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="jobCompany">
            <Form.Label>Company</Form.Label>
            <Form.Control
              type="text"
              name="company"
              value={form.company}
              onChange={handleChange}
              placeholder="DoorDash"
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="jobLocation">
            <Form.Label>Location</Form.Label>
            <Form.Control
              type="text"
              name="location"
              value={form.location}
              onChange={handleChange}
              placeholder="Toronto, ON"
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="jobUrl">
            <Form.Label>Job URL</Form.Label>
            <Form.Control
              type="url"
              name="url"
              value={form.url}
              onChange={handleChange}
              placeholder="https://..."
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="jobPostedAt">
            <Form.Label>Posted At</Form.Label>
            <Form.Control
              type="date"
              name="postedAt"
              value={form.postedAt}
              onChange={handleChange}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="jobSource">
            <Form.Label>Source</Form.Label>
            <Form.Control
              type="text"
              name="source"
              value={form.source}
              onChange={handleChange}
              placeholder="JSearch / Manual"
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="jobSkills">
            <Form.Label>Skills (comma separated)</Form.Label>
            <Form.Control
              as="textarea"
              rows={2}
              name="skillsText"
              value={form.skillsText}
              onChange={handleChange}
              placeholder="React, TypeScript, Node.js"
            />
          </Form.Group>

          <Form.Group className="mb-0" controlId="jobDescription">
            <Form.Label>Description</Form.Label>
            <Form.Control
              as="textarea"
              rows={4}
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Short description of the job..."
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onHide} disabled={saving}>
            Cancel
          </Button>
          <Button variant="primary" type="submit" disabled={saving}>
            {saving ? "Saving..." : mode === "edit" ? "Save Changes" : "Create Job"}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}
