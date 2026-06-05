import React, { useState } from 'react';
import { Box, Typography, IconButton, Button, Divider, Chip, Avatar, TextField, InputAdornment } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import ReplyIcon from '@mui/icons-material/Reply';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import PlayCircleOutlinedIcon from '@mui/icons-material/PlayCircleOutlined';
import ThumbUpOffAltIcon from '@mui/icons-material/ThumbUpOffAlt';
import InsertPhotoOutlinedIcon from '@mui/icons-material/InsertPhotoOutlined';
import { useNavigate } from 'react-router-dom';

const recommendedManga = [
  { id: 1, title: 'Black Clover', chap: 'Chap 293', img: 'https://placehold.co/200x300/2a2a2a/FFF?text=Black+Clover' },
  { id: 2, title: 'Boruto', chap: 'Chap 71', img: 'https://placehold.co/200x300/2a2a2a/FFF?text=Boruto' },
  { id: 3, title: 'Release that Witch!', chap: 'Chap 180', img: 'https://placehold.co/200x300/2a2a2a/FFF?text=Release+Witch' },
];

const recommendedAnime = [
  { id: 1, title: 'Hibike! Euphonium movie3', eps: 'Tập 12', views: '12k6 view', img: 'https://placehold.co/200x300/2a2a2a/FFF?text=Hibike' },
  { id: 2, title: 'Shirobako Movie', eps: 'Tập 12', views: '10k9 view', img: 'https://placehold.co/200x300/2a2a2a/FFF?text=Shirobako' },
  { id: 3, title: 'Precure Miracle Leap', eps: 'Tập 12', views: '4k6 view', img: 'https://placehold.co/200x300/2a2a2a/FFF?text=Precure' },
];

export default function MangaDetailScreen() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('doc-truyen');

  return (
    <Box sx={{ backgroundColor: '#000', minHeight: '100vh', display: 'flex', justifyContent: 'center' }}>
      <Box sx={{ width: '100%', maxWidth: 1200, backgroundColor: '#141414', minHeight: '100vh', color: '#fff', pb: 6 }}>
        

        <Box sx={{ display: 'flex', alignItems: 'center', p: 2, pt: 4, backgroundColor: '#141414', position: 'sticky', top: 0, zIndex: 100 }}>
          <IconButton sx={{ color: '#fff' }} onClick={() => navigate(-1)}>
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h6" sx={{ ml: 2, fontWeight: 'bold' }}>Truyện Tranh</Typography>
        </Box>

        <Box sx={{ p: { xs: 2, md: 4 } }}>

          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
            <Box sx={{ width: 200, height: 300, borderRadius: 2, overflow: 'hidden', mb: 2 }}>
              <img src="https://placehold.co/400x600/2a2a2a/FFF?text=Kingdom" alt="Kingdom Cover" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </Box>
            <Typography variant="h5" sx={{ fontWeight: 'bold', textAlign: 'center', mb: 1 }}>Kingdom - Vương Giả Thiên Hạ</Typography>
            <Typography variant="body2" sx={{ color: '#aaa', mb: 0.5 }}>Tác giả: Hara Yasuhisa</Typography>
            <Typography variant="body2" sx={{ color: '#aaa', mb: 0.5 }}>Tình trạng: Đang cập nhật</Typography>
            <Typography variant="body2" sx={{ color: '#aaa', mb: 2 }}>Lượt đọc: 153.017</Typography>
            
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button startIcon={<FavoriteBorderIcon />} sx={{ color: '#aaa', textTransform: 'none' }}>Thích 23</Button>
              <Button startIcon={<BookmarkBorderIcon />} sx={{ color: '#aaa', textTransform: 'none' }}>Theo dõi 70</Button>
              <Button startIcon={<ReplyIcon sx={{ transform: 'scaleX(-1)' }} />} sx={{ color: '#aaa', textTransform: 'none' }}>Chia sẻ 200</Button>
            </Box>
          </Box>

          <Divider sx={{ backgroundColor: '#333', mb: 3 }} />

          {/* Tabs */}
          <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
            <Button 
              onClick={() => setActiveTab('doc-truyen')}
              sx={{ backgroundColor: activeTab === 'doc-truyen' ? '#333' : 'transparent', color: '#fff', textTransform: 'none', px: 3, py: 1, borderRadius: 1, border: activeTab === 'doc-truyen' ? '1px solid #ff9800' : '1px solid #333' }}
            >
              Đọc truyện
            </Button>
            <Button 
              onClick={() => setActiveTab('binh-luan')}
              sx={{ backgroundColor: activeTab === 'binh-luan' ? '#333' : 'transparent', color: '#fff', textTransform: 'none', px: 3, py: 1, borderRadius: 1, border: activeTab === 'binh-luan' ? '1px solid #ff9800' : '1px solid #333' }}
            >
              70 Bình luận
            </Button>
          </Box>


          <Box sx={{ minHeight: 400, mb: 4 }}>

            {activeTab === 'doc-truyen' && (
              <Box>
     
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0, mb: 4, alignItems: 'center' }}>
                  {[1, 2, 3].map((page) => (
                    <img key={page} src={`https://placehold.co/600x900/222/FFF?text=Trang+Truyen+${page}`} alt={`Page ${page}`} style={{ width: '100%', maxWidth: 600, objectFit: 'contain' }} />
                  ))}
                </Box>
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Danh sách chương</Typography>
                  <Button variant="contained" sx={{ backgroundColor: '#ff9800', '&:hover': { backgroundColor: '#e68a00' }, textTransform: 'none' }}>Mới nhất</Button>
                </Box>
                
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  {[...Array(6)].map((_, i) => (
                    <Box key={i} sx={{ display: 'flex', justifyContent: 'space-between', p: 1.5, borderBottom: '1px solid #333', cursor: 'pointer', '&:hover': { backgroundColor: '#222' } }}>
                      <Typography variant="body2" sx={{ color: '#ccc' }}>Chapter - Tướng Quân Tái Xuất {i + 1}</Typography>
                      <Typography variant="body2" sx={{ color: '#ff9800' }}>Tập {6 - i}</Typography>
                    </Box>
                  ))}
                </Box>
              </Box>
            )}

            {activeTab === 'binh-luan' && (
              <Box>
                <Box sx={{ backgroundColor: '#222', p: 2, borderRadius: 2, mb: 3 }}>
                  <TextField 
                    fullWidth multiline minRows={2} placeholder="Nhập bình luận của bạn..." variant="standard"
                    InputProps={{ disableUnderline: true, style: { color: '#fff' } }}
                    sx={{ mb: 2 }}
                  />
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <IconButton sx={{ color: '#888' }}><InsertPhotoOutlinedIcon /></IconButton>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Button sx={{ color: '#aaa', textTransform: 'none' }}>Hủy</Button>
                      <Button variant="contained" sx={{ backgroundColor: '#ff9800', color: '#fff', textTransform: 'none', '&:hover': { backgroundColor: '#e68a00' } }}>Bình luận</Button>
                    </Box>
                  </Box>
                </Box>

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
 
                  {[1, 2, 3].map((cmt) => (
                    <Box key={cmt} sx={{ display: 'flex', gap: 2 }}>
                      <Avatar src={`https://i.pravatar.cc/150?img=${cmt + 10}`} />
                      <Box sx={{ flex: 1 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Typography variant="subtitle2" sx={{ color: '#ff9800', fontWeight: 'bold' }}>User Name {cmt}</Typography>
                          <Typography variant="caption" sx={{ color: '#666' }}>09/04/2022</Typography>
                        </Box>
                        <Typography variant="body2" sx={{ color: '#ccc', mt: 0.5, mb: 1 }}>
                          Truyện quá đỉnh, nét vẽ càng ngày càng xịn. Hóng chap mới từng ngày luôn á! 🔥
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                          <Button startIcon={<ThumbUpOffAltIcon sx={{ fontSize: 16 }} />} sx={{ color: '#888', textTransform: 'none', p: 0, minWidth: 'auto', fontSize: '0.8rem' }}>Thích</Button>
                          <Typography variant="caption" sx={{ color: '#888', cursor: 'pointer' }}>Phản hồi</Typography>
                        </Box>
                      </Box>
                    </Box>
                  ))}
                </Box>
              </Box>
            )}
          </Box>

          <Divider sx={{ backgroundColor: '#333', mb: 4 }} />


          <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>THÔNG TIN TRUYỆN</Typography>
          <Typography variant="body2" sx={{ color: '#aaa', mb: 0.5 }}>Thể loại: Viễn Tưởng, Đời Thường</Typography>
          <Typography variant="body2" sx={{ color: '#aaa', mb: 0.5 }}>Nhóm sub: A3DD</Typography>
          <Typography variant="body2" sx={{ color: '#aaa', mb: 1.5 }}>Tổng số chap: 150 chap</Typography>
          
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
            <Typography variant="body2" sx={{ color: '#aaa', mr: 1, alignSelf: 'center' }}>Từ khóa:</Typography>
            {['Truyện Kingdom', 'Vương Giả Thiên Hạ chap 1', 'Kingdom Viet', 'Chap 1'].map((tag) => (
              <Chip key={tag} label={tag} sx={{ backgroundColor: '#222', color: '#aaa', fontSize: '0.75rem', borderRadius: 1 }} />
            ))}
          </Box>
          
          <Typography variant="body2" sx={{ color: '#ccc', lineHeight: 1.6, mb: 4 }}>
            Trải qua hàng ngàn năm, vương quốc mới bắt đầu trỗi dậy. Một thiếu niên ôm mộng lớn trở thành đại tướng quân vĩ đại nhất.
          </Typography>


          <Box sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer', mb: 3, '&:hover': { color: '#ff9800' } }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', textTransform: 'uppercase' }}>Truyện tranh mới nhất</Typography>
            <ChevronRightIcon />
          </Box>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: 'repeat(3, 1fr)', sm: 'repeat(4, 1fr)', md: 'repeat(6, 1fr)' }, gap: 2, mb: 5 }}>
            {recommendedManga.map((item) => (
              <Box key={item.id} sx={{ display: 'flex', flexDirection: 'column', cursor: 'pointer' }}>
                <Box sx={{ position: 'relative', borderRadius: 1.5, overflow: 'hidden', aspectRatio: '2/3', mb: 1, '&:hover': { opacity: 0.8 } }}>
                  <img src={item.img} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                  <Box sx={{ position: 'absolute', top: 6, left: 6, backgroundColor: 'rgba(0,0,0,0.7)', borderLeft: '2px solid #ff4444', px: 0.8, py: 0.2, borderRadius: '2px' }}>
                    <Typography variant="caption" sx={{ color: '#fff', fontSize: '0.7rem', fontWeight: 'bold' }}>{item.chap}</Typography>
                  </Box>
                </Box>
                <Typography variant="body2" sx={{ fontWeight: 'bold', lineHeight: 1.3, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{item.title}</Typography>
              </Box>
            ))}
          </Box>


          <Box sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer', mb: 3, '&:hover': { color: '#ff9800' } }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', textTransform: 'uppercase' }}>Hôm nay xem gì</Typography>
            <ChevronRightIcon />
          </Box>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: 'repeat(3, 1fr)', sm: 'repeat(4, 1fr)', md: 'repeat(6, 1fr)' }, gap: 2 }}>
            {recommendedAnime.map((item) => (
              <Box key={item.id} sx={{ display: 'flex', flexDirection: 'column', cursor: 'pointer' }}>
                <Box sx={{ position: 'relative', borderRadius: 1.5, overflow: 'hidden', aspectRatio: '2/3', mb: 1, '&:hover': { opacity: 0.8 } }}>
                  <img src={item.img} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                  <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
                    <PlayCircleOutlinedIcon sx={{ fontSize: 40, color: 'rgba(255,255,255,0.9)' }} />
                  </Box>
                </Box>
                <Typography variant="body2" sx={{ fontWeight: 'bold', lineHeight: 1.3, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{item.title}</Typography>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', color: '#aaa', mt: 0.5 }}>
                  <Typography variant="caption">{item.eps}</Typography>
                </Box>
              </Box>
            ))}
          </Box>

        </Box>
      </Box>
    </Box>
  );
}