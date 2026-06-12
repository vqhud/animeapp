import { useEffect, useRef, useState } from 'react';
import { Box, Typography, IconButton, Button, Divider, Chip } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import PlayCircleOutlinedIcon from '@mui/icons-material/PlayCircleOutlined';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import ReplyIcon from '@mui/icons-material/Reply';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ThumbUpAltOutlinedIcon from '@mui/icons-material/ThumbUpAltOutlined';
import { useNavigate } from 'react-router-dom';
import PageShell from '../components/PageShell.js';
import PhoneFrame from '../components/PhoneFrame.js';
import { fetchHomeAnime } from '../services/animeApi.js';
import { readUserList, writeUserList, getSessionUser } from '../services/authSession.js';
import { fetchYouTubeVideoData } from '../services/youtubeApi.js';
import { fetchAnimeComments, postAnimeComment, reactToComment } from '../services/userApi.js';
import { BottomNav } from './AnimeMockPages.js';

const REACTION_EMOJIS = ['❤️', '😂', '😮', '😢', '😡', '👍'];

const getCommentSessionId = () => {
  let id = window.localStorage.getItem('commentSessionId');
  if (!id) {
    id = `anon-${Date.now()}-${Math.random().toString(36).slice(2)}`;
    window.localStorage.setItem('commentSessionId', id);
  }
  return id;
};

const selectedAnimeKey = 'selectedAnimeDetail';
const watchedAnimeKey = 'watchedAnimeItems';
const favoriteAnimeKey = 'favoriteAnimeItems';
const followedAnimeKey = 'followedAnimeItems';

const episodes = [
  { id: 1, title: 'Tập 1', views: '432K lượt xem', img: 'https://placehold.co/120x80/2a2a2a/FFF?text=Tap+1' },
  { id: 2, title: 'Tập 2', views: '321K lượt xem', img: 'https://placehold.co/120x80/2a2a2a/FFF?text=Tap+2' },
  { id: 3, title: 'Tập 3', views: '310K lượt xem', img: 'https://placehold.co/120x80/2a2a2a/FFF?text=Tap+3' },
  { id: 4, title: 'Tập 4', views: '309K lượt xem', img: 'https://placehold.co/120x80/2a2a2a/FFF?text=Tap+4' }
];

const fallbackAnime = {
  title: 'Eden',
  eps: 'Tập 1',
  views: '522.000 lượt xem',
  img: 'https://placehold.co/600x337/333/FFF?text=Anime',
  trailer: null,
  genres: []
};

const toAnimeDetail = (item) => ({
  title: item?.title || item?.[0] || fallbackAnime.title,
  views: item?.views || item?.[1] || fallbackAnime.views,
  eps: item?.eps || item?.[2] || fallbackAnime.eps,
  img: item?.img || item?.[3] || fallbackAnime.img,
  trailer: item?.trailer || item?.[4] || null,
  genres: item?.genres || item?.[5] || []
});

const toRecommendedAnime = (item, index) => ({
  id: `${item[0]}-${index}`,
  title: item[0],
  views: item[1],
  eps: item[2],
  img: item[3],
  trailer: item[4] || null,
  genres: item[5] || []
});

const toTopAnimeItem = (item, index) => ({
  id: `top-${item[0]}-${index}`,
  rank: index + 1,
  title: item[0],
  eps: item[1],
  views: item[2],
  img: item[3],
  trailer: item[4] || null,
  genres: item[5] || []
});

const trailerUrl = (trailer) => {
  if (!trailer?.id || trailer.site !== 'youtube') return '';
  return `https://www.youtube.com/embed/${trailer.id}`;
};

const readSelectedAnime = () => {
  try {
    return toAnimeDetail(JSON.parse(window.localStorage.getItem(selectedAnimeKey)));
  } catch {
    return fallbackAnime;
  }
};

const readStoredList = (key) => {
  return readUserList(key);
};

const writeStoredList = (key, items) => {
  writeUserList(key, items);
};

const toStoredVideoItem = (item) => [
  item.title,
  item.eps || 'Tập mới',
  item.views || 'Đang cập nhật lượt xem',
  item.img,
  item.trailer || null,
  item.genres || [],
  new Date().toISOString()
];

const hasStoredAnime = (key, title) => {
  return readStoredList(key).some((item) => item?.[0] === title);
};

const toggleStoredAnime = (key, anime) => {
  const items = readStoredList(key);
  const exists = items.some((item) => item?.[0] === anime.title);

  if (exists) {
    writeStoredList(
      key,
      items.filter((item) => item?.[0] !== anime.title)
    );
    return false;
  }

  writeStoredList(key, [toStoredVideoItem(anime), ...items]);
  return true;
};

const HOME_PAGE_SIZE = 10;

const getPageNumbers = (current, total) => {
  if (total <= 4) return Array.from({ length: total }, (_, i) => i + 1);
  const start = Math.max(1, Math.min(current - 1, total - 3));
  return [start, start + 1, start + 2, start + 3];
};

const formatCommentDate = (dateStr) => {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return '';
  return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`;
};

const AVATAR_COLORS = ['#ff9800', '#4caf50', '#2196f3', '#e91e63', '#9c27b0', '#00bcd4'];
const getAvatarColor = (name) => AVATAR_COLORS[(name?.charCodeAt(0) || 0) % AVATAR_COLORS.length];

const rememberWatchedAnime = (anime) => {
  if (!anime?.title) return;

  const items = readStoredList(watchedAnimeKey).filter((item) => item?.[0] !== anime.title);
  writeStoredList(watchedAnimeKey, [toStoredVideoItem(anime), ...items].slice(0, 80));
};

export default function AnimeDetailPage() {
  const navigate = useNavigate();
  const scrollRef = useRef(null);
  const [viewMode, setViewMode] = useState('trailer');
  const [anime, setAnime] = useState(readSelectedAnime);
  const [recommendedAnime, setRecommendedAnime] = useState([]);
  const [topAnime, setTopAnime] = useState([]);
  const [youtubeData, setYoutubeData] = useState(null);
  const [youtubeError, setYoutubeError] = useState('');
  const [commentText, setCommentText] = useState('');
  const [isLiked, setIsLiked] = useState(() => hasStoredAnime(favoriteAnimeKey, readSelectedAnime().title));
  const [isFollowed, setIsFollowed] = useState(() => hasStoredAnime(followedAnimeKey, readSelectedAnime().title));
  const [notice, setNotice] = useState('');
  const [comments, setComments] = useState([]);
  const [commentLoading, setCommentLoading] = useState(false);
  const [commentError, setCommentError] = useState('');
  const [replyTo, setReplyTo] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [openReactionId, setOpenReactionId] = useState(null);
  const [activeTab, setActiveTab] = useState('episodes');
  const [expandedReplies, setExpandedReplies] = useState({});
  const [likedComments, setLikedComments] = useState(new Set());
  const [homePage, setHomePage] = useState(1);
  const sessionId = getCommentSessionId();

  useEffect(() => {
    let ignore = false;

    fetchHomeAnime()
      .then((data) => {
        if (ignore) return;

        const storedAnime = readSelectedAnime();
        const detail = storedAnime.title === fallbackAnime.title ? toAnimeDetail(data.latestAnime[0]) : storedAnime;
        setAnime(detail);
        setRecommendedAnime(data.latestAnime.filter((item) => item[0] !== detail.title).slice(0, 40).map(toRecommendedAnime));
        if (data.ranking?.length) setTopAnime(data.ranking.slice(0, 10).map(toTopAnimeItem));
      })
      .catch(() => {
        if (!ignore) { setRecommendedAnime([]); setTopAnime([]); }
      });

    return () => {
      ignore = true;
    };
  }, []);

  useEffect(() => {
    const videoId = anime.trailer?.id;

    if (!videoId) {
      setYoutubeData(null);
      setYoutubeError('');
      return undefined;
    }

    let ignore = false;
    setYoutubeData(null);
    setYoutubeError('');

    fetchYouTubeVideoData(videoId)
      .then((data) => {
        if (!ignore) setYoutubeData(data);
      })
      .catch((error) => {
        if (!ignore) setYoutubeError(error?.message || 'Không thể tải dữ liệu YouTube');
      });

    return () => {
      ignore = true;
    };
  }, [anime.trailer?.id]);

  useEffect(() => {
    setIsLiked(hasStoredAnime(favoriteAnimeKey, anime.title));
    setIsFollowed(hasStoredAnime(followedAnimeKey, anime.title));
    scrollRef.current?.scrollTo({ top: 0, behavior: 'auto' });
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, [anime.title]);

  useEffect(() => {
    if (!anime.title) return undefined;

    let ignore = false;
    setComments([]);
    setCommentLoading(true);

    fetchAnimeComments(anime.title, sessionId)
      .then(({ comments: loaded }) => {
        if (ignore) return;
        setComments(
          (loaded || []).map((c) => ({
            id: String(c.id || c._id || c.createdAt),
            name: c.userName || c.name || 'An danh',
            text: c.content || c.text || '',
            parentId: c.parentId ? String(c.parentId) : null,
            reactions: c.reactions || {},
            myReaction: c.myReaction || null,
            createdAt: c.createdAt || null
          }))
        );
      })
      .catch(() => {
        if (!ignore) setComments([]);
      })
      .finally(() => {
        if (!ignore) setCommentLoading(false);
      });

    return () => {
      ignore = true;
    };
  }, [anime.title]);

  const episodeItems = episodes.map((episode) => ({
    ...episode,
    img: anime.img,
    views: anime.views
  }));
  const tags = [anime.title, `${anime.title} Vietsub`, `${anime.title} HD`, anime.eps];
  const genreText = anime.genres?.length ? anime.genres.join(', ') : 'Đang cập nhật';
  const activeTrailerUrl = trailerUrl(anime.trailer);

  useEffect(() => {
    if (viewMode === 'trailer' && activeTrailerUrl) {
      rememberWatchedAnime(anime);
    }
  }, [activeTrailerUrl, anime, viewMode]);

  const resetDetailView = () => {
    setViewMode('trailer');
    setNotice('');
    setCommentText('');
    scrollRef.current?.scrollTo({ top: 0, behavior: 'auto' });
    window.scrollTo({ top: 0, behavior: 'auto' });
  };
  const showTrailer = () => {
    rememberWatchedAnime(anime);
    setViewMode('trailer');
    scrollRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
  };
  const showEpisodes = () => {
    rememberWatchedAnime(anime);
    setViewMode('episodes');
  };
  const watchEpisode = () => {
    rememberWatchedAnime(anime);
    showNotice('Đã lưu vào lịch sử xem');
  };
  const showNotice = (text) => {
    setNotice(text);
    window.setTimeout(() => setNotice(''), 1400);
  };
  const likeAnime = () => {
    const active = toggleStoredAnime(favoriteAnimeKey, anime);
    setIsLiked(active);
    showNotice(active ? 'Đã thêm vào phim đã thích' : 'Đã hủy thích phim');
  };
  const followAnime = () => {
    const active = toggleStoredAnime(followedAnimeKey, anime);
    setIsFollowed(active);
    showNotice(active ? 'Đã thêm vào phim đã theo dõi' : 'Đã hủy theo dõi phim');
  };
  const shareAnime = async () => {
    const shareData = {
      title: anime.title,
      text: `${anime.title} - ${anime.eps}`,
      url: window.location.href
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
        showNotice('Đã mở chia sẻ phim');
        return;
      }

      await navigator.clipboard.writeText(shareData.url);
      showNotice('Đã copy link phim');
    } catch {
      showNotice('Chưa thể chia sẻ phim');
    }
  };
  const openRecommendedAnime = (item) => {
    window.localStorage.setItem(selectedAnimeKey, JSON.stringify(item));
    setAnime(toAnimeDetail(item));
    resetDetailView();
  };
  const buildComment = (text, parentId = null) => {
    const user = getSessionUser();
    return {
      id: `local-${Date.now()}`,
      name: user?.fullName || 'Ban',
      text,
      parentId,
      reactions: {},
      myReaction: null,
      createdAt: new Date().toISOString()
    };
  };

  const submitComment = async (event) => {
    if (event?.preventDefault) event.preventDefault();
    const text = commentText.trim();
    if (!text) return;

    setCommentError('');
    const user = getSessionUser();
    const optimistic = buildComment(text);
    setComments((prev) => [...prev, optimistic]);
    setCommentText('');

    try {
      const { comment } = await postAnimeComment({
        animeTitle: anime.title,
        userId: user?.id || null,
        userName: user?.fullName || 'Ban',
        avatar: user?.avatar || '',
        content: text,
        sessionId
      });
      setComments((prev) =>
        prev.map((c) =>
          c.id === optimistic.id
            ? { ...c, id: String(comment.id || comment._id || optimistic.id) }
            : c
        )
      );
    } catch (err) {
      if (err?.message?.includes('gioi han') || err?.message?.includes('429') || String(err?.message).toLowerCase().includes('limit')) {
        setCommentError('Ban da dat gioi han 3 binh luan trong 1 gio. Vui long cho them.');
        setComments((prev) => prev.filter((c) => c.id !== optimistic.id));
      }
    }
  };

  const submitReply = async (event, parentId, parentName) => {
    event.preventDefault();
    const text = replyText.trim();
    if (!text) return;

    setCommentError('');
    const user = getSessionUser();
    const optimistic = buildComment(`@${parentName} ${text}`, parentId);
    setComments((prev) => [...prev, optimistic]);
    setReplyTo(null);
    setReplyText('');

    try {
      const { comment } = await postAnimeComment({
        animeTitle: anime.title,
        userId: user?.id || null,
        userName: user?.fullName || 'Ban',
        avatar: user?.avatar || '',
        content: `@${parentName} ${text}`,
        parentId,
        sessionId
      });
      setComments((prev) =>
        prev.map((c) =>
          c.id === optimistic.id
            ? { ...c, id: String(comment.id || comment._id || optimistic.id) }
            : c
        )
      );
    } catch (err) {
      if (err?.message?.includes('gioi han') || err?.message?.includes('429') || String(err?.message).toLowerCase().includes('limit')) {
        setCommentError('Ban da dat gioi han 3 binh luan trong 1 gio. Vui long cho them.');
        setComments((prev) => prev.filter((c) => c.id !== optimistic.id));
      }
    }
  };

  const handleReact = async (commentId, emoji) => {
    const user = getSessionUser();
    const actorId = user?.id || sessionId;

    setComments((prev) =>
      prev.map((c) => {
        if (String(c.id) !== String(commentId)) return c;
        const reactions = { ...c.reactions };
        const prev_emoji = c.myReaction;
        if (prev_emoji) {
          reactions[prev_emoji] = Math.max(0, (reactions[prev_emoji] || 1) - 1);
          if (reactions[prev_emoji] === 0) delete reactions[prev_emoji];
        }
        const isToggleOff = prev_emoji === emoji;
        if (!isToggleOff) reactions[emoji] = (reactions[emoji] || 0) + 1;
        return { ...c, reactions, myReaction: isToggleOff ? null : emoji };
      })
    );

    try {
      const { reactions, myReaction } = await reactToComment(commentId, { emoji, userId: user?.id || null, sessionId: actorId });
      setComments((prev) =>
        prev.map((c) => (String(c.id) === String(commentId) ? { ...c, reactions, myReaction } : c))
      );
    } catch {
      // keep optimistic update
    }
  };

  return (
    <PageShell title="Chi tiết Anime">
      <PhoneFrame>
        <Box sx={{ height: '100%', bgcolor: '#101010', position: 'relative', color: '#fff' }}>
          <Box ref={scrollRef} sx={{ height: '100%', overflowY: 'auto', scrollbarWidth: 'none', pb: { xs: 9, md: 12 } }}>
            <Box sx={{ position: 'relative', pt: { xs: 0, md: 1.6 }, px: { xs: 0, md: 3 } }}>
            <Box sx={{ position: 'absolute', top: 0, left: 0, right: 0, zIndex: 10, display: 'flex', alignItems: 'center', px: { xs: 1.1, md: 3 }, py: { xs: 0.9, md: 1.4 }, background: 'linear-gradient(to bottom, rgba(0,0,0,0.8), transparent)' }}>
              <IconButton size="small" sx={{ color: '#fff', p: 0.55 }} onClick={() => navigate(-1)}>
                <ArrowBackIcon sx={{ fontSize: { xs: 19, md: 24 } }} />
              </IconButton>
              <Typography sx={{ ml: 0.9, fontWeight: 800, fontSize: { xs: 13, md: 18 } }}>Anime</Typography>
            </Box>

            <Box
              sx={{
                width: '100%',
                maxWidth: { xs: '100%', md: '50%' },
                mx: 'auto',
                aspectRatio: '16/9',
                position: 'relative',
                backgroundColor: '#222',
                borderRadius: { xs: 0, md: 1 },
                overflow: 'hidden',
                border: { xs: 0, md: '1px solid #2b2b2b' }
              }}
            >
              {activeTrailerUrl && viewMode === 'trailer' ? (
                <Box
                  component="iframe"
                  src={activeTrailerUrl}
                  title={`${anime.title} trailer`}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  sx={{ width: '100%', height: '100%', border: 0, display: 'block' }}
                />
              ) : (
                <>
                  <img src={anime.img} alt={anime.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
                    <PlayCircleOutlinedIcon sx={{ fontSize: { xs: 38, md: 52 }, color: 'rgba(255,255,255,0.8)' }} />
                  </Box>
                </>
              )}
            </Box>
          </Box>

            <Box sx={{ px: { xs: 1.4, md: 3 }, py: { xs: 1.3, md: 2.4 } }}>
            <Typography sx={{ fontWeight: 800, fontSize: { xs: 15, md: 22 }, mb: 0.35 }}>{anime.title} - {anime.eps}</Typography>
            <Typography sx={{ color: '#aaa', fontSize: { xs: 10.5, md: 14 }, mb: { xs: 1.2, md: 2 } }}>{anime.views}</Typography>
            {notice && (
              <Typography sx={{ color: '#ff9800', fontSize: { xs: 10.5, md: 13 }, fontWeight: 800, mb: 1 }}>
                {notice}
              </Typography>
            )}

            <Box sx={{ display: 'flex', gap: { xs: 0.5, md: 1.2 }, mb: { xs: 1.2, md: 2 }, overflowX: 'auto', scrollbarWidth: 'none' }}>
              <Button onClick={likeAnime} size="small" startIcon={isLiked ? <FavoriteIcon /> : <FavoriteBorderIcon />} sx={{ color: isLiked ? '#ff9800' : '#aaa', textTransform: 'none', minHeight: '28px !important', px: 0.7, fontSize: { xs: 9.5, md: 13 }, whiteSpace: 'nowrap' }}>
                {isLiked ? 'Đã thích' : 'Thích'}
              </Button>
              <Button onClick={followAnime} size="small" startIcon={isFollowed ? <BookmarkIcon /> : <BookmarkBorderIcon />} sx={{ color: isFollowed ? '#ff9800' : '#aaa', textTransform: 'none', minHeight: '28px !important', px: 0.7, fontSize: { xs: 9.5, md: 13 }, whiteSpace: 'nowrap' }}>
                {isFollowed ? 'Đã theo dõi' : 'Theo dõi'}
              </Button>
              <Button onClick={shareAnime} size="small" startIcon={<ReplyIcon sx={{ transform: 'scaleX(-1)' }} />} sx={{ color: '#aaa', textTransform: 'none', minHeight: '28px !important', px: 0.7, fontSize: { xs: 9.5, md: 13 }, whiteSpace: 'nowrap' }}>
                Chia sẻ
              </Button>
            </Box>

            {/* Tab bar */}
            <Box sx={{ display: 'flex', borderBottom: '1px solid #1e1e1e', mt: { xs: 0.6, md: 1 } }}>
              {[
                { key: 'episodes', label: 'Danh sách tập' },
                { key: 'comments', label: `${comments.filter((c) => !c.parentId).length} Bình luận` }
              ].map(({ key, label }) => (
                <Box
                  key={key}
                  onClick={() => setActiveTab(key)}
                  sx={{
                    px: { xs: 1.4, md: 2 }, py: { xs: 1.1, md: 1.4 },
                    borderBottom: `2px solid ${activeTab === key ? '#ff9800' : 'transparent'}`,
                    mb: '-1px',
                    color: activeTab === key ? '#fff' : '#666',
                    fontSize: { xs: 11.5, md: 15 }, fontWeight: 800, cursor: 'pointer',
                    whiteSpace: 'nowrap', userSelect: 'none'
                  }}
                >
                  {label}
                </Box>
              ))}
            </Box>

            {/* Episodes tab */}
            {activeTab === 'episodes' && (
              <Box sx={{ pt: { xs: 1.4, md: 2 }, mb: { xs: 2, md: 3 } }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: { xs: 1, md: 1.6 }, mb: { xs: 2, md: 3 } }}>
                  {episodeItems.map((ep) => (
                    <Box key={ep.id} onClick={watchEpisode} sx={{ display: 'flex', gap: { xs: 1, md: 1.6 }, cursor: 'pointer', '&:hover': { opacity: 0.8 } }}>
                      <Box sx={{ position: 'relative', width: { xs: 86, md: 130 }, height: { xs: 54, md: 78 }, borderRadius: 0.8, overflow: 'hidden', flexShrink: 0 }}>
                        <img src={ep.img} alt={ep.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
                          <PlayCircleOutlinedIcon sx={{ fontSize: { xs: 20, md: 26 }, color: 'rgba(255,255,255,0.8)' }} />
                        </Box>
                      </Box>
                      <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                        <Typography sx={{ color: '#ff9800', fontWeight: 'bold', fontSize: { xs: 9.5, md: 12 } }}>{anime.title}</Typography>
                        <Typography sx={{ fontWeight: 'bold', fontSize: { xs: 11.5, md: 15 } }}>{ep.title}</Typography>
                        <Typography sx={{ color: '#aaa', fontSize: { xs: 9, md: 12 } }}>{ep.views}</Typography>
                      </Box>
                    </Box>
                  ))}
                </Box>

                <Typography sx={{ fontWeight: 'bold', fontSize: { xs: 12.5, md: 16 }, mb: 0.8 }}>THÔNG TIN PHIM</Typography>
                <Typography sx={{ color: '#aaa', fontSize: { xs: 10, md: 13 }, mb: 0.4 }}>Thể loại: {genreText}</Typography>
                <Typography sx={{ color: '#aaa', fontSize: { xs: 10, md: 13 }, mb: 0.4 }}>Nhóm sub: Phim1080</Typography>
                <Typography sx={{ color: '#aaa', fontSize: { xs: 10, md: 13 }, mb: 1.2 }}>Tổng số tập: {anime.eps}</Typography>

                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 2 }}>
                  <Typography sx={{ color: '#aaa', mr: 0.5, alignSelf: 'center', fontSize: { xs: 10, md: 13 } }}>Từ khóa:</Typography>
                  {tags.map((tag) => (
                    <Chip key={tag} label={tag} size="small" sx={{ backgroundColor: '#222', color: '#aaa', height: { xs: 22, md: 28 }, fontSize: { xs: 9, md: 12 }, borderRadius: 0.8 }} />
                  ))}
                </Box>

                <Typography sx={{ color: '#ccc', lineHeight: 1.45, fontSize: { xs: 10.5, md: 14 } }}>
                  {anime.title} đang nằm trong danh sách anime được cập nhật từ API. Nội dung, lượt xem và hình ảnh được đồng bộ theo phim bạn chọn từ bảng xếp hạng hoặc menu Anime.
                </Typography>
              </Box>
            )}

            {/* Comments tab */}
            {activeTab === 'comments' && (
              <Box sx={{ pt: { xs: 1.4, md: 2 }, mb: { xs: 2.4, md: 3.2 } }}>
                {/* Input area */}
                <Box sx={{ border: '1px solid #2a2a2a', borderRadius: 1, overflow: 'hidden', mb: { xs: 1.4, md: 2 } }}>
                  <Box sx={{ position: 'relative' }}>
                    <Box
                      component="textarea"
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                      placeholder="Nhập bình luận..."
                      rows={3}
                      sx={{ width: '100%', display: 'block', bgcolor: '#161616', border: 0, outline: 0, color: '#ddd', fontSize: { xs: 10.5, md: 14 }, fontFamily: 'Roboto, Arial, sans-serif', resize: 'none', px: 1.2, pt: 1, pb: 2.5, boxSizing: 'border-box' }}
                    />
                    <Typography sx={{ position: 'absolute', bottom: 6, right: 10, fontSize: { xs: 15, md: 18 }, cursor: 'pointer', lineHeight: 1, userSelect: 'none' }}>😊</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8, px: 1, py: 0.8, bgcolor: '#141414', borderTop: '1px solid #1e1e1e' }}>
                    <Box sx={{ width: { xs: 22, md: 28 }, height: { xs: 22, md: 28 }, borderRadius: '50%', flexShrink: 0, bgcolor: getAvatarColor(getSessionUser()?.fullName || 'B'), color: '#fff', display: 'grid', placeItems: 'center', fontSize: { xs: 9, md: 11 }, fontWeight: 900 }}>
                      {(getSessionUser()?.fullName || 'B').charAt(0).toUpperCase()}
                    </Box>
                    <Typography sx={{ flex: 1, color: '#777', fontSize: { xs: 10, md: 13 } }}>
                      {getSessionUser()?.fullName || 'Bạn'}
                    </Typography>
                    <Button onClick={() => setCommentText('')} sx={{ color: '#666', textTransform: 'none', minHeight: '26px !important', px: 0.9, py: 0.3, fontSize: { xs: 10, md: 13 } }}>
                      Hủy
                    </Button>
                    <Button
                      onClick={(e) => { e.preventDefault(); submitComment(e); }}
                      variant="contained"
                      disabled={!commentText.trim()}
                      sx={{ bgcolor: '#ff9800', color: '#fff', boxShadow: 'none', textTransform: 'none', minHeight: '26px !important', px: 1.2, py: 0.3, fontSize: { xs: 10, md: 13 }, '&:hover': { bgcolor: '#e68a00', boxShadow: 'none' }, '&.Mui-disabled': { bgcolor: '#2a2a2a', color: '#555' } }}
                    >
                      Bình luận
                    </Button>
                  </Box>
                </Box>

                <Typography sx={{ color: '#444', fontSize: { xs: 9, md: 11 }, mb: { xs: 1, md: 1.4 } }}>
                  Giới hạn 3 bình luận / giờ
                </Typography>

                {commentError && (
                  <Typography sx={{ color: '#ff5252', fontSize: { xs: 10, md: 13 }, fontWeight: 700, mb: 1, px: 1, py: 0.5, bgcolor: 'rgba(255,82,82,0.1)', borderRadius: 0.5 }}>
                    {commentError}
                  </Typography>
                )}

                {commentLoading && (
                  <Typography sx={{ color: '#666', fontSize: { xs: 10, md: 13 }, mb: 1 }}>Đang tải bình luận...</Typography>
                )}

                {openReactionId && (
                  <Box onClick={() => setOpenReactionId(null)} sx={{ position: 'fixed', inset: 0, zIndex: 50 }} />
                )}

                {/* Comments list */}
                <Box>
                  {comments.filter((c) => !c.parentId).map((comment) => {
                    const replies = comments.filter((c) => String(c.parentId) === String(comment.id));
                    const isReplying = replyTo === comment.id;
                    const isExpanded = !!expandedReplies[comment.id];
                    const isLikedComment = likedComments.has(comment.id);
                    return (
                      <Box key={comment.id} sx={{ pt: { xs: 1.2, md: 1.6 }, pb: { xs: 1, md: 1.4 }, borderBottom: '1px solid #1a1a1a' }}>
                        <Box sx={{ display: 'flex', gap: { xs: 0.9, md: 1.2 }, alignItems: 'flex-start' }}>
                          <Box sx={{ width: { xs: 30, md: 40 }, height: { xs: 30, md: 40 }, borderRadius: 1, flexShrink: 0, bgcolor: getAvatarColor(comment.name), color: '#fff', display: 'grid', placeItems: 'center', fontSize: { xs: 11, md: 15 }, fontWeight: 900 }}>
                            {(comment.name || '?').charAt(0).toUpperCase()}
                          </Box>
                          <Box sx={{ flex: 1, minWidth: 0 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.3 }}>
                              <Typography sx={{ color: getAvatarColor(comment.name), fontWeight: 800, fontSize: { xs: 10.5, md: 14 } }}>
                                {comment.name}
                              </Typography>
                              <Typography sx={{ color: '#444', fontSize: { xs: 9, md: 11.5 } }}>
                                {formatCommentDate(comment.createdAt)}
                              </Typography>
                            </Box>
                            <Typography sx={{ color: '#ccc', fontSize: { xs: 10.5, md: 13.5 }, lineHeight: 1.5 }}>
                              {comment.text}
                            </Typography>

                            <Box sx={{ display: 'flex', gap: { xs: 2, md: 2.5 }, mt: { xs: 0.7, md: 1 }, alignItems: 'center' }}>
                              <Box
                                onClick={() => setLikedComments((prev) => { const n = new Set(prev); if (n.has(comment.id)) n.delete(comment.id); else n.add(comment.id); return n; })}
                                sx={{ display: 'flex', alignItems: 'center', gap: 0.5, cursor: 'pointer' }}
                              >
                                {isLikedComment
                                  ? <FavoriteIcon sx={{ fontSize: { xs: 12, md: 15 }, color: '#f44336' }} />
                                  : <FavoriteBorderIcon sx={{ fontSize: { xs: 12, md: 15 }, color: '#666' }} />}
                                <Typography sx={{ fontSize: { xs: 9.5, md: 12.5 }, fontWeight: 600, color: isLikedComment ? '#f44336' : '#666' }}>
                                  Thích
                                </Typography>
                              </Box>
                              <Box
                                onClick={() => { setReplyTo(isReplying ? null : comment.id); setReplyText(''); }}
                                sx={{ display: 'flex', alignItems: 'center', gap: 0.5, cursor: 'pointer' }}
                              >
                                <ReplyIcon sx={{ fontSize: { xs: 12, md: 15 }, transform: 'scaleX(-1)', color: isReplying ? '#ff9800' : '#666' }} />
                                <Typography sx={{ fontSize: { xs: 9.5, md: 12.5 }, fontWeight: 600, color: isReplying ? '#ff9800' : '#666' }}>
                                  Trả lời
                                </Typography>
                              </Box>
                            </Box>

                            {isReplying && (
                              <Box component="form" onSubmit={(e) => submitReply(e, comment.id, comment.name)} sx={{ display: 'flex', gap: 0.6, mt: 1 }}>
                                <Box
                                  component="input"
                                  value={replyText}
                                  onChange={(e) => setReplyText(e.target.value)}
                                  placeholder={`Trả lời ${comment.name}...`}
                                  autoFocus
                                  sx={{ flex: 1, minWidth: 0, height: { xs: 30, md: 38 }, px: 1, border: '1px solid #333', borderRadius: 0.7, bgcolor: '#161616', color: '#fff', outline: 0, fontSize: { xs: 10, md: 13 }, fontFamily: 'Roboto, Arial, sans-serif' }}
                                />
                                <Button type="submit" variant="contained" sx={{ bgcolor: '#ff9800', boxShadow: 'none', textTransform: 'none', minHeight: '30px !important', px: 1.1, fontSize: { xs: 9.5, md: 12 }, '&:hover': { bgcolor: '#e68a00', boxShadow: 'none' } }}>
                                  Gửi
                                </Button>
                              </Box>
                            )}

                            {replies.length > 0 && (
                              <Box
                                onClick={() => setExpandedReplies((prev) => ({ ...prev, [comment.id]: !prev[comment.id] }))}
                                sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: { xs: 0.9, md: 1.1 }, cursor: 'pointer' }}
                              >
                                <Typography sx={{ fontSize: { xs: 13, md: 16 }, lineHeight: 1, color: '#ff9800' }}>
                                  {isExpanded ? '↑' : '↓'}
                                </Typography>
                                <Typography sx={{ color: '#ff9800', fontSize: { xs: 9.5, md: 12.5 }, fontWeight: 700, userSelect: 'none' }}>
                                  {isExpanded ? `Ẩn ${replies.length} câu trả lời` : `Xem ${replies.length} câu trả lời`}
                                </Typography>
                              </Box>
                            )}

                            {isExpanded && replies.length > 0 && (
                              <Box sx={{ mt: { xs: 1, md: 1.2 }, pl: { xs: 1, md: 1.4 }, borderLeft: '2px solid #252525' }}>
                                {replies.map((reply) => {
                                  const isReplyLiked = likedComments.has(reply.id);
                                  return (
                                    <Box key={reply.id} sx={{ display: 'flex', gap: { xs: 0.7, md: 1 }, alignItems: 'flex-start', mb: { xs: 1, md: 1.2 } }}>
                                      <Box sx={{ width: { xs: 24, md: 32 }, height: { xs: 24, md: 32 }, borderRadius: 1, flexShrink: 0, bgcolor: getAvatarColor(reply.name), color: '#fff', display: 'grid', placeItems: 'center', fontSize: { xs: 9, md: 12 }, fontWeight: 900 }}>
                                        {(reply.name || '?').charAt(0).toUpperCase()}
                                      </Box>
                                      <Box sx={{ flex: 1, minWidth: 0 }}>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.25 }}>
                                          <Typography sx={{ color: getAvatarColor(reply.name), fontWeight: 800, fontSize: { xs: 10, md: 13 } }}>{reply.name}</Typography>
                                          <Typography sx={{ color: '#444', fontSize: { xs: 8.5, md: 11 } }}>{formatCommentDate(reply.createdAt)}</Typography>
                                        </Box>
                                        <Typography sx={{ color: '#ccc', fontSize: { xs: 10, md: 13 }, lineHeight: 1.45 }}>{reply.text}</Typography>
                                        <Box
                                          onClick={() => setLikedComments((prev) => { const n = new Set(prev); if (n.has(reply.id)) n.delete(reply.id); else n.add(reply.id); return n; })}
                                          sx={{ display: 'flex', alignItems: 'center', gap: 0.4, mt: 0.6, cursor: 'pointer' }}
                                        >
                                          {isReplyLiked
                                            ? <FavoriteIcon sx={{ fontSize: { xs: 11, md: 14 }, color: '#f44336' }} />
                                            : <FavoriteBorderIcon sx={{ fontSize: { xs: 11, md: 14 }, color: '#555' }} />}
                                          <Typography sx={{ fontSize: { xs: 9, md: 12 }, fontWeight: 600, color: isReplyLiked ? '#f44336' : '#555' }}>Thích</Typography>
                                        </Box>
                                      </Box>
                                    </Box>
                                  );
                                })}
                              </Box>
                            )}
                          </Box>
                        </Box>
                      </Box>
                    );
                  })}
                </Box>
              </Box>
            )}

            <Box sx={{ display: 'flex', alignItems: 'center', mb: { xs: 1, md: 1.6 } }}>
              <Typography sx={{ fontWeight: 900, textTransform: 'uppercase', fontSize: { xs: 12.5, md: 16 }, mr: 0.6 }}>TOP 10</Typography>
              <Box sx={{ display: 'flex', gap: '2px' }}>
                {[1, 2, 3].map((n) => (
                  <Box key={n} sx={{ width: { xs: 5, md: 7 }, height: { xs: 12, md: 17 }, bgcolor: n === 1 ? '#ff9800' : n === 2 ? '#f06000' : '#c04000', borderRadius: '1px' }} />
                ))}
              </Box>
            </Box>

            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: { xs: '8px 6px', md: '14px 10px' }, mb: { xs: 2, md: 3 } }}>
              {(topAnime.length ? topAnime : recommendedAnime.slice(0, 10)).map((item) => (
                <Box key={item.id} onClick={() => openRecommendedAnime(item)} sx={{ display: 'flex', flexDirection: 'column', cursor: 'pointer' }}>
                  <Box sx={{ position: 'relative', borderRadius: 0.7, overflow: 'hidden', aspectRatio: '2/3', mb: 0.5 }}>
                    <img src={item.img} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                    <Box sx={{
                      position: 'absolute', left: 0, bottom: 0,
                      minWidth: { xs: 16, md: 22 }, height: { xs: 16, md: 22 },
                      px: 0.4,
                      bgcolor: item.rank <= 3 ? '#ff9800' : 'rgba(0,0,0,0.72)',
                      color: '#fff',
                      display: 'grid', placeItems: 'center',
                      fontSize: { xs: 9, md: 12 }, fontWeight: 900,
                      borderTopRightRadius: 4
                    }}>
                      {item.rank}
                    </Box>
                    {item.trailer && (
                      <Box sx={{ position: 'absolute', right: 3, bottom: 3, width: { xs: 16, md: 22 }, height: { xs: 16, md: 22 }, borderRadius: '50%', display: 'grid', placeItems: 'center', bgcolor: 'rgba(255,152,0,0.9)' }}>
                        <PlayCircleOutlinedIcon sx={{ fontSize: { xs: 12, md: 16 }, color: '#fff' }} />
                      </Box>
                    )}
                  </Box>
                  <Typography sx={{ fontWeight: 700, lineHeight: 1.2, fontSize: { xs: 9, md: 12 }, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', color: '#ddd' }}>
                    {item.title}
                  </Typography>
                </Box>
              ))}
            </Box>

            {recommendedAnime.length > 0 && (
              <>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: { xs: 1, md: 1.6 }, mt: { xs: 0.5, md: 1 } }}>
                  <Typography sx={{ fontWeight: 900, textTransform: 'uppercase', fontSize: { xs: 12.5, md: 16 } }}>HÔM NAY XEM GÌ</Typography>
                </Box>

                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: 'repeat(4, 1fr)', md: 'repeat(5, 1fr)' }, gap: { xs: '16px 8px', md: '20px 12px' }, mb: { xs: 1.6, md: 2 } }}>
                  {recommendedAnime.slice((homePage - 1) * HOME_PAGE_SIZE, homePage * HOME_PAGE_SIZE).map((item) => (
                    <Box key={item.id} onClick={() => openRecommendedAnime(item)} sx={{ display: 'flex', flexDirection: 'column', cursor: 'pointer' }}>
                      <Box sx={{ position: 'relative', borderRadius: 0.7, overflow: 'hidden', aspectRatio: '2/3', mb: 0.5 }}>
                        <img src={item.img} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                        <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
                          <PlayCircleOutlinedIcon sx={{ fontSize: { xs: 20, md: 28 }, color: 'rgba(255,255,255,0.85)' }} />
                        </Box>
                      </Box>
                      <Typography sx={{ fontWeight: 700, lineHeight: 1.25, fontSize: { xs: 9, md: 12 }, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', color: '#ddd' }}>
                        {item.title}
                      </Typography>
                      <Typography sx={{ color: '#888', fontSize: { xs: 7.5, md: 11 }, mt: 0.2 }} noWrap>{item.eps}</Typography>
                    </Box>
                  ))}
                </Box>

                {Math.ceil(recommendedAnime.length / HOME_PAGE_SIZE) > 1 && (
                  <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: { xs: 0.6, md: 1 }, pb: { xs: 1.5, md: 2 } }}>
                    <Box
                      onClick={() => homePage > 1 && setHomePage(homePage - 1)}
                      sx={{ px: { xs: 1.2, md: 2 }, height: { xs: 28, md: 36 }, display: 'flex', alignItems: 'center', borderRadius: 1, border: '1px solid #333', bgcolor: '#1a1a1a', color: homePage === 1 ? '#444' : '#ccc', fontSize: { xs: 10.5, md: 13 }, fontWeight: 700, cursor: homePage === 1 ? 'default' : 'pointer' }}
                    >
                      Trước
                    </Box>
                    {getPageNumbers(homePage, Math.ceil(recommendedAnime.length / HOME_PAGE_SIZE)).map((n) => (
                      <Box
                        key={n}
                        onClick={() => setHomePage(n)}
                        sx={{ width: { xs: 28, md: 36 }, height: { xs: 28, md: 36 }, display: 'grid', placeItems: 'center', borderRadius: 1, border: `1px solid ${n === homePage ? '#ff9800' : '#333'}`, bgcolor: n === homePage ? '#ff9800' : '#1a1a1a', color: n === homePage ? '#fff' : '#ccc', fontSize: { xs: 11, md: 14 }, fontWeight: 800, cursor: 'pointer' }}
                      >
                        {n}
                      </Box>
                    ))}
                    <Box
                      onClick={() => homePage < Math.ceil(recommendedAnime.length / HOME_PAGE_SIZE) && setHomePage(homePage + 1)}
                      sx={{ px: { xs: 1.2, md: 2 }, height: { xs: 28, md: 36 }, display: 'flex', alignItems: 'center', borderRadius: 1, border: '1px solid #333', bgcolor: '#1a1a1a', color: homePage === Math.ceil(recommendedAnime.length / HOME_PAGE_SIZE) ? '#444' : '#ccc', fontSize: { xs: 10.5, md: 13 }, fontWeight: 700, cursor: homePage === Math.ceil(recommendedAnime.length / HOME_PAGE_SIZE) ? 'default' : 'pointer' }}
                    >
                      Sau
                    </Box>
                  </Box>
                )}
              </>
            )}
            </Box>
          </Box>
          <BottomNav active="home" />
        </Box>
      </PhoneFrame>
    </PageShell>
  );
}
