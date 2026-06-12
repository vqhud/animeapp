import { Box } from '@mui/material';

const phoneSx = {
  width: '100%',
  maxWidth: '100vw',
  height: '100dvh',
  bgcolor: '#101010',
  color: '#f7f7f7',
  position: 'relative',
  overflow: 'hidden',
  border: 'none',
  outline: 'none',
  boxShadow: 'none',

  '@media (min-width: 900px)': {
    '& .MuiTypography-root': {
      fontSize: 'max(var(--mui-font-size, 1em), 14px)',
    },
    '& .MuiSvgIcon-root': {
      fontSize: 'max(var(--mui-icon-size, 1em), 22px)',
    },
    '& .MuiButton-root': {
      minHeight: 44,
      fontSize: '15px !important',
    },
    '& input, & textarea': {
      fontSize: '15px !important',
    },
  },
};

function PhoneFrame({ children }) {
  return <Box sx={phoneSx}>{children}</Box>;
}

export default PhoneFrame;
