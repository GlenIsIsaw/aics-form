import React from 'react'
import { Container, Card, Alert } from 'react-bootstrap'
import { motion } from 'framer-motion'
import { FaCalendarTimes } from 'react-icons/fa'

const ApplicationEnded = () => {
  return (
    <Container className="d-flex align-items-center justify-content-center min-vh-100">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-100"
        style={{ maxWidth: '500px' }}
      >
        <Card className="custom-card">
          <Card.Header className="custom-card-header text-center">
            <FaCalendarTimes size={48} className="text-white" />
          </Card.Header>
          <Card.Body className="custom-card-body text-center">
            <Alert variant="info">
              <Alert.Heading>Application Period Has Ended</Alert.Heading>
              <p>
                Thank you for your interest. The scholarship application period 
                has officially ended.
              </p>
              <hr />
              <p className="mb-0">
                Please check back for future scholarship opportunities.
              </p>
            </Alert>
          </Card.Body>
        </Card>
      </motion.div>
    </Container>
  )
}

export default ApplicationEnded