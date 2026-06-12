import { useState } from 'react';
import CalendarTodayOutlinedIcon from '@mui/icons-material/CalendarTodayOutlined';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import PersonOutlineRoundedIcon from '@mui/icons-material/PersonOutlineRounded';
import PhoneOutlinedIcon from '@mui/icons-material/PhoneOutlined';
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';
import { Box, Button, InputAdornment, MenuItem, Stack, TextField, Typography } from '@mui/material';
import { setSessionUser } from '../services/authSession.js';
import { registerUser } from '../services/userApi.js';
import { AuthInput, AuthTabs, SocialButton, authColors, authInputSx, normalizeEmail } from './LoginScreen.js';
import PhoneFrame from './PhoneFrame.js';

const emptyValues = {
  fullName: '',
  email: '',
  phone: '',
  birthday: '',
  gender: '',
  password: '',
  confirmPassword: ''
};

const filledValues = {
  fullName: 'Tinh Vo',
  email: 'tinhvqpd09996@gmail.com',
  phone: '0900000000',
  birthday: '09/09/1996',
  gender: 'Nam',
  password: '1234',
  confirmPassword: '1234'
};

const errorMessages = {
  fullName: 'Vui lòng nhập họ và tên.',
  email: 'Vui lòng nhập email.',
  phone: 'Vui lòng nhập số điện thoại.',
  birthday: 'Vui lòng nhập ngày sinh.',
  gender: 'Vui lòng chọn giới tính.',
  password: 'Vui lòng nhập mật khẩu.',
  confirmPassword: 'Vui lòng nhập lại mật khẩu.'
};

const compactFieldSx = {
  '& .MuiInputBase-root': {
    height: 29
  },
  '& .MuiFormHelperText-root': {
    lineHeight: 1.15
  }
};

const compactSelectSx = (state) => ({
  ...authInputSx(state),
  ...compactFieldSx
});

function genderState(value, error, focused) {
  if (error) return 'error';
  if (focused || value) return 'focused';
  return 'default';
}

function RegisterScreen({ variant = 'empty' }) {
  const isFilled = variant === 'filled';
  const isErrorVariant = variant === 'error';
  const [values, setValues] = useState(isFilled ? filledValues : emptyValues);
  const [focused, setFocused] = useState(isFilled ? 'fullName' : '');
  const [errors, setErrors] = useState(isErrorVariant ? errorMessages : {});
  const [message, setMessage] = useState('');

  const handleChange = (event) => {
    const { name, value } = event.target;
    setValues((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: '' }));
    setMessage('');
  };

  const validate = () => {
    const email = normalizeEmail(values.email);
    const nextErrors = {
      fullName: values.fullName.trim() ? '' : errorMessages.fullName,
      email: email ? '' : errorMessages.email,
      phone: values.phone.trim() ? '' : errorMessages.phone,
      birthday: values.birthday.trim() ? '' : errorMessages.birthday,
      gender: values.gender ? '' : errorMessages.gender,
      password: values.password ? '' : errorMessages.password,
      confirmPassword: values.confirmPassword ? '' : errorMessages.confirmPassword
    };

    if (!nextErrors.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      nextErrors.email = 'Email không hợp lệ.';
    }

    if (!nextErrors.phone && !/^[0-9]{9,11}$/.test(values.phone.trim())) {
      nextErrors.phone = 'Số điện thoại không hợp lệ.';
    }

    if (!nextErrors.password && values.password.length < 4) {
      nextErrors.password = 'Mật khẩu phải từ 4 ký tự.';
    }

    if (!nextErrors.confirmPassword && values.confirmPassword !== values.password) {
      nextErrors.confirmPassword = 'Mật khẩu nhập lại không khớp.';
    }

    return nextErrors;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const nextErrors = validate();
    setErrors(nextErrors);

    if (Object.values(nextErrors).some(Boolean)) {
      return;
    }

    try {
      const { user } = await registerUser({
        fullName: values.fullName.trim(),
        email: normalizeEmail(values.email),
        phone: values.phone.trim(),
        birthday: values.birthday.trim(),
        gender: values.gender,
        password: values.password
      });

      setSessionUser(user, { resetUserData: true });
      setMessage('Đăng ký thành công.');
      window.setTimeout(() => {
        window.location.href = '/home';
      }, 500);
    } catch (error) {
      setErrors((current) => ({
        ...current,
        email: error?.message || 'Không thể đăng ký.'
      }));
    }
  };

  const fieldState = (name) => {
    if (errors[name]) return 'error';
    if (focused === name || isFilled) return 'focused';
    return 'default';
  };

  const hasValueOrError = Object.values(values).some(Boolean) || Object.values(errors).some(Boolean);

  return (
    <PhoneFrame>
      <Box component="form" onSubmit={handleSubmit} sx={{ height: '100%', width: { xs: 'auto', md: 540 }, mx: 'auto', px: { xs: 1.9, md: 0 }, pt: { xs: 5.8, md: 7 }, pb: 1.4, display: 'flex', flexDirection: 'column' }}>
        <Typography align="center" sx={{ fontSize: { xs: 21, md: 30 }, fontWeight: 500, color: '#d8d8d8', mb: { xs: 3.8, md: 5 } }}>
          HHTQ Anime
        </Typography>

        <AuthTabs active="register" />

        <Stack spacing={0.72} sx={{ minHeight: 0, flex: 1, overflowY: 'auto', pr: 0.4, scrollbarWidth: 'none', '&::-webkit-scrollbar': { display: 'none' }, '& .MuiTypography-root': { fontSize: { xs: 11, md: 14 } }, '& .MuiInputBase-root': { height: { xs: 29, md: 42 } }, '& .MuiFormHelperText-root': { fontSize: 10, lineHeight: 1.15 } }}>
          <AuthInput label="Họ và tên" placeholder="Nhập họ và tên" name="fullName" value={values.fullName} state={fieldState('fullName')} helper={errors.fullName} icon={<PersonOutlineRoundedIcon />} onChange={handleChange} onFocus={() => setFocused('fullName')} />
          <AuthInput label="Email" placeholder="Nhập mail" name="email" value={values.email} state={fieldState('email')} helper={errors.email} icon={<EmailOutlinedIcon />} onChange={handleChange} onFocus={() => setFocused('email')} />
          <AuthInput label="Số điện thoại" placeholder="Nhập số điện thoại" name="phone" value={values.phone} state={fieldState('phone')} helper={errors.phone} icon={<PhoneOutlinedIcon />} onChange={handleChange} onFocus={() => setFocused('phone')} />
          <AuthInput label="Ngày sinh" placeholder="00/00/0000" name="birthday" value={values.birthday} state={fieldState('birthday')} helper={errors.birthday} icon={<CalendarTodayOutlinedIcon />} onChange={handleChange} onFocus={() => setFocused('birthday')} />

          <Box>
            <Typography sx={{ color: '#8b8b8b', fontSize: 11, fontWeight: 700, mb: 0.55 }}>Giới tính</Typography>
            <TextField
              select
              fullWidth
              name="gender"
              value={values.gender}
              error={Boolean(errors.gender)}
              helperText={errors.gender}
              onChange={handleChange}
              onFocus={() => setFocused('gender')}
              SelectProps={{ IconComponent: KeyboardArrowDownRoundedIcon, displayEmpty: true }}
              FormHelperTextProps={{ sx: { ml: 0, mt: 0.45, color: authColors.error, fontSize: 10, fontWeight: 700, lineHeight: 1.15 } }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PersonOutlineRoundedIcon />
                  </InputAdornment>
                )
              }}
              sx={compactSelectSx(genderState(values.gender, errors.gender, focused === 'gender'))}
            >
              <MenuItem value="" disabled>Chọn giới tính</MenuItem>
              <MenuItem value="Nam">Nam</MenuItem>
              <MenuItem value="Nữ">Nữ</MenuItem>
              <MenuItem value="Khác">Khác</MenuItem>
            </TextField>
          </Box>

          <AuthInput label="Mật khẩu" placeholder="Nhập mật khẩu" name="password" type="password" value={values.password} state={fieldState('password')} helper={errors.password} icon={<LockOutlinedIcon />} endIcon={<VisibilityOffOutlinedIcon />} onChange={handleChange} onFocus={() => setFocused('password')} />
          <AuthInput label="Xác nhận mật khẩu" placeholder="Nhập lại mật khẩu" name="confirmPassword" type="password" value={values.confirmPassword} state={fieldState('confirmPassword')} helper={errors.confirmPassword} icon={<LockOutlinedIcon />} endIcon={<VisibilityOffOutlinedIcon />} onChange={handleChange} onFocus={() => setFocused('confirmPassword')} />
        </Stack>

        <Box sx={{ pt: 1.05 }}>
          {message && <Typography sx={{ mb: 0.8, color: '#12b76a', fontSize: 11, fontWeight: 800 }}>{message}</Typography>}

          <Button fullWidth type="submit" variant="contained" sx={{ height: { xs: 34, md: 44 }, bgcolor: hasValueOrError ? authColors.orange : authColors.mutedOrange, color: '#fff', borderRadius: 0.75, fontSize: { xs: 12, md: 15 }, fontWeight: 700, boxShadow: 'none', '&:hover': { bgcolor: authColors.orange, boxShadow: 'none' } }}>
            Đăng ký
          </Button>

          <Typography align="center" sx={{ mt: 1.5, mb: 1.05, color: '#d8d8d8', fontSize: 12, fontWeight: 700 }}>
            Đăng ký với
          </Typography>

          <Stack spacing={0.95}>
            <SocialButton provider="Google" />
            <SocialButton provider="Facebook" />
          </Stack>
        </Box>
      </Box>
    </PhoneFrame>
  );
}

export default RegisterScreen;
