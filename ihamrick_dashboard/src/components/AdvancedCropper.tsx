import React, { useState, useEffect } from 'react';
import Cropper from 'react-easy-crop';
import {
  X,
  Monitor,
  Tablet,
  Smartphone,
  Square,
  Image as ImageIcon,
  RectangleVertical,
  Tv,
  Film,
} from 'lucide-react';

export const AdvancedCropper = ({ image, onSave, onClose }: any) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [aspect, setAspect] = useState<number | undefined>(undefined);
  const [pixels, setPixels] = useState(null);
  const [originalAspect, setOriginalAspect] = useState<number | undefined>(undefined);

  useEffect(() => {
    const img = new Image();
    img.src = image;
    img.onload = () => {
      const ratio = img.width / img.height;
      setOriginalAspect(ratio);
      setAspect(ratio);
    };
  }, [image]);

  const RATIOS = [
    { label: 'Original', value: originalAspect, icon: <ImageIcon size={14} /> },
    { label: 'Desktop (16:9)', value: 16 / 9, icon: <Monitor size={14} /> },
    { label: 'Laptop (3:2)', value: 3 / 2, icon: <Tablet size={14} /> },
    { label: 'Social (4:5)', value: 4 / 5, icon: <RectangleVertical size={14} /> },
    { label: 'Tablet (4:3)', value: 4 / 3, icon: <Tv size={14} /> },
    { label: 'Mobile (9:16)', value: 9 / 16, icon: <Smartphone size={14} /> },
    { label: 'Square (1:1)', value: 1, icon: <Square size={14} /> },
    { label: 'Cinematic (21:9)', value: 21 / 9, icon: <Film size={14} /> },
  ];

  const handleSave = async () => {
    const canvas = document.createElement('canvas');
    const img = new Image();
    img.src = image;
    await new Promise((res) => (img.onload = res));
    const ctx = canvas.getContext('2d');
    const p: any = pixels;
    canvas.width = p.width;
    canvas.height = p.height;
    ctx?.drawImage(img, p.x, p.y, p.width, p.height, 0, 0, p.width, p.height);

    canvas.toBlob(
      (blob) => {
        if (blob) {
          onSave(blob, URL.createObjectURL(blob));
        }
      },
      'image/jpeg',
      0.95,
    );
  };

  return (
    <div className="fixed inset-0 z-100 flex flex-col bg-zinc-950 font-sans">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/5 bg-black/90 p-4 text-white">
        <div className="flex flex-wrap items-center gap-2">
          {RATIOS.map((r) => (
            <button
              key={r.label}
              onClick={() => setAspect(r.value)}
              className={`flex items-center gap-2 rounded-lg px-3 py-2 text-[10px] font-bold tracking-tight uppercase transition-all ${aspect === r.value ? 'bg-white text-black' : 'bg-white/5 text-white/70 hover:bg-white/10'}`}
            >
              {r.icon} {r.label}
            </button>
          ))}
        </div>
        <button
          onClick={onClose}
          className="ml-4 rounded-full p-2 transition-colors hover:bg-white/10"
        >
          <X size={20} />
        </button>
      </div>

      {/* Cropping Area */}
      <div className="relative flex-1 bg-[#050505]">
        <Cropper
          image={image}
          crop={crop}
          zoom={zoom}
          zoomSpeed={0.2}
          aspect={aspect}
          onCropChange={setCrop}
          onZoomChange={setZoom}
          onCropComplete={(_, p: any) => setPixels(p)}
        />
      </div>

      {/* Footer */}
      <div className="flex flex-col items-center gap-6 bg-black/95 p-8">
        <div className="flex w-full max-w-md items-center gap-5">
          <span className="text-[10px] font-black tracking-[2px] text-white/30 uppercase">
            Zoom
          </span>
          <input
            type="range"
            min={1}
            max={3}
            step={0.1}
            value={zoom}
            onChange={(e) => setZoom(Number(e.target.value))}
            className="h-1 flex-1 cursor-pointer appearance-none rounded-lg bg-white/10 accent-white"
          />
        </div>
        <div className="flex gap-4">
          <button
            onClick={onClose}
            className="px-10 text-[11px] font-black tracking-widest text-white/40 uppercase transition-all hover:text-white"
          >
            Discard
          </button>
          <button
            onClick={handleSave}
            className="rounded-2xl bg-white px-16 py-4 text-[11px] font-black tracking-widest text-black uppercase shadow-2xl transition-all hover:scale-[1.02] active:scale-95"
          >
            Apply & Save
          </button>
        </div>
      </div>
    </div>
  );
};
