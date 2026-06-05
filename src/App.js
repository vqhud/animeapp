// src/App.js
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomeScreen from './HomeScreen';
import AnimeRankingScreen from './AnimeRankingScreen';
import AnimeMenuScreen from './AnimeMenuScreen';
import AnimeDetailScreen from './AnimeDetailScreen';
import MangaMenuScreen from './MangaMenuScreen';
import MangaDetailScreen from './MangaDetailScreen';
import NewsMenuScreen from './NewsMenuScreen';
import NewsDetailScreen from './NewsDetailScreen';


export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomeScreen />} />
        <Route path="/ranking" element={<AnimeRankingScreen />} />
        
        <Route path="/anime-menu" element={<AnimeMenuScreen />} />
        <Route path="/anime-detail" element={<AnimeDetailScreen />} />
        
        <Route path="/manga-menu" element={<MangaMenuScreen />} />
        <Route path="/manga-detail" element={<MangaDetailScreen />} />
        <Route path="/news-menu" element={<NewsMenuScreen />} />
        <Route path="/news-detail" element={<NewsDetailScreen />} />
      </Routes>
    </BrowserRouter>
  );
}