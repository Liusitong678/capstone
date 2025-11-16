import React, { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase/firebase";
import { useNavigate, Link } from "react-router-dom";
import { Container, Form, Button, Card, Alert, Spinner } from "react-bootstrap";

const Signup = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirm, setConfirm] = useState("");

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSignup = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        if (password !== confirm) {
            setError("Passwords do not match.");
            setLoading(false);
            return;
        }

        try {
            await createUserWithEmailAndPassword(auth, email, password);
            navigate("/"); // Redirect to home/dashboard
        } catch (err) {
            setError(err.message);
        }

        setLoading(false);
    };

    return (
        <Container className="d-flex justify-content-center mt-5">
            <Card style={{ width: "420px" }} className="p-4 shadow-sm">
                <h3 className="text-center mb-3">Create Account</h3>

                {error && <Alert variant="danger">{error}</Alert>}

                <Form onSubmit={handleSignup}>
                    <Form.Group className="mb-3">
                        <Form.Label>Email address</Form.Label>
                        <Form.Control
                            type="email"
                            required
                            value={email}
                            placeholder="Enter email"
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Password (min 6 chars)</Form.Label>
                        <Form.Control
                            type="password"
                            required
                            value={password}
                            placeholder="Enter password"
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </Form.Group>

                    <Form.Group className="mb-4">
                        <Form.Label>Confirm Password</Form.Label>
                        <Form.Control
                            type="password"
                            required
                            value={confirm}
                            placeholder="Confirm password"
                            onChange={(e) => setConfirm(e.target.value)}
                        />
                    </Form.Group>

                    <Button
                        type="submit"
                        className="w-100"
                        disabled={loading}
                        variant="primary"
                    >
                        {loading ? <Spinner animation="border" size="sm" /> : "Sign Up"}
                    </Button>

                    <p className="text-center mt-3">
                        Already have an account? <Link to="/login">Login</Link>
                    </p>
                </Form>
            </Card>
        </Container>
    );
};

export default Signup;
