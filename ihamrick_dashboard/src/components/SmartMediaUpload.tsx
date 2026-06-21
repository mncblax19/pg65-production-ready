import React, { useEffect, useState } from 'react';
import { Upload } from 'lucide-react';
import { MediaPreview } from './MediaPreview';
import { AdvancedCropper } from './AdvancedCropper';
import { toast } from 'react-toastify';

interface Props {
  onFileChange: (file: File | Blob, preview: string) => void;
  allowedFormats: string[];
  label: string;
  className?: string;
  initialUrl?: string;
  thumbnail?: string;
}

export const SmartMediaUpload = ({
  onFileChange,
  allowedFormats,
  label,
  className,
  initialUrl,
  thumbnail,
}: Props) => {
  const [preview, setPreview] = useState(initialUrl || '');
  const [sourceImage, setSourceImage] = useState<string | null>(null);
  const [fileObj, setFileObj] = useState<any>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [showCropper, setShowCropper] = useState(false);

  useEffect(() => {
    if (initialUrl) {
      setPreview(initialUrl);
    }
  }, [initialUrl]);

  const handleProcess = (file: File) => {
    const isAllowed = allowedFormats.some((fmt) =>
      fmt.includes('/*') ? file.type.startsWith(fmt.split('/')[0]) : file.type === fmt,
    );
    if (!isAllowed) return toast.error(`Only ${allowedFormats.join(', ')} are allowed!`);

    setFileObj(file);
    const url = URL.createObjectURL(file);

    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = () => {
        const base64 = reader.result as string;
        setSourceImage(base64);
        setShowCropper(true);
      };
      reader.readAsDataURL(file);
    } else {
      setPreview(url);
      onFileChange(file, url);
    }
  };

  return (
    <div className={`group relative ${className}`}>
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragging(false);
          const f = e.dataTransfer.files?.[0];
          if (f) handleProcess(f);
        }}
        className={`h-full w-full rounded-3xl border-2 border-dashed transition-all duration-300 ${isDragging ? 'scale-[1.01] border-blue-500 bg-blue-50/50' : 'border-zinc-200 bg-zinc-50 hover:bg-zinc-100/50'}`}
      >
        {preview ? (
          <MediaPreview
            file={fileObj}
            previewUrl={preview}
            fileName={fileObj?.name}
            onResize={() => {
              if (sourceImage) setShowCropper(true);
              else toast.info('Original source not available for this file.');
            }}
            onChange={() => document.getElementById(`input-${label}`)?.click()}
            thumbnail={thumbnail}
          />
        ) : (
          <div
            onClick={() => document.getElementById(`input-${label}`)?.click()}
            className="flex h-full w-full cursor-pointer flex-col items-center justify-center"
          >
            <div className="mb-3 rounded-2xl bg-white p-4 shadow-sm transition-transform group-hover:scale-110">
              <Upload
                size={24}
                className="text-zinc-400 transition-colors group-hover:text-black"
              />
            </div>
            <p className="text-[10px] font-black tracking-[1px] text-zinc-500 uppercase">{label}</p>
          </div>
        )}
        <input
          id={`input-${label}`}
          type="file"
          hidden
          accept={allowedFormats.join(',')}
          onChange={(e) => e.target.files?.[0] && handleProcess(e.target.files[0])}
        />
      </div>

      {/* Cropper Modal */}
      {showCropper && sourceImage && (
        <AdvancedCropper
          image={sourceImage}
          onClose={() => setShowCropper(false)}
          onSave={(blob: Blob, url: string) => {
            setPreview(url);
            onFileChange(blob, url);
            setShowCropper(false);
          }}
        />
      )}
    </div>
  );
};
