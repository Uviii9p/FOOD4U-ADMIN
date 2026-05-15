/**
 * Extracts the direct image URL from a Google Image search result link.
 * If it's a regular link, it returns it as is.
 */
export const extractImageUrl = (url) => {
  if (!url) return '';
  
  try {
    const urlObj = new URL(url);
    
    // Check if it's a Google image search result link
    if (urlObj.hostname.includes('google') && urlObj.pathname.includes('/imgres')) {
      const imgUrl = urlObj.searchParams.get('imgurl');
      if (imgUrl) return decodeURIComponent(imgUrl);
    }
    
    // Check for other common image search engines if needed
  } catch (e) {
    // If it's not a valid URL (just text), return as is
  }
  
  return url;
};
export const getImageUrl = (imagePath) => {
  if (!imagePath) return '';
  if (imagePath.startsWith('http')) return imagePath;
  
  const baseUrl = import.meta.env.VITE_API_URL 
    ? import.meta.env.VITE_API_URL.replace('/api', '') 
    : 'http://localhost:5001';
    
  return `${baseUrl}${imagePath}`;
};
