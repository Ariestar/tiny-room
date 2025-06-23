import React, { useState } from "react";
import { galleryImages, type GalleryImage } from "../assets/data/gallery";
import "../styles/pages/Gallery.scss";
import { motion, AnimatePresence } from "framer-motion";

const Gallery: React.FC = () => {
  const [selected, setSelected] = useState<number | null>(null);

  return (
    <div className="gallery-page">
      <h1 className="gallery-title">Photo Gallery</h1>
      <div className="gallery-grid">
        {galleryImages.map((img: GalleryImage, idx: number) => (
          <motion.div
            className="gallery-item"
            key={img.src}
            whileHover={{ scale: 1.05 }}
            onClick={() => setSelected(idx)}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
          >
            <img src={img.src} alt={img.alt} />
          </motion.div>
        ))}
      </div>
      <AnimatePresence>
        {selected !== null && (
          <motion.div
            className="gallery-modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelected(null)}
          >
            <motion.img
              src={galleryImages[selected].src}
              alt={galleryImages[selected].alt}
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              onClick={e => e.stopPropagation()}
            />
            <button className="close-btn" onClick={() => setSelected(null)}>×</button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Gallery; 