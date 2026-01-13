import { Cloudinary } from '@cloudinary/url-gen';

export const cloudinary = new Cloudinary({
  cloud: {
    cloudName: 'dvvjvfois'
  }
});

// Helper to generate optimized Cloudinary URL for a publicId
export const getCloudinaryUrl = (publicId: string) => {
  if (!publicId) return null;
  // If it's already a full URL, return it
  if (publicId.startsWith('http')) return publicId;
  
  return cloudinary
    .image(publicId)
    .format('auto')
    .quality('auto')
    .toURL();
};
