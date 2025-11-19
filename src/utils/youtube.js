export const getYouTubeId = (raw) => {
  const url = typeof raw === 'string' ? raw.trim() : '';
  if (!url) return '';
  try {
    const u = new URL(url);
    const host = u.hostname.toLowerCase();
    if (host.includes('youtube.com')) {
      const v = u.searchParams.get('v');
      if (v) return v;
      const path = u.pathname.replace(/^\/+|\/+$/g, '');
      const parts = path.split('/');
      if (parts[0] === 'shorts' && parts[1]) return parts[1];
      if (parts[0] === 'embed' && parts[1]) return parts[1];
      return '';
    }
    if (host === 'youtu.be') {
      const id = u.pathname.replace(/^\/+|\/+$/g, '');
      return id || '';
    }
  } catch (err) {
    if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.MODE === 'development') {
      console.debug('[utils/youtube] Falha ao fazer parse da URL do YouTube', { url, error: err });
    }
  }
  const regexes = [
    /youtu\.be\/([A-Za-z0-9_-]{6,})/i,
    /youtube\.com\/watch\?[^#]*v=([A-Za-z0-9_-]{6,})/i,
    /youtube\.com\/shorts\/([A-Za-z0-9_-]{6,})/i,
    /youtube\.com\/embed\/([A-Za-z0-9_-]{6,})/i,
  ];
  for (const rx of regexes) {
    const m = url.match(rx);
    if (m && m[1]) return m[1];
  }
  return '';
};

export const getYouTubeEmbedUrl = (url) => {
  const id = getYouTubeId(url);
  return id ? `https://www.youtube.com/embed/${id}` : '';
};