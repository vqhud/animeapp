import { createElement, useEffect, useState } from 'react';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import FavoriteIcon from '@mui/icons-material/Favorite';
import HomeIcon from '@mui/icons-material/Home';
import MenuIcon from '@mui/icons-material/Menu';
import NotificationsIcon from '@mui/icons-material/Notifications';
import PersonIcon from '@mui/icons-material/Person';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PublicIcon from '@mui/icons-material/Public';
import SearchIcon from '@mui/icons-material/Search';
import SettingsIcon from '@mui/icons-material/Settings';
import { Box, IconButton, Stack, Typography } from '@mui/material';
import PageShell from '../components/PageShell.js';
import PhoneFrame from '../components/PhoneFrame.js';
import { fetchHomeAnime } from '../services/animeApi.js';
import { getSessionUser } from '../services/authSession.js';
import logoUrl from '../../logo.jpg';

const selectedAnimeKey = 'selectedAnimeDetail';
const selectedMangaKey = 'selectedMangaDetail';
const selectedNewsKey = 'selectedNewsDetail';
const ANIME_PAGE_SIZE = 30;
const MANGA_PAGE_SIZE = 30;

const assetPosters = [
  '/assets/anime-01.jpg',
  '/assets/anime-02.jpg',
  '/assets/anime-03.jpg',
  '/assets/anime-04.jpg',
  '/assets/anime-05.jpg',
  '/assets/anime-06.jpg',
  '/assets/anime-07.jpg',
  '/assets/anime-08.jpg',
  '/assets/anime-09.jpg',
  '/assets/anime-10.jpg',
  '/assets/anime-11.jpg',
  '/assets/anime-12.jpg',
  '/assets/anime-13.jpg',
  '/assets/hq720.jpg',
  '/assets/harper-bazaar-nhung-bo-phim-anime-trung-quoc-hay-14-e1665242615423.jpg',
  '/assets/phim-hoat-hinh-2d-trung-quoc-3-1-1024x577.jpg',
  '/assets/6-Luong-Bat-Nghi-No-Doubt-in-Us-Liang-Bu-Yi-2021.jpg',
  '/assets/Muc-Than-Ky-12-hh3d.jpg',
  '/assets/than-mo-800x1200.jpg',
  '/assets/phim-anime-trung-quoc-14.jpg',
  '/assets/hq720%20%281%29.jpg',
  '/assets/tải xuống (7).jpg'
];

const poster = (image, w = 360, h = 520) => {
  if (image?.startsWith('/')) return image;
  if (/^https?:\/\//.test(image || '')) return image;

  const index = Math.abs(
    String(image || 'anime')
      .split('')
      .reduce((total, char) => total + char.charCodeAt(0), 0)
  ) % assetPosters.length;

  return assetPosters[index] || `/assets/anime-01.jpg?w=${w}&h=${h}`;
};

const go = (path) => {
  window.location.href = path;
};

const getCurrentUser = () => {
  return getSessionUser();
};

const STATIC_COMING_SOON = [
  ['Kiếm Vực Trường Sinh', '/assets/anime-02.jpg'],
  ['Long Huyết Chiến Thần', '/assets/anime-03.jpg'],
  ['Băng Thành Dị Giới', '/assets/anime-04.jpg'],
  ['Thần Ấn Lưu Ly', '/assets/anime-05.jpg'],
  ['Vạn Cổ Kiếm Tôn 2', '/assets/anime-06.jpg'],
  ['Thiên Đạo Huyền Sư', '/assets/anime-07.jpg'],
  ['Long Tộc Trỗi Dậy', '/assets/anime-08.jpg'],
  ['Ma Vực Phong Thần', '/assets/anime-09.jpg'],
  ['Hỏa Phụng Liên Thành', '/assets/anime-10.jpg'],
  ['Tinh Hà Chiến Kỷ', '/assets/anime-11.jpg'],
  ['Thương Khung Bí Sử', '/assets/anime-12.jpg'],
  ['Ngự Kiếm Sơn Hà', '/assets/anime-13.jpg'],
  ['Đấu La Đại Lục: Tái Chiến', '/assets/hq720.jpg'],
  ['Thiếu Niên Ca Hành', '/assets/harper-bazaar-nhung-bo-phim-anime-trung-quoc-hay-14-e1665242615423.jpg'],
  ['Lưỡng Bất Nghi', '/assets/6-Luong-Bat-Nghi-No-Doubt-in-Us-Liang-Bu-Yi-2021.jpg'],
  ['Phong Linh Ngọc Tú', '/assets/phim-hoat-hinh-2d-trung-quoc-3-1-1024x577.jpg'],
  ['Mục Thần Ký', '/assets/Muc-Than-Ky-12-hh3d.jpg'],
  ['Thần Mộ', '/assets/than-mo-800x1200.jpg'],
  ['Đại Chúa Tể', '/assets/phim-anime-trung-quoc-14.jpg'],
  ['Đấu Phá Thương Khung: Dị Hỏa', '/assets/hq720%20%281%29.jpg'],
  ['Tiên Vương Trở Lại', '/assets/tải xuống (7).jpg']
];

const STATIC_LATEST_ANIME = [
  ['Tuyết Ưng Lĩnh Chủ: Huyết Chiến Băng Thành', '982k lượt xem', 'Tập 01', '/assets/anime-01.jpg'],
  ['Vạn Cổ Kiếm Tôn', '756k lượt xem', 'Tập 18', '/assets/anime-06.jpg'],
  ['Thiên Đạo Huyền Sư', '612k lượt xem', 'Tập 12', '/assets/anime-07.jpg'],
  ['Long Tộc Trỗi Dậy', '723k lượt xem', 'Tập mới', '/assets/anime-08.jpg'],
  ['Ma Vực Phong Thần', '488k lượt xem', 'Tập 09', '/assets/anime-09.jpg'],
  ['Hỏa Phụng Liên Thành', '417k lượt xem', 'Tập 22', '/assets/anime-10.jpg'],
  ['Tinh Hà Chiến Kỷ', '365k lượt xem', 'Tập 15', '/assets/anime-11.jpg'],
  ['Thương Khung Bí Sử', '289k lượt xem', 'Tập 06', '/assets/anime-12.jpg'],
  ['Ngự Kiếm Sơn Hà', '842k lượt xem', 'Tập 30', '/assets/anime-13.jpg'],
  ['Đấu La Đại Lục: Hồn Sư Trở Lại', '1.2M lượt xem', 'Tập 41', '/assets/hq720.jpg'],
  ['Thiếu Niên Ca Hành: Phong Hoa Tuyết Nguyệt', '928k lượt xem', 'Tập 27', '/assets/harper-bazaar-nhung-bo-phim-anime-trung-quoc-hay-14-e1665242615423.jpg'],
  ['Lưỡng Bất Nghi', '384k lượt xem', 'Tập 12', '/assets/6-Luong-Bat-Nghi-No-Doubt-in-Us-Liang-Bu-Yi-2021.jpg'],
  ['Phong Linh Ngọc Tú', '456k lượt xem', 'Tập 08', '/assets/phim-hoat-hinh-2d-trung-quoc-3-1-1024x577.jpg'],
  ['Tiên Vương Mùa Mới', '619k lượt xem', 'Tập 05', '/assets/tải xuống (7).jpg'],
  ['Kiếm Lai', '777k lượt xem', 'Tập 16', '/assets/anime-02.jpg'],
  ['Thần Mộ', '1.1M lượt xem', 'Tập 34', '/assets/anime-03.jpg'],
  ['Bách Luyện Thành Thần', '689k lượt xem', 'Tập 51', '/assets/anime-04.jpg'],
  ['Già Thiên', '954k lượt xem', 'Tập 39', '/assets/anime-05.jpg'],
  ['Sư Huynh A Sư Huynh', '732k lượt xem', 'Tập 19', '/assets/anime-06.jpg'],
  ['Mục Thần Ký', '881k lượt xem', 'Tập 12', '/assets/Muc-Than-Ky-12-hh3d.jpg'],
  ['Thần Mộ', '1.4M lượt xem', 'Tập 33', '/assets/than-mo-800x1200.jpg'],
  ['Đại Chúa Tể', '942k lượt xem', 'Tập 26', '/assets/phim-anime-trung-quoc-14.jpg'],
  ['Đấu Phá Thương Khung: Dị Hỏa Trùng Sinh', '1.8M lượt xem', 'Tập 52', '/assets/hq720%20%281%29.jpg']
];

const STATIC_RANKING = [
  ['Tuyết Ưng Lĩnh Chủ', '60/60 tập', '62,925,535 lượt xem', '/assets/anime-01.jpg'],
  ['Vạn Cổ Kiếm Tôn', '42/48 tập', '17,616,136 lượt xem', '/assets/anime-06.jpg'],
  ['Long Tộc Trỗi Dậy', '35/40 tập', '22,320,110 lượt xem', '/assets/anime-08.jpg'],
  ['Đấu La Đại Lục', '41/52 tập', '38,420,900 lượt xem', '/assets/hq720.jpg'],
  ['Thiếu Niên Ca Hành', '27/36 tập', '24,730,112 lượt xem', '/assets/harper-bazaar-nhung-bo-phim-anime-trung-quoc-hay-14-e1665242615423.jpg'],
  ['Già Thiên', '39/60 tập', '19,804,230 lượt xem', '/assets/anime-05.jpg'],
  ['Mục Thần Ký', '12/24 tập', '16,902,118 lượt xem', '/assets/Muc-Than-Ky-12-hh3d.jpg'],
  ['Thần Mộ', '33/40 tập', '28,110,500 lượt xem', '/assets/than-mo-800x1200.jpg'],
  ['Đấu Phá Thương Khung', '52/60 tập', '44,760,220 lượt xem', '/assets/hq720%20%281%29.jpg']
];

const STATIC_NEWS = [
  ['Tuyết Ưng Lĩnh Chủ hé lộ trận chiến cuối tại Băng Thành', 'Tin tức Anime / 8 giờ trước', '512k lượt xem', '/assets/anime-01.jpg'],
  ['Vạn Cổ Kiếm Tôn công bố teaser mùa mới', 'Tin tức Anime / 1 ngày trước', '203k lượt xem', '/assets/anime-06.jpg'],
  ['Long Tộc Trỗi Dậy xác nhận lịch chiếu tập đặc biệt', 'Tin tức Anime / 1 ngày trước', '609k lượt xem', '/assets/anime-08.jpg'],
  ['Ma Vực Phong Thần giới thiệu nhân vật phản diện mới', 'Tin tức Anime / 2 ngày trước', '434k lượt xem', '/assets/anime-09.jpg'],
  ['Tinh Hà Chiến Kỷ mở sự kiện xem trước tập 15', 'Tin tức Anime / 3 ngày trước', '417k lượt xem', '/assets/anime-11.jpg'],
  ['Đấu La Đại Lục tung hình ảnh hồn kỹ mới', 'Tin tức Anime / 4 giờ trước', '821k lượt xem', '/assets/hq720.jpg'],
  ['Lưỡng Bất Nghi trở lại với bản dựng 2D sắc nét', 'Tin tức Anime / 6 giờ trước', '276k lượt xem', '/assets/6-Luong-Bat-Nghi-No-Doubt-in-Us-Liang-Bu-Yi-2021.jpg'],
  ['Thiếu Niên Ca Hành hé lộ poster nhân vật mới', 'Tin tức Anime / 12 giờ trước', '533k lượt xem', '/assets/harper-bazaar-nhung-bo-phim-anime-trung-quoc-hay-14-e1665242615423.jpg'],
  ['Mục Thần Ký công bố lịch phát sóng mới', 'Tin tức Anime / 2 giờ trước', '492k lượt xem', '/assets/Muc-Than-Ky-12-hh3d.jpg'],
  ['Thần Mộ tung poster nhân vật chính', 'Tin tức Anime / 5 giờ trước', '638k lượt xem', '/assets/than-mo-800x1200.jpg'],
  ['Đại Chúa Tể hé lộ trận chiến tại Linh Lộ', 'Tin tức Anime / 9 giờ trước', '579k lượt xem', '/assets/phim-anime-trung-quoc-14.jpg']
];

const STATIC_MANGA = [
  ['Kiếm Ảnh Huyền Môn', '/assets/anime-02.jpg'],
  ['Bí Lục Long Thành', '/assets/anime-03.jpg'],
  ['Thần Hỏa Lưu Ly', '/assets/anime-04.jpg'],
  ['Phong Vân Cửu Châu', '/assets/anime-05.jpg'],
  ['Đế Tôn Tái Sinh', '/assets/anime-07.jpg'],
  ['Huyết Nguyệt Sơn Hải', '/assets/anime-09.jpg'],
  ['Linh Vực Ký', '/assets/anime-10.jpg'],
  ['Tinh Hà Truyền Thuyết', '/assets/anime-11.jpg'],
  ['Ngự Kiếm Vấn Đạo', '/assets/anime-13.jpg'],
  ['Đấu La Ngoại Truyện', '/assets/hq720.jpg'],
  ['Lưỡng Bất Nghi', '/assets/6-Luong-Bat-Nghi-No-Doubt-in-Us-Liang-Bu-Yi-2021.jpg'],
  ['Phong Linh Ngọc Tú', '/assets/phim-hoat-hinh-2d-trung-quoc-3-1-1024x577.jpg'],
  ['Thiếu Niên Hành', '/assets/harper-bazaar-nhung-bo-phim-anime-trung-quoc-hay-14-e1665242615423.jpg'],
  ['Mục Thần Ký', '/assets/Muc-Than-Ky-12-hh3d.jpg'],
  ['Thần Mộ Ngoại Truyện', '/assets/than-mo-800x1200.jpg'],
  ['Đại Chúa Tể', '/assets/phim-anime-trung-quoc-14.jpg'],
  ['Dị Hỏa Trùng Sinh', '/assets/hq720%20%281%29.jpg'],
  ['Tiên Vương Quy Lai', '/assets/tải xuống (7).jpg']
];

const addAnimeMeta = (items) => items.map((item) => [...item, null, []]);

const fallbackHomeData = {
  comingSoon: STATIC_COMING_SOON,
  latestAnime: addAnimeMeta(STATIC_LATEST_ANIME),
  ranking: addAnimeMeta(STATIC_RANKING),
  news: STATIC_NEWS,
  manga: STATIC_MANGA,
  mangaRanking: STATIC_MANGA.slice(0, 12).map(([title, img], index) => [
    title,
    `Chap ${String(index + 1).padStart(2, '0')}`,
    `${Math.max(35, 110 - index * 6)}k lượt xem`,
    img
  ])
};

function Header({ onNotice }) {
  const [backgroundMode, setBackgroundMode] = useState('dark');
  const [openBackgroundMenu, setOpenBackgroundMenu] = useState(false);
  const isLight = backgroundMode === 'light';

  return (
    <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ position: 'relative', px: { xs: 1.4, md: 3 }, py: { xs: 1.1, md: 1.6 }, bgcolor: isLight ? '#fff' : '#101010' }}>
      <IconButton size="small" onClick={() => go('/menu')} sx={{ color: isLight ? '#242424' : '#d8d8d8' }}>
        <MenuIcon sx={{ fontSize: { xs: 20, md: 26 } }} />
      </IconButton>
      <Stack
        direction="row"
        alignItems="center"
        spacing={{ xs: 0.8, md: 1.15 }}
        sx={{
          minWidth: 0,
          px: 1,
          py: 0.35,
          borderRadius: 1,
          color: isLight ? '#171717' : '#f7f7f7'
        }}
      >
        <Box
          component="img"
          src={logoUrl}
          alt="HHTQ Anime logo"
          sx={{
            width: { xs: 28, md: 38 },
            height: { xs: 28, md: 38 },
            borderRadius: '50%',
            objectFit: 'cover',
            flexShrink: 0,
            border: isLight ? '2px solid rgba(0,0,0,0.14)' : '2px solid rgba(255,255,255,0.28)',
            boxShadow: isLight ? '0 4px 12px rgba(0,0,0,0.16)' : '0 4px 14px rgba(0,0,0,0.48)'
          }}
        />
        <Typography
          sx={{
            fontSize: { xs: 16, md: 24 },
            fontWeight: 900,
            lineHeight: 1,
            color: 'inherit',
            whiteSpace: 'nowrap',
            textShadow: isLight ? 'none' : '0 1px 10px rgba(0,0,0,0.55)'
          }}
        >
          HHTQ Anime
        </Typography>
      </Stack>
      <Stack direction="row" spacing={{ xs: 0.2, md: 1 }}>
        {[
          [PublicIcon, 'region'],
          [SearchIcon, 'search'],
          [PersonIcon, 'profile']
        ].map(([Icon, key]) => (
          <IconButton
            key={key}
            size="small"
            onClick={() => {
              if (key === 'region') {
                setOpenBackgroundMenu((current) => !current);
                return;
              }
              if (key === 'search') go('/search');
              if (key === 'profile') go(getCurrentUser() ? '/profile' : '/no-login');
            }}
            sx={{ color: isLight ? '#555' : '#777', p: { xs: 0.65, md: 1 } }}
          >
            {createElement(Icon, { sx: { fontSize: { xs: 18, md: 24 } } })}
          </IconButton>
        ))}
      </Stack>
      {openBackgroundMenu && (
        <Stack sx={{ position: 'absolute', top: { xs: 38, md: 58 }, right: { xs: 52, md: 82 }, zIndex: 5, width: { xs: 98, md: 132 }, bgcolor: '#0d0d0d', border: '1px solid #333', borderRadius: 0.6, overflow: 'hidden' }}>
          {[
            ['dark', 'Nền đen'],
            ['light', 'Nền trắng']
          ].map(([mode, label]) => (
            <Typography
              key={mode}
              onClick={() => {
                setBackgroundMode(mode);
                setOpenBackgroundMenu(false);
                onNotice(`Đã chọn ${label}`);
              }}
              sx={{ px: 1.2, py: 0.85, color: mode === backgroundMode ? '#ff9800' : '#f0f0f0', fontSize: { xs: 11, md: 13 }, fontWeight: 800, cursor: 'pointer', '&:hover': { bgcolor: '#1d1d1d' } }}
            >
              {label}
            </Typography>
          ))}
        </Stack>
      )}
    </Stack>
  );
}

function SectionTitle({ children }) {
  return (
    <Typography sx={{ color: '#dcdcdc', fontSize: { xs: 13, md: 18 }, fontWeight: 800, textTransform: 'uppercase', mb: { xs: 1, md: 2 } }}>
      {children}
    </Typography>
  );
}

function ShowMore({ path = '/search' }) {
  return (
    <Stack
      direction="row"
      alignItems="center"
      justifyContent="center"
      spacing={5}
      onClick={() => go(path)}
      sx={{ height: { xs: 39, md: 46 }, border: '1px solid #3b3b3b', borderRadius: 0.5, color: '#d9d9d9', mt: { xs: 1.4, md: 2.4 }, cursor: 'pointer' }}
    >
      <Typography sx={{ fontSize: { xs: 11, md: 14 }, fontWeight: 700 }}>Xem thêm</Typography>
      <ArrowForwardIcon sx={{ fontSize: { xs: 16, md: 20 }, color: '#777' }} />
    </Stack>
  );
}

function AnimePagination({ page, totalPages, onChange }) {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, index) => index + 1);

  return (
    <Stack
      direction="row"
      alignItems="center"
      justifyContent="center"
      spacing={{ xs: 0.6, md: 1 }}
      sx={{ mt: { xs: 1.5, md: 2.4 }, flexWrap: 'wrap', rowGap: 1 }}
    >
      <Typography
        onClick={() => page > 1 && onChange(page - 1)}
        sx={{ px: { xs: 1, md: 1.25 }, height: { xs: 30, md: 36 }, display: 'grid', placeItems: 'center', border: '1px solid #343434', borderRadius: 0.6, color: page > 1 ? '#ddd' : '#555', fontSize: { xs: 10.5, md: 13 }, fontWeight: 800, cursor: page > 1 ? 'pointer' : 'default' }}
      >
        Trước
      </Typography>
      {pages.map((item) => (
        <Typography
          key={item}
          onClick={() => onChange(item)}
          sx={{ minWidth: { xs: 30, md: 36 }, height: { xs: 30, md: 36 }, display: 'grid', placeItems: 'center', border: `1px solid ${item === page ? '#ff9800' : '#343434'}`, borderRadius: 0.6, bgcolor: item === page ? '#ff9800' : 'transparent', color: item === page ? '#111' : '#ddd', fontSize: { xs: 11, md: 14 }, fontWeight: 900, cursor: 'pointer' }}
        >
          {item}
        </Typography>
      ))}
      <Typography
        onClick={() => page < totalPages && onChange(page + 1)}
        sx={{ px: { xs: 1, md: 1.25 }, height: { xs: 30, md: 36 }, display: 'grid', placeItems: 'center', border: '1px solid #343434', borderRadius: 0.6, color: page < totalPages ? '#ddd' : '#555', fontSize: { xs: 10.5, md: 13 }, fontWeight: 800, cursor: page < totalPages ? 'pointer' : 'default' }}
      >
        Sau
      </Typography>
    </Stack>
  );
}

function PosterTile({ item, compact = false, featured = false, onSelect }) {
  const [title, views, episode, imageSeed] = item;
  const seed = compact ? views : imageSeed;

  return (
    <Box
      onClick={() => onSelect(item)}
      sx={{
        minWidth: 0,
        cursor: 'pointer',
        perspective: 900,
        '&:hover .poster-card': {
          transform: 'translateY(-4px) rotateX(3deg) rotateY(-2deg) scale(1.018)',
          boxShadow: '0 18px 34px rgba(0,0,0,0.48), 0 0 0 1px rgba(255,152,0,0.32)'
        },
        '&:hover img': {
          transform: 'scale(1.025) translateZ(0)'
        }
      }}
    >
      <Box
        className="poster-card"
        sx={{
          position: 'relative',
          aspectRatio: featured ? '1 / 1.22' : compact ? '1 / 1.35' : '1 / 1.42',
          borderRadius: 1.35,
          overflow: 'hidden',
          border: '1px solid rgba(255,255,255,0.16)',
          bgcolor: '#181818',
          boxShadow: '0 12px 26px rgba(0,0,0,0.42), inset 0 1px 0 rgba(255,255,255,0.14)',
          transformStyle: 'preserve-3d',
          transition: 'transform 220ms ease, box-shadow 220ms ease, border-color 220ms ease'
        }}
      >
        <Box
          component="img"
          src={poster(seed)}
          alt={title}
          loading="lazy"
          sx={{
            width: '100%',
            height: '100%',
            display: 'block',
            objectFit: 'cover',
            imageRendering: 'auto',
            filter: 'contrast(1.1) saturate(1.14) brightness(1.03)',
            transform: 'translateZ(0)',
            transition: 'transform 260ms ease'
          }}
        />
        <Box sx={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(255,255,255,0.18), transparent 24%, transparent 62%, rgba(0,0,0,0.36))' }} />
        <Box sx={{ position: 'absolute', inset: 0, boxShadow: 'inset 10px 0 18px rgba(255,255,255,0.06), inset -12px -14px 26px rgba(0,0,0,0.42)' }} />
        {featured && (
          <>
            <Typography sx={{ position: 'absolute', left: 0, top: 0, px: 0.65, py: 0.25, bgcolor: '#f0a800', color: '#fff', fontSize: { xs: 8.5, md: 11 }, fontWeight: 900, borderBottomRightRadius: 0.45 }}>
              {episode}
            </Typography>
            <Box sx={{ position: 'absolute', left: 0, right: 0, bottom: 0, px: { xs: 0.7, md: 1 }, py: { xs: 0.65, md: 0.9 }, background: 'linear-gradient(180deg, transparent, rgba(0,0,0,0.88))' }}>
              <Typography sx={{ color: '#fff', fontSize: { xs: 10, md: 13 }, fontWeight: 900, lineHeight: 1.15 }} noWrap>
                {title}
              </Typography>
              <Typography sx={{ color: '#b8c6d8', fontSize: { xs: 8.5, md: 11 }, mt: 0.35 }} noWrap>
                {views}
              </Typography>
            </Box>
          </>
        )}
        {!compact && !featured && (
          <Box
            sx={{
              position: 'absolute',
              inset: 0,
              display: 'grid',
              placeItems: 'center',
              color: '#fff',
              bgcolor: 'rgba(0,0,0,0.08)'
            }}
          >
            <Box sx={{ width: { xs: 34, md: 46 }, height: { xs: 34, md: 46 }, borderRadius: '50%', border: '2px solid rgba(255,255,255,0.7)', display: 'grid', placeItems: 'center' }}>
              <PlayArrowIcon sx={{ fontSize: { xs: 22, md: 30 } }} />
            </Box>
          </Box>
        )}
      </Box>
      {!featured && (
        <>
          <Typography sx={{ color: '#f2f2f2', fontSize: { xs: 11, md: 15 }, fontWeight: 700, lineHeight: 1.15, mt: { xs: 0.65, md: 1 } }} noWrap>
            {title}
          </Typography>
          {!compact && views && (
            <Stack direction="row" spacing={0.8} sx={{ color: '#aaa', mt: 0.35 }}>
              <Typography sx={{ fontSize: { xs: 9.5, md: 12 } }}>{episode}</Typography>
              <Typography sx={{ fontSize: { xs: 9.5, md: 12 } }}>{views}</Typography>
            </Stack>
          )}
        </>
      )}
    </Box>
  );
}

function Toast({ text }) {
  if (!text) return null;

  return (
    <Typography sx={{ position: 'absolute', top: { xs: 48, md: 72 }, left: { xs: 16, md: 32 }, right: { xs: 16, md: 32 }, zIndex: 8, px: 1.2, py: 0.8, borderRadius: 0.5, bgcolor: '#202020', color: '#f5f5f5', fontSize: { xs: 11, md: 14 }, fontWeight: 800, textAlign: 'center' }}>
      {text}
    </Typography>
  );
}

function MenuPage() {
  const [toast, setToast] = useState('');
  const [homeData, setHomeData] = useState(null);
  const [apiError, setApiError] = useState('');
  const [animePage, setAnimePage] = useState(1);
  const [mangaPage, setMangaPage] = useState(1);

  useEffect(() => {
    const sectionId = window.location.hash.replace('#', '');

    if (!sectionId) return;

    window.setTimeout(() => {
      document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 80);
  }, []);

  useEffect(() => {
    let ignore = false;

    fetchHomeAnime()
      .then((nextData) => {
        if (!ignore) {
          setHomeData(nextData);
          setApiError('');
        }
      })
      .catch((error) => {
        if (!ignore) {
          console.warn('Home API failed, using fallback data:', error);
          setHomeData(fallbackHomeData);
          setApiError('');
        }
      });

    return () => {
      ignore = true;
    };
  }, []);

  const notify = (text) => {
    setToast(text);
    window.setTimeout(() => setToast(''), 1400);
  };

  const openAnime = (item) => {
    const [title, second, third, fourth, trailer] = item;
    const isCompactAnime = !fourth;
    window.localStorage.setItem(selectedAnimeKey, JSON.stringify({
      title,
      views: isCompactAnime ? 'Đang cập nhật lượt xem' : second,
      eps: isCompactAnime ? 'Sắp chiếu' : third,
      img: isCompactAnime ? second : fourth,
      trailer: trailer || null
    }));
    go('/anime-detail');
  };

  const openManga = (item) => {
    const [title, img] = item;
    window.localStorage.setItem(selectedMangaKey, JSON.stringify({ title, img, chap: 'Chap 01', views: 'Đang cập nhật lượt đọc' }));
    go('/manga-detail');
  };

  const openNews = (item) => {
    const [title, meta, views, img] = item;
    window.localStorage.setItem(selectedNewsKey, JSON.stringify({ title, meta, views, img }));
    go('/news-detail');
  };

  if (!homeData) {
    return (
      <PageShell title="Menu">
        <PhoneFrame>
          <Box sx={{ height: '100%', bgcolor: '#101010', display: apiError ? 'grid' : 'block', placeItems: 'center', px: 3, textAlign: 'center' }}>
            {apiError && (
              <Typography sx={{ color: '#ffb74d', fontSize: { xs: 12, md: 18 }, fontWeight: 800 }}>
                Lỗi API: {apiError}
              </Typography>
            )}
          </Box>
        </PhoneFrame>
      </PageShell>
    );
  }

  const animeTotalPages = Math.max(1, Math.ceil(homeData.latestAnime.length / ANIME_PAGE_SIZE));
  const activeAnimePage = Math.min(animePage, animeTotalPages);
  const pagedAnime = homeData.latestAnime.slice((activeAnimePage - 1) * ANIME_PAGE_SIZE, activeAnimePage * ANIME_PAGE_SIZE);
  const mangaTotalPages = Math.max(1, Math.ceil(homeData.manga.length / MANGA_PAGE_SIZE));
  const activeMangaPage = Math.min(mangaPage, mangaTotalPages);
  const pagedManga = homeData.manga.slice((activeMangaPage - 1) * MANGA_PAGE_SIZE, activeMangaPage * MANGA_PAGE_SIZE);
  const changeAnimePage = (nextPage) => {
    setAnimePage(nextPage);
    window.setTimeout(() => {
      document.getElementById('anime')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 40);
  };
  const changeMangaPage = (nextPage) => {
    setMangaPage(nextPage);
    window.setTimeout(() => {
      document.getElementById('manga')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 40);
  };

  return (
    <PageShell title="Menu">
      <PhoneFrame>
        <Box sx={{ height: '100%', overflowY: 'auto', scrollbarWidth: 'none', pb: { xs: 8, md: 10 }, bgcolor: '#101010' }}>
          <Header onNotice={notify} />
          <Toast text={toast} />

          <Box id="coming-soon" sx={{ px: { xs: 1.4, md: 3 }, pt: { xs: 1, md: 3 }, scrollMarginTop: { xs: 56, md: 84 } }}>
            <Typography align="center" sx={{ color: '#f1f1f1', fontSize: { xs: 13, md: 20 }, fontWeight: 800, mb: { xs: 1.4, md: 2.4 } }}>
              Sắp ra mắt
            </Typography>
            <Box
              sx={{
                overflow: 'hidden',
                pb: { xs: 2.4, md: 3 },
                WebkitMaskImage: 'linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent)',
                maskImage: 'linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent)'
              }}
            >
              <Stack
                direction="row"
                sx={{
                  width: 'max-content',
                  gap: { xs: 1.1, md: 2 },
                  animation: 'comingSoonLoop 45s linear infinite',
                  '@keyframes comingSoonLoop': {
                    from: { transform: 'translateX(0)' },
                    to: { transform: 'translateX(-50%)' }
                  },
                  '&:hover': { animationPlayState: 'paused' }
                }}
              >
                {[...homeData.comingSoon, ...homeData.comingSoon].map((item, index) => (
                  <Box key={`${item[1]}-${index}`} sx={{ width: { xs: 96, md: 155 }, flex: '0 0 auto' }}>
                    <PosterTile item={item} compact onSelect={openAnime} />
                  </Box>
                ))}
              </Stack>
            </Box>
          </Box>

          <Box id="anime" sx={{ px: { xs: 1.4, md: 3 }, py: { xs: 1.5, md: 3 }, borderTop: '1px solid #242424', scrollMarginTop: { xs: 56, md: 84 } }}>
            <SectionTitle>Tập mới nhất</SectionTitle>
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: 'repeat(2, 1fr)', md: 'repeat(5, 1fr)' }, gap: { xs: '16px 14px', md: '24px 24px' }, justifyItems: 'center' }}>
              {pagedAnime.map((item) => (
                <Box key={`${item[0]}-${item[3]}`} sx={{ width: '75%' }}>
                  <PosterTile item={item} featured onSelect={openAnime} />
                </Box>
              ))}
            </Box>
            <AnimePagination page={activeAnimePage} totalPages={animeTotalPages} onChange={changeAnimePage} />
          </Box>

          <Box id="ranking" sx={{ px: { xs: 1.4, md: 3 }, py: { xs: 1.4, md: 3 }, borderTop: '1px solid #242424', scrollMarginTop: { xs: 56, md: 84 } }}>
            <SectionTitle>BXH</SectionTitle>
            <Stack direction="row" spacing={{ xs: 1, md: 2 }} sx={{ overflowX: 'auto', pb: 0.5, scrollbarWidth: 'none' }}>
              {homeData.ranking.map((item, index) => (
                <Box key={`${item[0]}-${item[3]}`} onClick={() => openAnime(item)} sx={{ minWidth: { xs: 124, md: 216 }, cursor: 'pointer', perspective: 900 }}>
                  <Typography sx={{ color: '#f3f3f3', fontSize: { xs: 11, md: 15 }, fontWeight: 800 }}>#Top {index + 1}</Typography>
                  <Box sx={{ height: { xs: 72, md: 122 }, mt: 0.5, borderRadius: 1.2, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.16)', bgcolor: '#181818', boxShadow: '0 12px 24px rgba(0,0,0,0.38), inset 0 1px 0 rgba(255,255,255,0.12)', transition: 'transform 220ms ease, box-shadow 220ms ease', '&:hover': { transform: 'translateY(-4px) rotateX(3deg) scale(1.025)', boxShadow: '0 18px 32px rgba(0,0,0,0.46)' } }}>
                    <Box component="img" src={poster(item[3], 520, 320)} alt={item[0]} loading="lazy" sx={{ width: '100%', height: '100%', display: 'block', objectFit: 'cover', filter: 'contrast(1.1) saturate(1.14) brightness(1.03)' }} />
                  </Box>
                  <Typography sx={{ color: '#fff', fontSize: { xs: 11, md: 15 }, fontWeight: 800, mt: 0.55 }} noWrap>{item[0]}</Typography>
                  <Typography sx={{ color: '#aaa', fontSize: { xs: 9.5, md: 12 } }}>{item[1]} - {item[2]}</Typography>
                </Box>
              ))}
            </Stack>
          </Box>

          <Box id="news" sx={{ px: { xs: 1.4, md: 3 }, py: { xs: 1.4, md: 3 }, borderTop: '1px solid #242424', scrollMarginTop: { xs: 56, md: 84 } }}>
            <SectionTitle>Tin anime</SectionTitle>
            <Stack spacing={{ xs: 1.2, md: 2 }}>
              {homeData.news.map((item) => (
                <Stack key={`${item[0]}-${item[3]}`} direction="row" spacing={{ xs: 1.1, md: 2 }} onClick={() => openNews(item)} sx={{ cursor: 'pointer' }}>
                  <Box sx={{ width: { xs: 84, md: 160 }, height: { xs: 56, md: 100 }, flexShrink: 0, borderRadius: 1.2, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.16)', bgcolor: '#181818', boxShadow: '0 12px 24px rgba(0,0,0,0.34), inset 0 1px 0 rgba(255,255,255,0.12)' }}>
                    <Box component="img" src={poster(item[3], 420, 260)} alt={item[0]} loading="lazy" sx={{ width: '100%', height: '100%', display: 'block', objectFit: 'cover', filter: 'contrast(1.1) saturate(1.14) brightness(1.03)' }} />
                  </Box>
                  <Box sx={{ minWidth: 0 }}>
                    <Typography sx={{ color: '#fff', fontSize: { xs: 11.5, md: 16 }, fontWeight: 800, lineHeight: 1.2 }}>{item[0]}</Typography>
                    <Typography sx={{ color: '#f59a23', fontSize: { xs: 9.5, md: 13 }, fontWeight: 700, mt: 0.45 }}>{item[1]}</Typography>
                    <Typography sx={{ color: '#aaa', fontSize: { xs: 9.5, md: 13 }, mt: 0.35 }}>{item[2]}</Typography>
                  </Box>
                </Stack>
              ))}
            </Stack>
            <ShowMore />
          </Box>

          <Box id="manga" sx={{ px: { xs: 1.4, md: 3 }, py: { xs: 1.4, md: 3 }, borderTop: '1px solid #242424', scrollMarginTop: { xs: 56, md: 84 } }}>
            <SectionTitle>Truyện tranh</SectionTitle>
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: 'repeat(3, 1fr)', md: 'repeat(5, 1fr)' }, gap: { xs: '14px 10px', md: '24px 18px' } }}>
              {pagedManga.map((item) => (
                <PosterTile key={`${item[0]}-${item[1]}`} item={item} compact onSelect={openManga} />
              ))}
            </Box>
            <AnimePagination page={activeMangaPage} totalPages={mangaTotalPages} onChange={changeMangaPage} />
          </Box>
        </Box>

        <Stack
          direction="row"
          justifyContent="space-around"
          sx={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: { xs: 55, md: 70 }, bgcolor: '#151515', borderTop: '1px solid #282828' }}
        >
          {[
            [HomeIcon, 'Trang chủ', true],
            [FavoriteIcon, 'Phim đã thích'],
            [NotificationsIcon, 'Phim đã theo dõi'],
            [SettingsIcon, 'Cài đặt']
          ].map(([Icon, label, active], index) => (
            <Stack
              key={label}
              onClick={() => {
                const path = ['/home', '/favorites', '/followed', getCurrentUser() ? '/profile' : '/no-login'][index];
                go(path);
              }}
              alignItems="center"
              justifyContent="center"
              spacing={0.25}
              sx={{ width: { xs: 64, md: 180 }, color: active ? '#ff9800' : '#606060', cursor: 'pointer' }}
            >
              {createElement(Icon, { sx: { fontSize: { xs: 20, md: 26 } } })}
              <Typography sx={{ fontSize: { xs: 8.5, md: 13 }, fontWeight: 800 }} noWrap>{label}</Typography>
            </Stack>
          ))}
        </Stack>
      </PhoneFrame>
    </PageShell>
  );
}

export default MenuPage;
