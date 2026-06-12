import React from 'react';
import ReactDOM from 'react-dom/client';
import { CssBaseline, ThemeProvider } from '@mui/material';
import App from './App';
import './index.css';

import { GoogleOAuthProvider } from '@react-oauth/google';
import { theme } from './theme.js';

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <GoogleOAuthProvider
                clientId="123956077281-l0hlf5t2llaev204b95gveggm61g3957.apps.googleusercontent.com"
            >
                <App />
            </GoogleOAuthProvider>
        </ThemeProvider>
    </React.StrictMode>
);
