// src/components/EventCard.js
import React from 'react';
import { Link } from 'react-router-dom';
import { AdvancedImage } from '@cloudinary/react';
import { Cloudinary } from "@cloudinary/url-gen";
import { scale } from "@cloudinary/url-gen/actions/resize";
import './EventCard.css';

const EventCard = ({ event }) => {
  const cld = new Cloudinary({
    cloud: {
      cloudName: "dhoaeyjpt" // Tu cloud name
    }
  });

  // Creamos la imagen con una transformación para la tarjeta
    const coverImage = cld.image(event.coverImagePublicId)
                        .resize(scale().width(400)) // <-- Solo escalamos a 400px de ancho
                        .format('auto')
                        .quality('auto');

  return (
    <Link to={`/evento/${event.id}`} className="event-card">
      <div className="event-card-image-wrapper">
        <AdvancedImage cldImg={coverImage} className="event-card-image" />
      </div>
      <div className="event-card-info">
        <h3 className="event-card-title">{event.title}</h3>
        <p className="event-card-date">{event.date}</p>
      </div>
    </Link>
  );
};

export default EventCard;