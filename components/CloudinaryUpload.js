'use client';

import { CldUploadWidget } from 'next-cloudinary';

export default function CloudinaryUpload({ onUpload }) {
  return (
    <CldUploadWidget
      uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
      options={{ multiple: true, maxFiles: 6, resourceType: 'image', clientAllowedFormats: ['jpg', 'jpeg', 'png', 'webp'] }}
      onSuccess={(result) => result?.info?.secure_url && onUpload(result.info.secure_url)}
    >
      {({ open }) => (
        <button type="button" className="upload-button" onClick={() => open()}>
          Add memories <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline-block', marginLeft: '4px' }}><path d="M5 12h14"/><path d="M12 5v14"/></svg>
        </button>
      )}
    </CldUploadWidget>
  );
}
