import React, { useState } from 'react';
import {
  Offcanvas,
  Navbar,
  Nav,
  Button,
  Container,
  Badge,
  Image,
  Stack,
} from 'react-bootstrap';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaBars,
  FaHome,
  FaUser,
  FaUsers,
  FaFileAlt,
  FaCog,
  FaSignOutAlt,
  FaSignInAlt,
  FaUserPlus,
  FaShieldAlt,
  FaBell,
  FaQuestionCircle,
  FaChevronRight,
  FaMoon,
  FaSun,
} from 'react-icons/fa';

const OffCanvasNav = ({
  isAuthenticated = false,
  user = null,
  onLogin,
  onLogout,
  onNavigate,
  unreadNotifications = 0,
}) => {
  const [show, setShow] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleNavigation = (path) => {
    if (onNavigate) onNavigate(path);
    handleClose();
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    // You can implement dark mode logic here
    document.body.classList.toggle('dark-mode');
  };

  // Animation variants
  const menuItemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: (i) => ({
      opacity: 1,
      x: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.3,
        ease: "easeOut",
      },
    }),
  };

  const headerVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4 },
    },
  };

  return (
    <>
      {/* Navbar */}
      <Navbar bg="primary" variant="dark" expand={false} className="mb-4 px-3">
        <Container fluid>
          <Navbar.Brand href="#" className="d-flex align-items-center">
            <motion.div
              initial={{ rotate: -180, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <FaShieldAlt className="me-2" size={24} />
            </motion.div>
            <motion.span
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="fw-bold"
            >
              AICS Application
            </motion.span>
          </Navbar.Brand>

          <div className="d-flex align-items-center gap-2">
            {/* Notifications Badge */}
            {isAuthenticated && unreadNotifications > 0 && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 500 }}
              >
                <Button
                  variant="outline-light"
                  size="sm"
                  className="position-relative me-2"
                  onClick={() => handleNavigation('/notifications')}
                >
                  <FaBell />
                  <Badge
                    bg="danger"
                    className="position-absolute top-0 start-100 translate-middle rounded-pill"
                    style={{ fontSize: '0.6rem' }}
                  >
                    {unreadNotifications}
                  </Badge>
                </Button>
              </motion.div>
            )}

            {/* Menu Button */}
            <Button
              variant="outline-light"
              onClick={handleShow}
              className="d-flex align-items-center"
            >
              <FaBars className="me-2" />
              <span className="d-none d-sm-inline">Menu</span>
            </Button>
          </div>
        </Container>
      </Navbar>

      {/* Offcanvas Menu */}
      <Offcanvas
        show={show}
        onHide={handleClose}
        placement="end"
        className="custom-offcanvas"
        backdropClassName="offcanvas-backdrop-custom"
      >
        <Offcanvas.Header closeButton className="border-bottom">
          <Offcanvas.Title>
            <motion.div
              variants={headerVariants}
              initial="hidden"
              animate="visible"
              className="d-flex align-items-center"
            >
              {isAuthenticated ? (
                <Image
                  src={user?.avatar || `https://ui-avatars.com/api/?name=${user?.name || 'User'}&background=667eea&color=fff&bold=true`}
                  roundedCircle
                  width={40}
                  height={40}
                  className="me-2"
                />
              ) : (
                <FaUser className="me-2 text-primary" size={24} />
              )}
              <div>
                <div className="fw-bold">
                  {isAuthenticated ? user?.name || 'User' : 'Welcome!'}
                </div>
                <small className="text-muted">
                  {isAuthenticated ? user?.email || 'user@example.com' : 'Please sign in'}
                </small>
              </div>
            </motion.div>
          </Offcanvas.Title>
        </Offcanvas.Header>

        <Offcanvas.Body className="p-0">
          {/* User Stats (when authenticated) */}
          {isAuthenticated && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="p-3 border-bottom bg-light"
            >
              <Stack direction="horizontal" gap={3} className="justify-content-center">
                <div className="text-center">
                  <h6 className="mb-0">Applications</h6>
                  <small className="text-primary fw-bold">3</small>
                </div>
                <div className="vr" />
                <div className="text-center">
                  <h6 className="mb-0">Saved</h6>
                  <small className="text-primary fw-bold">2</small>
                </div>
                <div className="vr" />
                <div className="text-center">
                  <h6 className="mb-0">Status</h6>
                  <small className="text-success fw-bold">Active</small>
                </div>
              </Stack>
            </motion.div>
          )}

          {/* Navigation Menu */}
          <Nav className="flex-column p-3">
            <motion.div
              custom={0}
              variants={menuItemVariants}
              initial="hidden"
              animate="visible"
            >
              <Nav.Link
                onClick={() => handleNavigation('/')}
                className="d-flex align-items-center py-3 nav-link-custom"
              >
                <FaHome className="me-3 text-primary" />
                <span>Home</span>
                <FaChevronRight className="ms-auto text-muted" size={12} />
              </Nav.Link>
            </motion.div>

            <motion.div
              custom={1}
              variants={menuItemVariants}
              initial="hidden"
              animate="visible"
            >
              <Nav.Link
                onClick={() => handleNavigation('/application')}
                className="d-flex align-items-center py-3 nav-link-custom"
              >
                <FaFileAlt className="me-3 text-success" />
                <span>Application Form</span>
                <Badge bg="info" className="ms-2">New</Badge>
                <FaChevronRight className="ms-auto text-muted" size={12} />
              </Nav.Link>
            </motion.div>

            {isAuthenticated && (
              <>
                <motion.div
                  custom={2}
                  variants={menuItemVariants}
                  initial="hidden"
                  animate="visible"
                >
                  <Nav.Link
                    onClick={() => handleNavigation('/profile')}
                    className="d-flex align-items-center py-3 nav-link-custom"
                  >
                    <FaUser className="me-3 text-warning" />
                    <span>My Profile</span>
                    <FaChevronRight className="ms-auto text-muted" size={12} />
                  </Nav.Link>
                </motion.div>

                <motion.div
                  custom={3}
                  variants={menuItemVariants}
                  initial="hidden"
                  animate="visible"
                >
                  <Nav.Link
                    onClick={() => handleNavigation('/family')}
                    className="d-flex align-items-center py-3 nav-link-custom"
                  >
                    <FaUsers className="me-3 text-info" />
                    <span>Family Members</span>
                    <Badge bg="secondary" className="ms-2">{familyMembers?.length || 0}</Badge>
                    <FaChevronRight className="ms-auto text-muted" size={12} />
                  </Nav.Link>
                </motion.div>

                <motion.div
                  custom={4}
                  variants={menuItemVariants}
                  initial="hidden"
                  animate="visible"
                >
                  <Nav.Link
                    onClick={() => handleNavigation('/settings')}
                    className="d-flex align-items-center py-3 nav-link-custom"
                  >
                    <FaCog className="me-3 text-secondary" />
                    <span>Settings</span>
                    <FaChevronRight className="ms-auto text-muted" size={12} />
                  </Nav.Link>
                </motion.div>
              </>
            )}

            <motion.div
              custom={5}
              variants={menuItemVariants}
              initial="hidden"
              animate="visible"
            >
              <Nav.Link
                onClick={() => handleNavigation('/help')}
                className="d-flex align-items-center py-3 nav-link-custom"
              >
                <FaQuestionCircle className="me-3 text-info" />
                <span>Help & Support</span>
                <FaChevronRight className="ms-auto text-muted" size={12} />
              </Nav.Link>
            </motion.div>
          </Nav>

          {/* Divider */}
          <hr className="my-2" />

          {/* Footer Actions */}
          <div className="p-3">
            {/* Dark Mode Toggle */}
            <motion.div
              custom={6}
              variants={menuItemVariants}
              initial="hidden"
              animate="visible"
            >
              <Button
                variant="outline-secondary"
                className="w-100 mb-2 d-flex align-items-center justify-content-between"
                onClick={toggleDarkMode}
              >
                <span className="d-flex align-items-center">
                  {darkMode ? <FaSun className="me-2" /> : <FaMoon className="me-2" />}
                  {darkMode ? 'Light Mode' : 'Dark Mode'}
                </span>
                <Badge bg="light" text="dark">Soon</Badge>
              </Button>
            </motion.div>

            {/* Authentication Button */}
            <motion.div
              custom={7}
              variants={menuItemVariants}
              initial="hidden"
              animate="visible"
            >
              {isAuthenticated ? (
                <Button
                  variant="outline-danger"
                  className="w-100 d-flex align-items-center justify-content-center"
                  onClick={() => {
                    if (onLogout) onLogout();
                    handleClose();
                  }}
                >
                  <FaSignOutAlt className="me-2" />
                  Sign Out
                </Button>
              ) : (
                <div className="d-grid gap-2">
                  <Button
                    variant="primary"
                    className="d-flex align-items-center justify-content-center"
                    onClick={() => {
                      if (onLogin) onLogin();
                      handleClose();
                    }}
                  >
                    <FaSignInAlt className="me-2" />
                    Sign In
                  </Button>
                  <Button
                    variant="outline-primary"
                    size="sm"
                    className="d-flex align-items-center justify-content-center"
                    onClick={() => handleNavigation('/register')}
                  >
                    <FaUserPlus className="me-2" />
                    Create Account
                  </Button>
                </div>
              )}
            </motion.div>

            {/* App Version */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="text-center mt-3"
            >
              <small className="text-muted">
                Version 1.0.0 | © 2024 AICS
              </small>
            </motion.div>
          </div>
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
};

export default OffCanvasNav;