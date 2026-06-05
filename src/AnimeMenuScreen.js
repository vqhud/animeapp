import React, { useState } from 'react';
import { Box, Typography, IconButton, InputBase, Button } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SearchIcon from '@mui/icons-material/Search';
import PlayCircleOutlinedIcon from '@mui/icons-material/PlayCircleOutlined';
import { useNavigate } from 'react-router-dom';

const categories = [
  'Tất Cả Anime', 'Hành Động', 'Viễn Tưởng', 'Lãng Mạn', 'Kinh Dị', 'Võ Thuật', 'Hài Hước', 
  'Trường Học', 'Trinh Thám', 'Âm Nhạc', 'Phiêu Lưu', 'Siêu Nhiên', 'Đời Thường'
];

const animeList = [
  { id: 1, title: 'Eden', eps: 'Tập 04', views: '522k view', img: 'https://placehold.co/200x300/2a2a2a/FFF?text=Eden', isNew: true },
  { id: 2, title: 'Dragons Ball Super', eps: 'Tập 70', views: '161k view', img: 'https://placehold.co/200x300/2a2a2a/FFF?text=Dragon+Ball', isNew: false },
  { id: 3, title: 'Yasuke', eps: 'Tập 72', views: '120k view', img: 'https://placehold.co/200x300/2a2a2a/FFF?text=Yasuke', isNew: false },
  { id: 4, title: 'Nanatsu No Taizai', eps: 'Tập 04', views: '211k view', img: 'https://placehold.co/200x300/2a2a2a/FFF?text=Nanatsu', isNew: true },
  { id: 5, title: 'Dounika Naru Hibi', eps: 'Tập 01', views: '201 view', img: 'https://placehold.co/200x300/2a2a2a/FFF?text=Dounika', isNew: false },
  { id: 6, title: 'Gintama', eps: 'Tập 08', views: '1tr view', img: 'https://placehold.co/200x300/2a2a2a/FFF?text=Gintama', isNew: false },
  // Tui nhân đôi data lên xíu cho bạn dễ nhìn hiệu ứng nhiều cột nha
  { id: 7, title: 'Blue Reflection Ray', eps: 'Tập 24', views: '111k view', img: 'https://placehold.co/200x300/2a2a2a/FFF?text=Blue+Ray', isNew: true },
  { id: 8, title: 'Date A Bullet', eps: 'Tập 32', views: '573k view', img: 'https://placehold.co/200x300/2a2a2a/FFF?text=Date+A+Bullet', isNew: false },
];

export default function AnimeMenuScreen() {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState('Tất Cả Anime');

  return (
    <Box sx={{ backgroundColor: '#000', minHeight: '100vh', display: 'flex', justifyContent: 'center' }}>
      <Box sx={{ width: '100%', maxWidth: 1200, backgroundColor: '#141414', minHeight: '100vh', color: '#fff', pb: 4, px: { xs: 0, sm: 2 } }}>
        
        <Box sx={{ display: 'flex', alignItems: 'center', p: 2, pt: 4 }}>
          <IconButton sx={{ color: '#fff' }} onClick={() => navigate('/')}>
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h6" sx={{ ml: 2, fontWeight: 'bold' }}>Anime</Typography>
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

        <Typography variant="h6" sx={{ px: 2, mb: 3, fontWeight: 'bold', color: '#fff' }}>
          HÔM NAY XEM GÌ
        </Typography>


        <Box sx={{ px: 2, display: 'grid', gridTemplateColumns: { xs: 'repeat(3, 1fr)', sm: 'repeat(4, 1fr)', md: 'repeat(6, 1fr)' }, gap: 2 }}>
          {animeList.map((item) => (
            <Box key={item.id} sx={{ display: 'flex', flexDirection: 'column', cursor: 'pointer' }} onClick={() => navigate('/anime-detail')}>
              <Box sx={{ position: 'relative', borderRadius: 1.5, overflow: 'hidden', aspectRatio: '2/3', mb: 1, '&:hover': { opacity: 0.8 } }}>
                <img src={item.img} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                
                {item.isNew && (
                  <Box sx={{ position: 'absolute', top: 6, left: 6, backgroundColor: '#e53935', px: 0.8, py: 0.3, borderRadius: '4px' }}>
                    <Typography variant="caption" sx={{ color: '#fff', fontSize: '0.7rem', fontWeight: 'bold' }}>Sắp chiếu</Typography>
                  </Box>
                )}
                
                <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
                  <PlayCircleOutlinedIcon sx={{ fontSize: 40, color: 'rgba(255,255,255,0.9)' }} />
                </Box>
              </Box>

              <Typography variant="body2" sx={{ fontWeight: 'bold', lineHeight: 1.3, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                {item.title}
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', color: '#aaa', mt: 0.5 }}>
                <Typography variant="caption">{item.eps}</Typography>
                <Typography variant="caption">{item.views}</Typography>
              </Box>
            </Box>
          ))}
        </Box>

      </Box>
    </Box>
  );
}