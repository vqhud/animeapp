import { useEffect, useRef, useState } from 'react';
import { Box, Typography, IconButton, Button, Divider, Chip } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import ReplyIcon from '@mui/icons-material/Reply';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { useNavigate } from 'react-router-dom';
import PageShell from '../components/PageShell.js';
import PhoneFrame from '../components/PhoneFrame.js';
import { fetchHomeAnime } from '../services/animeApi.js';
import { BottomNav } from './AnimeMockPages.js';

const selectedMangaKey = 'selectedMangaDetail';

const fallbackManga = {
  title: 'Kingdom - Vương Giả Thiên Hạ',
  chap: 'Chap 01',
  views: '153.017 lượt đọc',
  img: 'https://placehold.co/400x600/2a2a2a/FFF?text=Kingdom'
};

const toMangaDetail = (item) => ({
  title: item?.title || item?.[0] || fallbackManga.title,
  chap: item?.chap || item?.[1] || fallbackManga.chap,
  views: item?.views || item?.[2] || fallbackManga.views,
  img: item?.img || item?.[3] || item?.[1] || fallbackManga.img
});

const readSelectedManga = () => {
  try {
    return toMangaDetail(JSON.parse(window.localStorage.getItem(selectedMangaKey)));
  } catch {
    return fallbackManga;
  }
};

const toRecommendedManga = (item, index) => ({
  id: `${item[0]}-${index}`,
  title: item[0],
  chap: item[1],
  views: item[2],
  img: item[3]
});

export default function MangaDetailPage() {
  const navigate = useNavigate();
  const scrollRef = useRef(null);
  const [activeTab, setActiveTab] = useState('doc-truyen');
  const [manga, setManga] = useState(readSelectedManga);
  const [recommendedManga, setRecommendedManga] = useState([]);
  const [apiError, setApiError] = useState('');

  useEffect(() => {
    let ignore = false;

    fetchHomeAnime()
      .then((data) => {
        if (ignore) return;

        const storedManga = readSelectedManga();
        const detail = storedManga.title === fallbackManga.title ? toMangaDetail(data.mangaRanking[0]) : storedManga;

        setManga(detail);
        setRecommendedManga(data.mangaRanking.filter((item) => item[0] !== detail.title).slice(0, 5).map(toRecommendedManga));
        setApiError('');
      })
      .catch((error) => {
        if (!ignore) setApiError(error?.message || 'Không thể tải dữ liệu truyện');
      });

    return () => {
      ignore = true;
    };
  }, []);

  const openRecommendedManga = (item) => {
    window.localStorage.setItem(selectedMangaKey, JSON.stringify(item));
    setManga(toMangaDetail(item));
    setActiveTab('doc-truyen');
    scrollRef.current?.scrollTo({ top: 0, behavior: 'auto' });
    window.scrollTo({ top: 0, behavior: 'auto' });
  };

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: 0, behavior: 'auto' });
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, [manga.title]);

  return (
    <PageShell title="Đọc Truyện Tranh">
      <PhoneFrame>
        <Box sx={{ height: '100%', bgcolor: '#101010', position: 'relative', color: '#fff' }}>
          <Box ref={scrollRef} sx={{ height: '100%', overflowY: 'auto', scrollbarWidth: 'none', pb: { xs: 9, md: 12 } }}>
          
          <Box sx={{ display: 'flex', alignItems: 'center', px: { xs: 1.2, md: 3 }, py: { xs: 1, md: 1.6 }, backgroundColor: '#101010', position: 'sticky', top: 0, zIndex: 100 }}>
            <IconButton size="small" sx={{ color: '#fff', p: 0.55 }} onClick={() => navigate(-1)}>
              <ArrowBackIcon sx={{ fontSize: { xs: 19, md: 24 } }} />
            </IconButton>
            <Typography sx={{ ml: 0.9, fontWeight: 800, fontSize: { xs: 13, md: 18 } }}>Truyện Tranh</Typography>
          </Box>

          <Box sx={{ px: { xs: 1.4, md: 3 }, py: { xs: 1.3, md: 2.4 } }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: { xs: 2, md: 3 } }}>
              <Box sx={{ width: { xs: 112, md: 170 }, height: { xs: 168, md: 255 }, borderRadius: 1.2, overflow: 'hidden', mb: { xs: 1.2, md: 2 } }}>
                <img src={manga.img} alt={manga.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </Box>
              <Typography sx={{ fontWeight: 'bold', textAlign: 'center', mb: 0.8, fontSize: { xs: 15, md: 22 }, lineHeight: 1.2 }}>{manga.title}</Typography>
              <Typography sx={{ color: '#aaa', mb: 0.35, fontSize: { xs: 10.5, md: 14 } }}>Tác giả: Hara Yasuhisa</Typography>
              <Typography sx={{ color: '#aaa', mb: 0.35, fontSize: { xs: 10.5, md: 14 } }}>Tình trạng: Đang cập nhật</Typography>
              <Typography sx={{ color: '#aaa', mb: { xs: 1.2, md: 2 }, fontSize: { xs: 10.5, md: 14 } }}>{manga.views}</Typography>
              
              <Box sx={{ display: 'flex', gap: { xs: 0.5, md: 1.2 }, maxWidth: '100%', overflowX: 'auto', scrollbarWidth: 'none' }}>
                <Button size="small" startIcon={<FavoriteBorderIcon />} sx={{ color: '#aaa', textTransform: 'none', minHeight: '28px !important', px: 0.7, fontSize: { xs: 9.5, md: 13 }, whiteSpace: 'nowrap' }}>Thích 23</Button>
                <Button size="small" startIcon={<BookmarkBorderIcon />} sx={{ color: '#aaa', textTransform: 'none', minHeight: '28px !important', px: 0.7, fontSize: { xs: 9.5, md: 13 }, whiteSpace: 'nowrap' }}>Theo dõi 70</Button>
                <Button size="small" startIcon={<ReplyIcon sx={{ transform: 'scaleX(-1)' }} />} sx={{ color: '#aaa', textTransform: 'none', minHeight: '28px !important', px: 0.7, fontSize: { xs: 9.5, md: 13 }, whiteSpace: 'nowrap' }}>Chia sẻ 200</Button>
              </Box>
            </Box>

            <Divider sx={{ borderColor: '#333', mb: { xs: 1.4, md: 3 } }} />

            <Box sx={{ display: 'flex', gap: 0.7, mb: { xs: 1.4, md: 3 } }}>
              <Button 
                onClick={() => setActiveTab('doc-truyen')}
                sx={{ backgroundColor: activeTab === 'doc-truyen' ? '#333' : 'transparent', color: '#fff', textTransform: 'none', minHeight: '30px !important', px: 1.2, py: 0.35, borderRadius: 0.7, border: activeTab === 'doc-truyen' ? '1px solid #ff9800' : '1px solid #333', fontSize: { xs: 10.5, md: 13 } }}
              >
                Đọc truyện
              </Button>
              <Button 
                onClick={() => setActiveTab('binh-luan')}
                sx={{ backgroundColor: activeTab === 'binh-luan' ? '#333' : 'transparent', color: '#fff', textTransform: 'none', minHeight: '30px !important', px: 1.2, py: 0.35, borderRadius: 0.7, border: activeTab === 'binh-luan' ? '1px solid #ff9800' : '1px solid #333', fontSize: { xs: 10.5, md: 13 } }}
              >
                70 Bình luận
              </Button>
            </Box>

            <Box sx={{ minHeight: { xs: 240, md: 320 }, mb: { xs: 2.4, md: 4 } }}>
              {activeTab === 'doc-truyen' && (
                <Box>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0, mb: { xs: 2.4, md: 4 }, alignItems: 'center' }}>
                    {[1, 2, 3].map((page) => (
                      <img key={page} src={manga.img} alt={`${manga.title} page ${page}`} style={{ width: '100%', maxWidth: 360, objectFit: 'contain' }} />
                    ))}
                  </Box>
                  
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: { xs: 1.2, md: 2 } }}>
                    <Typography sx={{ fontWeight: 'bold', fontSize: { xs: 12.5, md: 16 } }}>Danh sách chương</Typography>
                    <Button size="small" variant="contained" sx={{ backgroundColor: '#ff9800', '&:hover': { backgroundColor: '#e68a00' }, textTransform: 'none', minHeight: '28px !important', fontSize: { xs: 10, md: 13 } }}>Mới nhất</Button>
                  </Box>
                  
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    {[...Array(6)].map((_, i) => (
                      <Box key={i} sx={{ display: 'flex', justifyContent: 'space-between', gap: 1, px: 0.8, py: { xs: 0.8, md: 1.2 }, borderBottom: '1px solid #333', cursor: 'pointer', '&:hover': { backgroundColor: '#222' } }}>
                        <Typography sx={{ color: '#ccc', fontSize: { xs: 10.5, md: 14 } }}>{manga.title} - chương {i + 1}</Typography>
                        <Typography sx={{ color: '#ff9800', fontSize: { xs: 10.5, md: 14 }, whiteSpace: 'nowrap' }}>Tập {6 - i}</Typography>
                      </Box>
                    ))}
                  </Box>
                </Box>
              )}

              {activeTab === 'binh-luan' && (
                <Box>
                  <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 150, color: '#aaa' }}>
                    <Typography sx={{ fontSize: { xs: 11, md: 14 } }}>Đang tải bình luận...</Typography>
                  </Box>
                </Box>
              )}
            </Box>

            <Divider sx={{ borderColor: '#333', mb: { xs: 2, md: 3 } }} />

            <Typography sx={{ fontWeight: 'bold', mb: 0.8, fontSize: { xs: 12.5, md: 16 } }}>THÔNG TIN TRUYỆN</Typography>
            <Typography sx={{ color: '#aaa', mb: 0.4, fontSize: { xs: 10, md: 13 } }}>Thể loại: Viễn Tưởng, Đời Thường</Typography>
            <Typography sx={{ color: '#aaa', mb: 0.4, fontSize: { xs: 10, md: 13 } }}>Nhóm sub: A3DD</Typography>
            <Typography sx={{ color: '#aaa', mb: 1.2, fontSize: { xs: 10, md: 13 } }}>Chương hiện tại: {manga.chap}</Typography>
            
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 2 }}>
              <Typography sx={{ color: '#aaa', mr: 0.5, alignSelf: 'center', fontSize: { xs: 10, md: 13 } }}>Từ khóa:</Typography>
              {[`Truyện ${manga.title}`, `${manga.title} ${manga.chap}`].map((tag) => (
                <Chip key={tag} label={tag} size="small" sx={{ backgroundColor: '#222', color: '#aaa', height: { xs: 22, md: 28 }, fontSize: { xs: 9, md: 12 }, borderRadius: 0.8 }} />
              ))}
            </Box>
            
            <Typography sx={{ color: '#ccc', lineHeight: 1.45, mb: { xs: 3, md: 4 }, fontSize: { xs: 10.5, md: 14 } }}>
              {manga.title} được lấy từ API truyện và truyền vào trang chi tiết theo lựa chọn của bạn ở ranking hoặc menu truyện.
            </Typography>
            {apiError && (
              <Typography sx={{ color: '#ffb74d', mb: 2, fontSize: { xs: 10.5, md: 14 }, fontWeight: 700 }}>
                Lỗi API: {apiError}
              </Typography>
            )}

            <Box sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer', mb: { xs: 1.1, md: 2 }, '&:hover': { color: '#ff9800' } }}>
              <Typography sx={{ fontWeight: 'bold', textTransform: 'uppercase', fontSize: { xs: 12.5, md: 16 } }}>Truyện tranh mới nhất</Typography>
              <ChevronRightIcon fontSize="small" />
            </Box>
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: 'repeat(3, 1fr)', md: 'repeat(5, 1fr)' }, gap: { xs: '13px 9px', md: '22px 18px' }, mb: { xs: 3, md: 4 } }}>
              {recommendedManga.map((item) => (
                <Box key={item.id} onClick={() => openRecommendedManga(item)} sx={{ display: 'flex', flexDirection: 'column', cursor: 'pointer' }}>
                  <Box sx={{ position: 'relative', borderRadius: 0.9, overflow: 'hidden', aspectRatio: '2/3', mb: 0.65 }}>
                    <img src={item.img} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    <Box sx={{ position: 'absolute', top: 4, left: 4, backgroundColor: 'rgba(0,0,0,0.7)', borderLeft: '2px solid #ff4444', px: 0.45, py: 0.1, borderRadius: '2px' }}>
                      <Typography sx={{ color: '#fff', fontSize: { xs: 8.5, md: 10.5 }, fontWeight: 'bold' }}>{item.chap}</Typography>
                    </Box>
                  </Box>
                  <Typography sx={{ fontWeight: 'bold', lineHeight: 1.25, fontSize: { xs: 10.2, md: 14 }, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{item.title}</Typography>
                </Box>
              ))}
            </Box>

          </Box>
        </Box>
        <BottomNav active="home" />
      </Box>
      </PhoneFrame>
    </PageShell>
  );
}
