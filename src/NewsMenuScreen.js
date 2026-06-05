import React, { useState } from 'react';
import { Box, Typography, IconButton, InputBase, Button } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SearchIcon from '@mui/icons-material/Search';
import { useNavigate } from 'react-router-dom';

const categories = [
  'Tất Cả', 'Tin Anime', 'Tin Phim', 'Thể Thao', 'Du Lịch', 'Sức Khỏe', 'Thế Giới'
];


const newsList = [
  { id: 1, time: '8:10 Hôm nay', title: 'Sau 30 năm, ca khúc “CHA-LA HEAD CHA-LA” của Dragon Ball Z được tái hiện trở lại!', tag: 'Tin Anime', img: 'https://placehold.co/300x200/2a2a2a/FFF?text=Dragon+Ball' },
  { id: 2, time: '16:10 Hôm nay', title: 'One Piece sẽ chính thức lên sóng tập mới trở lại từ 17 tháng 4!', tag: 'Tin Anime', img: 'https://placehold.co/300x200/2a2a2a/FFF?text=One+Piece' },
  { id: 3, time: '18:40 Hôm nay', title: 'Đón chờ podcast “Anime Roomy” với 4 cô nàng dễ thương!', tag: 'Tin Anime', img: 'https://placehold.co/300x200/2a2a2a/FFF?text=Anime+Roomy' },
  { id: 4, time: '17:23 Hôm qua', title: 'Doraemon movie 41 chính thức khởi chiếu tại Việt Nam với cái tên hoàn toàn mới!', tag: 'Tin Anime', img: 'https://placehold.co/300x200/2a2a2a/FFF?text=Doraemon' },
  { id: 5, time: '17:23 Hôm qua', title: '6 nhân vật chiếm trọn trái tim khán giả từ cái nhìn đầu tiên: Emma Watson mãi là “Tình đầu”...', tag: 'Tin Phim', img: 'https://placehold.co/300x200/2a2a2a/FFF?text=Emma+Watson' },
  { id: 6, time: '21:00 Thứ hai', title: 'Mads Mikkelsen được khen khi thay thế Johnny Depp', tag: 'Tin Phim', img: 'https://placehold.co/300x200/2a2a2a/FFF?text=Mads+Mikkelsen' },
];

export default function NewsMenuScreen() {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState('Tất Cả');

  return (
    <Box sx={{ backgroundColor: '#000', minHeight: '100vh', display: 'flex', justifyContent: 'center' }}>
      <Box sx={{ width: '100%', maxWidth: 1200, backgroundColor: '#141414', minHeight: '100vh', color: '#fff', pb: 4, px: { xs: 0, sm: 2 } }}>
        

        <Box sx={{ display: 'flex', alignItems: 'center', p: 2, pt: 4, position: 'sticky', top: 0, backgroundColor: '#141414', zIndex: 10 }}>
          <IconButton sx={{ color: '#fff' }} onClick={() => navigate('/')}>
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h6" sx={{ ml: 2, fontWeight: 'bold' }}>Tin Tức</Typography>
        </Box>

        <Box sx={{ px: 2, mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', backgroundColor: '#222', borderRadius: 2, px: 2, py: 1 }}>
            <SearchIcon sx={{ color: '#888', mr: 1, fontSize: 20 }} />
            <InputBase placeholder="Nhập tên tin tức cần tìm kiếm" sx={{ color: '#fff', flex: 1, fontSize: '0.95rem' }} />
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
                borderRadius: 1, textTransform: 'none', minWidth: 'auto', px: 2, py: 0.5, fontSize: '0.85rem',
                '&:hover': { backgroundColor: activeCategory === cat ? '#e68a00' : '#333' }
              }}
            >
              {cat}
            </Button>
          ))}
        </Box>

        <Typography variant="h6" sx={{ px: 2, mb: 3, fontWeight: 'bold', color: '#fff', textTransform: 'uppercase' }}>
          Tin mới nhất
        </Typography>

        <Box sx={{ px: 2, display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' }, gap: 3 }}>
          {newsList.map((item) => (
            <Box key={item.id} sx={{ display: 'flex', gap: 2, cursor: 'pointer', '&:hover': { opacity: 0.8 } }} onClick={() => navigate('/news-detail')}>
              <Box sx={{ width: 140, flexShrink: 0, borderRadius: 1.5, overflow: 'hidden', aspectRatio: '16/9' }}>
                <img src={item.img} alt="thumbnail" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </Box>
              
              <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', flex: 1 }}>
                <Typography variant="caption" sx={{ color: '#888', mb: 0.5 }}>{item.time}</Typography>
                <Typography variant="body2" sx={{ fontWeight: 'bold', lineHeight: 1.4, mb: 1, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                  {item.title}
                </Typography>
                <Box sx={{ alignSelf: 'flex-start', backgroundColor: '#222', px: 1, py: 0.2, borderRadius: 1 }}>
                  <Typography variant="caption" sx={{ color: '#aaa', fontSize: '0.7rem' }}>{item.tag}</Typography>
                </Box>
              </Box>
            </Box>
          ))}
        </Box>

      </Box>
    </Box>
  );
}