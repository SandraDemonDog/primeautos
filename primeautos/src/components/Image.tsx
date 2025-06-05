import React from "react";

interface ImageProps {
  src: string; 
  alt: string; 
  width?: number; 
  height?: number; 
  className?: string;
  onError?: () => void; 
}

const ImageComponent: React.FC<ImageProps> = ({
  src,
  alt,
  width,
  height,
  className = "",
  onError,
}) => {
  return (
    <img
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={`rounded-lg shadow-md ${className}`} 
      onError={onError} 
    />
  );
};

export default ImageComponent;
