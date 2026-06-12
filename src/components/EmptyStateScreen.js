import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';
import MovieCreationOutlinedIcon from '@mui/icons-material/MovieCreationOutlined';
import TheatersOutlinedIcon from '@mui/icons-material/TheatersOutlined';
import WifiOffRoundedIcon from '@mui/icons-material/WifiOffRounded';
import { Box, Stack, Typography } from '@mui/material';
import PhoneFrame from './PhoneFrame.js';

const orange = '#ff9800';

function Illustration({ type }) {
  const isWifi = type === 'wifi';

  return (
    <Box sx={{ width: 170, height: 132, position: 'relative', mx: 'auto' }}>
      <Box
        sx={{
          position: 'absolute',
          inset: '11px 22px 2px 34px',
          bgcolor: '#202020',
          borderRadius: '54% 46% 48% 52%',
          transform: 'rotate(-4deg)'
        }}
      />
      <MovieCreationOutlinedIcon sx={{ position: 'absolute', top: 27, left: 53, fontSize: 14, color: '#9b6b1f' }} />
      <TheatersOutlinedIcon sx={{ position: 'absolute', top: 76, left: 7, fontSize: 16, color: '#9b6b1f', transform: 'rotate(-15deg)' }} />
      <TheatersOutlinedIcon sx={{ position: 'absolute', top: 83, right: 15, fontSize: 15, color: '#9b6b1f', transform: 'rotate(-20deg)' }} />
      <Box
        sx={{
          position: 'absolute',
          right: 24,
          top: 38,
          width: 58,
          height: 18,
          bgcolor: '#77500d',
          borderRadius: '50%',
          transform: 'rotate(8deg)',
          '&::before': {
            content: '""',
            position: 'absolute',
            left: 0,
            width: 30,
            height: 19,
            bgcolor: '#8d5c0e',
            borderRadius: '50%',
            transform: 'rotate(20deg)'
          }
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          left: 6,
          bottom: 2,
          width: 49,
          height: 15,
          bgcolor: '#676767',
          borderRadius: '50%',
          transform: 'rotate(-8deg)',
          '&::before': {
            content: '""',
            position: 'absolute',
            left: 21,
            top: -9,
            width: 28,
            height: 22,
            bgcolor: '#777',
            borderRadius: '50%'
          },
          '&::after': {
            content: '""',
            position: 'absolute',
            left: -7,
            top: 7,
            width: 20,
            height: 7,
            bgcolor: '#6b6b6b',
            borderRadius: '50%'
          }
        }}
      />

      {isWifi ? (
        <WifiOffRoundedIcon sx={{ position: 'absolute', top: 53, left: 45, color: orange, fontSize: 78 }} />
      ) : (
        <>
          <Box
            sx={{
              position: 'absolute',
              left: 57,
              top: 47,
              width: 29,
              height: 71,
              bgcolor: orange,
              clipPath: 'polygon(0 15%, 100% 0, 100% 100%, 0 84%)'
            }}
          />
          <Box sx={{ position: 'absolute', left: 91, top: 57, width: 18, height: 54, bgcolor: '#2d2d2d' }} />
          <LogoutRoundedIcon sx={{ position: 'absolute', left: 89, top: 70, fontSize: 35, color: '#9b9b9b', transform: 'rotate(180deg)' }} />
          <Box sx={{ position: 'absolute', left: 74, top: 81, width: 4, height: 4, borderRadius: '50%', bgcolor: '#232323' }} />
        </>
      )}
    </Box>
  );
}

function EmptyStateScreen({ type, title, message }) {
  return (
    <PhoneFrame>
      <Stack
        alignItems="center"
        sx={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: type === 'wifi' ? 183 : 194
        }}
      >
        <Illustration type={type} />
        <Typography sx={{ mt: 2.4, fontSize: 16, lineHeight: 1.2, fontWeight: 800 }}>{title}</Typography>
        <Typography sx={{ mt: 1.4, fontSize: 12, color: '#c8c8c8', fontWeight: 600 }}>{message}</Typography>
      </Stack>
    </PhoneFrame>
  );
}

export default EmptyStateScreen;
