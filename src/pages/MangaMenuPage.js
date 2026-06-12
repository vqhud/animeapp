import { useEffect, useMemo, useState } from 'react';
import { Box, Typography, IconButton, InputBase, Button } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SearchIcon from '@mui/icons-material/Search';
import { useNavigate } from 'react-router-dom';
import PageShell from '../components/PageShell.js';
import PhoneFrame from '../components/PhoneFrame.js';
import { fetchHomeAnime } from '../services/animeApi.js';

const selectedMangaKey = 'selectedMangaDetail';

const categories = [
  'Tất Cả', 'Hành Động', 'Viễn Tưởng', 'Lãng Mạn', 'Kinh Dị', 'Võ Thuật', 'Hài Hước',
  'Trường Học', 'Trinh Thám', 'Âm Nhạc', 'Phiêu Lưu', 'Siêu Nhiên', 'Đời Thường',
  'Giả Tưởng', 'Isekai', 'Game', 'Thể Thao', 'Kịch Tính'
];

const toMangaItem = (item, index) => ({
  id: `${item[0]}-${index}`,
  title: item[0],
  chap: `Chap ${String(index + 1).padStart(2, '0')}`,
  img: item[1]
});

export default function MangaMenuPage() {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState('Tất Cả');
  const [searchText, setSearchText] = useState('');
  const [state, setState] = useState({ items: [], loading: true, error: '' });

  useEffect(() => {
    let ignore = false;

    fetchHomeAnime()
      .then((data) => {
        if (!ignore) setState({ items: data.manga.map(toMangaItem), loading: false, error: '' });
      })
      .catch((error) => {
        if (!ignore) setState({ items: [], loading: false, error: error?.message || 'Không thể tải dữ liệu truyện tranh' });
      });

    return () => {
      ignore = true;
    };
  }, []);

  const filteredItems = useMemo(() => {
    const keyword = searchText.trim().toLowerCase();
    if (!keyword) return state.items;

    return state.items.filter((item) => item.title.toLowerCase().includes(keyword));
  }, [searchText, state.items]);
  const openMangaDetail = (item) => {
    window.localStorage.setItem(selectedMangaKey, JSON.stringify(item));
    navigate('/manga-detail');
  };

  return (
    <PageShell title="Danh sách Truyện Tranh">
      <PhoneFrame>
        <Box sx={{ height: '100%', overflowY: 'auto', scrollbarWidth: 'none', backgroundColor: '#101010', color: '#fff', pb: { xs: 3, md: 5 } }}>
          <Box sx={{ display: 'flex', alignItems: 'center', px: { xs: 1.2, md: 3 }, py: { xs: 1, md: 1.6 }, position: 'sticky', top: 0, bgcolor: '#101010', zIndex: 10 }}>
            <IconButton size="small" sx={{ color: '#fff', p: 0.55 }} onClick={() => navigate('/home')}>
              <ArrowBackIcon sx={{ fontSize: { xs: 19, md: 24 } }} />
            </IconButton>
            <Typography sx={{ ml: 1, fontWeight: 800, fontSize: { xs: 13, md: 18 } }}>Truyện Tranh</Typography>
          </Box>

          <Box sx={{ px: { xs: 1.4, md: 3 }, mb: { xs: 1.2, md: 2 } }}>
            <Box sx={{ display: 'flex', alignItems: 'center', minHeight: { xs: 30, md: 38 }, backgroundColor: '#222', borderRadius: 8, px: { xs: 1.2, md: 2 }, py: 0.25 }}>
              <SearchIcon sx={{ color: '#888', mr: 0.8, fontSize: { xs: 17, md: 22 } }} />
              <InputBase value={searchText} onChange={(event) => setSearchText(event.target.value)} placeholder="Nhập tên truyện để tìm kiếm" sx={{ color: '#fff', flex: 1, fontSize: { xs: 11, md: 14 } }} />
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

          <Typography sx={{ px: { xs: 1.4, md: 3 }, mb: { xs: 1.1, md: 2 }, fontWeight: 800, color: '#dcdcdc', fontSize: { xs: 13, md: 18 }, textTransform: 'uppercase' }}>
            Truyện tranh mới nhất
          </Typography>

          {state.loading || state.error ? (
            <Typography sx={{ px: { xs: 1.4, md: 3 }, color: state.error ? '#ffb74d' : '#aaa', fontSize: { xs: 11, md: 14 }, fontWeight: 700 }}>
              {state.error || 'Đang tải dữ liệu truyện tranh...'}
            </Typography>
          ) : (
            <Box sx={{ px: { xs: 1.4, md: 3 }, display: 'grid', gridTemplateColumns: { xs: 'repeat(3, 1fr)', md: 'repeat(5, 1fr)' }, gap: { xs: '13px 9px', md: '22px 18px' } }}>
              {filteredItems.map((item) => (
                <Box key={item.id} sx={{ display: 'flex', flexDirection: 'column', cursor: 'pointer' }} onClick={() => openMangaDetail(item)}>
                  <Box sx={{ position: 'relative', borderRadius: 0.9, overflow: 'hidden', aspectRatio: '2/3', mb: 0.65, '&:hover': { opacity: 0.8 } }}>
                    <img src={item.img} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />

                    <Box sx={{ position: 'absolute', top: 4, left: 4, backgroundColor: 'rgba(0,0,0,0.7)', borderLeft: '2px solid #ff4444', px: 0.55, py: 0.1, borderRadius: '2px' }}>
                      <Typography sx={{ color: '#fff', fontSize: { xs: 8.5, md: 10.5 }, fontWeight: 'bold' }}>
                        {item.chap}
                      </Typography>
                    </Box>
                  </Box>

                  <Typography sx={{ fontWeight: 'bold', lineHeight: 1.25, fontSize: { xs: 10.2, md: 14 }, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {item.title}
                  </Typography>
                </Box>
              ))}
            </Box>
          )}
        </Box>
      </PhoneFrame>
    </PageShell>
  );
}
