// src/cloudinary.js
import { Cloudinary } from "@cloudinary/url-gen";

const cld = new Cloudinary({
  cloud: {
    // REEMPLAZA CON TU "CLOUD NAME" DE CLOUDINARY
    cloudName: 'dhoaeyjpt'
  }
});

export default cld;