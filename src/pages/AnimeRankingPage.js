import { useEffect, useState } from 'react';
import { Box, Typography, Tabs, Tab, Button, IconButton } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import PlayCircleOutlinedIcon from '@mui/icons-material/PlayCircleOutlined';
import { useNavigate } from 'react-router-dom';
import PageShell from '../components/PageShell.js';
import PhoneFrame from '../components/PhoneFrame.js';
import { fetchHomeAnime } from '../services/animeApi.js';

const selectedAnimeKey = 'selectedAnimeDetail';
const selectedMangaKey = 'selectedMangaDetail';

const toAnimeRankingItem = (item, index) => ({
  rank: index + 1,
  title: item[0],
  eps: item[1],
  views: item[2],
  img: item[3],
  trailer: item[4] || null
});

const toMangaRankingItem = (item, index) => ({
  rank: index + 1,
  title: item[0],
  chap: item[1],
  views: item[2],
  img: item[3]
});

const seedShuffle = (arr, seed) => {
  const result = [...arr];
  let s = (seed ^ 0xdeadbeef) >>> 0;
  for (let i = result.length - 1; i > 0; i--) {
    s = Math.imul(s ^ (s >>> 16), 0x45d9f3b);
    s = (s ^ (s >>> 16)) >>> 0;
    const j = s % (i + 1);
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result.map((item, index) => ({ ...item, rank: index + 1 }));
};

const getTimeSeed = (filter) => {
  const now = new Date();
  if (filter === 'Tuần') {
    const startOfYear = new Date(now.getFullYear(), 0, 1);
    const weekNum = Math.ceil(((now - startOfYear) / 86400000 + startOfYear.getDay() + 1) / 7);
    return now.getFullYear() * 100 + weekNum;
  }
  if (filter === 'Tháng') return now.getFullYear() * 100 + now.getMonth();
  if (filter === 'Năm') return now.getFullYear();
  return 0;
};

export default function AnimeRankingPage() {
  const [tabIndex, setTabIndex] = useState(0);
  const [timeFilter, setTimeFilter] = useState('Ngày');
  const [state, setState] = useState({ anime: [], manga: [], loading: true, error: '' });
  const navigate = useNavigate();

  useEffect(() => {
    let ignore = false;

    fetchHomeAnime()
      .then((data) => {
        if (!ignore) {
          setState({
            anime: data.ranking.map(toAnimeRankingItem),
            manga: data.mangaRanking.map(toMangaRankingItem),
            loading: false,
            error: ''
          });
        }
      })
      .catch((error) => {
        if (!ignore) setState({ anime: [], manga: [], loading: false, error: error?.message || 'Không thể tải dữ liệu BXH' });
      });

    return () => {
      ignore = true;
    };
  }, []);

  const handleTabChange = (event, newValue) => {
    setTabIndex(newValue);
  };

  const rawList = tabIndex === 0 ? state.anime : state.manga;
  const currentList = timeFilter === 'Ngày' ? rawList : seedShuffle(rawList, getTimeSeed(timeFilter));
  const openRankingItem = (item) => {
    if (tabIndex === 0) {
      window.localStorage.setItem(selectedAnimeKey, JSON.stringify(item));
      navigate('/anime-detail');
      return;
    }

    window.localStorage.setItem(selectedMangaKey, JSON.stringify(item));
    navigate('/manga-detail');
  };

  return (
    <PageShell title="Bảng Xếp Hạng">
      <PhoneFrame>
        <Box sx={{ height: '100%', overflowY: 'auto', scrollbarWidth: 'none', backgroundColor: '#101010', color: '#fff', pb: { xs: 3, md: 5 } }}>
          <Box sx={{ display: 'flex', alignItems: 'center', px: { xs: 1.2, md: 3 }, py: { xs: 1, md: 1.6 }, position: 'sticky', top: 0, bgcolor: '#101010', zIndex: 10 }}>
            <IconButton size="small" sx={{ color: '#fff', p: 0.55 }} onClick={() => navigate('/home')}>
              <ArrowBackIcon sx={{ fontSize: { xs: 19, md: 24 } }} />
            </IconButton>
            <Typography sx={{ ml: 1, fontWeight: 800, fontSize: { xs: 13, md: 18 } }}>
              Bảng Xếp Hạng
            </Typography>
          </Box>

          <Box sx={{ px: { xs: 1.4, md: 3 }, pt: { xs: 0.4, md: 1 }, pb: { xs: 1, md: 1.6 } }}>
            <Typography sx={{ color: '#f2f2f2', fontSize: { xs: 18, md: 28 }, fontWeight: 900, lineHeight: 1 }}>
              BXH
            </Typography>
            <Typography sx={{ color: '#8f8f8f', fontSize: { xs: 10, md: 13 }, mt: 0.5 }}>

            </Typography>
          </Box>

          <Tabs
            value={tabIndex}
            onChange={handleTabChange}
            sx={{
              mx: { xs: 1.4, md: 3 },
              minHeight: { xs: 34, md: 42 },
              borderBottom: 1,
              borderColor: '#2a2a2a',
              '& .MuiTabs-indicator': { backgroundColor: '#ff9800' },
              '& .MuiTab-root': { minWidth: 'auto', minHeight: { xs: 34, md: 42 }, px: { xs: 1.2, md: 2 } },
              '& .MuiTab-root.Mui-selected': { color: '#fff' }
            }}
          >
            <Tab label="Anime" sx={{ color: '#aaa', textTransform: 'none', fontWeight: 800, fontSize: { xs: 11, md: 15 } }} />
            <Tab label="Truyện tranh" sx={{ color: '#aaa', textTransform: 'none', fontWeight: 800, fontSize: { xs: 11, md: 15 } }} />
          </Tabs>

          <Box sx={{ display: 'flex', gap: 0.7, px: { xs: 1.4, md: 3 }, py: { xs: 1.1, md: 1.8 }, overflowX: 'auto', scrollbarWidth: 'none' }}>
            {['Ngày', 'Tuần', 'Tháng', 'Năm'].map((filter) => (
              <Button
                key={filter}
                onClick={() => setTimeFilter(filter)}
                sx={{
                  backgroundColor: timeFilter === filter ? '#ff9800' : '#222',
                  color: timeFilter === filter ? '#fff' : '#aaa',
                  borderRadius: 0.6, textTransform: 'none', minWidth: 'max-content', minHeight: '28px !important', px: 1.25, py: 0.35, fontSize: { xs: 10.5, md: 13 },
                  '&:hover': { backgroundColor: timeFilter === filter ? '#e68a00' : '#333' }
                }}
              >
                {filter}
              </Button>
            ))}
          </Box>

          {state.loading || state.error ? (
            <Typography sx={{ px: { xs: 1.4, md: 3 }, color: state.error ? '#ffb74d' : '#aaa', fontSize: { xs: 11, md: 14 }, fontWeight: 700 }}>
              {state.error || 'Đang tải bảng xếp hạng...'}
            </Typography>
          ) : (
            <Box sx={{ px: { xs: 1.4, md: 3 }, display: 'flex', flexDirection: 'column', gap: { xs: 1, md: 1.6 } }}>
              {currentList.map((item) => (
                <Box
                  key={`${tabIndex}-${item.rank}-${item.title}`}
                  onClick={() => openRankingItem(item)}
                  sx={{ display: 'grid', gridTemplateColumns: { xs: '32px 92px 1fr', md: '48px 154px 1fr' }, gap: { xs: 1, md: 1.6 }, alignItems: 'center', minHeight: { xs: 70, md: 112 }, cursor: 'pointer', borderBottom: '1px solid #242424', pb: { xs: 1, md: 1.6 } }}
                >
                  <Typography sx={{ color: item.rank <= 3 ? '#ff9800' : '#777', fontSize: { xs: 15, md: 22 }, fontWeight: 900, textAlign: 'center' }}>
                    {item.rank}
                  </Typography>

                  <Box sx={{ position: 'relative', height: { xs: 56, md: 92 }, borderRadius: 0.8, overflow: 'hidden', bgcolor: '#181818', border: '1px solid rgba(255,255,255,0.12)' }}>
                    <img src={item.img} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />

                    <Box sx={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, transparent, rgba(0,0,0,0.35))' }} />
                    <Box sx={{ position: 'absolute', right: 5, bottom: 5, width: { xs: 22, md: 30 }, height: { xs: 22, md: 30 }, borderRadius: '50%', display: 'grid', placeItems: 'center', bgcolor: tabIndex === 0 && item.trailer ? 'rgba(255,152,0,0.92)' : 'rgba(0,0,0,0.56)' }}>
                      <PlayCircleOutlinedIcon sx={{ fontSize: { xs: 18, md: 24 }, color: '#fff' }} />
                    </Box>

                    {tabIndex === 1 && (
                      <Typography sx={{ position: 'absolute', left: 5, top: 5, px: 0.55, py: 0.1, bgcolor: 'rgba(0,0,0,0.64)', borderLeft: '2px solid #ff4444', color: '#fff', fontSize: { xs: 8.5, md: 10.5 }, fontWeight: 800 }}>
                        {item.chap}
                      </Typography>
                    )}
                  </Box>

                  <Box sx={{ minWidth: 0 }}>
                    <Typography sx={{ color: '#f4f4f4', fontWeight: 800, mb: 0.35, fontSize: { xs: 11.5, md: 16 }, lineHeight: 1.2 }} noWrap>
                      {item.title}
                    </Typography>
                    <Typography sx={{ color: '#ff9800', fontSize: { xs: 9.5, md: 12.5 }, fontWeight: 700 }}>
                      {tabIndex === 0 ? item.eps : item.chap}
                    </Typography>
                    <Typography sx={{ color: '#aaa', fontSize: { xs: 9.5, md: 12.5 }, mt: 0.2 }}>
                      {item.views}
                    </Typography>
                    {tabIndex === 0 && item.trailer && (
                      <Typography sx={{ color: '#777', fontSize: { xs: 9, md: 12 }, mt: 0.25 }}>
                        Có trailer
                      </Typography>
                    )}
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
