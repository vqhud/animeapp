import React, { useState } from 'react';
import { Box, Typography, IconButton, Button, Divider, Chip } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import PlayCircleOutlinedIcon from '@mui/icons-material/PlayCircleOutlined';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import ReplyIcon from '@mui/icons-material/Reply';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { useNavigate } from 'react-router-dom';

const episodes = [
  { id: 1, title: 'Tập 1', views: '432K lượt xem', img: 'https://placehold.co/120x80/2a2a2a/FFF?text=Tap+1' },
  { id: 2, title: 'Tập 2', views: '321K lượt xem', img: 'https://placehold.co/120x80/2a2a2a/FFF?text=Tap+2' },
  { id: 3, title: 'Tập 3', views: '310K lượt xem', img: 'https://placehold.co/120x80/2a2a2a/FFF?text=Tap+3' },
  { id: 4, title: 'Tập 4', views: '309K lượt xem', img: 'https://placehold.co/120x80/2a2a2a/FFF?text=Tap+4' },
];


const recommendedAnime = [
  { id: 1, title: 'Hibike! Euphonium movie3: Chikai no', eps: 'Tập 12', views: '12k6 view', img: 'https://placehold.co/200x300/2a2a2a/FFF?text=Hibike' },
  { id: 2, title: 'Shirobako Movie', eps: 'Tập 12', views: '10k9 view', img: 'https://placehold.co/200x300/2a2a2a/FFF?text=Shirobako' },
  { id: 3, title: 'Precure Miracle Leap movie: Minna to no', eps: 'Tập 12', views: '4k6 view', img: 'https://placehold.co/200x300/2a2a2a/FFF?text=Precure' },
  { id: 4, title: 'Date A Bullet', eps: 'Tập 32', views: '672k view', img: 'https://placehold.co/200x300/2a2a2a/FFF?text=Date+A+Bullet' },
  { id: 5, title: 'Headspace', eps: 'Tập 76', views: '853k view', img: 'https://placehold.co/200x300/2a2a2a/FFF?text=Headspace' },
  { id: 6, title: 'Takt Op. Destiny', eps: 'Tập 12', views: '816k view', img: 'https://placehold.co/200x300/2a2a2a/FFF?text=Takt' },
];


const recommendedManga = [
  { id: 1, title: 'Black Clover', chap: 'Chap 293', img: 'https://placehold.co/200x300/2a2a2a/FFF?text=Black+Clover' },
  { id: 2, title: 'Boruto', chap: 'Chap 71', img: 'https://placehold.co/200x300/2a2a2a/FFF?text=Boruto' },
  { id: 3, title: 'Release that Witch!', chap: 'Chap 180', img: 'https://placehold.co/200x300/2a2a2a/FFF?text=Release+Witch' },
];

export default function AnimeDetailScreen() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('danh-sach');

  return (
    <Box sx={{ backgroundColor: '#000', minHeight: '100vh', display: 'flex', justifyContent: 'center' }}>

      <Box sx={{ width: '100%', maxWidth: 1200, backgroundColor: '#141414', minHeight: '100vh', color: '#fff', pb: 6 }}>
        
        <Box sx={{ position: 'relative' }}>
          <Box sx={{ position: 'absolute', top: 0, left: 0, right: 0, zIndex: 10, display: 'flex', alignItems: 'center', p: 2, pt: 4, background: 'linear-gradient(to bottom, rgba(0,0,0,0.8), transparent)' }}>
            <IconButton sx={{ color: '#fff' }} onClick={() => navigate(-1)}>
              <ArrowBackIcon />
            </IconButton>
            <Typography variant="h6" sx={{ ml: 2, fontWeight: 'bold' }}>Anime</Typography>
          </Box>

          <Box sx={{ width: '100%', aspectRatio: { xs: '16/9', md: '21/9' }, position: 'relative', backgroundColor: '#222' }}>
            <img src="https://placehold.co/1200x500/333/FFF?text=Eden+Video" alt="Video" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
              <PlayCircleOutlinedIcon sx={{ fontSize: 64, color: 'rgba(255,255,255,0.8)' }} />
            </Box>
          </Box>
        </Box>

        <Box sx={{ p: { xs: 2, md: 4 } }}>
          <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 0.5 }}>Eden - Tập 1</Typography>
          <Typography variant="body2" sx={{ color: '#aaa', mb: 2 }}>522.000 lượt xem</Typography>
          
          <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
            <Button startIcon={<FavoriteBorderIcon />} sx={{ color: '#aaa', textTransform: 'none' }}>Thích 23</Button>
            <Button startIcon={<BookmarkBorderIcon />} sx={{ color: '#aaa', textTransform: 'none' }}>Theo dõi 23</Button>
            <Button startIcon={<ReplyIcon sx={{ transform: 'scaleX(-1)' }} />} sx={{ color: '#aaa', textTransform: 'none' }}>Chia sẻ 200</Button>
          </Box>

          <Divider sx={{ backgroundColor: '#333', mb: 3 }} />

          <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
            <Button 
              onClick={() => setActiveTab('danh-sach')}
              sx={{ backgroundColor: activeTab === 'danh-sach' ? '#333' : 'transparent', color: '#fff', textTransform: 'none', px: 3, py: 1, borderRadius: 1, border: activeTab === 'danh-sach' ? '1px solid #ff9800' : '1px solid #333' }}
            >
              Danh sách tập
            </Button>
            <Button 
              onClick={() => setActiveTab('binh-luan')}
              sx={{ backgroundColor: activeTab === 'binh-luan' ? '#333' : 'transparent', color: '#fff', textTransform: 'none', px: 3, py: 1, borderRadius: 1, border: activeTab === 'binh-luan' ? '1px solid #ff9800' : '1px solid #333' }}
            >
              0 Bình luận
            </Button>
          </Box>

          <Box sx={{ minHeight: 200, mb: 4 }}>
            {activeTab === 'danh-sach' && (
              <Box>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 4 }}>
                  {episodes.map((ep) => (
                    <Box key={ep.id} sx={{ display: 'flex', gap: 2, cursor: 'pointer', '&:hover': { opacity: 0.8 } }}>
                      <Box sx={{ position: 'relative', width: 140, height: 90, borderRadius: 1, overflow: 'hidden' }}>
                        <img src={ep.img} alt={ep.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
                          <PlayCircleOutlinedIcon sx={{ fontSize: 32, color: 'rgba(255,255,255,0.8)' }} />
                        </Box>
                      </Box>
                      <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                        <Typography variant="body2" sx={{ color: '#ff9800', fontWeight: 'bold' }}>Eden</Typography>
                        <Typography variant="body1" sx={{ fontWeight: 'bold' }}>{ep.title}</Typography>
                        <Typography variant="caption" sx={{ color: '#aaa' }}>{ep.views}</Typography>
                      </Box>
                    </Box>
                  ))}
                </Box>

                <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>THÔNG TIN PHIM</Typography>
                <Typography variant="body2" sx={{ color: '#aaa', mb: 0.5 }}>Thể loại: Viễn Tưởng, Đời Thường, Robot</Typography>
                <Typography variant="body2" sx={{ color: '#aaa', mb: 0.5 }}>Nhóm sub: Phim1080</Typography>
                <Typography variant="body2" sx={{ color: '#aaa', mb: 1.5 }}>Tổng số tập: 4 tập</Typography>
                
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                  <Typography variant="body2" sx={{ color: '#aaa', mr: 1, alignSelf: 'center' }}>Từ khóa:</Typography>
                  {['Eden', 'Eden Vietsub', 'Eden HD', 'tập 1', 'Eden tập mới nhất'].map((tag) => (
                    <Chip key={tag} label={tag} sx={{ backgroundColor: '#222', color: '#aaa', fontSize: '0.75rem', borderRadius: 1 }} />
                  ))}
                </Box>
                
                <Typography variant="body2" sx={{ color: '#ccc', lineHeight: 1.6 }}>
                  Một bé gái loài người được robot bí mật nuôi nấng bắt đầu khám phá những bí mật đen tối đằng sau thế giới dịu dàng xanh tươi nơi con người gần như biến mất.
                </Typography>
              </Box>
            )}

            {activeTab === 'binh-luan' && (
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 200, color: '#aaa' }}>
                <Typography>Chưa có bình luận nào. Hãy là người đầu tiên!</Typography>
              </Box>
            )}
          </Box>

          <Divider sx={{ backgroundColor: '#333', mb: 4 }} />

          <Box sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer', mb: 3, '&:hover': { color: '#ff9800' } }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', textTransform: 'uppercase' }}>
              Hôm nay xem gì
            </Typography>
            <ChevronRightIcon />
          </Box>

          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: 'repeat(3, 1fr)', sm: 'repeat(4, 1fr)', md: 'repeat(6, 1fr)' }, gap: 2, mb: 5 }}>
            {recommendedAnime.map((item) => (
              <Box key={item.id} sx={{ display: 'flex', flexDirection: 'column', cursor: 'pointer' }}>
                <Box sx={{ position: 'relative', borderRadius: 1.5, overflow: 'hidden', aspectRatio: '2/3', mb: 1, '&:hover': { opacity: 0.8 } }}>
                  <img src={item.img} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
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

          <Box sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer', mb: 3, '&:hover': { color: '#ff9800' } }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', textTransform: 'uppercase' }}>
              Truyện Tranh
            </Typography>
            <ChevronRightIcon />
          </Box>

          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: 'repeat(3, 1fr)', sm: 'repeat(4, 1fr)', md: 'repeat(6, 1fr)' }, gap: 2 }}>
            {recommendedManga.map((item) => (
              <Box key={item.id} sx={{ display: 'flex', flexDirection: 'column', cursor: 'pointer' }}>
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
    </Box>
  );
}