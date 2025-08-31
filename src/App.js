// src/App.js
import React from 'react';
import Header from './components/Header';
import Gallery from './components/Gallery';
import './App.css';

function App() {
  return (
    <div className="App">
      <Header />
      <main>
        <Gallery />
      </main>
      <footer className="main-footer">
        <p>Rocío's 25th Birthday Bash &copy; 2025</p>
      </footer>
    </div>
  );
}

export default App;