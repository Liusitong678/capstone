import React, { useEffect, useState } from "react";
import { 
  Container, Table, Button, Badge, Modal, Form, InputGroup, Spinner, Alert 
} from "react-bootstrap";
import { 
  Trash2, Edit, Plus, Search, Shield, ShieldAlert, ShieldCheck, User as UserIcon 
} from "lucide-react";
// FIXED IMPORTS: specific to the current directory structure
import { fetchAllUsers, updateUserRole, createUserAsAdmin, deleteUser } from "../services/api";
import { useAuth } from "../firebase/useAuth";

const SuperAdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [formType, setFormType] = useState("create");

  const { firebaseUser, loading: authLoading } = useAuth();
  
  // Form State
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    role: "free",
    uid: ""
  });

  // Fetch Users
  const loadUsers = async () => {
    setLoading(true);
    try {
      const list = await fetchAllUsers();
      setUsers(list);
      setError("");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (authLoading) return;
    if (!firebaseUser) return;
    loadUsers();
  }, [authLoading, firebaseUser]);

  // Handlers
  const handleDelete = async (uid) => {
    if (!window.confirm("Are you sure? This will delete the user from Auth and Database.")) return;
    try {
      await deleteUser(uid);
      setUsers(users.filter((u) => u.firebaseUid !== uid));
    } catch (err) {
      alert("Failed to delete: " + err.message);
    }
  };

  const handleRoleChange = async (uid, newRole) => {
    if(!window.confirm(`Are you sure you want to change this user's role to ${newRole.toUpperCase()}?`)) return;
    
    try {
      await updateUserRole(uid, newRole);
      // Optimistic update
      setUsers(users.map(u => u.firebaseUid === uid ? { ...u, role: newRole } : u));
    } catch (err) {
      alert("Failed to update role: " + err.message);
      loadUsers(); // Revert on failure
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (formType === "create") {
        await createUserAsAdmin(formData);
        alert("User created successfully");
      } 
      
      setShowModal(false);
      loadUsers();
      resetForm();
    } catch (err) {
      alert("Error: " + err.message);
    }
  };

  const resetForm = () => {
    setFormData({ firstName: "", lastName: "", email: "", password: "", role: "free", uid: "" });
  };

  const openCreateModal = () => {
    resetForm();
    setFormType("create");
    setShowModal(true);
  };

  // Helper for Role Colors
  const getRoleColor = (role) => {
    switch(role) {
      case 'admin': return 'danger';
      case 'premium': return 'primary';
      default: return 'secondary';
    }
  };

  return (
    <Container fluid className="p-4 bg-light min-vh-100">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="mb-0 fw-bold text-dark">User Management</h2>
          <p className="text-muted">Manage system access and user roles</p>
        </div>
        <Button variant="primary" onClick={openCreateModal} className="d-flex align-items-center gap-2 shadow-sm">
          <Plus size={18} /> Add New User
        </Button>
      </div>

      {error && <Alert variant="danger">{error}</Alert>}

      <div className="card shadow-sm border-0">
        <div className="card-body p-0">
          {loading ? (
            <div className="text-center p-5">
              <Spinner animation="border" variant="primary" />
            </div>
          ) : (
            <Table hover responsive className="mb-0 align-middle">
              <thead className="bg-light">
                <tr>
                  <th className="ps-4 py-3 text-secondary text-uppercase fs-7 fw-bold" style={{fontSize: '0.85rem'}}>User</th>
                  <th className="py-3 text-secondary text-uppercase fs-7 fw-bold" style={{fontSize: '0.85rem'}}>Email</th>
                  <th className="py-3 text-secondary text-uppercase fs-7 fw-bold" style={{fontSize: '0.85rem'}}>Role</th>
                  <th className="py-3 text-end pe-4 text-secondary text-uppercase fs-7 fw-bold" style={{fontSize: '0.85rem'}}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.firebaseUid} className="border-bottom">
                    <td className="ps-4 py-3">
                      <div className="d-flex align-items-center">
                        <div 
                          className="rounded-circle bg-primary text-white d-flex justify-content-center align-items-center me-3 fw-bold"
                          style={{ width: "40px", height: "40px", fontSize: "1.1rem" }}
                        >
                          {user.firstName?.[0]?.toUpperCase() || "U"}
                        </div>
                        <div>
                          <div className="fw-semibold text-dark">
                            {user.firstName} {user.lastName}
                          </div>
                          <div className="text-muted small">ID: ...{user.firebaseUid.slice(-6)}</div>
                        </div>
                      </div>
                    </td>
                    <td className="text-secondary">{user.email}</td>
                    <td>
                      <Form.Select
                        size="sm"
                        value={user.role || 'free'}
                        onChange={(e) => handleRoleChange(user.firebaseUid, e.target.value)}
                        style={{ width: '130px', fontWeight: 'bold' }}
                        className={`text-${getRoleColor(user.role)} border-${getRoleColor(user.role)}`}
                      >
                        <option value="free">Free</option>
                        <option value="premium">Premium</option>
                        <option value="admin">Admin</option>
                      </Form.Select>
                    </td>
                    <td className="text-end pe-4">
                      <Button 
                        variant="link" 
                        className="text-danger p-1"
                        onClick={() => handleDelete(user.firebaseUid)}
                      >
                        <Trash2 size={18} />
                      </Button>
                    </td>
                  </tr>
                ))}
                {users.length === 0 && (
                  <tr>
                    <td colSpan="4" className="text-center py-5 text-muted">No users found.</td>
                  </tr>
                )}
              </tbody>
            </Table>
          )}
        </div>
      </div>

      {/* CREATE/EDIT MODAL */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>{formType === "create" ? "Add New User" : "Edit User"}</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <div className="row g-3">
              <div className="col-6">
                <Form.Group>
                  <Form.Label>First Name</Form.Label>
                  <Form.Control 
                    type="text" 
                    required 
                    value={formData.firstName}
                    onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                  />
                </Form.Group>
              </div>
              <div className="col-6">
                <Form.Group>
                  <Form.Label>Last Name</Form.Label>
                  <Form.Control 
                    type="text" 
                    required 
                    value={formData.lastName}
                    onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                  />
                </Form.Group>
              </div>
              <div className="col-12">
                <Form.Group>
                  <Form.Label>Email Address</Form.Label>
                  <Form.Control 
                    type="email" 
                    required 
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                  />
                </Form.Group>
              </div>
              {formType === "create" && (
                <div className="col-12">
                  <Form.Group>
                    <Form.Label>Password</Form.Label>
                    <Form.Control 
                      type="password" 
                      required 
                      minLength={6}
                      value={formData.password}
                      onChange={(e) => setFormData({...formData, password: e.target.value})}
                    />
                  </Form.Group>
                </div>
              )}
              <div className="col-12">
                <Form.Group>
                  <Form.Label>Role</Form.Label>
                  <Form.Select 
                    value={formData.role}
                    onChange={(e) => setFormData({...formData, role: e.target.value})}
                  >
                    <option value="free">Free User</option>
                    <option value="premium">Premium</option>
                    <option value="admin">Admin</option>
                  </Form.Select>
                </Form.Group>
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
            <Button variant="primary" type="submit">
              {formType === "create" ? "Create User" : "Save Changes"}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </Container>
  );
};

export default SuperAdminDashboard;