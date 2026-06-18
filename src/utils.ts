/**
 * Compresses a base64 image data URL using a Canvas element.
 * It resizes the image so that neither dimension exceeds the maximum bounds,
 * and exports as a compressed JPEG (which usually shrinks file size significantly).
 */
export const compressImage = (
  dataUrl: string,
  maxWidth = 1200,
  maxHeight = 600,
  quality = 0.75
): Promise<string> => {
  return new Promise((resolve) => {
    // If it's not a data URL (e.g., standard HTTP link), just return it as is
    if (!dataUrl || !dataUrl.startsWith('data:image/')) {
      resolve(dataUrl);
      return;
    }

    const img = new Image();
    img.src = dataUrl;
    img.onload = () => {
      let width = img.width;
      let height = img.height;

      // Calculate new dimensions maintaining aspect ratio if either is exceeded
      if (width > maxWidth || height > maxHeight) {
        const widthRatio = maxWidth / width;
        const heightRatio = maxHeight / height;
        const bestRatio = Math.min(widthRatio, heightRatio);

        width = Math.round(width * bestRatio);
        height = Math.round(height * bestRatio);
      }

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        resolve(dataUrl);
        return;
      }

      // Draw and export as compressed jpeg
      ctx.drawImage(img, 0, 0, width, height);
      const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
      
      // If compression somehow failed to reduce size, fallback to original
      if (compressedDataUrl.length >= dataUrl.length) {
        resolve(dataUrl);
      } else {
        resolve(compressedDataUrl);
      }
    };

    img.onerror = () => {
      // In case of error, resolve with original
      resolve(dataUrl);
    };
  });
};
