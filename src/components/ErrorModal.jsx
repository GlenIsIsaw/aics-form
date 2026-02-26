import React from 'react'
import { Modal, Button, Alert } from 'react-bootstrap'
import { motion } from 'framer-motion'
import { FaExclamationTriangle } from 'react-icons/fa'

const ErrorModal = ({ show, onHide, title, message, errors = [] }) => {
  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton className="custom-card-header">
        <Modal.Title className="text-white">
          <motion.span
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="d-flex align-items-center"
          >
            <FaExclamationTriangle className="me-2" />
            {title || 'Error'}
          </motion.span>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="custom-card-body">
        <Alert variant="danger">
          <Alert.Heading>{message}</Alert.Heading>
          {errors.length > 0 && (
            <ul className="mb-0 mt-2">
              {errors.map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          )}
        </Alert>
      </Modal.Body>
      <Modal.Footer className="custom-card-footer">
        <Button variant="secondary" onClick={onHide} className="custom-btn">
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

export default ErrorModal