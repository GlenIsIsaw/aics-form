import React from 'react'
import { Modal, Button } from 'react-bootstrap'
import { motion } from 'framer-motion'

const DataPrivacyModal = ({ show, onAccept, onClose }) => {
  return (
    <Modal show={show} onHide={onClose} size="lg" centered backdrop="static">
      <Modal.Header closeButton={false} className="custom-card-header">
        <Modal.Title className="text-white">
          <motion.span
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
          >
            Data Privacy Notice
          </motion.span>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="custom-card-body">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <h5>Republic Act No. 10173 (Data Privacy Act of 2012)</h5>
          <p className="mt-3">
            We value your privacy and are committed to protecting your personal information. 
            By proceeding with this application, you acknowledge and agree to the following:
          </p>
          
          <h6 className="mt-4">Collection of Information</h6>
          <p>
            We collect personal information including but not limited to your name, contact details, 
            address, and other relevant information for the purpose of processing your scholarship application.
          </p>

          <h6 className="mt-4">Use of Information</h6>
          <p>
            Your information will be used solely for evaluation, processing, and administration of 
            the scholarship program. We may also use your contact details to communicate with you 
            regarding your application status.
          </p>

          <h6 className="mt-4">Data Protection</h6>
          <p>
            We implement appropriate technical and organizational security measures to protect your 
            personal information against unauthorized access, alteration, disclosure, or destruction.
          </p>

          <h6 className="mt-4">Your Rights</h6>
          <p>
            You have the right to access, correct, and request deletion of your personal information 
            in accordance with the Data Privacy Act.
          </p>

          <div className="alert alert-info mt-4">
            By clicking "Accept and Continue", you consent to the collection, use, and storage of 
            your personal information as described in this notice.
          </div>
        </motion.div>
      </Modal.Body>
      <Modal.Footer className="custom-card-footer justify-content-center">
        <Button variant="primary" onClick={onAccept} className="custom-btn">
          Accept and Continue
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

export default DataPrivacyModal