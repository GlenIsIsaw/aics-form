import React from 'react'
import { Container, Card, Alert } from 'react-bootstrap'
import { motion } from 'framer-motion'
import { FaWrench } from 'react-icons/fa'

const MaintenanceMode = () => {
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
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            >
              <FaWrench size={48} className="text-white" />
            </motion.div>
          </Card.Header>
          <Card.Body className="custom-card-body text-center">
            <Alert variant="warning">
              <Alert.Heading>System Under Maintenance</Alert.Heading>
              <p>
                We are currently performing scheduled maintenance to improve our services.
                Please check back later.
              </p>
              <hr />
              <p className="mb-0">
                Expected completion: Within the next few hours
              </p>
            </Alert>
          </Card.Body>
        </Card>
      </motion.div>
    </Container>
  )
}

export default MaintenanceMode