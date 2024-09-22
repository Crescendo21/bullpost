import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';

const BouncingImages = () => {
  const totalImages = 40;
  const imageSize = 40;

  const [images, setImages] = useState(
    Array.from({ length: totalImages }, () => ({
      x: Math.random() * (window.innerWidth - imageSize),
      y: Math.random() * (window.innerHeight - imageSize),
      dx: (Math.random() < 0.5 ? 1 : -1) * (1 + Math.random()),
      dy: (Math.random() < 0.5 ? 1 : -1) * (1 + Math.random()),
      isHovered: false,
    }))
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setImages((currentImages) =>
        currentImages.map((img) => {
          if (img.isHovered) return img; // Ne pas mettre à jour si l'image est survolée

          let { x, y, dx, dy } = img;

          // Rebonds horizontaux
          if (x + dx < 0 || x + dx + imageSize > window.innerWidth) {
            dx = -dx; // Inverse la direction horizontale
          }
          // Rebonds verticaux
          if (y + dy < 0 || y + dy + imageSize > window.innerHeight) {
            dy = -dy; // Inverse la direction verticale
          }

          return {
            ...img,
            x: x + dx,
            y: y + dy,
            dx,
            dy,
          };
        })
      );
    }, 30);

    return () => clearInterval(interval);
  }, []);

  const handleMouseEnter = (index: number) => {
    setImages((currentImages) =>
      currentImages.map((img, i) =>
        i === index ? { ...img, isHovered: true } : img
      )
    );
  };

  const handleMouseLeave = (index: number) => {
    setImages((currentImages) =>
      currentImages.map((img, i) =>
        i === index ? { ...img, isHovered: false } : img
      )
    );
  };

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      {images.map((img, index) => (
        <motion.div
          key={index}
          onMouseEnter={() => handleMouseEnter(index)}
          onMouseLeave={() => handleMouseLeave(index)}
          initial={{ scale: 1 }} // Taille initiale
          animate={img.isHovered ? { scale: 1.2 } : { scale: 1 }} // Animation de taille
          transition={{ type: 'spring', stiffness: 300 }} // Transition douce
          style={{
            position: 'absolute',
            left: `${img.x}px`,
            top: `${img.y}px`,
            width: `${imageSize}px`,
            height: `${imageSize}px`,
            zIndex: img.isHovered ? 10 : 1,
            cursor: 'pointer', // Changer le curseur
          }}
        >
          <Image
            src={`/image${index + 1}.png`}
            alt=""
            width={imageSize}
            height={imageSize}
          />
        </motion.div>
      ))}
    </div>
  );
};

export default BouncingImages;
