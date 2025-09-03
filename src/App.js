// src/App.js
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import EventPage from './pages/EventPage';
import Header from './components/Header';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        {/* El Header ahora está fuera de las rutas para mostrarse siempre */}
        <Header />
        
        <main>
          <Routes>
            {/* Ruta para la página principal */}
            <Route path="/" element={<HomePage />} />
            
            {/* Ruta dinámica para cada evento */}
            <Route path="/evento/:eventId" element={<EventPage />} />
          </Routes>
        </main>
        
        <footer className="main-footer">
          <p>Recuerdos Familiares &copy; 2025</p>
        </footer>
      </div>
    </BrowserRouter>
  );
}

export default App;