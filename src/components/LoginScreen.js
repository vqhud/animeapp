import { useState } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import FacebookRoundedIcon from '@mui/icons-material/FacebookRounded';
import GoogleIcon from '@mui/icons-material/Google';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';
import { Box, Button, IconButton, InputAdornment, Stack, TextField, Typography } from '@mui/material';
import { setSessionUser } from '../services/authSession.js';
import { loginUser } from '../services/userApi.js';
import PhoneFrame from './PhoneFrame.js';

export const authColors = {
  orange: '#ff9800',
  mutedOrange: '#b16c03',
  fieldBorder: '#2d2d2d',
  error: '#f04438'
};

export const authInputSx = (state = 'default') => {
  const isError = state === 'error';
  const isFocused = state === 'focused';

  return {
    '& .MuiInputBase-root': {
      height: { xs: 34, md: 44 },
      bgcolor: 'transparent',
      borderRadius: 0.75,
      color: '#d8d8d8',
      fontSize: { xs: 12, md: 14 }
    },
    '& .MuiOutlinedInput-notchedOutline': {
      borderColor: isError ? authColors.error : isFocused ? authColors.mutedOrange : authColors.fieldBorder
    },
    '& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline': {
      borderColor: isError ? authColors.error : isFocused ? authColors.mutedOrange : '#3b3b3b'
    },
    '& .Mui-focused .MuiOutlinedInput-notchedOutline': {
      borderColor: isError ? authColors.error : authColors.orange,
      borderWidth: 1
    },
    '& .MuiInputBase-input': {
      py: 0,
      fontSize: { xs: 12, md: 14 },
      '&::placeholder': {
        color: '#4a4a4a',
        opacity: 1
      }
    },
    '& .MuiSvgIcon-root': {
      color: isError ? '#b8b8b8' : '#5f5f5f',
      fontSize: { xs: 18, md: 22 }
    }
  };
};

export function FieldLabel({ children }) {
  return (
    <Typography sx={{ color: '#8b8b8b', fontSize: { xs: 12, md: 14 }, fontWeight: 700, mb: 0.75 }}>
      {children}
    </Typography>
  );
}

export function AuthInput({ label, placeholder, value, type = 'text', icon, endIcon, state, helper, name, onChange, onFocus }) {
  return (
    <Box>
      <FieldLabel>{label}</FieldLabel>
      <TextField
        fullWidth
        name={name}
        value={value}
        placeholder={placeholder}
        type={type}
        error={state === 'error'}
        helperText={helper}
        onChange={onChange}
        onFocus={onFocus}
        FormHelperTextProps={{
          sx: { ml: 0, mt: 0.6, color: authColors.error, fontSize: 11, fontWeight: 700 }
        }}
        InputProps={{
          startAdornment: <InputAdornment position="start">{icon}</InputAdornment>,
          endAdornment: endIcon ? <InputAdornment position="end">{endIcon}</InputAdornment> : null
        }}
        sx={authInputSx(state)}
      />
    </Box>
  );
}

export function AuthTabs({ active }) {
  return (
    <Stack direction="row" sx={{ mb: 3.4, borderBottom: '1px solid transparent' }}>
      {[
        ['login', 'Đăng nhập', '/login'],
        ['register', 'Đăng ký', '/register']
      ].map(([key, label, path]) => (
        <Box
          key={key}
          onClick={() => {
            window.location.href = path;
          }}
          sx={{
            width: '50%',
            textAlign: 'center',
            pb: 1.4,
            cursor: 'pointer',
            borderBottom: active === key ? `2px solid ${authColors.mutedOrange}` : '2px solid transparent'
          }}
        >
          <Typography sx={{ fontSize: 12, fontWeight: 700, color: '#d9d9d9' }}>{label}</Typography>
        </Box>
      ))}
    </Stack>
  );
}
export function SocialButton({ provider }) {
  const isGoogle = provider === 'Google';
  const isFacebook = provider === 'Facebook';

  const handleClick = () => {
    if (isFacebook) {
      window.location.href = `${import.meta.env.VITE_API_BASE}/api/auth/facebook`;
      return;
    }

    window.alert(`${provider} chưa hỗ trợ đăng nhập.`);
  };

  return (
    <Button
      fullWidth
      variant="outlined"
      onClick={handleClick}
      startIcon={
        isGoogle ? (
          <GoogleIcon sx={{ color: '#4285f4' }} />
        ) : (
          <FacebookRoundedIcon sx={{ color: '#4267b2' }} />
        )
      }
      sx={{
        height: { xs: 34, md: 44 },
        borderColor: isFacebook ? '#4267b2' : authColors.fieldBorder,
        color: '#d6d6d6',
        borderRadius: 0.75,
        fontSize: { xs: 12, md: 14 },
        fontWeight: 600,
        textTransform: 'none',
        '&:hover': {
          borderColor: isFacebook ? '#4267b2' : '#4a4a4a',
          bgcolor: isFacebook ? 'rgba(66, 103, 178, 0.08)' : 'rgba(255,255,255,0.02)'
        }
      }}
    >
      {provider}
    </Button>
  );
}

export const normalizeEmail = (email) => email.trim().toLowerCase();

export const getStoredUsers = () => [];

export const getAllUsers = () => [];

function LoginScreen({ variant = 'empty' }) {
  const isFilled = variant === 'filled';
  const isErrorVariant = variant === 'error';
  const [values, setValues] = useState({
    email: isFilled || isErrorVariant ? 'tinhvqpd09996@gmail.com' : '',
    password: isFilled || isErrorVariant ? '1234' : ''
  });
  const [errors, setErrors] = useState({
    email: isErrorVariant ? 'Email không tồn tại.' : '',
    password: isErrorVariant ? 'Tài khoản hoặc mật khẩu không tồn tại.' : ''
  });
  const [focused, setFocused] = useState(isFilled ? 'email' : '');
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState('');
  const handleGoogleSuccess = (credentialResponse) => {
    try {
      const userInfo = jwtDecode(
        credentialResponse.credential
      );

      console.log(userInfo);

      const user = {
        id: userInfo.sub,
        email: userInfo.email,
        fullName: userInfo.name,
        avatar: userInfo.picture,
        provider: 'google'
      };

      setSessionUser(user);

      setMessage('Đăng nhập Google thành công');

      setTimeout(() => {
        window.location.href = '/home';
      }, 500);
    } catch (error) {
      console.error(error);
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setValues((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: '' }));
    setMessage('');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const email = normalizeEmail(values.email);
    const nextErrors = {
      email: email ? '' : 'Vui lòng nhập email.',
      password: values.password ? '' : 'Vui lòng nhập mật khẩu.'
    };

    if (!nextErrors.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      nextErrors.email = 'Email không hợp lệ.';
    }

    if (!nextErrors.email && !nextErrors.password) {
      try {
        const { user } = await loginUser({ email, password: values.password });

        setSessionUser(user);
        setErrors({ email: '', password: '' });
        setMessage('Đăng nhập thành công.');
        window.setTimeout(() => {
          window.location.href = '/home';
        }, 500);
        return;
      } catch (error) {
        const messageText = error?.message || 'Không thể đăng nhập.';

        if (messageText.toLowerCase().includes('email')) {
          nextErrors.email = messageText;
        } else {
          nextErrors.password = messageText;
        }
      }
    }

    setErrors(nextErrors);
  };

  const fieldState = (name) => {
    if (errors[name]) return 'error';
    if (focused === name || isFilled) return 'focused';
    return 'default';
  };

  return (
    <PhoneFrame>
      <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%', maxWidth: { xs: '100%', md: 430 }, mx: 'auto', px: { xs: 2.5, md: 0 }, pt: { xs: 7, md: 9 }, overflow: 'hidden' }}>
        <Typography align="center" sx={{ fontSize: { xs: 21, md: 30 }, fontWeight: 500, color: '#d8d8d8', mb: { xs: 4.8, md: 6 } }}>
          HHTQ Anime
        </Typography>

        <AuthTabs active="login" />

        <Stack spacing={1.55}>
          <AuthInput label="Email" placeholder="Nhập mail" name="email" value={values.email} state={fieldState('email')} helper={errors.email} icon={<EmailOutlinedIcon />} onChange={handleChange} onFocus={() => setFocused('email')} />
          <AuthInput
            label="Mật khẩu"
            placeholder="Mật khẩu của bạn"
            name="password"
            type={showPassword ? 'text' : 'password'}
            value={values.password}
            state={fieldState('password')}
            helper={errors.password}
            icon={<LockOutlinedIcon />}
            endIcon={
              <IconButton size="small" onClick={() => setShowPassword((current) => !current)} sx={{ p: 0.2, color: '#777' }}>
                {showPassword ? <VisibilityOutlinedIcon sx={{ fontSize: { xs: 18, md: 22 } }} /> : <VisibilityOffOutlinedIcon sx={{ fontSize: { xs: 18, md: 22 } }} />}
              </IconButton>
            }
            onChange={handleChange}
            onFocus={() => setFocused('password')}
          />
        </Stack>

        {message && <Typography sx={{ mt: 1.1, color: '#12b76a', fontSize: 11.5, fontWeight: 800 }}>{message}</Typography>}

        <Typography align="right" sx={{ mt: errors.password ? 1.25 : 0.7, mb: 1.35, fontSize: 12, color: '#d8d8d8', fontWeight: 700 }}>
          Quên mật khẩu?
        </Typography>

        <Button fullWidth type="submit" variant="contained" sx={{ height: { xs: 34, md: 44 }, bgcolor: values.email || values.password || errors.email ? authColors.orange : authColors.mutedOrange, color: '#fff', borderRadius: 0.75, fontSize: { xs: 12, md: 15 }, fontWeight: 700, boxShadow: 'none', '&:hover': { bgcolor: authColors.orange, boxShadow: 'none' } }}>
          Đăng nhập
        </Button>

        <Typography align="center" sx={{ mt: 2.35, mb: 1.45, color: '#d8d8d8', fontSize: 12, fontWeight: 700 }}>
          Đăng nhập với
        </Typography>
        <Stack spacing={1.3}>

          <Box sx={{ width: '100%', overflow: 'hidden', '& > div': { width: '100% !important' }, '& iframe': { width: '100% !important', maxWidth: '100% !important' } }}>
            <GoogleLogin
              width="100%"
              onSuccess={handleGoogleSuccess}
              onError={() => {
                console.log('Google Login Failed');
              }}
            />
          </Box>

          <SocialButton provider="Facebook" />

        </Stack>
        <Typography align="center" sx={{ mt: 2.2, color: '#d8d8d8', fontSize: 12, fontWeight: 700 }}>
          Bạn chưa có tài khoản?{' '}
          <Box component="span" onClick={() => { window.location.href = '/register'; }} sx={{ color: authColors.orange, cursor: 'pointer' }}>
            Đăng ký
          </Box>
        </Typography>
      </Box>
    </PhoneFrame>
  );
}

export default LoginScreen;
