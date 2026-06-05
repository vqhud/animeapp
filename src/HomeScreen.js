// src/HomeScreen.js
import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

export default function HomeScreen() {
  const navigate = useNavigate();

  return (
    <Box sx={{ backgroundColor: '#000', minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <Box sx={{ width: '100%', maxWidth: 480, backgroundColor: '#141414', minHeight: '100vh', color: '#fff', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', p: 3, boxSizing: 'border-box' }}>
        
        <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 4, textAlign: 'center' }}>
          App Đọc Truyện Tranh, Xem Anime
        </Typography>
        
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, width: '100%', maxWidth: 300 }}>
          <Button 
            variant="contained" 
            onClick={() => navigate('/ranking')} 
            sx={{ backgroundColor: '#ff9800', '&:hover': { backgroundColor: '#e68a00' }, fontWeight: 'bold' }}
          >
            Xem Bảng Xếp Hạng
          </Button>
          
          <Button 
            variant="contained" 
            onClick={() => navigate('/anime-menu')} 
            sx={{ backgroundColor: '#ff9800', '&:hover': { backgroundColor: '#e68a00' }, fontWeight: 'bold' }}
          >
            Mở Danh Sách Anime
          </Button>

          <Button 
            variant="contained" 
            onClick={() => navigate('/manga-menu')} 
            sx={{ backgroundColor: '#ff9800', '&:hover': { backgroundColor: '#e68a00' }, fontWeight: 'bold' }}
          >
            Mở Danh Sách Truyện Tranh
          </Button>

            <Button 
            variant="contained" 
            onClick={() => navigate('/news-menu')} 
            sx={{ backgroundColor: '#ff9800', '&:hover': { backgroundColor: '#e68a00' }, fontWeight: 'bold' }}
          >
            Mở Danh Sách Tin Tức
          </Button>



        </Box>

      </Box>
    </Box>
  );
}