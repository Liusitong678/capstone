import React, { useState } from "react";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setFormData({ name: "", email: "", subject: "", message: "" });
      setSubmitted(false);
    }, 3000);
  };

  return (
    <div className="py-5 bg-light">
      <div className="container">
        {/* Header Section */}
        <div className="row justify-content-center mb-4">
          <div className="col-lg-8 text-center">
            <h1 className="fw-bold mb-3 text-primary">Get in Touch</h1>
            <p className="lead text-muted">
              Have questions about JobHuntCopilot? We'd love to hear from you.
              Send us a message and we'll respond as soon as possible.
            </p>
          </div>
        </div>

        <div className="row justify-content-center">
          {/* Contact Form */}
          <div className="col-lg-7 mb-4">
            <div className="card border-0 shadow-sm">
              <div className="card-body p-4">
                <h4 className="fw-semibold text-secondary mb-4">Send Us a Message</h4>
                
                {submitted && (
                  <div className="alert alert-success" role="alert">
                    <strong>Thank you!</strong> Your message has been sent successfully.
                  </div>
                )}

                <div>
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label fw-semibold small">Full Name</label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="John Doe"
                        required
                        className="form-control"
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label fw-semibold small">Email Address</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="john@example.com"
                        required
                        className="form-control"
                      />
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="form-label fw-semibold small">Subject</label>
                    <input
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      placeholder="How can we help you?"
                      required
                      className="form-control"
                    />
                  </div>

                  <div className="mb-4">
                    <label className="form-label fw-semibold small">Message</label>
                    <textarea
                      rows={5}
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Tell us more about your inquiry..."
                      required
                      className="form-control"
                    />
                  </div>

                  <button
                    onClick={handleSubmit}
                    className="btn btn-primary w-100 py-2 fw-semibold"
                  >
                    Send Message
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="col-lg-4 mb-4">
            <div className="card border-0 shadow-sm mb-3">
              <div className="card-body p-4">
                <div className="d-flex align-items-start mb-3">
                  <div 
                    className="bg-primary bg-gradient text-white rounded-circle d-flex align-items-center justify-content-center me-3"
                    style={{ width: "50px", height: "50px", minWidth: "50px", fontSize: "1.2rem" }}
                  >
                    ✉
                  </div>
                  <div>
                    <h6 className="fw-semibold mb-1">Email</h6>
                    <p className="text-muted small mb-0">support@jobhuntcopilot.com</p>
                  </div>
                </div>

                <div className="d-flex align-items-start mb-3">
                  <div 
                    className="bg-success bg-gradient text-white rounded-circle d-flex align-items-center justify-content-center me-3"
                    style={{ width: "50px", height: "50px", minWidth: "50px", fontSize: "1.2rem" }}
                  >
                    ☎
                  </div>
                  <div>
                    <h6 className="fw-semibold mb-1">Phone</h6>
                    <p className="text-muted small mb-0">+1 (519) 123-4567</p>
                  </div>
                </div>

                <div className="d-flex align-items-start">
                  <div 
                    className="bg-info bg-gradient text-white rounded-circle d-flex align-items-center justify-content-center me-3"
                    style={{ width: "50px", height: "50px", minWidth: "50px", fontSize: "1.2rem" }}
                  >
                    📍
                  </div>
                  <div>
                    <h6 className="fw-semibold mb-1">Location</h6>
                    <p className="text-muted small mb-0">
                      Conestoga College<br />
                      Kitchener, ON, Canada
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* <div className="card border-0 shadow-sm bg-primary bg-gradient text-white">
              <div className="card-body p-4">
                <h6 className="fw-semibold mb-2">Business Hours</h6>
                <p className="small mb-2">Monday - Friday: 9:00 AM - 6:00 PM</p>
                <p className="small mb-0">Saturday - Sunday: Closed</p>
              </div>
            </div> */}
          </div>
        </div>

        {/* Footer Section */}
        <div className="row mt-5">
          <div className="col text-center text-muted small">
            <p>
              © {new Date().getFullYear()} JobHuntCopilot | Built for Conestoga College Capstone Project
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;