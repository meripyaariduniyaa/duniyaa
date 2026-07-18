'use client';

import { CldUploadWidget } from 'next-cloudinary';

export default function CloudinaryUpload({ onUpload }) {
  return (
    <CldUploadWidget
      uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
      options={{ multiple: true, maxFiles: 6, resourceType: 'image', clientAllowedFormats: ['jpg', 'jpeg', 'png', 'webp'] }}
      onSuccess={(result) => result?.info?.secure_url && onUpload(result.info.secure_url)}
    >
      {({ open }) => <button type="button" className="upload-button" onClick={() => open()}>Add memories <span>↗</span></button>}
    </CldUploadWidget>
  );
}
