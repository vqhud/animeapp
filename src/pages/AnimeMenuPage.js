import { useEffect, useMemo, useState } from 'react';
import { Box, Typography, IconButton, InputBase, Button } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SearchIcon from '@mui/icons-material/Search';
import PlayCircleOutlinedIcon from '@mui/icons-material/PlayCircleOutlined';
import { useNavigate } from 'react-router-dom';
import PageShell from '../components/PageShell.js';
import PhoneFrame from '../components/PhoneFrame.js';
import { fetchHomeAnime } from '../services/animeApi.js';

const selectedAnimeKey = 'selectedAnimeDetail';

const categories = [
  'Tất Cả Anime', 'Hành Động', 'Viễn Tưởng', 'Lãng Mạn', 'Kinh Dị', 'Võ Thuật', 'Hài Hước',
  'Trường Học', 'Trinh Thám', 'Âm Nhạc', 'Phiêu Lưu', 'Siêu Nhiên', 'Đời Thường'
];

const categoryGenres = {
  'Hành Động': ['Action'],
  'Viễn Tưởng': ['Fantasy', 'Sci-Fi'],
  'Lãng Mạn': ['Romance'],
  'Kinh Dị': ['Horror', 'Thriller'],
  'Võ Thuật': ['Action', 'Sports'],
  'Hài Hước': ['Comedy'],
  'Trường Học': ['Slice of Life', 'Drama'],
  'Trinh Thám': ['Mystery'],
  'Âm Nhạc': ['Music'],
  'Phiêu Lưu': ['Adventure'],
  'Siêu Nhiên': ['Supernatural'],
  'Đời Thường': ['Slice of Life']
};

const toAnimeItem = (item, index) => ({
  id: `${item[0]}-${index}`,
  title: item[0],
  views: item[1],
  eps: item[2],
  img: item[3],
  trailer: item[4] || null,
  genres: item[5] || [],
  isNew: index < 3
});

export default function AnimeMenuPage() {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState('Tất Cả Anime');
  const [searchText, setSearchText] = useState('');
  const [state, setState] = useState({ items: [], loading: true, error: '' });

  useEffect(() => {
    let ignore = false;

    fetchHomeAnime()
      .then((data) => {
        if (!ignore) setState({ items: data.latestAnime.map(toAnimeItem), loading: false, error: '' });
      })
      .catch((error) => {
        if (!ignore) setState({ items: [], loading: false, error: error?.message || 'Không thể tải dữ liệu Anime' });
      });

    return () => {
      ignore = true;
    };
  }, []);

  const filteredItems = useMemo(() => {
    const keyword = searchText.trim().toLowerCase();
    const acceptedGenres = categoryGenres[activeCategory] || [];
    const itemsByCategory = acceptedGenres.length
      ? state.items.filter((item) => item.genres.some((genre) => acceptedGenres.includes(genre)))
      : state.items;

    if (!keyword) return itemsByCategory;

    return itemsByCategory.filter((item) => `${item.title} ${item.eps} ${item.views} ${item.genres.join(' ')}`.toLowerCase().includes(keyword));
  }, [activeCategory, searchText, state.items]);
  const openAnimeDetail = (item) => {
    window.localStorage.setItem(selectedAnimeKey, JSON.stringify(item));
    navigate('/anime-detail');
  };

  return (
    <PageShell title="Danh sách Anime">
      <PhoneFrame>
        <Box sx={{ height: '100%', overflowY: 'auto', scrollbarWidth: 'none', backgroundColor: '#101010', color: '#fff', pb: { xs: 3, md: 5 } }}>
          <Box sx={{ display: 'flex', alignItems: 'center', px: { xs: 1.2, md: 3 }, py: { xs: 1, md: 1.6 }, position: 'sticky', top: 0, bgcolor: '#101010', zIndex: 10 }}>
            <IconButton size="small" sx={{ color: '#fff', p: 0.55 }} onClick={() => navigate('/home')}>
              <ArrowBackIcon sx={{ fontSize: { xs: 19, md: 24 } }} />
            </IconButton>
            <Typography sx={{ ml: 1, fontWeight: 800, fontSize: { xs: 13, md: 18 } }}>Anime</Typography>
          </Box>

          <Box sx={{ px: { xs: 1.4, md: 3 }, mb: { xs: 1.2, md: 2 } }}>
            <Box sx={{ display: 'flex', alignItems: 'center', minHeight: { xs: 30, md: 38 }, backgroundColor: '#222', borderRadius: 8, px: { xs: 1.2, md: 2 }, py: 0.25 }}>
              <SearchIcon sx={{ color: '#888', mr: 0.8, fontSize: { xs: 17, md: 22 } }} />
              <InputBase value={searchText} onChange={(event) => setSearchText(event.target.value)} placeholder="Nhập tên Anime để tìm kiếm" sx={{ color: '#fff', flex: 1, fontSize: { xs: 11, md: 14 } }} />
            </Box>
          </Box>

          <Box sx={{ px: { xs: 1.4, md: 3 }, mb: { xs: 1.6, md: 2.4 }, display: 'flex', gap: 0.7, overflowX: 'auto', scrollbarWidth: 'none' }}>
            {categories.map((cat) => (
              <Button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                sx={{
                  backgroundColor: activeCategory === cat ? '#ff9800' : '#222',
                  color: activeCategory === cat ? '#fff' : '#aaa',
                  borderRadius: 0.6, textTransform: 'none', minWidth: 'max-content', minHeight: '28px !important', px: 1.1, py: 0.35, fontSize: { xs: 10.5, md: 13 }
                }}
              >
                {cat}
              </Button>
            ))}
          </Box>

          <Typography sx={{ px: { xs: 1.4, md: 3 }, mb: { xs: 1.1, md: 2 }, fontWeight: 800, color: '#dcdcdc', fontSize: { xs: 13, md: 18 } }}>
            HÔM NAY XEM GÌ
          </Typography>

          {state.loading || state.error ? (
            <Typography sx={{ px: { xs: 1.4, md: 3 }, color: state.error ? '#ffb74d' : '#aaa', fontSize: { xs: 11, md: 14 }, fontWeight: 700 }}>
              {state.error || 'Đang tải dữ liệu Anime...'}
            </Typography>
          ) : (
            <Box sx={{ px: { xs: 1.4, md: 3 }, display: 'grid', gridTemplateColumns: { xs: 'repeat(3, 1fr)', md: 'repeat(5, 1fr)' }, gap: { xs: '13px 9px', md: '22px 18px' } }}>
              {filteredItems.map((item) => (
                <Box key={item.id} sx={{ display: 'flex', flexDirection: 'column', cursor: 'pointer' }} onClick={() => openAnimeDetail(item)}>
                  <Box sx={{ position: 'relative', borderRadius: 0.9, overflow: 'hidden', aspectRatio: '2/3', mb: 0.65, '&:hover': { opacity: 0.8 } }}>
                    <img src={item.img} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />

                    {item.isNew && (
                      <Box sx={{ position: 'absolute', top: 4, left: 4, backgroundColor: '#e53935', px: 0.55, py: 0.15, borderRadius: '3px' }}>
                        <Typography sx={{ color: '#fff', fontSize: { xs: 8, md: 10 }, fontWeight: 'bold' }}>Sắp chiếu</Typography>
                      </Box>
                    )}

                    <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
                      <PlayCircleOutlinedIcon sx={{ fontSize: { xs: 24, md: 32 }, color: 'rgba(255,255,255,0.9)' }} />
                    </Box>
                  </Box>

                  <Typography sx={{ fontWeight: 'bold', lineHeight: 1.25, fontSize: { xs: 10.2, md: 14 }, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {item.title}
                  </Typography>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', color: '#aaa', mt: 0.35, gap: 0.4 }}>
                    <Typography sx={{ fontSize: { xs: 8.7, md: 12 } }} noWrap>{item.eps}</Typography>
                    <Typography sx={{ fontSize: { xs: 8.7, md: 12 } }} noWrap>{item.views}</Typography>
                  </Box>
                </Box>
              ))}
            </Box>
          )}
        </Box>
      </PhoneFrame>
    </PageShell>
  );
}
