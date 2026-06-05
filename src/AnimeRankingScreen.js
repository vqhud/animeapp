// src/AnimeRankingScreen.js
import React, { useState } from 'react';
import { Box, Typography, Tabs, Tab, Button, IconButton } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import PlayCircleOutlinedIcon from '@mui/icons-material/PlayCircleOutlined';
import { useNavigate } from 'react-router-dom';

const animeList = [
  { rank: 1, title: 'Naruto Shippuuden', eps: '500/500 tập', views: '68,929,535 lượt xem', img: 'https://m.media-amazon.com/images/I/810Xo+d8xlL._AC_UF1000,1000_QL80_.jpg' },
  { rank: 2, title: 'Nanatsu no Taizai', eps: '98/100 tập', views: '17,616,136 lượt xem', img: 'https://i1.sndcdn.com/artworks-000116891575-7208vq-t500x500.jpg' },
  { rank: 3, title: 'Boruto', eps: '202/999 tập', views: '59,477,828 lượt xem', img: 'https://upload.wikimedia.org/wikipedia/en/d/db/Boruto_manga_vol_1.jpg' },
  { rank: 4, title: 'Yuusha, Yamemasu', eps: '500/500 tập', views: '8,723 lượt xem', img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTOdv4wlF6BFAB0HS6iTTpaxsu9Nr6YE_WCwA&s' },
  { rank: 5, title: 'Conan The Movie', eps: '500/500 tập', views: '9,980,542 lượt xem', img: 'https://placehold.co/600x320/2a2a2a/FFF?text=Conan' },
  { rank: 6, title: 'Attack on Titan', eps: '500/500 tập', views: '6,929,535 lượt xem', img: 'https://placehold.co/600x320/2a2a2a/FFF?text=Attack+on+Titan' },
  { rank: 7, title: 'Otome Game Sekai wa Mob ni Kibishii', eps: '500/500 tập', views: '22,151 lượt xem', img: 'https://placehold.co/600x320/2a2a2a/FFF?text=Otome+Game' },
  { rank: 8, title: 'Arifureta Shokugyou de Sekai Saikyou', eps: '500/500 tập', views: '2,464,486 lượt xem', img: 'https://placehold.co/600x320/2a2a2a/FFF?text=Arifureta' },
  { rank: 9, title: 'Hội Pháp Sư', eps: '500/500 tập', views: '36,181,840 lượt xem', img: 'https://placehold.co/600x320/2a2a2a/FFF?text=Hoi+Phap+Su' },
  { rank: 10, title: 'Sứ Mạng Thần Chết', eps: '500/500 tập', views: '13,449,108 lượt xem', img: 'https://placehold.co/600x320/2a2a2a/FFF?text=Su+Mang+Than+Chet' },
];

const mangaList = [
  { rank: 1, title: 'Komi không thể giao tiếp', chap: 'Chap 100/100', views: '929,535 lượt xem', img: 'https://placehold.co/600x320/2a2a2a/FFF?text=Komi' },
  { rank: 2, title: 'Ao Ashi', chap: 'Chap 100/100', views: '616,136 lượt xem', img: 'https://placehold.co/600x320/2a2a2a/FFF?text=Ao+Ashi' },
  { rank: 3, title: 'Từ Chức Nghiệp Yếu Nhất Trở Thành “ Thợ Rèn” Mạnh Nhất', chap: 'Chap 100/100', views: '477,828 lượt xem', img: 'https://placehold.co/600x320/2a2a2a/FFF?text=Tho+Ren' },
  { rank: 4, title: 'Spy X Family', chap: 'Chap 100/100', views: '8,723 lượt xem', img: 'https://placehold.co/600x320/2a2a2a/FFF?text=Spy+X+Family' },
  { rank: 5, title: 'Boku No Kokoro', chap: 'Chap 100/100', views: '980,542 lượt xem', img: 'https://placehold.co/600x320/2a2a2a/FFF?text=Boku+No+Kokoro' },
  { rank: 6, title: 'Gia Đình Của Những Chiếc Bóng', chap: 'Chap 100/100', views: '929,535 lượt xem', img: 'https://placehold.co/600x320/2a2a2a/FFF?text=Gia+Dinh' },
  { rank: 7, title: 'Shijou Saikyou No Daimaou A Ni Tensei Suru', chap: 'Chap 100/100', views: '22,151 lượt xem', img: 'https://placehold.co/600x320/2a2a2a/FFF?text=Shijou+Saikyou' },
  { rank: 8, title: 'Mashle: Magic And Muscles', chap: 'Chap 100/100', views: '464,486 lượt xem', img: 'https://placehold.co/600x320/2a2a2a/FFF?text=Mashle' },
  { rank: 9, title: 'Kingdom - Vương Giả Thiên Hạ', chap: 'Chap 100/100', views: '181,840 lượt xem', img: 'https://placehold.co/600x320/2a2a2a/FFF?text=Kingdom' },
  { rank: 10, title: 'Rinjin-chan Thật Làm Tôi Lo Lắng', chap: 'Chap 100/100', views: '449,108 lượt xem', img: 'https://placehold.co/600x320/2a2a2a/FFF?text=Rinjin-chan' },
];


export default function AnimeRankingScreen() {
  const [tabIndex, setTabIndex] = useState(0);
  const [timeFilter, setTimeFilter] = useState('Ngày');
  const navigate = useNavigate(); // Dùng để quay về trang trước

  const handleTabChange = (event, newValue) => {
    setTabIndex(newValue);
  };

  const currentList = tabIndex === 0 ? animeList : mangaList;

  return (
    <Box sx={{ backgroundColor: '#000', minHeight: '100vh', display: 'flex', justifyContent: 'center' }}>
      <Box sx={{ width: '100%', maxWidth: 1200, backgroundColor: '#141414', minHeight: '100vh', color: '#fff', pb: 4 }}>
        
        {/* Header có nút quay lại quay về Trang Chủ */}
        <Box sx={{ display: 'flex', alignItems: 'center', p: 2, pt: 4 }}>
          <IconButton sx={{ color: '#fff' }} onClick={() => navigate('/')}>
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h6" sx={{ ml: 2, fontWeight: 'bold' }}>
            Bảng Xếp Hạng
          </Typography>
        </Box>

        {/* Tabs */}
        <Tabs 
          value={tabIndex} 
          onChange={handleTabChange} 
          centered 
          sx={{ 
            borderBottom: 1, borderColor: '#333',
            '& .MuiTabs-indicator': { backgroundColor: '#ff9800' },
            '& .MuiTab-root.Mui-selected': { color: '#fff' }
          }}
        >
          <Tab label="BXH Phim Anime" sx={{ color: '#aaa', textTransform: 'none', fontWeight: 'bold' }} />
          <Tab label="BXH Truyện Tranh" sx={{ color: '#aaa', textTransform: 'none', fontWeight: 'bold' }} />
        </Tabs>

        {/* Time Filters */}
        <Box sx={{ display: 'flex', gap: 1, p: 2 }}>
          {['Ngày', 'Tuần', 'Tháng', 'Năm'].map((filter) => (
            <Button
              key={filter}
              onClick={() => setTimeFilter(filter)}
              sx={{
                backgroundColor: timeFilter === filter ? '#ff9800' : '#222',
                color: timeFilter === filter ? '#fff' : '#aaa',
                borderRadius: 1, textTransform: 'none', minWidth: 'auto', px: 2, py: 0.5,
                '&:hover': { backgroundColor: timeFilter === filter ? '#e68a00' : '#333' }
              }}
            >
              {filter}
            </Button>
          ))}
        </Box>

        {/* Content List */}
        <Box sx={{ px: 2 }}>
          {currentList.map((item) => (
            <Box key={item.rank} sx={{ mb: 3 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>
                #Top {item.rank}
              </Typography>
              
              <Box sx={{ position: 'relative', borderRadius: 2, overflow: 'hidden', mb: 1 }}>
                <img src={item.img} alt={item.title} style={{ width: '100%', display: 'block', borderRadius: '8px' }} />
                
                {tabIndex === 0 && (
                  <Box sx={{
                    position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
                    backgroundColor: 'rgba(0,0,0,0.4)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', p: 1
                  }}>
                    <PlayCircleOutlinedIcon sx={{ fontSize: 48, color: 'rgba(255,255,255,0.8)' }} />
                  </Box>
                )}

                {tabIndex === 1 && (
                  <Box sx={{
                    position: 'absolute', top: 8, left: 8, backgroundColor: 'rgba(0,0,0,0.6)', border: '1px solid #fff', borderRadius: '4px', px: 1, py: 0.2
                  }}>
                    <Typography variant="caption" sx={{ color: '#fff', fontWeight: 'bold' }}>
                      {item.chap}
                    </Typography>
                  </Box>
                )}
              </Box>

              <Typography variant="body1" sx={{ fontWeight: 'bold', mb: 0.5 }}>
                {item.title}
              </Typography>
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', color: '#aaa' }}>
                {tabIndex === 0 && <Typography variant="body2">{item.eps}</Typography>}
                <Typography variant="body2" sx={{ ml: tabIndex === 1 ? 0 : 'auto' }}>
                  {item.views}
                </Typography>
              </Box>
            </Box>
          ))}
        </Box>

      </Box>
    </Box>
  );
}