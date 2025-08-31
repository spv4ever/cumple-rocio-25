// src/components/Gallery.js (VERSIÓN FINAL Y ROBUSTA)

import React, { useState, useEffect } from 'react';
import { AdvancedImage, AdvancedVideo } from '@cloudinary/react';
import { Cloudinary } from "@cloudinary/url-gen";

import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import Download from "yet-another-react-lightbox/plugins/download";

import './Gallery.css';

const Gallery = () => {
    const [assets, setAssets] = useState([]);
    const [lightboxOpen, setLightboxOpen] = useState(false);
    const [lightboxIndex, setLightboxIndex] = useState(0);

    // Usa tu cloud_name aquí
    const CLOUD_NAME = "dhoaeyjpt"; 
    const TAG = "CumpleRocio25";

    useEffect(() => {
        const fetchAssets = async () => {
            try {
                // Función auxiliar para manejar el fetch y los posibles errores 404
                const resilientFetch = (url) => fetch(url).then(res => {
                    // Si la respuesta es OK (200), la procesamos como JSON.
                    // Si no es OK (ej. 404), devolvemos un objeto con recursos vacíos.
                    if (res.ok) {
                        return res.json();
                    }
                    return { resources: [] };
                });

                // Petición para obtener IMÁGENES
                const imagesPromise = resilientFetch(`https://res.cloudinary.com/${CLOUD_NAME}/image/list/${TAG}.json`);

                // Petición para obtener VÍDEOS
                const videosPromise = resilientFetch(`https://res.cloudinary.com/${CLOUD_NAME}/video/list/${TAG}.json`);

                // Esperamos a que ambas peticiones terminen (ninguna fallará ahora)
                const [imagesData, videosData] = await Promise.all([imagesPromise, videosPromise]);
                
                // Añadimos la propiedad 'resource_type' a cada objeto manualmente
                const taggedImages = (imagesData.resources || []).map(asset => ({ ...asset, resource_type: 'image' }));
                const taggedVideos = (videosData.resources || []).map(asset => ({ ...asset, resource_type: 'video' }));

                // Combinamos los resultados en un solo array
                const allAssets = [...taggedImages, ...taggedVideos];

                // Ordenar por public_id para un orden consistente
                allAssets.sort((a, b) => a.public_id.localeCompare(b.public_id));
                
                setAssets(allAssets);

            } catch (error) {
                // Este error solo ocurriría por problemas de red, no por 404
                console.error("Error crítico al obtener los assets:", error);
            }
        };

        fetchAssets();
    }, [CLOUD_NAME, TAG]);
    
    if (assets.length === 0) {
        return <p className="loading-message">Buscando los recuerdos de Rocío...</p>;
    }

    // El resto del código no necesita cambios
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
        <>
            <div className="gallery-container">
                {assets.map((asset) => {
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
        </>
    );
};

export default Gallery;