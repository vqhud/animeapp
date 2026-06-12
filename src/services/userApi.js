const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:3001';

const sleep = (ms) => new Promise((resolve) => window.setTimeout(resolve, ms));

const requestJson = async (path, options = {}) => {
  let lastError = null;

  for (let attempt = 0; attempt < 2; attempt += 1) {
    const controller = new AbortController();
    const timeoutId = window.setTimeout(() => controller.abort(), 10000);

    try {
      const response = await fetch(`${API_BASE}${path}`, {
        ...options,
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
          ...(options.headers || {})
        }
      });
      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data.message || data.error || 'Không thể kết nối máy chủ.');
      }

      return data;
    } catch (error) {
      lastError = error;
      if (attempt === 0) await sleep(350);
    } finally {
      window.clearTimeout(timeoutId);
    }
  }

  if (lastError?.name === 'AbortError') {
    throw new Error('Máy chủ phản hồi quá lâu, vui lòng thử lại.');
  }

  throw new Error(lastError?.message || 'Không thể kết nối máy chủ.');
};

export const loginUser = (payload) =>
  requestJson('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify(payload)
  });

export const loginWithGoogle = (accessToken) =>
  requestJson('/api/auth/google', {
    method: 'POST',
    body: JSON.stringify({ accessToken })
  });

export const registerUser = (payload) =>
  requestJson('/api/auth/register', {
    method: 'POST',
    body: JSON.stringify(payload)
  });

export const fetchUserProfile = (userId) => requestJson(`/api/users/${userId}/profile`);

export const updateUserProfile = (userId, payload) =>
  requestJson(`/api/users/${userId}/profile`, {
    method: 'PUT',
    body: JSON.stringify(payload)
  });

export const sendUserFeedback = (payload) =>
  requestJson('/api/feedback', {
    method: 'POST',
    body: JSON.stringify(payload)
  });

export const fetchAnimeComments = (animeTitle, sessionId) =>
  requestJson(`/api/anime-comments?animeTitle=${encodeURIComponent(animeTitle)}&sessionId=${encodeURIComponent(sessionId)}`);

export const postAnimeComment = (payload) =>
  requestJson('/api/anime-comments', {
    method: 'POST',
    body: JSON.stringify(payload)
  });

export const reactToComment = (commentId, payload) =>
  requestJson(`/api/anime-comments/${commentId}/react`, {
    method: 'PUT', 
    body: JSON.stringify(payload)
  });

// Cổng lấy danh sách tin tức từ Backend
export const fetchNewsList = () => requestJson('/api/news');

// Cổng lấy chi tiết 1 bài báo theo ID mẫu
export const fetchNewsDetail = (id) => requestJson(`/api/news/${id}`);