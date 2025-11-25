"use client";
import Image from "next/image";
import { useRef, useState, useEffect } from "react";

interface GalleryProps {
  imageKendaraan: {
    url_gambar: string;
  }[];
}

export default function Gallery({ imageKendaraan = [] }: GalleryProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  
  const images = imageKendaraan.length > 0 ? imageKendaraan.slice(0, 5) : [];

  // Track scroll position to update active index
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container || images.length <= 1) return;

    let scrollTimeout: NodeJS.Timeout;
    
    const handleScroll = () => {
      clearTimeout(scrollTimeout);
      
      scrollTimeout = setTimeout(() => {
        // Calculate which image is most visible
        const containerWidth = container.clientWidth;
        const scrollLeft = container.scrollLeft;
        const imageWidth = containerWidth * 0.85 + 16; // 85% width + gap
        
        const newActiveIndex = Math.round(scrollLeft / imageWidth);
        setActiveIndex(Math.min(Math.max(newActiveIndex, 0), images.length - 1));
      }, 100);
    };

    container.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => {
      container.removeEventListener('scroll', handleScroll);
      clearTimeout(scrollTimeout);
    };
  }, [images.length]);

  // Function to scroll to specific image
  const scrollToImage = (index: number) => {
    const container = scrollContainerRef.current;
    if (!container) return;
    
    const containerWidth = container.clientWidth;
    const imageWidth = containerWidth * 0.85 + 16; // 85% width + gap
    const scrollLeft = index * imageWidth;
    
    container.scrollTo({
      left: scrollLeft,
      behavior: 'smooth'
    });
  };

  return (
    <div className="sm:px-6 lg:px-[100px] mx-auto py-4">
      {/* Mobile Layout: Horizontal scroll with swipe */}
      <div className="md:hidden">
        <div 
          ref={scrollContainerRef}
          className="flex gap-4 overflow-x-auto snap-x snap-mandatory scrollbar-hide scroll-smooth touch-pan-x px-4 pb-2"
          style={{
            WebkitOverflowScrolling: 'touch',
          }}
        >
          {images.map((image, index) => (
            <div
              key={index}
              className="relative h-[200px] min-w-[85%] snap-center overflow-hidden rounded-2xl bg-gray-100 flex-shrink-0 mx-auto"
            >
              <Image
                src={image?.url_gambar || "/emptyImage.jpg"}
                alt={`Gallery image ${index + 1}`}
                quality={100}
                fill
                className="object-contain object-center"
                loading={index === 0 ? "eager" : "lazy"}
                sizes="(max-width: 768px) 80vw, 400px"
                draggable={false}
              />
              
              {/* Image counter */}
              <div className="absolute bottom-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded-full">
                {index + 1}/{images.length}
              </div>
            </div>
          ))}
          
          {/* Placeholder if no images */}
          {images.length === 0 && (
            <div className="relative h-[200px] min-w-[85%] snap-center overflow-hidden rounded-2xl bg-gray-100 flex-shrink-0 mx-auto">
              <Image
                src="/emptyImage.jpg"
                alt="Empty Image"
                quality={100}
                fill
                className="object-contain object-center"
                sizes="(max-width: 768px) 80vw, 400px"
                draggable={false}
              />
            </div>
          )}
        </div>

        {/* Dots indicator - only show if there are multiple images */}
        {images.length > 1 && (
          <div className="flex justify-center mt-3 gap-2">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={() => scrollToImage(index)}
                className={`w-2 h-2 rounded-full transition-all duration-300 touch-manipulation ${
                  activeIndex === index 
                    ? 'bg-primary w-6' 
                    : 'bg-gray-300 hover:bg-gray-400'
                }`}
                aria-label={`Go to image ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Desktop Layout: Grid */}
      <div className="hidden md:grid md:grid-cols-4 md:grid-rows-[200px_200px] lg:grid-rows-[250px_250px] gap-4 lg:gap-6">
        {/* Main large image */}
        <div className="md:col-span-2 md:row-span-2 relative overflow-hidden rounded-2xl lg:rounded-3xl bg-gray-100">
          <Image
            src={imageKendaraan?.[0]?.url_gambar || "/emptyImage.jpg"}
            alt="Main gallery image"
            quality={100}
            fill
            className="object-contain object-center"
            priority
            sizes="(max-width: 1024px) 50vw, 40vw"
          />
        </div>

        {/* Small images */}
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="relative overflow-hidden rounded-2xl lg:rounded-3xl bg-gray-100"
          >
            <Image
              src={imageKendaraan?.[i]?.url_gambar || "/emptyImage.jpg"}
              alt={`Gallery image ${i + 1}`}
              quality={100}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 25vw, 20vw"
            />
          </div>
        ))}
      </div>
    </div>
  );
}