import React, { useState } from 'react'
import { Container, Card, Form, Button, Alert, Row, Col } from 'react-bootstrap'
import { motion } from 'framer-motion'
import { useAuth } from '../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'
import { FaEnvelope, FaLock, FaSignInAlt, FaUserPlus } from 'react-icons/fa'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [isSignUp, setIsSignUp] = useState(false)
  
  const { signIn, signUp } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      let result
      if (isSignUp) {
        result = await signUp(email, password, {
          full_name: email.split('@')[0], // You can add more fields
        })
      } else {
        result = await signIn(email, password)
      }

      if (result.error) throw result.error
      
      // Successful login/registration
      navigate('/application')
    } catch (error) {
      setError(error.message || 'Authentication failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Container className="d-flex align-items-center justify-content-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-100"
        style={{ maxWidth: '400px' }}
      >
        <Card className="custom-card">
          <Card.Header className="custom-card-header text-center">
            <motion.h4
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mb-0 text-white"
            >
              {isSignUp ? 'Create Account' : 'Welcome Back'}
            </motion.h4>
          </Card.Header>
          <Card.Body className="custom-card-body">
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <Alert variant="danger">{error}</Alert>
              </motion.div>
            )}

            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3">
                <Form.Label className="form-label-custom">
                  <FaEnvelope className="me-2" />
                  User Name
                </Form.Label>
                <Form.Control
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="Enter your user name"
                  className="form-control-custom"
                />
              </Form.Group>

              <Form.Group className="mb-4">
                <Form.Label className="form-label-custom">
                  <FaLock className="me-2" />
                  Password
                </Form.Label>
                <Form.Control
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="Enter your password"
                  className="form-control-custom"
                />
                {isSignUp && (
                  <Form.Text className="text-muted">
                    Password must be at least 6 characters
                  </Form.Text>
                )}
              </Form.Group>

              <Button
                type="submit"
                variant="primary"
                className="w-100 mb-3 custom-btn"
                disabled={loading}
              >
                {loading ? (
                  'Processing...'
                ) : (
                  <>
                    {isSignUp ? <FaUserPlus className="me-2" /> : <FaSignInAlt className="me-2" />}
                    {isSignUp ? 'Sign Up' : 'Sign In'}
                  </>
                )}
              </Button>
            </Form>

            {/* Demo credentials */}
            <div className="text-center mt-3">
              <small className="text-muted">
                Demo: demo@example.com / demo123
              </small>
            </div>
          </Card.Body>
        </Card>
      </motion.div>
    </Container>
  )
}

export default Login