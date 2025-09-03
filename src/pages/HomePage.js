// src/pages/HomePage.js
import React from 'react';
import EventCard from '../components/EventCard';
import { eventsData } from '../eventsData';
import './HomePage.css';

const HomePage = () => {
  return (
    <div className="home-page">
      <h1 className="home-title">Eventos Recientes Familiares</h1>
      <div className="events-grid">
        {eventsData.map(event => (
          <EventCard key={event.id} event={event} />
        ))}
      </div>
    </div>
  );
};

export default HomePage;