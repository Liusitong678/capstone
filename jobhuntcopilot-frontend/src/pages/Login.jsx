import React, { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase/firebase";
import { useNavigate, Link } from "react-router-dom";
import { Container, Form, Button, Card, Alert, Spinner } from "react-bootstrap";

const Login = () => {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            await signInWithEmailAndPassword(auth, email, password);
            navigate("/"); // redirect after login
        } catch (err) {
            setError("Invalid email or password.");
        }

        setLoading(false);
    };

    return (
        <Container className="d-flex justify-content-center mt-5">
            <Card style={{ width: "420px" }} className="p-4 shadow-sm">
                <h3 className="text-center mb-3">Login</h3>

                {error && <Alert variant="danger">{error}</Alert>}

                <Form onSubmit={handleLogin}>
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

                    <Form.Group className="mb-4">
                        <Form.Label>Password</Form.Label>
                        <Form.Control
                            type="password"
                            required
                            value={password}
                            placeholder="Enter password"
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </Form.Group>

                    <Button
                        type="submit"
                        className="w-100"
                        disabled={loading}
                        variant="primary"
                    >
                        {loading ? <Spinner animation="border" size="sm" /> : "Login"}
                    </Button>

                    <p className="text-center mt-3">
                        Don't have an account? <Link to="/signup">Create one</Link>
                    </p>
                </Form>
            </Card>
        </Container>
    );
};

export default Login;
