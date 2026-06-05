import React, { useState } from 'react';
import {
  Box,
  Typography,
  IconButton,
  Divider,
  Avatar,
  TextField,
  Button,
} from '@mui/material';

import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ShareIcon from '@mui/icons-material/Share';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ThumbUpOffAltIcon from '@mui/icons-material/ThumbUpOffAlt';
import ReplyIcon from '@mui/icons-material/Reply';

import { useNavigate } from 'react-router-dom';

const relatedNews = [
  {
    id: 1,
    time: '16:10 Hôm nay',
    title: 'One Piece sẽ chính thức lên sóng tập mới trở lại từ 17 tháng 4!',
    tag: 'Tin Anime',
    img: 'https://placehold.co/300x200/2a2a2a/FFF?text=One+Piece',
  },
  {
    id: 2,
    time: '18:40 Hôm nay',
    title: 'Đón chờ podcast “Anime Roomy” với 4 cô nàng dễ thương!',
    tag: 'Tin Anime',
    img: 'https://placehold.co/300x200/2a2a2a/FFF?text=Anime+Roomy',
  },
  {
    id: 3,
    time: '17:23 Hôm qua',
    title:
      'Doraemon movie 41 chính thức khởi chiếu tại Việt Nam với cái tên hoàn toàn mới!',
    tag: 'Tin Anime',
    img: 'https://placehold.co/300x200/2a2a2a/FFF?text=Doraemon',
  },
];

const commentsData = [
  {
    id: 1,
    name: 'Sakura Chan',
    avatar: 'https://i.pravatar.cc/150?img=32',
    time: '10/04/2022',
    content:
      'Bài hát này đúng tuổi thơ luôn 😭 nghe lại nổi da gà!',
    replies: [
      {
        id: 11,
        name: 'Naruto',
        avatar: 'https://i.pravatar.cc/150?img=12',
        time: '10/04/2022',
        content: 'Công nhận luôn 🔥',
      },
    ],
  },
  {
    id: 2,
    name: 'Jiraiya',
    avatar: 'https://i.pravatar.cc/150?img=15',
    time: '08/04/2022',
    content:
      'Mong remake thêm nhiều bài opening huyền thoại nữa.',
    replies: [],
  },
];

export default function NewsDetailScreen() {
  const navigate = useNavigate();

  const [comment, setComment] = useState('');

  return (
    <Box
      sx={{
        backgroundColor: '#000',
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
      }}
    >
      <Box
        sx={{
          width: '100%',
          maxWidth: 800,
          backgroundColor: '#141414',
          minHeight: '100vh',
          color: '#fff',
          pb: 6,
        }}
      >


        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            p: 2,
            pt: 4,
            position: 'sticky',
            top: 0,
            backgroundColor: '#141414',
            zIndex: 10,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <IconButton
              sx={{ color: '#fff' }}
              onClick={() => navigate(-1)}
            >
              <ArrowBackIcon />
            </IconButton>
          </Box>

          <Typography sx={{ fontWeight: 'bold' }}>
            Tin Tức
          </Typography>

          <Box>
            <IconButton sx={{ color: '#fff' }}>
              <BookmarkBorderIcon />
            </IconButton>

            <IconButton sx={{ color: '#fff' }}>
              <ShareIcon />
            </IconButton>
          </Box>
        </Box>

        <Box sx={{ p: { xs: 2, md: 4 } }}>
 
 
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 2,
              mb: 2,
            }}
          >
            <Box
              sx={{
                backgroundColor: '#ff9800',
                px: 1.5,
                py: 0.5,
                borderRadius: 1,
              }}
            >
              <Typography
                variant="caption"
                sx={{ color: '#fff', fontWeight: 'bold' }}
              >
                Tin Anime
              </Typography>
            </Box>

            <Typography variant="caption" sx={{ color: '#888' }}>
              8:10 Hôm nay
            </Typography>
          </Box>



          <Typography
            variant="h5"
            sx={{
              fontWeight: 'bold',
              lineHeight: 1.4,
              mb: 3,
            }}
          >
            Sau 30 năm, ca khúc “CHA-LA HEAD CHA-LA” của Dragon Ball Z được tái hiện trở lại!
          </Typography>



          <Box
            sx={{
              width: '100%',
              aspectRatio: '16/9',
              borderRadius: 2,
              overflow: 'hidden',
              mb: 4,
            }}
          >
            <img
              src="https://placehold.co/800x450/2a2a2a/FFF?text=Dragon+Ball+Cover"
              alt="Cover"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              }}
            />
          </Box>

       
       
          <Typography
            variant="body1"
            sx={{
              color: '#ccc',
              lineHeight: 1.8,
              mb: 2,
            }}
          >
            Người hâm mộ bộ anime huyền thoại Dragon Ball Z vừa đón nhận một tin không thể vui hơn.
            Bài hát mở đầu mang tính biểu tượng "CHA-LA HEAD CHA-LA" vừa được thu âm lại với chất lượng hoàn toàn mới mẻ.
          </Typography>

          <Typography
            variant="body1"
            sx={{
              color: '#ccc',
              lineHeight: 1.8,
              mb: 4,
            }}
          >
            Sự kiện này đánh dấu kỷ niệm 30 năm ra mắt thương hiệu.
            Rất nhiều khán giả đã bày tỏ sự xúc động mạnh mẽ khi giai điệu tuổi thơ một lần nữa vang lên trên các nền tảng phát trực tuyến.
          </Typography>

          <Divider sx={{ backgroundColor: '#333', mb: 4 }} />


          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 2,
              mb: 5,
              backgroundColor: '#222',
              p: 2,
              borderRadius: 2,
            }}
          >
            <Avatar
              src="https://i.pravatar.cc/150?img=11"
              sx={{ width: 50, height: 50 }}
            />

            <Box>
              <Typography
                variant="subtitle2"
                sx={{ fontWeight: 'bold' }}
              >
                Phóng viên Wibu
              </Typography>

              <Typography
                variant="caption"
                sx={{ color: '#888' }}
              >
                Chuyên gia săn tin Anime/Manga
              </Typography>
            </Box>
          </Box>

   
   
          <Box sx={{ mb: 6 }}>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 'bold',
                textTransform: 'uppercase',
                mb: 3,
              }}
            >
              Bình luận ({commentsData.length})
            </Typography>


            <Box
              sx={{
                backgroundColor: '#1d1d1d',
                borderRadius: 2,
                p: 2,
                mb: 4,
              }}
            >
              <TextField
                fullWidth
                multiline
                rows={3}
                placeholder="Nhập bình luận..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                variant="outlined"
                sx={{
                  mb: 2,
                  '& .MuiOutlinedInput-root': {
                    color: '#fff',
                    backgroundColor: '#2a2a2a',
                  },
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#444',
                  },
                }}
              />

              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'flex-end',
                  gap: 1,
                }}
              >
                <Button
                  variant="outlined"
                  sx={{
                    borderColor: '#555',
                    color: '#aaa',
                  }}
                >
                  Hủy
                </Button>

                <Button
                  variant="contained"
                  sx={{
                    backgroundColor: '#ff9800',
                    '&:hover': {
                      backgroundColor: '#fb8c00',
                    },
                  }}
                >
                  Bình luận
                </Button>
              </Box>
            </Box>

         <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              {commentsData.map((item) => (
                <Box key={item.id}>
   
   
                  <Box sx={{ display: 'flex', gap: 2 }}>
                    <Avatar src={item.avatar} />

                    <Box sx={{ flex: 1 }}>
                      <Box
                        sx={{
                          backgroundColor: '#1f1f1f',
                          p: 2,
                          borderRadius: 2,
                        }}
                      >
                        <Box
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            mb: 1,
                          }}
                        >
                          <Typography
                            sx={{
                              fontWeight: 'bold',
                              fontSize: '0.95rem',
                            }}
                          >
                            {item.name}
                          </Typography>

                          <Typography
                            variant="caption"
                            sx={{ color: '#777' }}
                          >
                            {item.time}
                          </Typography>
                        </Box>

                        <Typography
                          sx={{
                            color: '#ddd',
                            lineHeight: 1.7,
                            fontSize: '0.92rem',
                          }}
                        >
                          {item.content}
                        </Typography>
                      </Box>

                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 3,
                          mt: 1,
                          ml: 1,
                        }}
                      >
                        <Box
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 0.5,
                            cursor: 'pointer',
                            color: '#888',
                            '&:hover': { color: '#ff9800' },
                          }}
                        >
                          <ThumbUpOffAltIcon sx={{ fontSize: 18 }} />
                          <Typography variant="caption">
                            Thích
                          </Typography>
                        </Box>

                        <Box
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 0.5,
                            cursor: 'pointer',
                            color: '#888',
                            '&:hover': { color: '#ff9800' },
                          }}
                        >
                          <ReplyIcon sx={{ fontSize: 18 }} />
                          <Typography variant="caption">
                            Trả lời
                          </Typography>
                        </Box>
                      </Box>

                
                      {item.replies.length > 0 && (
                        <Box
                          sx={{
                            mt: 3,
                            ml: 4,
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 2,
                          }}
                        >
                          {item.replies.map((reply) => (
                            <Box
                              key={reply.id}
                              sx={{
                                display: 'flex',
                                gap: 2,
                              }}
                            >
                              <Avatar
                                src={reply.avatar}
                                sx={{ width: 34, height: 34 }}
                              />

                              <Box
                                sx={{
                                  backgroundColor: '#1a1a1a',
                                  p: 1.5,
                                  borderRadius: 2,
                                  flex: 1,
                                }}
                              >
                                <Box
                                  sx={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    mb: 0.5,
                                  }}
                                >
                                  <Typography
                                    sx={{
                                      fontWeight: 'bold',
                                      fontSize: '0.85rem',
                                    }}
                                  >
                                    {reply.name}
                                  </Typography>

                                  <Typography
                                    variant="caption"
                                    sx={{ color: '#777' }}
                                  >
                                    {reply.time}
                                  </Typography>
                                </Box>

                                <Typography
                                  sx={{
                                    fontSize: '0.85rem',
                                    color: '#ccc',
                                  }}
                                >
                                  {reply.content}
                                </Typography>
                              </Box>
                            </Box>
                          ))}
                        </Box>
                      )}
                    </Box>
                  </Box>
                </Box>
              ))}
            </Box>
          </Box>

       <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              cursor: 'pointer',
              mb: 3,
              '&:hover': { color: '#ff9800' },
            }}
          >
            <Typography
              variant="h6"
              sx={{
                fontWeight: 'bold',
                textTransform: 'uppercase',
              }}
            >
              Tin mới nhất
            </Typography>

            <ChevronRightIcon />
          </Box>


          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: 3,
            }}
          >
            {relatedNews.map((item) => (
              <Box
                key={item.id}
                sx={{
                  display: 'flex',
                  gap: 2,
                  cursor: 'pointer',
                  '&:hover': { opacity: 0.8 },
                }}
              >
                <Box
                  sx={{
                    width: 140,
                    flexShrink: 0,
                    borderRadius: 1.5,
                    overflow: 'hidden',
                    aspectRatio: '16/9',
                  }}
                >
                  <img
                    src={item.img}
                    alt="thumbnail"
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                    }}
                  />
                </Box>

                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'flex-start',
                    flex: 1,
                  }}
                >
                  <Typography
                    variant="caption"
                    sx={{
                      color: '#888',
                      mb: 0.5,
                    }}
                  >
                    {item.time}
                  </Typography>

                  <Typography
                    variant="body2"
                    sx={{
                      fontWeight: 'bold',
                      lineHeight: 1.4,
                      mb: 1,
                      display: '-webkit-box',
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                    }}
                  >
                    {item.title}
                  </Typography>

                  <Box
                    sx={{
                      alignSelf: 'flex-start',
                      backgroundColor: '#222',
                      px: 1,
                      py: 0.2,
                      borderRadius: 1,
                    }}
                  >
                    <Typography
                      variant="caption"
                      sx={{
                        color: '#aaa',
                        fontSize: '0.7rem',
                      }}
                    >
                      {item.tag}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            ))}
          </Box>
        </Box>
      </Box>
    </Box>
  );
}