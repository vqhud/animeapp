import { Box } from '@mui/material';

function PageShell({ children }) {
  return (
    <Box sx={{ width: '100%', maxWidth: '100vw', height: '100dvh', bgcolor: '#101010', overflow: 'hidden' }}>
      {children}
    </Box>
  );
}

export default PageShell;
