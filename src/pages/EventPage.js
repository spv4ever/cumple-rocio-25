// src/pages/EventPage.js
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { AdvancedImage, AdvancedVideo } from '@cloudinary/react';
import { Cloudinary } from "@cloudinary/url-gen";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import Download from "yet-another-react-lightbox/plugins/download";
import { eventsData } from '../eventsData';
import './EventPage.css'; // Renombramos el CSS

const EventPage = () => {
  // Obtenemos el ID del evento desde la URL (ej: "CumpleRocio25")
  const { eventId } = useParams(); 
  
  // Buscamos los detalles del evento para mostrar el título
  const currentEvent = eventsData.find(e => e.id === eventId);
  
  const [assets, setAssets] = useState([]);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const CLOUD_NAME = "dhoaeyjpt";
  const TAG = eventId; // El tag ahora es dinámico

  // ... (el resto del código de useEffect y las funciones es idéntico al de Gallery.js)
  // No es necesario copiarlo aquí, simplemente asegúrate de que esté
  useEffect(() => {
    const fetchAssets = async () => {
        try {
            const resilientFetch = (url) => fetch(url).then(res => res.ok ? res.json() : { resources: [] });
            const imagesPromise = resilientFetch(`https://res.cloudinary.com/${CLOUD_NAME}/image/list/${TAG}.json`);
            const videosPromise = resilientFetch(`https://res.cloudinary.com/${CLOUD_NAME}/video/list/${TAG}.json`);
            const [imagesData, videosData] = await Promise.all([imagesPromise, videosPromise]);
            const taggedImages = (imagesData.resources || []).map(asset => ({ ...asset, resource_type: 'image' }));
            const taggedVideos = (videosData.resources || []).map(asset => ({ ...asset, resource_type: 'video' }));
            const allAssets = [...taggedImages, ...taggedVideos];
            allAssets.sort((a, b) => a.public_id.localeCompare(b.public_id));
            setAssets(allAssets);
        } catch (error) {
            console.error("Error crítico al obtener los assets:", error);
        }
    };
    fetchAssets();
  }, [CLOUD_NAME, TAG]);

  // ... (código de imageAssets, slides, openImage)
   const imageAssets = assets.filter(asset => asset.resource_type === 'image');
    const slides = imageAssets.map(asset => {
        const cld = new Cloudinary({cloud:{cloudName: CLOUD_NAME}});
        return {
            src: cld.image(asset.public_id).toURL(),
            downloadUrl: cld.image(asset.public_id).toURL(),
        }
    });
    const openImage = (publicId) => {
        const imageIndex = imageAssets.findIndex(asset => asset.public_id === publicId);
        if (imageIndex !== -1) {
            setLightboxIndex(imageIndex);
            setLightboxOpen(true);
        }
    };
  
  const cld = new Cloudinary({cloud:{cloudName: CLOUD_NAME}});

  return (
    <div className="event-page">
      <Link to="/" className="back-link">← Volver a todos los eventos</Link>
      <h1 className="event-title">{currentEvent?.title || 'Galería de Evento'}</h1>
      <p className="event-date">{currentEvent?.date}</p>
      
      {assets.length === 0 && <p className="loading-message">Buscando recuerdos...</p>}

      <div className="gallery-container">
        {assets.map((asset) => {
            // ... (el código del map es idéntico, no necesita cambios)
            if (asset.resource_type === 'image') {
                const imageResource = cld.image(asset.public_id).format('auto').quality('auto');
                return (
                    <div key={asset.public_id} className="gallery-item" onClick={() => openImage(asset.public_id)}>
                        <AdvancedImage cldImg={imageResource} />
                    </div>
                );
            } else if (asset.resource_type === 'video') {
                const videoResource = cld.video(asset.public_id).format('auto').quality('auto');
                return (
                    <div key={asset.public_id} className="gallery-item video-item">
                        <AdvancedVideo cldVid={videoResource} controls autoPlay muted loop />
                    </div>
                )
            }
            return null;
        })}
      </div>

      <Lightbox
        open={lightboxOpen}
        close={() => setLightboxOpen(false)}
        slides={slides}
        index={lightboxIndex}
        plugins={[Download]}
      />
    </div>
  );
};

export default EventPage;