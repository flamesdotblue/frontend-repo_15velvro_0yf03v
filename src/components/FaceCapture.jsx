import React, { useEffect, useRef, useState } from 'react';

// Simple face embedding from webcam: downscale to 32x32 grayscale and normalize
function computeEmbeddingFromCanvas(canvas) {
  const size = 32;
  const tmp = document.createElement('canvas');
  tmp.width = size;
  tmp.height = size;
  const tctx = tmp.getContext('2d');
  tctx.drawImage(canvas, 0, 0, size, size);
  const imgData = tctx.getImageData(0, 0, size, size).data;
  const vec = [];
  for (let i = 0; i < imgData.length; i += 4) {
    const r = imgData[i];
    const g = imgData[i + 1];
    const b = imgData[i + 2];
    // grayscale
    const gray = 0.299 * r + 0.587 * g + 0.114 * b;
    vec.push(gray / 255);
  }
  // normalize
  const norm = Math.sqrt(vec.reduce((s, v) => s + v * v, 0)) || 1;
  return vec.map((v) => v / norm);
}

export default function FaceCapture({ onCapture, label = 'Capture Face' }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [ready, setReady] = useState(false);
  const [previewDataUrl, setPreviewDataUrl] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function setup() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.onloadedmetadata = () => {
            setReady(true);
          };
        }
      } catch (e) {
        setError('Camera access denied');
      }
    }
    setup();
    return () => {
      const stream = videoRef.current?.srcObject;
      if (stream) {
        stream.getTracks().forEach((t) => t.stop());
      }
    };
  }, []);

  const handleCapture = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;
    const w = video.videoWidth;
    const h = video.videoHeight;
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, w, h);

    const embedding = computeEmbeddingFromCanvas(canvas);
    setPreviewDataUrl(canvas.toDataURL('image/jpeg', 0.8));
    onCapture(embedding);
  };

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
        <div className="aspect-video w-full rounded-lg overflow-hidden border bg-black">
          <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
        </div>
        <div className="space-y-2">
          <canvas ref={canvasRef} className="hidden" />
          {previewDataUrl ? (
            <img src={previewDataUrl} alt="capture" className="aspect-video w-full rounded-lg border object-cover" />
          ) : (
            <div className="aspect-video w-full rounded-lg border grid place-items-center text-sm text-gray-500">
              No capture yet
            </div>
          )}
          <button
            type="button"
            onClick={handleCapture}
            disabled={!ready}
            className="w-full md:w-auto inline-flex items-center justify-center px-4 py-2 rounded bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50"
          >
            {label}
          </button>
          {error && <p className="text-sm text-red-600">{error}</p>}
        </div>
      </div>
    </div>
  );
}
