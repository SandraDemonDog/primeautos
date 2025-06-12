import React from "react";
import NextImage from "next/image";

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
    <NextImage
      src={src}
      alt={alt}
      width={width || 400} 
      height={height || 300}
      className={`rounded-lg shadow-md ${className}`}
      onError={onError}
    />
  );
};

export default ImageComponent;
