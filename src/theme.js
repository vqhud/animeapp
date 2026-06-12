import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#2563eb'
    },
    secondary: {
      main: '#0f766e'
    },
    background: {
      default: '#101010',
      paper: '#181818'
    },
    text: {
      primary: '#f6f6f6',
      secondary: '#c8c8c8'
    }
  },
  shape: {
    borderRadius: 8
  },
  typography: {
    fontFamily: '"Roboto", "Inter", "Segoe UI", Arial, sans-serif',
    fontSize: 14,
    allVariants: {
      letterSpacing: 0,
      textRendering: 'optimizeLegibility'
    },
    body1: {
      lineHeight: 1.55,
      fontWeight: 500
    },
    body2: {
      lineHeight: 1.5,
      fontWeight: 500
    },
    h4: {
      fontWeight: 900,
      lineHeight: 1.15
    },
    h6: {
      fontWeight: 900,
      lineHeight: 1.2
    },
    button: {
      fontWeight: 800,
      letterSpacing: 0
    }
  },
  components: {
    MuiButton: {
      defaultProps: {
        disableElevation: true
      },
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 800,
          borderRadius: 8,
          minHeight: 38,
          padding: '8px 14px',
          lineHeight: 1.2,
          boxShadow: 'none',
          transition: 'background-color 160ms ease, border-color 160ms ease, color 160ms ease, transform 160ms ease, box-shadow 160ms ease',
          '&:hover': {
            transform: 'translateY(-1px)',
            boxShadow: '0 8px 18px rgba(0,0,0,0.24)'
          },
          '&:active': {
            transform: 'translateY(0)'
          },
          '&.Mui-focusVisible': {
            outline: '2px solid rgba(255,152,0,0.72)',
            outlineOffset: 2
          }
        },
        contained: {
          backgroundColor: '#ff9800',
          color: '#111',
          '&:hover': {
            backgroundColor: '#ffad2f'
          }
        },
        outlined: {
          borderColor: 'rgba(255,255,255,0.22)',
          color: '#f2f2f2',
          '&:hover': {
            borderColor: 'rgba(255,152,0,0.78)',
            backgroundColor: 'rgba(255,152,0,0.08)'
          }
        },
        text: {
          color: '#f2f2f2',
          '&:hover': {
            backgroundColor: 'rgba(255,255,255,0.08)'
          }
        },
        sizeSmall: {
          minHeight: 32,
          padding: '6px 10px',
          fontSize: '0.8125rem'
        }
      }
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          transition: 'background-color 160ms ease, color 160ms ease, transform 160ms ease',
          '&:hover': {
            backgroundColor: 'rgba(255,255,255,0.1)',
            transform: 'translateY(-1px)'
          },
          '&.Mui-focusVisible': {
            outline: '2px solid rgba(255,152,0,0.72)',
            outlineOffset: 2
          }
        }
      }
    },
    MuiTypography: {
      styleOverrides: {
        root: {
          overflowWrap: 'break-word'
        }
      }
    },
    MuiInputBase: {
      styleOverrides: {
        root: {
          fontWeight: 600
        },
        input: {
          '&::placeholder': {
            opacity: 1
          }
        }
      }
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none'
        }
      }
    }
  }
});
