'use client';

import { useEffect, useState } from 'react';
import { CldUploadWidget } from 'next-cloudinary';
import { ImagePlus, Trash, Image as ImageIcon } from 'lucide-react';
import Image from 'next/image';

interface ImageUploadProps {
  disabled?: boolean;
  onChange: (value: string) => void;
  onRemove: (value: string) => void;
  value: string[]; // Manejamos array por compatibilidad, aunque usemos uno solo
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  disabled,
  onChange,
  onRemove,
  value
}) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const onUpload = (result: any) => {
    // Al subir, le pasamos la URL segura al formulario padre
    onChange(result.info.secure_url);
  };

  if (!isMounted) {
    return null; // Evita errores de hidratación
  }

  return (
    <div className="mb-4 flex flex-col gap-4">
      {/* 1. Vista Previa de Imágenes subidas */}
      <div className="flex items-center gap-4">
        {value.map((url) => (
          <div key={url} className="relative w-[200px] h-[200px] rounded-md overflow-hidden border border-gray-200">
            <div className="z-10 absolute top-2 right-2">
              <button
                type="button"
                onClick={() => onRemove(url)}
                className="bg-red-500 text-white p-1.5 rounded-md hover:bg-red-600 transition-colors shadow-sm"
              >
                <Trash className="h-4 w-4" />
              </button>
            </div>
            <Image
              fill
              className="object-cover"
              alt="Producto"
              src={url}
            />
          </div>
        ))}
      </div>

      {/* 2. Botón de Subida (Widget) */}
      <CldUploadWidget 
        onSuccess={onUpload} // Cambio: onSuccess es el evento moderno
        uploadPreset="oasis_preset" // ⚠️ CAMBIA ESTO POR TU PRESET (Dato 2)
      >
        {({ open }) => {
          const onClick = () => {
            open();
          };

          return (
            <button 
              type="button" 
              disabled={disabled} 
              onClick={onClick}
              className="flex items-center justify-center gap-2 px-4 py-3 bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg hover:bg-gray-200 transition-all w-full md:w-auto text-gray-600 font-medium"
            >
              <ImagePlus className="h-5 w-5" />
              Subir una imagen
            </button>
          );
        }}
      </CldUploadWidget>
    </div>
  );
}

export default ImageUpload;