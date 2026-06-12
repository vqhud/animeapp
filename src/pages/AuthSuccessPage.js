import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { setSessionUser } from '../services/authSession.js';

function decodeJwtPayload(token) {
    try {
        const payloadPart = token.split('.')[1];

        if (!payloadPart) {
            return null;
        }

        const base64 = payloadPart.replace(/-/g, '+').replace(/_/g, '/');
        const paddedBase64 = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), '=');
        const json = decodeURIComponent(
            atob(paddedBase64)
                .split('')
                .map((char) => `%${`00${char.charCodeAt(0).toString(16)}`.slice(-2)}`)
                .join('')
        );

        return JSON.parse(json);
    } catch (error) {
        console.error('Decode JWT payload error:', error);
        return null;
    }
}

function AuthSuccessPage() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    useEffect(() => {
        const token = searchParams.get('token');

        if (!token) {
            navigate('/login-error', { replace: true });
            return;
        }

        localStorage.setItem('accessToken', token);

        const payload = decodeJwtPayload(token);

        if (!payload) {
            navigate('/login-error', { replace: true });
            return;
        }

        const user = {
            id: payload.id || payload.facebookId || payload.sub || payload.email || 'facebook-user',
            email: payload.email || '',
            fullName: payload.fullName || payload.name || 'Facebook User',
            avatar: payload.avatar || payload.picture || '',
            provider: payload.provider || 'facebook',
            token
        };

        setSessionUser(user);
        navigate('/home', { replace: true });
    }, [searchParams, navigate]);

    return <div>Đang đăng nhập...</div>;
}

export default AuthSuccessPage;