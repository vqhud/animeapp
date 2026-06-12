import { useEffect, useRef, useState } from 'react';
import { Avatar, Box, Button, Divider, IconButton, Typography } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import ShareIcon from '@mui/icons-material/Share';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ReplyIcon from '@mui/icons-material/Reply';
import { useNavigate } from 'react-router-dom';
import PageShell from '../components/PageShell.js';
import PhoneFrame from '../components/PhoneFrame.js';
import { fetchHomeAnime } from '../services/animeApi.js';
import { fetchNewsDetail, fetchAnimeComments, postAnimeComment, reactToComment } from '../services/userApi.js';
import { getSessionUser } from '../services/authSession.js';
import { BottomNav } from './AnimeMockPages.js';

// --- CÁC HÀM HỖ TRỢ CHO BÌNH LUẬN ---
const AVATAR_COLORS = ['#ff9800', '#4caf50', '#2196f3', '#e91e63', '#9c27b0', '#00bcd4'];
const getAvatarColor = (name) => AVATAR_COLORS[(name?.charCodeAt(0) || 0) % AVATAR_COLORS.length];

const formatCommentDate = (dateStr) => {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return '';
  return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`;
};

const getCommentSessionId = () => {
  let id = window.localStorage.getItem('commentSessionId');
  if (!id) {
    id = `anon-${Date.now()}-${Math.random().toString(36).slice(2)}`;
    window.localStorage.setItem('commentSessionId', id);
  }
  return id;
};

export default function NewsDetailPage() {
  const navigate = useNavigate();
  const scrollRef = useRef(null);
  const [news, setNews] = useState(null); 
  const [loading, setLoading] = useState(true);
  const [latestNews, setLatestNews] = useState([]);

  // --- STATE CHO BÌNH LUẬN ---
  const [commentText, setCommentText] = useState('');
  const [comments, setComments] = useState([]);
  const [commentLoading, setCommentLoading] = useState(false);
  const [commentError, setCommentError] = useState('');
  const [replyTo, setReplyTo] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [expandedReplies, setExpandedReplies] = useState({});
  const [likedComments, setLikedComments] = useState(new Set());
  const sessionId = getCommentSessionId();

  useEffect(() => {
    let ignore = false;
    const id = window.localStorage.getItem('selectedNewsId'); 
    
    if (!id) {
      setLoading(false);
      return;
    }

    setLoading(true);

    fetchNewsDetail(id)
      .then((data) => {
        if (ignore) return;
        setNews(data.article);
        setLoading(false);
      })
      .catch(() => {
        if (!ignore) setLoading(false);
      });

    return () => { ignore = true; };
  }, [window.localStorage.getItem('selectedNewsId')]);

  useEffect(() => {
    let ignore = false;

    fetchHomeAnime()
      .then((data) => {
        if (ignore) return;
        setLatestNews((data.news || [])
            .map((item) => ({ title: item[0], time: 'Mới cập nhật', tag: 'Tin tức', img: item[3] }))
            .filter((item) => item.title !== news?.title).slice(0, 6));
      })
      .catch(() => {
        if (!ignore) setLatestNews([]);
      });

    return () => { ignore = true; };
  }, [news?.title]);

  // --- TẢI BÌNH LUẬN KHI MỞ BÀI BÁO ---
  useEffect(() => {
    if (!news?.title) return undefined;

    let ignore = false;
    setComments([]);
    setCommentLoading(true);

    const threadId = `NEWS_${news.title}`;

    fetchAnimeComments(threadId, sessionId)
      .then(({ comments: loaded }) => {
        if (ignore) return;
        setComments(
          (loaded || []).map((c) => ({
            id: String(c.id || c._id || c.createdAt),
            name: c.userName || c.name || 'Ẩn danh',
            text: c.content || c.text || '',
            parentId: c.parentId ? String(c.parentId) : null,
            reactions: c.reactions || {},
            myReaction: c.myReaction || null,
            createdAt: c.createdAt || null
          }))
        );
      })
      .catch(() => {})
      .finally(() => {
        if (!ignore) setCommentLoading(false);
      });

    return () => { ignore = true; };
  }, [news?.title, sessionId]);

  const openRelatedNews = (item) => {
    window.alert("Tính năng đọc tin liên quan đang xây dựng nha!");
  };

  const shareNews = async () => {
    const shareData = { title: news.title, text: news.title, url: window.location.href };
    try {
      if (navigator.share) {
        await navigator.share(shareData);
        return;
      }
      await navigator.clipboard.writeText(shareData.url);
    } catch { }
  };

  // --- CÁC HÀM XỬ LÝ BÌNH LUẬN ---
  const buildComment = (text, parentId = null) => {
    const user = getSessionUser();
    return {
      id: `local-${Date.now()}`,
      name: user?.fullName || 'Bạn',
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
        animeTitle: `NEWS_${news.title}`,
        userId: user?.id || null,
        userName: user?.fullName || 'Bạn',
        avatar: user?.avatar || '',
        content: text,
        sessionId
      });
      setComments((prev) => prev.map((c) => c.id === optimistic.id ? { ...c, id: String(comment.id || comment._id || optimistic.id) } : c));
    } catch (err) {
      setCommentError('Gửi bình luận quá nhanh. Hãy chờ một chút nha.');
      setComments((prev) => prev.filter((c) => c.id !== optimistic.id));
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
        animeTitle: `NEWS_${news.title}`,
        userId: user?.id || null,
        userName: user?.fullName || 'Bạn',
        avatar: user?.avatar || '',
        content: `@${parentName} ${text}`,
        parentId,
        sessionId
      });
      setComments((prev) => prev.map((c) => c.id === optimistic.id ? { ...c, id: String(comment.id || comment._id || optimistic.id) } : c));
    } catch (err) {
      setCommentError('Gửi phản hồi quá nhanh. Hãy chờ một chút nha.');
      setComments((prev) => prev.filter((c) => c.id !== optimistic.id));
    }
  };

  if (loading) return <Typography sx={{ p: 3, color: '#fff', textAlign: 'center', mt: 10 }}>Đang mở phong bì lấy bài báo...</Typography>;
  if (!news) return <Typography sx={{ p: 3, color: '#fff', textAlign: 'center', mt: 10 }}>Bài báo này đã bị ai đó lấy trộm mất rồi!</Typography>;

  return (
    <PageShell title="Chi tiết Tin tức">
      <PhoneFrame>
        <Box sx={{ height: '100%', bgcolor: '#101010', position: 'relative', color: '#fff' }}>
          <Box ref={scrollRef} sx={{ height: '100%', overflowY: 'auto', scrollbarWidth: 'none', pb: { xs: 9, md: 12 } }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: { xs: 1, md: 2.2 }, py: { xs: 0.8, md: 1.2 }, position: 'sticky', top: 0, bgcolor: 'rgba(16,16,16,0.96)', zIndex: 10, borderBottom: '1px solid #202020' }}>
              <IconButton size="small" sx={{ color: '#fff' }} onClick={() => navigate(-1)}>
                <ArrowBackIcon sx={{ fontSize: { xs: 20, md: 24 } }} />
              </IconButton>
              <Box>
                <IconButton size="small" sx={{ color: '#fff', mr: 0.6 }}>
                  <BookmarkBorderIcon sx={{ fontSize: { xs: 19, md: 23 } }} />
                </IconButton>
                <IconButton size="small" sx={{ color: '#fff' }} onClick={shareNews}>
                  <ShareIcon sx={{ fontSize: { xs: 19, md: 23 } }} />
                </IconButton>
              </Box>
            </Box>

            <Box sx={{ px: { xs: 1.2, md: 2.5 }, pt: { xs: 1.2, md: 2 }, pb: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <Box sx={{ backgroundColor: '#ff9800', px: 0.8, py: 0.2, borderRadius: 0.5 }}>
                  <Typography sx={{ color: '#fff', fontWeight: 800, fontSize: { xs: 9, md: 11 } }}>{news.tag}</Typography>
                </Box>
                <Typography sx={{ color: '#888', fontSize: { xs: 9.5, md: 12 } }}>{news.time}</Typography>
              </Box>

              <Typography sx={{ fontWeight: 900, lineHeight: 1.28, mb: 1.2, fontSize: { xs: 15, md: 21 } }}>
                {news.title}
              </Typography>

              <Box sx={{ width: '100%', maxWidth: { xs: '100%', md: '58%' }, mx: 'auto', aspectRatio: '16/9', borderRadius: 1, overflow: 'hidden', mb: { xs: 1.4, md: 2 }, border: '1px solid #2a2a2a' }}>
                <img src={news.img} alt={news.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </Box>

              <Typography sx={{ color: '#d0d0d0', lineHeight: 1.55, mb: 1.1, fontSize: { xs: 11, md: 14 }, whiteSpace: 'pre-wrap' }}>
                {news.content}
              </Typography>

              <Typography sx={{ color: '#b8b8b8', lineHeight: 1.5, mb: 2, fontSize: { xs: 10.5, md: 13 }, mt: 3 }}>
                Lượt quan tâm: {news.views}. 
              </Typography>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2, mb: 2.2, backgroundColor: '#1d1d1d', p: { xs: 1, md: 1.2 }, borderRadius: 1 }}>
                <Avatar src="https://i.pravatar.cc/150?img=11" sx={{ width: { xs: 32, md: 40 }, height: { xs: 32, md: 40 } }} />
                <Box>
                  <Typography sx={{ fontWeight: 800, fontSize: { xs: 11.5, md: 14 } }}>Phóng viên Wibu</Typography>
                  <Typography sx={{ color: '#888', fontSize: { xs: 9.5, md: 12 } }}>Chuyên gia săn tin Anime</Typography>
                </Box>
              </Box>

              <Divider sx={{ borderColor: '#303030', mb: 2.5 }} />

              {/* --- KHU VỰC BÌNH LUẬN --- */}
              <Typography sx={{ fontWeight: 900, textTransform: 'uppercase', mb: 1.5, fontSize: { xs: 12.5, md: 15 } }}>
                Bình Luận ({comments.filter((c) => !c.parentId).length})
              </Typography>

              <Box sx={{ mb: 3 }}>
                <Box sx={{ border: '1px solid #2a2a2a', borderRadius: 1, overflow: 'hidden', mb: { xs: 1.4, md: 2 } }}>
                  <Box sx={{ position: 'relative' }}>
                    <Box
                      component="textarea"
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                      placeholder="Bày tỏ ý kiến của bạn về bài viết..."
                      rows={3}
                      sx={{ width: '100%', display: 'block', bgcolor: '#161616', border: 0, outline: 0, color: '#ddd', fontSize: { xs: 10.5, md: 14 }, fontFamily: 'Roboto, Arial, sans-serif', resize: 'none', px: 1.2, pt: 1, pb: 2.5, boxSizing: 'border-box' }}
                    />
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

                {commentError && (
                  <Typography sx={{ color: '#ff5252', fontSize: { xs: 10, md: 13 }, fontWeight: 700, mb: 1, px: 1, py: 0.5, bgcolor: 'rgba(255,82,82,0.1)', borderRadius: 0.5 }}>
                    {commentError}
                  </Typography>
                )}

                {commentLoading && (
                  <Typography sx={{ color: '#666', fontSize: { xs: 10, md: 13 }, mb: 1 }}>Đang tải bình luận...</Typography>
                )}

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

              <Divider sx={{ borderColor: '#303030', mb: 1.8 }} />

              <Typography sx={{ fontWeight: 900, textTransform: 'uppercase', mb: 1.2, fontSize: { xs: 12.5, md: 15 } }}>
                Tin mới nhất
              </Typography>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: { xs: 1, md: 1.25 } }}>
                {latestNews.map((item) => (
                  <Box key={`${item.title}-${item.time}`} sx={{ display: 'flex', gap: { xs: 1, md: 1.4 }, cursor: 'pointer', '&:hover': { opacity: 0.82 } }} onClick={() => openRelatedNews(item)}>
                    <Box sx={{ width: { xs: 82, md: 118 }, flexShrink: 0, borderRadius: 0.8, overflow: 'hidden', aspectRatio: '16/9', bgcolor: '#222' }}>
                      <img src={item.img} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </Box>

                    <Box sx={{ minWidth: 0, flex: 1 }}>
                      <Typography sx={{ color: '#ff9800', fontSize: { xs: 9, md: 11 }, mb: 0.25, fontWeight: 800 }}>{item.time}</Typography>
                      <Typography sx={{ fontWeight: 800, lineHeight: 1.28, mb: 0.45, fontSize: { xs: 10.5, md: 13.5 }, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                        {item.title}
                      </Typography>
                      <Typography sx={{ color: '#9a9a9a', fontSize: { xs: 9, md: 11 } }}>{item.tag}</Typography>
                    </Box>
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