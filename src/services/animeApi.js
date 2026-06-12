const API_BASE = 'https://graphql.anilist.co';
const HOME_CACHE_KEY = 'hhtq.homeAnimeCache.v5';
const CATALOG_CACHE_KEY = 'hhtq.animeCatalogCache.v2';
const CACHE_TTL = 15 * 60 * 1000;
const STALE_TTL = 24 * 60 * 60 * 1000;
const HOME_ANIME_PAGE_SIZE = 30;
const HOME_ANIME_PAGE_COUNT = 4;
const HOME_MANGA_PAGE_SIZE = 30;
const HOME_MANGA_PAGE_COUNT = 3;

let homeAnimePromise = null;
const animeCatalogPromises = new Map();

const sleep = (ms) => new Promise((resolve) => window.setTimeout(resolve, ms));

const readCache = (key, maxAge = CACHE_TTL) => {
  try {
    const cached = JSON.parse(window.localStorage.getItem(key));
    if (!cached?.savedAt || !cached?.data) return null;
    if (Date.now() - cached.savedAt > maxAge) return null;

    return cached.data;
  } catch {
    return null;
  }
};

const writeCache = (key, data) => {
  try {
    window.localStorage.setItem(key, JSON.stringify({ savedAt: Date.now(), data }));
  } catch {
    // Cache is optional; fallback data still keeps the UI alive.
  }
};

const fetchGraphQL = async (query, variables = {}) => {
  let lastError = null;

  for (let attempt = 0; attempt < 2; attempt += 1) {
    const controller = new AbortController();
    const timeoutId = window.setTimeout(() => controller.abort(), 12000);

    try {
      const response = await fetch(API_BASE, {
        method: 'POST',
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json'
        },
        body: JSON.stringify({ query, variables })
      });

      if (!response.ok) throw new Error(`API Error ${response.status}`);
      return response.json();
    } catch (error) {
      lastError = error;
      if (attempt === 0) await sleep(450);
    } finally {
      window.clearTimeout(timeoutId);
    }
  }

  throw lastError;
};

const pickImage = (anime) => anime?.coverImage?.large || anime?.coverImage?.medium || '';

const pickTrailer = (anime) => {
  if (!anime?.trailer?.id || anime.trailer.site !== 'youtube') return null;

  return {
    id: anime.trailer.id,
    site: anime.trailer.site,
    thumbnail: anime.trailer.thumbnail || ''
  };
};

const titleOf = (anime) =>
  anime?.title?.english ||
  anime?.title?.romaji ||
  anime?.title?.native ||
  'Donghua mới';

const formatViews = (anime) => {
  const popularity = Number(anime?.popularity || 0);
  if (popularity >= 1000000) return `${(popularity / 1000000).toFixed(1)}M lượt xem`;
  if (popularity >= 1000) return `${Math.round(popularity / 1000)}k lượt xem`;

  return `${popularity} lượt xem`;
};

const formatEpisode = (anime, index = 0) => {
  if (anime?.episodes) return `Tập ${anime.episodes}`;
  if (anime?.status === 'NOT_YET_RELEASED') return 'Sắp chiếu';

  return `Tập ${String(index + 1).padStart(2, '0')}`;
};

const genresOf = (anime) => anime?.genres || [];

const toLatest = (anime, index) => [
  titleOf(anime),
  formatViews(anime),
  formatEpisode(anime, index),
  pickImage(anime),
  pickTrailer(anime),
  genresOf(anime)
];

const toVideoRow = (anime, index) => [
  titleOf(anime),
  formatEpisode(anime, index),
  formatViews(anime),
  pickImage(anime),
  pickTrailer(anime),
  genresOf(anime)
];

const toComingSoon = (anime) => [titleOf(anime), pickImage(anime)];

const toRanking = (anime) => [
  titleOf(anime),
  anime?.episodes ? `${anime.episodes} tập` : 'Đang cập nhật',
  formatViews(anime),
  pickImage(anime),
  pickTrailer(anime),
  genresOf(anime)
];

const toNews = (anime, index) => [
  `${titleOf(anime)} vừa cập nhật thông tin mới`,
  `Tin Anime / ${index + 1} giờ trước`,
  formatViews(anime),
  pickImage(anime)
];

const toManga = (manga) => [titleOf(manga), pickImage(manga)];

const toMangaRanking = (manga, index) => [
  titleOf(manga),
  manga?.chapters ? `Chap ${manga.chapters}` : `Chap ${String(index + 1).padStart(2, '0')}`,
  formatViews(manga),
  pickImage(manga)
];

const validRows = (rows) => rows.filter((item) => item.slice(0, 4).every(Boolean));

const requireApiRows = (nextRows, limit) => {
  const rows = validRows(nextRows).slice(0, limit);
  if (!rows.length) throw new Error('API không có dữ liệu hợp lệ');

  return rows;
};

const animeQuery = `
query ($page: Int, $perPage: Int) {
  Page(page: $page, perPage: $perPage) {
    media(
      type: ANIME
      countryOfOrigin: CN
      sort: POPULARITY_DESC
    ) {
      id
      title {
        romaji
        english
        native
      }
      coverImage {
        large
        medium
      }
      popularity
      episodes
      status
      genres
      trailer {
        id
        site
        thumbnail
      }
    }
  }
}
`;

const mangaQuery = `
query ($page: Int, $perPage: Int) {
  Page(page: $page, perPage: $perPage) {
    media(
      type: MANGA
      countryOfOrigin: CN
      sort: POPULARITY_DESC
    ) {
      id
      title {
        romaji
        english
        native
      }
      coverImage {
        large
        medium
      }
      popularity
      chapters
      status
    }
  }
}
`;

const fallbackAnimeRows = [
  ['Tuyết Ưng Lĩnh Chủ', 'Tập 1', '432k lượt xem', '/assets/anime-01.jpg', null, ['Action', 'Fantasy']],
  ['Vạn Cổ Kiếm Tôn', 'Tập 18', '756k lượt xem', '/assets/anime-06.jpg', null, ['Adventure']],
  ['Thiên Đạo Huyền Sư', 'Tập 12', '612k lượt xem', '/assets/anime-07.jpg', null, ['Fantasy']],
  ['Long Tộc Trỗi Dậy', 'Tập mới', '723k lượt xem', '/assets/anime-08.jpg', null, ['Action']],
  ['Ma Vực Phong Thần', 'Tập 09', '488k lượt xem', '/assets/anime-09.jpg', null, ['Supernatural']],
  ['Hỏa Phụng Liên Thành', 'Tập 22', '417k lượt xem', '/assets/anime-10.jpg', null, ['Drama']],
  ['Tinh Hà Chiến Kỷ', 'Tập 15', '365k lượt xem', '/assets/anime-11.jpg', null, ['Sci-Fi']],
  ['Thương Khung Bí Sử', 'Tập 06', '289k lượt xem', '/assets/anime-12.jpg', null, ['Mystery']],
  ['Ngự Kiếm Sơn Hà', 'Tập 30', '842k lượt xem', '/assets/anime-13.jpg', null, ['Action']]
];

const fallbackMangaRows = [
  ['Đại Chúa Tể', '/assets/anime-02.jpg'],
  ['Linh Kiếm Tôn', '/assets/anime-03.jpg'],
  ['Võ Luyện Đỉnh Phong', '/assets/anime-04.jpg'],
  ['Tiên Nghịch', '/assets/anime-05.jpg'],
  ['Thần Ấn Vương Tọa', '/assets/anime-06.jpg']
];

const expandRows = (rows, count) =>
  Array.from({ length: count }, (_, index) => {
    const item = rows[index % rows.length];
    if (index < rows.length) return item;

    const season = Math.floor(index / rows.length) + 1;
    return [`${item[0]} ${season}`, ...item.slice(1)];
  });

const fallbackHomeAnime = () => {
  const latestAnime = expandRows(fallbackAnimeRows, HOME_ANIME_PAGE_SIZE * HOME_ANIME_PAGE_COUNT);

  return {
    comingSoon: expandRows(fallbackAnimeRows, 20).map((item) => [item[0], item[3]]),
    latestAnime,
    ranking: fallbackAnimeRows,
    news: fallbackAnimeRows.slice(0, 6).map((item, index) => [
      `${item[0]} vừa cập nhật thông tin mới`,
      `Tin Anime / ${index + 1} giờ trước`,
      item[2],
      item[3]
    ]),
    manga: expandRows(fallbackMangaRows, HOME_MANGA_PAGE_SIZE * HOME_MANGA_PAGE_COUNT),
    mangaRanking: fallbackMangaRows.map((item, index) => [
      item[0],
      `Chap ${String(index + 1).padStart(2, '0')}`,
      `${(index + 2) * 128}k lượt đọc`,
      item[1]
    ])
  };
};

const getAnimeList = async (limit, page = 1) => {
  const result = await fetchGraphQL(animeQuery, { page, perPage: limit });
  return result?.data?.Page?.media || [];
};

const getMangaList = async (limit, page = 1) => {
  const result = await fetchGraphQL(mangaQuery, { page, perPage: limit });
  return result?.data?.Page?.media || [];
};

export async function fetchHomeAnime() {
  const freshCache = readCache(HOME_CACHE_KEY);
  if (freshCache) return freshCache;
  if (homeAnimePromise) return homeAnimePromise;

  homeAnimePromise = (async () => {
    try {
      const animePageNumbers = Array.from({ length: HOME_ANIME_PAGE_COUNT }, (_, index) => index + 1);
      const mangaPageNumbers = Array.from({ length: HOME_MANGA_PAGE_COUNT }, (_, index) => index + 1);
      const [animePages, mangaPages] = await Promise.all([
        Promise.all(animePageNumbers.map((page) => getAnimeList(HOME_ANIME_PAGE_SIZE, page))),
        Promise.all(mangaPageNumbers.map((page) => getMangaList(HOME_MANGA_PAGE_SIZE, page)))
      ]);
      const animeList = animePages.flat();
      const mangaList = mangaPages.flat();
      const firstAnimePage = animePages[0] || [];

      const data = {
        comingSoon: requireApiRows(firstAnimePage.slice(0, 20).map(toComingSoon), 20),
        latestAnime: requireApiRows(animeList.map(toLatest), HOME_ANIME_PAGE_SIZE * HOME_ANIME_PAGE_COUNT),
        ranking: requireApiRows(firstAnimePage.slice(0, 12).map(toRanking), 12),
        news: requireApiRows(firstAnimePage.slice(0, 10).map(toNews), 10),
        manga: requireApiRows(mangaList.map(toManga), HOME_MANGA_PAGE_SIZE * HOME_MANGA_PAGE_COUNT),
        mangaRanking: requireApiRows(mangaList.slice(0, 12).map(toMangaRanking), 12)
      };

      writeCache(HOME_CACHE_KEY, data);
      return data;
    } catch {
      return readCache(HOME_CACHE_KEY, STALE_TTL) || fallbackHomeAnime();
    } finally {
      homeAnimePromise = null;
    }
  })();

  return homeAnimePromise;
}

export async function fetchAnimeCatalog(limit = 30) {
  const cacheKey = `${CATALOG_CACHE_KEY}.${limit}`;
  const freshCache = readCache(cacheKey);
  if (freshCache) return freshCache;
  if (animeCatalogPromises.has(limit)) return animeCatalogPromises.get(limit);

  const promise = (async () => {
    try {
      const animeList = await getAnimeList(limit);
      const data = requireApiRows(animeList.map(toVideoRow), limit);
      writeCache(cacheKey, data);
      return data;
    } catch {
      return readCache(cacheKey, STALE_TTL) || fallbackAnimeRows.slice(0, limit);
    } finally {
      animeCatalogPromises.delete(limit);
    }
  })();

  animeCatalogPromises.set(limit, promise);
  return promise;
}
