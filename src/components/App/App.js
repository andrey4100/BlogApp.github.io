import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import styles from './App.module.scss';

import Header from '../Header';
import Home from '../../Pages/Home';
import Login from '../../Pages/Login';
import Registration from '../../Pages/Registration';
import PrivateRoute from '../PrivateRoute';
import Profile from '../../Pages/Profile';
import CurrentArticle from '../../Pages/CurrentArticle';
import CreateArticle from '../../Pages/CreateArticle';

function App() {
  return (
    <div className={styles.app}>
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/articles" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Registration />} />
          <Route path="/page/:numberPage" element={<Home />} />
          <Route
            path="/profile"
            element={
              <PrivateRoute>
                <Profile />
              </PrivateRoute>
            }
          />
          <Route path="/articles/:slug" element={<CurrentArticle />} />
          <Route
            path="/create-article"
            element={
              <PrivateRoute>
                <CreateArticle />
              </PrivateRoute>
            }
          />
            <Route
            path="/new-article"
            element={
              <PrivateRoute>
                <CreateArticle />
              </PrivateRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
