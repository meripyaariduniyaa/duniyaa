'use client';

import { useState, useRef } from 'react';

export default function CloudinaryUpload({
  onUpload,
  maxPhotos = 6,
  currentCount = 0,
  images,
  setImages,
  maxImages,
}) {
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');

  const cameraInputRef = useRef(null);
  const galleryInputRef = useRef(null);

  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'vkcgnlm1';
  const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || 'apology_images';

  const effectiveMax = maxImages ?? maxPhotos;
  const effectiveCount = Array.isArray(images) ? images.length : currentCount;

  const handleFiles = async (fileList) => {
    if (!fileList || fileList.length === 0) return;
    setUploading(true);
    setUploadError('');

    const files = Array.from(fileList);
    let workingImages = Array.isArray(images) ? [...images] : [];

    for (const file of files) {
      if (!file.type.startsWith('image/')) {
        setUploadError('Please select image files only.');
        continue;
      }
      if (file.size > 15 * 1024 * 1024) {
        setUploadError('Image size should be under 15MB.');
        continue;
      }

      try {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', uploadPreset);
        formData.append('folder', 'user-uploads');

        const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
          method: 'POST',
          body: formData,
        });

        const data = await res.json();
        if (data?.secure_url) {
          workingImages.push(data.secure_url);
          if (typeof onUpload === 'function') {
            onUpload(data.secure_url);
          }
          if (typeof setImages === 'function') {
            setImages([...workingImages]);
          }
        } else {
          setUploadError(data?.error?.message || 'Failed to upload photo.');
        }
      } catch (err) {
        console.error('Cloudinary upload error:', err);
        setUploadError('Upload failed. Please check your internet connection.');
      }
    }

    setUploading(false);
    if (cameraInputRef.current) cameraInputRef.current.value = '';
    if (galleryInputRef.current) galleryInputRef.current.value = '';
  };

  const handleRemove = (indexToRemove) => {
    if (typeof setImages === 'function') {
      const currentList = Array.isArray(images) ? images : [];
      const nextList = currentList.filter((_, i) => i !== indexToRemove);
      setImages(nextList);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
      {/* Hidden File Inputs */}
      <input
        type="file"
        ref={cameraInputRef}
        accept="image/*"
        capture="environment"
        style={{ display: 'none' }}
        onChange={(e) => handleFiles(e.target.files)}
      />
      <input
        type="file"
        ref={galleryInputRef}
        accept="image/*"
        multiple
        style={{ display: 'none' }}
        onChange={(e) => handleFiles(e.target.files)}
      />

      {/* 2-Option Buttons Grid */}
      <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
        <button
          type="button"
          disabled={uploading || effectiveCount >= effectiveMax}
          onClick={() => cameraInputRef.current?.click()}
          style={{
            flex: 1,
            minWidth: '130px',
            padding: '0.75rem 1rem',
            background: 'linear-gradient(135deg, #fff1f2, #ffe4e6)',
            border: '1.5px dashed #f43f5e',
            borderRadius: '12px',
            color: '#be185d',
            fontWeight: 700,
            fontSize: '0.9rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
            cursor: uploading || effectiveCount >= effectiveMax ? 'not-allowed' : 'pointer',
            opacity: uploading || effectiveCount >= effectiveMax ? 0.6 : 1,
            transition: 'all 0.2s ease',
          }}
        >
          <span style={{ fontSize: '1.2rem' }}>📸</span>
          <span>Click Photo</span>
        </button>

        <button
          type="button"
          disabled={uploading || effectiveCount >= effectiveMax}
          onClick={() => galleryInputRef.current?.click()}
          style={{
            flex: 1,
            minWidth: '130px',
            padding: '0.75rem 1rem',
            background: 'linear-gradient(135deg, #fdf2f8, #fce7f3)',
            border: '1.5px dashed #ec4899',
            borderRadius: '12px',
            color: '#9d174d',
            fontWeight: 700,
            fontSize: '0.9rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
            cursor: uploading || effectiveCount >= effectiveMax ? 'not-allowed' : 'pointer',
            opacity: uploading || effectiveCount >= effectiveMax ? 0.6 : 1,
            transition: 'all 0.2s ease',
          }}
        >
          <span style={{ fontSize: '1.2rem' }}>🖼️</span>
          <span>Upload Gallery</span>
        </button>
      </div>

      {uploading && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: '#be185d', fontWeight: 600 }}>
          <div className="spinner" style={{ width: 16, height: 16, borderTopColor: '#be185d' }} />
          <span>Uploading photo to secure cloud...</span>
        </div>
      )}

      {uploadError && (
        <p style={{ color: '#ef4444', fontSize: '0.82rem', margin: 0, fontWeight: 500 }}>
          ⚠️ {uploadError}
        </p>
      )}

      {/* Render Image Thumbnails if images array is provided */}
      {Array.isArray(images) && images.length > 0 && (
        <div style={{ display: 'flex', gap: '8px', marginTop: '8px', flexWrap: 'wrap' }}>
          {images.map((url, index) => (
            <div key={`${url}-${index}`} style={{ position: 'relative', width: 68, height: 68 }}>
              <img
                src={url}
                alt={`Uploaded memory ${index + 1}`}
                style={{ width: '100%', height: '100%', borderRadius: 10, objectFit: 'cover', border: '1px solid #e2e8f0' }}
              />
              {typeof setImages === 'function' && (
                <button
                  type="button"
                  onClick={() => handleRemove(index)}
                  style={{
                    position: 'absolute',
                    top: -6,
                    right: -6,
                    width: 20,
                    height: 20,
                    borderRadius: '50%',
                    background: '#ef4444',
                    color: '#fff',
                    border: 'none',
                    fontSize: '11px',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                  }}
                  title="Remove photo"
                >
                  ✕
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
