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

import { ExecutiveReport } from './types';

export const isCourseCompleted = (report: ExecutiveReport, userEmail: string): boolean => {
  const emailKey = userEmail || 'guest';
  const saved = localStorage.getItem(`masonic_completed_${emailKey}_${report.id}`);
  const completedMaterials = saved ? JSON.parse(saved) : {};
  
  let totalCount = 0;
  let completedCount = 0;
  
  if (report.htmlContent) {
    totalCount++;
    if (completedMaterials['htmlContent']) completedCount++;
  }
  if (report.material1Link) {
    totalCount++;
    if (completedMaterials['material1']) completedCount++;
  }
  if (report.material2Link) {
    totalCount++;
    if (completedMaterials['material2']) completedCount++;
  }
  if (report.material3Link) {
    totalCount++;
    if (completedMaterials['material3']) completedCount++;
  }
  if (report.material4Link) {
    totalCount++;
    if (completedMaterials['material4']) completedCount++;
  }
  if (report.material5Link) {
    totalCount++;
    if (completedMaterials['material5']) completedCount++;
  }
  if (report.material6Link) {
    totalCount++;
    if (completedMaterials['material6']) completedCount++;
  }
  if (report.linkedQuestionnaireId) {
    totalCount++;
    if (completedMaterials['linked_questionnaire']) completedCount++;
  }
  if (report.additionalLink && !report.conteudoSemProva) {
    totalCount++;
    if (completedMaterials['proof']) completedCount++;
  }
  
  if (totalCount === 0) return false;
  return completedCount === totalCount;
};

