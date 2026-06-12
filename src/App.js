import React from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { getSessionUser } from './services/authSession.js';

import {
  ChangePasswordPage,
  EditProfilePage,
  FaqPage,
  FavoritesPage,
  FeedbackFormPage,
  FeedbackPage,
  FollowedPage,
  HistoryPage,
  ProfilePage,
  SearchEmptyPage,
  SearchResultsPage,
  SideMenuPage
} from './pages/AnimeMockPages.js';
import LoginErrorPage from './pages/LoginErrorPage.js';
import LoginFilledPage from './pages/LoginFilledPage.js';
import LoginPage from './pages/LoginPage.js';
import LoginRequiredPage from './pages/LoginRequiredPage.js';
import MenuPage from './pages/MenuPage.js';
import NoWifiPage from './pages/NoWifiPage.js';
import RegisterErrorPage from './pages/RegisterErrorPage.js';
import RegisterFilledPage from './pages/RegisterFilledPage.js';
import RegisterPage from './pages/RegisterPage.js';
import AuthSuccessPage from './pages/AuthSuccessPage.js';

import AnimeDetailPage from './pages/AnimeDetailPage.js';
import AnimeMenuPage from './pages/AnimeMenuPage.js';
import AnimeRankingPage from './pages/AnimeRankingPage.js';
import MangaDetailPage from './pages/MangaDetailPage.js';
import MangaMenuPage from './pages/MangaMenuPage.js';
import NewsDetailPage from './pages/NewsDetailPage.js';
import NewsMenuPage from './pages/NewsMenuPage.js';

const publicRoutes = [
  { path: '/no-login', element: <LoginRequiredPage /> },
  { path: '/login-required', element: <Navigate to="/no-login" replace /> },
  { path: '/no-wifi', element: <NoWifiPage /> },
  { path: '/login', element: <LoginPage /> },
  { path: '/login-filled', element: <LoginFilledPage /> },
  { path: '/login-error', element: <LoginErrorPage /> },
  { path: '/register', element: <RegisterPage /> },
  { path: '/register-filled', element: <RegisterFilledPage /> },
  { path: '/register-error', element: <RegisterErrorPage /> },
  { path: '/auth/success', element: <AuthSuccessPage /> }
];

const protectedRoutes = [
  { path: '/home', element: <MenuPage /> },
  { path: '/menu', element: <SideMenuPage /> },
  { path: '/search', element: <SearchResultsPage /> },
  { path: '/search-empty', element: <SearchEmptyPage /> },
  { path: '/profile', element: <ProfilePage /> },
  { path: '/profile-guest', element: <ProfilePage guest /> },
  { path: '/profile-language', element: <ProfilePage language /> },
  { path: '/profile-edit', element: <EditProfilePage /> },
  { path: '/history', element: <HistoryPage /> },
  { path: '/history-actions', element: <HistoryPage actions /> },
  { path: '/change-password', element: <ChangePasswordPage /> },
  { path: '/change-password-filled', element: <ChangePasswordPage filled /> },
  { path: '/faq', element: <FaqPage /> },
  { path: '/feedback', element: <FeedbackPage /> },
  { path: '/feedback-form', element: <FeedbackFormPage /> },
  { path: '/favorites', element: <FavoritesPage /> },
  { path: '/favorites-actions', element: <FavoritesPage actions /> },
  { path: '/favorites-delete', element: <FavoritesPage deleteDialog /> },
  { path: '/followed', element: <FollowedPage /> },
  { path: '/followed-actions', element: <FollowedPage actions /> },
  { path: '/followed-delete', element: <FollowedPage deleteDialog /> },
  { path: '/ranking', element: <AnimeRankingPage /> },
  { path: '/anime-menu', element: <AnimeMenuPage /> },
  { path: '/anime-detail', element: <AnimeDetailPage /> },
  { path: '/manga-menu', element: <MangaMenuPage /> },
  { path: '/manga-detail', element: <MangaDetailPage /> },
  { path: '/news-menu', element: <NewsMenuPage /> },
  { path: '/news-detail', element: <NewsDetailPage /> }
];

function RequireAuth({ children }) {
  return getSessionUser() ? children : <Navigate to="/no-login" replace />;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to={getSessionUser() ? '/home' : '/login'} replace />} />

        {publicRoutes.map((route) => (
          <Route key={route.path} path={route.path} element={route.element} />
        ))}

        {protectedRoutes.map((route) => (
          <Route key={route.path} path={route.path} element={<RequireAuth>{route.element}</RequireAuth>} />
        ))}

        <Route path="*" element={<Navigate to={getSessionUser() ? '/home' : '/no-login'} replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;