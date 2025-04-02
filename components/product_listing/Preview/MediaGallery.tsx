
import React, { useState } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { Product } from '@/Types';

interface MediaGalleryProps {
  productData: Product;
}

const MediaGallery: React.FC<MediaGalleryProps> = ({ productData }) => {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  
  const allMedia = [
    ...(productData.images || []),
    ...(productData.demo_video ? [productData.demo_video] : [])
  ];

  const scrollToNext = () => {
    if (allMedia.length <= 1) return;
    setActiveImageIndex((prevIndex) => (prevIndex + 1) % allMedia.length);
  };

  const scrollToPrev = () => {
    if (allMedia.length <= 1) return;
    setActiveImageIndex((prevIndex) => (prevIndex - 1 + allMedia.length) % allMedia.length);
  };

  if (allMedia.length === 0) {
    return (
      <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-gray-100 flex items-center justify-center">
        <p className="text-gray-400">No images provided</p>
      </div>
    );
  }

  return (
    <div className="relative">
      <div className="w-full overflow-hidden rounded-xl bg-gray-100">
        <div className="relative aspect-square w-full overflow-hidden">
          {activeImageIndex < (productData.images?.length || 0) ? (
            <img 
              src={allMedia[activeImageIndex]} 
              alt={`${productData.title || 'Product'} image`}
              className="w-full h-full object-cover transition-opacity duration-300"
            />
          ) : (
            <video 
              src={productData.demo_video || ''} 
              controls
              className="w-full h-full object-cover"
              poster={productData.images?.[0] || ''}
            >
              Your browser does not support the video tag.
            </video>
          )}
        </div>
      </div>
      
      {/* Thumbnail navigation */}
      {allMedia.length > 1 && (
        <div className="mt-4 overflow-x-auto no-scrollbar">
          <div className="flex space-x-2 pb-2">
            {allMedia.map((media, index) => (
              <button 
                key={index} 
                onClick={() => setActiveImageIndex(index)}
                className={`relative shrink-0 rounded-md overflow-hidden w-16 h-16 border-2 ${
                  activeImageIndex === index ? 'border-red-500' : 'border-transparent'
                }`}
              >
                {index < (productData.images?.length || 0) ? (
                  <img 
                    src={media} 
                    alt={`Thumbnail ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="bg-gray-200 w-full h-full flex items-center justify-center">
                    <div className="w-8 h-8 rounded-full bg-red-500 flex items-center justify-center">
                      <div className="w-0 h-0 border-t-4 border-t-transparent border-l-8 border-l-white border-b-4 border-b-transparent ml-1"></div>
                    </div>
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
      
      {/* Navigation arrows */}
      {allMedia.length > 1 && (
        <>
          <button 
            onClick={scrollToPrev}
            className="absolute left-2 top-1/3 z-10 h-8 w-8 rounded-full bg-white/80 flex items-center justify-center shadow-md hover:bg-white"
            aria-label="Previous image"
          >
            <ArrowLeft size={16} />
          </button>
          <button 
            onClick={scrollToNext}
            className="absolute right-2 top-1/3 z-10 h-8 w-8 rounded-full bg-white/80 flex items-center justify-center shadow-md hover:bg-white"
            aria-label="Next image"
          >
            <ArrowRight size={16} />
          </button>
        </>
      )}
    </div>
  );
};

export default MediaGallery;