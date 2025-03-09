/* eslint-disable no-shadow */
import React, { useState, useEffect } from 'react';

import { useNavigate, useParams } from 'react-router-dom';
import Markdown from 'react-markdown';
import { useDispatch, useSelector } from 'react-redux';

import { deleteArticle, getArticle, favoriteArticle, unfavoriteArticle } from '../../store/articleSlice';

import styles from './CurrentArticle.module.scss';
import profile from '../../assets/img/profile.svg';

function CurrentArticle() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const article = useSelector((state) => state.articles.list[0]);
  const status = useSelector((state) => state.articles.status);
  const error = useSelector((state) => state.articles.error);
  const isLoggedIn = useSelector((state) => !!state.user.user.token);
  const currentUsername = useSelector((state) => state.user.user.username);
  const apiToken = useSelector((state) => state.user.user.token);

  const [showConfirmation, setShowConfirmation] = useState(false);
  const [isFavorited, setIsFavorited] = useState(article?.favorited || false);
  const [favoritesCount, setFavoritesCount] = useState(article?.favoritesCount || 0);

  useEffect(() => {
    if (article) {
      setIsFavorited(article.favorited);
      setFavoritesCount(article.favoritesCount);
    }
  }, [article]);

  const handleDelete = async () => {
    setShowConfirmation(true);
  };

  const handleConfirmDelete = async () => {
    if (!apiToken) {
      // eslint-disable-next-line no-console
      console.error('User not logged in or no token available');
      return;
    }
    try {
      await dispatch(deleteArticle({ slug, apiToken })).unwrap();
      navigate('/');
      // eslint-disable-next-line no-shadow
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Failed to delete article:', error);
    }
    setShowConfirmation(false);
  };

  const handleCancelDelete = () => {
    setShowConfirmation(false);
  };

  const handleEdit = () => {
    navigate('/create-article', { state: { article } });
  };

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
      if (isFavorited) {
        // Если уже лайкнуто, снимаем лайк
        await dispatch(unfavoriteArticle({ apiToken, slug })).unwrap();
        setIsFavorited(false);
        setFavoritesCount(favoritesCount - 1);
      } else {
        // Если не лайкнуто, ставим лайк
        await dispatch(favoriteArticle({ apiToken, slug })).unwrap();
        setIsFavorited(true);
        setFavoritesCount(favoritesCount + 1);
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Failed to like/unlike article:', error);
    }
  };

  useEffect(() => {
    dispatch(getArticle({ slug, apiToken: apiToken || '' }));
  }, [dispatch, slug, apiToken]);

  if (status === 'loading') {
    return <div></div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  const isAuthor = isLoggedIn && article && currentUsername === article.author.username;

  return (
    <div className={styles.container}>
      {article ? (
        <div className={styles.currentArticle}>
          <div className={styles.currentArticle__container}>
            <div className={styles.currentArticle__decription}>
              <div className={styles.currentArticle__titleBlock}>
                <h1 className={styles.currentArticle__title}>{article.title}</h1>
                <div className={styles.currentArticle__likeBlock}>
                  <button
                    className={`${styles.currentArticle__button} ${isFavorited ? styles.active : ''}`}
                    type="button"
                    onClick={handleLikeClick}
                  />
                  <p className={styles.currentArticle__likeCount}>{favoritesCount}</p>
                </div>
              </div>
              <div className={styles.currentArticle__tagsList}>
                {(() => {
                  const uniqueTags = [...new Set(article.tagList)];
                  return uniqueTags.map((tag) => (
                    <div className={styles.currentArticle__tag} key={tag}>
                      <p className={styles.currentArticle__tagText}>{tag}</p>
                    </div>
                  ));
                })()}
              </div>
              <p className={styles.currentArticle__shortDescription}>{article.description}</p>
              <Markdown>{article.body}</Markdown>
            </div>
            <div className="currentArticle__authorContainer">
              <div className={styles.currentArticle__author}>
                <div className={styles.currentArticle__info}>
                  <p className={styles.currentArticle__name}>{article.author.username}</p>
                  <p className={styles.currentArticle__date}>{new Date(article.createdAt).toLocaleDateString()}</p>
                </div>
                <img className={styles.currentArticle__img} src={article.author.image || profile} alt="logo" />
              </div>
              {isAuthor && (
                <div className={styles.currentArticle__buttons}>
                  <button className={styles.currentArticle__delete} type="button" onClick={handleDelete}>
                    Delete
                  </button>
                  <button className={styles.currentArticle__edit} type="button" onClick={handleEdit}>
                    Edit
                  </button>
                  <div className={`${styles.currentArticle__notification} ${showConfirmation ? styles.show : ''}`}>
                    <p className={styles.currentArticle__notificationText}>
                      Are you sure you want to delete this article?
                    </p>
                    <div className={styles.currentArticle__notificationButtons}>
                      <button className={styles.currentArticle__buttonNo} type="button" onClick={handleCancelDelete}>
                        No
                      </button>
                      <button className={styles.currentArticle__buttonYes} type="button" onClick={handleConfirmDelete}>
                        Yes
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div>Article not found</div>
      )}
    </div>
  );
}

export default CurrentArticle;
