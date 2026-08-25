// =====================================================
// API BASE URL
// =====================================================
const API_BASE_URL =
  process.env.REACT_APP_API_URL || 'http://127.0.0.1:8000';


// =====================================================
// FORMAT DATE
// =====================================================
export const formatDate = (date) => {
  if (!date) return '';

  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};


// =====================================================
// FORMAT TIME
// =====================================================
export const formatTime = (date) => {
  if (!date) return '';

  return new Date(date).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });
};


// =====================================================
// TRUNCATE TEXT
// =====================================================
export const truncateText = (text, length = 100) => {
  if (!text) return '';

  if (text.length <= length) {
    return text;
  }

  return text.substring(0, length) + '...';
};


// =====================================================
// GET INITIALS
// =====================================================
export const getInitials = (name) => {
  if (!name) return '';

  return name
    .split(' ')
    .map((word) => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};


// =====================================================
// VALIDATE EMAIL
// =====================================================
export const isValidEmail = (email) => {
  if (!email) return false;

  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};


// =====================================================
// VALIDATE PHONE NUMBER
// =====================================================
export const isValidPhone = (phone) => {
  if (!phone) return false;

  return /^[0-9+\s\-()]{10,15}$/.test(phone);
};


// =====================================================
// GET YOUTUBE VIDEO ID
// =====================================================
export const getYouTubeId = (url) => {
  if (!url) return null;

  const regExp =
    /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;

  const match = url.match(regExp);

  return match && match[2].length === 11
    ? match[2]
    : null;
};


// =====================================================
// GET EMBED URL
// =====================================================
export const getEmbedUrl = (url) => {
  if (!url) return '';

  if (url.includes('youtube.com/watch?v=')) {
    const videoId =
      url.split('v=')[1]?.split('&')[0];

    return `https://www.youtube.com/embed/${videoId}`;
  }

  if (url.includes('youtu.be/')) {
    const videoId =
      url.split('youtu.be/')[1]?.split('?')[0];

    return `https://www.youtube.com/embed/${videoId}`;
  }

  if (url.includes('facebook.com')) {
    return url;
  }

  return url;
};


// =====================================================
// GET IMAGE URL
// =====================================================
export const getImageUrl = (
  image,
  fallback = '/default-avatar.png'
) => {
  // No image
  if (!image) {
    return fallback;
  }

  // Already full URL
  if (
    image.startsWith('http://') ||
    image.startsWith('https://') ||
    image.startsWith('data:') ||
    image.startsWith('blob:')
  ) {
    return image;
  }

  const normalizedPath = String(image)
    .replace(/\\/g, '/')
    .replace(/^\/+/, '');

  return `${API_BASE_URL.replace(/\/+$/, '')}/${normalizedPath}`;
};