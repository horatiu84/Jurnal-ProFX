// src/utils/cloudinaryUpload.js
// Upload unsigned - API secret NU este necesar/expus in frontend

const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

if (!CLOUD_NAME || !UPLOAD_PRESET) {
  console.error(
    '[Cloudinary] Variabilele de environment lipsesc! Asigură-te că VITE_CLOUDINARY_CLOUD_NAME și VITE_CLOUDINARY_UPLOAD_PRESET sunt setate în Netlify → Site configuration → Environment variables.'
  );
}

const UPLOAD_URL = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`;

/**
 * Uploadează un fișier/imagine pe Cloudinary și returnează metadata.
 * @param {File} file - fișierul imagine de uploadat
 * @param {Object} options - opțiuni suplimentare (folder, tags etc.)
 * @returns {Promise<{publicId: string, secureUrl: string, width: number, height: number, format: string}>}
 */
export const uploadToCloudinary = async (file, options = {}) => {
  if (!CLOUD_NAME || !UPLOAD_PRESET) {
    throw new Error('Configurația Cloudinary lipsește. Contactează administratorul.');
  }

  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', UPLOAD_PRESET);

  // Folder dinamic bazat pe opțiunile primite (ex: trades/2026-04/EURUSD)
  if (options.folder) {
    formData.append('folder', options.folder);
  }

  if (options.tags && options.tags.length > 0) {
    formData.append('tags', options.tags.join(','));
  }

  const response = await fetch(UPLOAD_URL, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error?.message || `Upload eșuat: ${response.status}`);
  }

  const data = await response.json();

  return {
    publicId: data.public_id,
    secureUrl: data.secure_url,
    width: data.width,
    height: data.height,
    format: data.format,
    resourceType: data.resource_type,
  };
};

/**
 * Construieste folderul pentru upload bazat pe datele trade-ului.
 * Exemplu: trades/2026-04/Flavius
 */
export const buildTradeFolder = (date, mentor) => {
  const yearMonth = date ? date.substring(0, 7) : new Date().toISOString().substring(0, 7);
  return `trades/${yearMonth}/${mentor || 'general'}`;
};
