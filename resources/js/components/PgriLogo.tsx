import React, { useState } from 'react';

interface PgriLogoProps {
  className?: string;
  size?: number;
  src?: string;
  alt?: string;
}

export const PgriLogo: React.FC<PgriLogoProps> = ({
  className = '',
  size = 64,
  src = '/images/logo.pgri.png',
  alt = 'Logo SMK PGRI 11 CILEDUG',
}) => {
  const [useFallback, setUseFallback] = useState(false);

 
  const imageSource = useFallback ? '/images/sekola_pgri.png' : src;

  return (
    <img
      src={imageSource}
      alt={alt}
      width={size}
      height={size}
      style= {{ width: `${size}px`, height: `${size}px` }}
      className={`object-contain rounded-full select-none shrink-0 ${className}`}
      onError={() => {
        if (!useFallback) {
          setUseFallback(true);
        }
      }}
    />
  );
};
