import React, { useState } from 'react';
import { Modal, Button, Form, Alert } from 'react-bootstrap';
import { motion } from 'framer-motion';
import { FaUser, FaLock, FaSignInAlt } from 'react-icons/fa';

const LoginModal = ({ show, onHide, onLogin }) => {
  const [credentials, setCredentials] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value,
    });
    setError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Simple validation
    if (!credentials.email || !credentials.password) {
      setError('Please fill in all fields');
      return;
    }

    // Demo login (in real app, this would be an API call)
    if (credentials.email === 'demo@aics.gov.ph' && credentials.password === 'demo123') {
      onLogin({
        name: 'Demo User',
        email: credentials.email,
      });
      onHide();
      setCredentials({ email: '', password: '' });
    } else {
      setError('Invalid email or password. Try demo@aics.gov.ph / demo123');
    }
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton className="custom-card-header">
        <Modal.Title className="text-white">
          <motion.span
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="d-flex align-items-center"
          >
            <FaSignInAlt className="me-2" />
            Sign In
          </motion.span>
        </Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit}>
        <Modal.Body className="custom-card-body">
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Alert variant="danger">{error}</Alert>
            </motion.div>
          )}
          
          <Form.Group className="mb-3">
            <Form.Label className="form-label-custom">
              <FaUser className="me-2" />
              Email Address
            </Form.Label>
            <Form.Control
              type="email"
              name="email"
              value={credentials.email}
              onChange={handleChange}
              placeholder="Enter your email"
              className="form-control-custom"
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label className="form-label-custom">
              <FaLock className="me-2" />
              Password
            </Form.Label>
            <Form.Control
              type="password"
              name="password"
              value={credentials.password}
              onChange={handleChange}
              placeholder="Enter your password"
              className="form-control-custom"
            />
          </Form.Group>

          <div className="text-center mt-3">
            <small className="text-muted">
              Demo: demo@aics.gov.ph / demo123
            </small>
          </div>
        </Modal.Body>
        <Modal.Footer className="custom-card-footer">
          <Button variant="secondary" onClick={onHide} className="custom-btn">
            Cancel
          </Button>
          <Button type="submit" variant="primary" className="custom-btn">
            Sign In
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default LoginModal;