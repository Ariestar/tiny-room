import React, { useState, useEffect } from 'react';
import { useGallery } from '../contexts/DataContext';
import '../styles/pages/Gallery.scss';
import { motion, AnimatePresence } from 'framer-motion';
import type { GalleryImage } from '../types';

const Gallery: React.FC = () => {
  const { data: galleryImages, loading, actions } = useGallery();
  const [selected, setSelected] = useState<number | null>(null);

  useEffect(() => {
    // 组件挂载时加载图库数据
    actions.getAll();
  }, []);

  if (loading.isLoading) {
    return (
      <div className="gallery-page">
        <h1 className="gallery-title">Photo Gallery</h1>
        <div className="flex justify-center items-center h-64">
          <div className="text-lg text-gray-600">加载图片中...</div>
        </div>
      </div>
    );
  }

  if (loading.error) {
    return (
      <div className="gallery-page">
        <h1 className="gallery-title">Photo Gallery</h1>
        <div className="flex justify-center items-center h-64">
          <div className="text-lg text-red-600">加载失败: {loading.error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="gallery-page">
      <h1 className="gallery-title">Photo Gallery</h1>
      <div className="gallery-grid">
        {galleryImages.map((img: GalleryImage, idx: number) => (
          <motion.div
            className="gallery-item"
            key={img.id}
            whileHover={{ scale: 1.05 }}
            onClick={() => setSelected(idx)}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
          >
            <img src={img.imageUrl} alt={img.title} />
            <div className="gallery-item-info">
              <h3 className="gallery-item-title">{img.title}</h3>
              <p className="gallery-item-category">{img.category}</p>
              {img.location && <p className="gallery-item-location">📍 {img.location}</p>}
            </div>
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
            <div className="gallery-modal-content">
              <motion.img
                src={galleryImages[selected].imageUrl}
                alt={galleryImages[selected].title}
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.8 }}
                onClick={e => e.stopPropagation()}
              />
              <div className="gallery-modal-info">
                <h3>{galleryImages[selected].title}</h3>
                <p>{galleryImages[selected].description}</p>
                {galleryImages[selected].camera && (
                  <p className="camera-info">📷 {galleryImages[selected].camera}</p>
                )}
                {galleryImages[selected].location && (
                  <p className="location-info">📍 {galleryImages[selected].location}</p>
                )}
                <div className="tags">
                  {galleryImages[selected].tags.map(tag => (
                    <span key={tag} className="tag">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            <button className="close-btn" onClick={() => setSelected(null)}>
              ×
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Gallery;
