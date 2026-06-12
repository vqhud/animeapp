import { fetchNewsList } from '../services/userApi.js';
import { useEffect, useMemo, useState } from 'react';
import { Box, Typography, IconButton, InputBase, Button } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SearchIcon from '@mui/icons-material/Search';
import { useNavigate } from 'react-router-dom';
import PageShell from '../components/PageShell.js';
import PhoneFrame from '../components/PhoneFrame.js';
import { fetchHomeAnime } from '../services/animeApi.js';

const selectedNewsKey = 'selectedNewsDetail';

const categories = [
  'Tất Cả', 'Tin Anime', 'Tin Phim', 'Thể Thao', 'Du Lịch', 'Sức Khỏe', 'Thế Giới'
];

const splitMeta = (meta = '') => {
  const [tag = 'Tin Anime', time = 'Mới cập nhật'] = meta.split('/').map((part) => part.trim());
  return { tag, time };
};

const toNewsItem = (item, index) => {
  const meta = splitMeta(item[1]);

  return {
    id: `${item[0]}-${index}`,
    title: item[0],
    time: meta.time,
    tag: meta.tag,
    views: item[2],
    img: item[3]
  };
};

export default function NewsMenuPage() {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState('Tất Cả');
  const [searchText, setSearchText] = useState('');
  const [state, setState] = useState({ items: [], loading: true, error: '' });

  useEffect(() => {
    let ignore = false;

    fetchNewsList()
      .then((data) => {
        if (!ignore) setState({ items: data.news, loading: false, error: '' });
      })
      .catch((error) => {
        if (!ignore) setState({ items: [], loading: false, error: error?.message || 'Không thể tải dữ liệu tin tức' });
      });

    return () => { ignore = true; };
  }, []);

  const openNewsDetail = (item) => {
    window.localStorage.setItem('selectedNewsId', item.id);
    navigate('/news-detail');
  };

  const filteredItems = useMemo(() => {
    const keyword = searchText.trim().toLowerCase();
    const itemsByCategory = activeCategory === 'Tất Cả'
      ? state.items
      : state.items.filter((item) => item.tag === activeCategory);

    if (!keyword) return itemsByCategory;

    return itemsByCategory.filter((item) => item.title.toLowerCase().includes(keyword));
  }, [activeCategory, searchText, state.items]);

  return (
    <PageShell title="Danh sách Tin Tức">
      <PhoneFrame>
        <Box sx={{ height: '100%', overflowY: 'auto', scrollbarWidth: 'none', backgroundColor: '#101010', color: '#fff', pb: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', p: 2, pt: 3, position: 'sticky', top: 0, bgcolor: '#101010', zIndex: 10 }}>
            <IconButton size="small" sx={{ color: '#fff' }} onClick={() => navigate('/home')}>
              <ArrowBackIcon />
            </IconButton>
            <Typography variant="h6" sx={{ ml: 1.5, fontWeight: 'bold', fontSize: 16 }}>Tin Tức</Typography>
          </Box>

          <Box sx={{ px: 2, mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', backgroundColor: '#222', borderRadius: 8, px: 2, py: 0.5 }}>
              <SearchIcon sx={{ color: '#888', mr: 1, fontSize: 20 }} />
              <InputBase value={searchText} onChange={(event) => setSearchText(event.target.value)} placeholder="Nhập tên tin tức cần tìm kiếm" sx={{ color: '#fff', flex: 1, fontSize: '0.9rem' }} />
            </Box>
          </Box>

          <Box sx={{ px: 2, mb: 3, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {categories.map((cat) => (
              <Button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                sx={{
                  backgroundColor: activeCategory === cat ? '#ff9800' : '#222',
                  color: activeCategory === cat ? '#fff' : '#aaa',
                  borderRadius: 1, textTransform: 'none', minWidth: 'auto', px: 1.5, py: 0.5, fontSize: '0.8rem',
                  '&:hover': { backgroundColor: activeCategory === cat ? '#e68a00' : '#333' }
                }}
              >
                {cat}
              </Button>
            ))}
          </Box>

          <Typography sx={{ px: 2, mb: 3, fontWeight: 'bold', color: '#fff', textTransform: 'uppercase', fontSize: 14 }}>
            Tin mới nhất
          </Typography>

          {state.loading || state.error ? (
            <Typography sx={{ px: 2, color: state.error ? '#ffb74d' : '#aaa', fontSize: 13, fontWeight: 700 }}>
              {state.error || 'Đang tải tin tức...'}
            </Typography>
          ) : (
            <Box sx={{ px: 2, display: 'flex', flexDirection: 'column', gap: 2.5 }}>
              {filteredItems.map((item) => (
                <Box key={item.id} sx={{ display: 'flex', gap: 1.5, cursor: 'pointer', '&:hover': { opacity: 0.8 } }} onClick={() => openNewsDetail(item)}>
                  <Box sx={{ width: 130, flexShrink: 0, borderRadius: 1.5, overflow: 'hidden', aspectRatio: '16/9' }}>
                    <img src={item.img} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </Box>

                  <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', flex: 1 }}>
                    <Typography sx={{ color: '#ff9800', fontSize: 10, mb: 0.5 }}>{item.time}</Typography>
                    <Typography sx={{ fontWeight: 'bold', lineHeight: 1.3, mb: 1, fontSize: 13, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      {item.title}
                    </Typography>
                    <Box sx={{ alignSelf: 'flex-start', backgroundColor: '#222', px: 1, py: 0.2, borderRadius: 1 }}>
                      <Typography sx={{ color: '#aaa', fontSize: 10 }}>{item.tag}</Typography>
                    </Box>
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
