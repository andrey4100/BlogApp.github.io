import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useLocation } from 'react-router-dom';

import styles from './Article.module.scss';

import profile from '../../assets/img/profile.svg';
import { favoriteArticle, unfavoriteArticle } from '../../store/articleSlice';

function Article({ article }) {
  const dispatch = useDispatch();
  const apiToken = useSelector((state) => state.user.user?.token);
  const isLoggedIn = useSelector((state) => !!state.user.user?.token);
  const location = useLocation();

  const [isFavorited, setIsFavorited] = useState(article.favorited);

  const handleLikeClick = async (e) => {
    e.preventDefault();
    if (!isLoggedIn) {
      // eslint-disable-next-line no-alert
      alert('You must be logged in to like an article.');
      return;
    }

    if (!apiToken) {
      // eslint-disable-next-line no-console
      console.error('No API token available');
      return;
    }

    try {
      if (!isFavorited) {
        await dispatch(favoriteArticle({ apiToken, slug: article.slug })).unwrap();
        setIsFavorited(true);
      } else {
        await dispatch(unfavoriteArticle({ apiToken, slug: article.slug })).unwrap();
        setIsFavorited(false);
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Failed to like/unlike article:', error);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = { month: 'short', day: 'numeric', year: 'numeric' };
    return date.toLocaleDateString('en-US', options);
  };

  return (
    <div className={styles.article}>
      <div className={styles.article__container}>
        <div className={styles.article__decription}>
          <div className={styles.article__titleBlock}>
            <Link
              className={styles.article__title}
              to={{
                pathname: `/articles/${article.slug}`,
                state: { from: location.pathname },
              }}
            >
              {article.title}
            </Link>
            <div className={styles.article__likeBlock}>
              <button
                className={`${styles.article__button} ${isFavorited ? styles.active : ''}`}
                type="button"
                onClick={handleLikeClick}
              />
              <p className={styles.article__likeCount}>{article.favoritesCount}</p>
            </div>
          </div>
          <div className={styles.article__tagsList}>
            {(() => {
              const uniqueTags = [...new Set(article.tagList)];
              return uniqueTags.map((tag) => (
                <div className={styles.article__tag} key={tag}>
                  <p className={styles.article__tagText}>{tag}</p>
                </div>
              ));
            })()}
          </div>
          <p className={styles.article__text}>{article.description}</p>
        </div>
        <div className={styles.article__author}>
          <div className={styles.article__info}>
            <p className={styles.article__name}>{article.author.username}</p>
            <p className={styles.article__date}>{formatDate(article.createdAt)}</p>
          </div>
          <img className={styles.article__img} src={article.author.image || profile} alt="logo" />
        </div>
      </div>
    </div>
  );
}

export default Article;