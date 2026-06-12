const SESSION_USER_KEY = 'sessionUser';
const USER_LIST_KEYS = ['watchedAnimeItems', 'favoriteAnimeItems', 'followedAnimeItems'];
const LEGACY_LOCAL_KEYS = [
  'currentUser',
  'profileInfo',
  'watchedMovies',
  'favoriteMovies',
  'followedMovies',
  'registeredUsers',
  ...USER_LIST_KEYS
];

const getUserStorageId = (user) => {
  const rawId = user?.id || user?.email || '';
  return String(rawId).trim().toLowerCase().replace(/[^a-z0-9._-]+/g, '_');
};

const scopedKey = (baseKey, user = getSessionUser()) => {
  const userId = getUserStorageId(user);
  return userId ? `${baseKey}:${userId}` : '';
};

export const clearLegacyLocalUserData = () => {
  for (const key of LEGACY_LOCAL_KEYS) {
    window.localStorage.removeItem(key);
  }
};

export const getSessionUser = () => {
  try {
    return JSON.parse(window.sessionStorage.getItem(SESSION_USER_KEY) || 'null');
  } catch {
    return null;
  }
};

export const resetUserLists = (user = getSessionUser()) => {
  for (const key of USER_LIST_KEYS) {
    const keyForUser = scopedKey(key, user);
    if (keyForUser) {
      window.localStorage.setItem(keyForUser, JSON.stringify([]));
    }
  }
};

export const setSessionUser = (user, options = {}) => {
  clearLegacyLocalUserData();

  if (!user) {
    window.sessionStorage.removeItem(SESSION_USER_KEY);
    return;
  }

  window.sessionStorage.setItem(SESSION_USER_KEY, JSON.stringify(user));

  if (options.resetUserData) {
    resetUserLists(user);
    const profileKey = scopedKey('profileInfo', user);
    if (profileKey) window.localStorage.removeItem(profileKey);
  }
};

export const clearSessionUser = () => {
  clearLegacyLocalUserData();
  window.sessionStorage.removeItem(SESSION_USER_KEY);
};

export const readUserList = (baseKey, user = getSessionUser()) => {
  const key = scopedKey(baseKey, user);
  if (!key) return [];

  try {
    const items = JSON.parse(window.localStorage.getItem(key));
    return Array.isArray(items) ? items : [];
  } catch {
    return [];
  }
};

export const writeUserList = (baseKey, items, user = getSessionUser()) => {
  const key = scopedKey(baseKey, user);
  if (!key) return;

  window.localStorage.setItem(key, JSON.stringify(Array.isArray(items) ? items : []));
};

export const getUserProfileCache = (user = getSessionUser()) => {
  const key = scopedKey('profileInfo', user);
  if (!key) return null;

  try {
    return JSON.parse(window.localStorage.getItem(key) || 'null');
  } catch {
    return null;
  }
};

export const setUserProfileCache = (profile, user = getSessionUser()) => {
  const key = scopedKey('profileInfo', user);
  if (!key) return;

  window.localStorage.setItem(key, JSON.stringify(profile || {}));
};

export const clearUserProfileCache = (user = getSessionUser()) => {
  const key = scopedKey('profileInfo', user);
  if (key) window.localStorage.removeItem(key);
};
