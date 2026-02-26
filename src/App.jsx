import React, { useState } from 'react';
import SinglePageForm from './pages/SinglePageForm';
import OffCanvasNav from './components/OffCanvasNav';
import LoginModal from './components/LogInModal';
import { Container } from 'react-bootstrap';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [unreadNotifications, setUnreadNotifications] = useState(3);

  const handleLogin = () => {
    setShowLoginModal(true);
  };

  const handleLoginSuccess = (userData) => {
    setIsAuthenticated(true);
    setUser(userData);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUser(null);
  };

  const handleNavigate = (path) => {
    console.log('Navigating to:', path);
    if (path === '/') {
      window.location.href = '/';
    } else if (path === '/application') {
      document.getElementById('application-form')?.scrollIntoView({ behavior: 'smooth' });
    } else if (path === '/register') {
      alert('Registration page coming soon!');
    }
  };

  const handleSuccess = (data) => {
    console.log('Form submitted successfully:', data);
    setUnreadNotifications(prev => prev + 1);
  };

  return (
    <>
      <OffCanvasNav
        isAuthenticated={isAuthenticated}
        user={user}
        onLogin={handleLogin}
        onLogout={handleLogout}
        onNavigate={handleNavigate}
        unreadNotifications={unreadNotifications}
      />
      <LoginModal
        show={showLoginModal}
        onHide={() => setShowLoginModal(false)}
        onLogin={handleLoginSuccess}
      />
      <Container fluid className="p-0" id="application-form">
        <SinglePageForm onSuccess={handleSuccess} />
      </Container>
    </>
  );
}

export default App;