import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import OffCanvasNav from './components/OffCanvasNav';
import Login from './components/Login';
import SinglePageForm from './pages/SinglePageForm';

function App() {
  const [unreadNotifications] = useState(3);

  return (
    <Router>
      <AuthProvider>
        <OffCanvasNav unreadNotifications={unreadNotifications} />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route 
            path="/application" 
            element={
              <ProtectedRoute>
                <SinglePageForm />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/" 
            element={
              <ProtectedRoute>
                <SinglePageForm />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;