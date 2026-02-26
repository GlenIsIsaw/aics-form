import React from 'react'
import { Modal, Button, Row, Col } from 'react-bootstrap'
import { motion } from 'framer-motion'
import { FaCheck, FaTimes, FaSpinner } from 'react-icons/fa'

const ConfirmationModal = ({
  show,
  onHide,
  onConfirm,
  isSubmitting,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
}) => {
  return (
    <Modal show={show} onHide={!isSubmitting ? onHide : null} centered>
      <Modal.Header closeButton={!isSubmitting} className="custom-card-header">
        <Modal.Title className="text-white">
          <motion.span
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
          >
            {title || 'Confirm Action'}
          </motion.span>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="custom-card-body">
        <p>{message}</p>
      </Modal.Body>
      <Modal.Footer className="custom-card-footer">
        <Row>
            <Col>
        <Button
          variant="secondary"
          onClick={onHide}
          disabled={isSubmitting}
          className="custom-btn"
        >
          <FaTimes className="me-2" />
          {cancelText}
        </Button>
        <Button
          variant="primary"
          onClick={onConfirm}
          disabled={isSubmitting}
          className="custom-btn"
        >
          {isSubmitting ? (
            <>
              <FaSpinner className="me-2 spin" />
              Submitting...
            </>
          ) : (
            <>
              <FaCheck className="me-2" />
              {confirmText}
            </>
          )}
        </Button>
        </Col>
        </Row>
      </Modal.Footer>
    </Modal>
  )
}

export default ConfirmationModal