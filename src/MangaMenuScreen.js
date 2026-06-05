import React, { useState } from 'react';
import { Box, Typography, IconButton, InputBase, Button } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SearchIcon from '@mui/icons-material/Search';
import { useNavigate } from 'react-router-dom';

const categories = [
  'Tất Cả', 'Hành Động', 'Viễn Tưởng', 'Lãng Mạn', 'Kinh Dị', 'Võ Thuật', 'Hài Hước', 
  'Trường Học', 'Trinh Thám', 'Âm Nhạc', 'Phiêu Lưu', 'Siêu Nhiên', 'Đời Thường', 
  'Giả Tưởng', 'Isekai', 'Game', 'Thể Thao', 'Kịch Tính'
];

const mangaList = [
  { id: 1, title: 'Kaguya-sama Wa Kokurasetai?: Tensai-tachi no Renai Zunousen', chap: 'Chap 252', img: 'https://placehold.co/200x300/2a2a2a/FFF?text=Kaguya' },
  { id: 2, title: 'Trong núi có dã thú', chap: 'Chap 55', img: 'https://placehold.co/200x300/2a2a2a/FFF?text=Da+Thu' },
  { id: 3, title: 'Du Hành Không Gian', chap: 'Chap 360', img: 'https://placehold.co/200x300/2a2a2a/FFF?text=Space' },
  { id: 4, title: 'Mashle: Magic And Muscles', chap: 'Chap 102', img: 'https://placehold.co/200x300/2a2a2a/FFF?text=Mashle' },
  { id: 5, title: 'Kingdom - Vương Giả Thiên Hạ', chap: 'Chap 750', img: 'https://placehold.co/200x300/2a2a2a/FFF?text=Kingdom' },
  { id: 6, title: 'Kyou kara Hajimeru Osananajimi', chap: 'Chap 58', img: 'https://placehold.co/200x300/2a2a2a/FFF?text=Osananajimi' },
  { id: 7, title: 'Rinjin-chan thật làm tôi lo lắng', chap: 'Chap 83', img: 'https://placehold.co/200x300/2a2a2a/FFF?text=Rinjin' },
  { id: 8, title: 'Yankee Wa Isekai De Seirei Ni Aisaremasu', chap: 'Chap 54', img: 'https://placehold.co/200x300/2a2a2a/FFF?text=Yankee' },
  { id: 9, title: 'Quán Cà Phê Nữ Thần', chap: 'Chap 54', img: 'https://placehold.co/200x300/2a2a2a/FFF?text=Cafe' },
];

export default function MangaMenuScreen() {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState('Tất Cả');

  return (
    <Box sx={{ backgroundColor: '#000', minHeight: '100vh', display: 'flex', justifyContent: 'center' }}>
      <Box sx={{ width: '100%', maxWidth: 1200, backgroundColor: '#141414', minHeight: '100vh', color: '#fff', pb: 4, px: { xs: 0, sm: 2 } }}>
        
        <Box sx={{ display: 'flex', alignItems: 'center', p: 2, pt: 4 }}>
          <IconButton sx={{ color: '#fff' }} onClick={() => navigate('/')}>
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h6" sx={{ ml: 2, fontWeight: 'bold' }}>Truyện Tranh</Typography>
        </Box>

        <Box sx={{ px: 2, mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', backgroundColor: '#222', borderRadius: 8, px: 2, py: 0.5 }}>
            <SearchIcon sx={{ color: '#888', mr: 1, fontSize: 20 }} />
            <InputBase placeholder="Nhập tên Anime để tìm kiếm" sx={{ color: '#fff', flex: 1, fontSize: '0.9rem' }} />
          </Box>
        </Box>

        <Box sx={{ px: 2, mb: 4, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          {categories.map((cat) => (
            <Button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              sx={{
                backgroundColor: activeCategory === cat ? '#ff9800' : '#222',
                color: activeCategory === cat ? '#fff' : '#aaa',
                borderRadius: 1, textTransform: 'none', minWidth: 'auto', px: 1.5, py: 0.5, fontSize: '0.85rem',
              }}
            >
              {cat}
            </Button>
          ))}
        </Box>

        <Typography variant="h6" sx={{ px: 2, mb: 3, fontWeight: 'bold', color: '#fff', textTransform: 'uppercase' }}>
          Truyện tranh mới nhất
        </Typography>

        <Box sx={{ px: 2, display: 'grid', gridTemplateColumns: { xs: 'repeat(3, 1fr)', sm: 'repeat(4, 1fr)', md: 'repeat(6, 1fr)' }, gap: 2 }}>
          {mangaList.map((item) => (
            <Box key={item.id} sx={{ display: 'flex', flexDirection: 'column', cursor: 'pointer' }} onClick={() => navigate('/manga-detail')}>
              <Box sx={{ position: 'relative', borderRadius: 1.5, overflow: 'hidden', aspectRatio: '2/3', mb: 1, '&:hover': { opacity: 0.8 } }}>
                <img src={item.img} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                
                <Box sx={{ position: 'absolute', top: 6, left: 6, backgroundColor: 'rgba(0,0,0,0.7)', borderLeft: '2px solid #ff4444', px: 0.8, py: 0.2, borderRadius: '2px' }}>
                  <Typography variant="caption" sx={{ color: '#fff', fontSize: '0.7rem', fontWeight: 'bold' }}>
                    {item.chap}
                  </Typography>
                </Box>
              </Box>

              <Typography variant="body2" sx={{ fontWeight: 'bold', lineHeight: 1.3, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                {item.title}
              </Typography>
            </Box>
          ))}
        </Box>

      </Box>
    </Box>
  );
}