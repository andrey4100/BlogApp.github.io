import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

import { getArticles } from '../../store/articleSlice';
import Article from '../Article';
import styles from './ArticleList.module.scss';

function ArticleList() {
  const dispatch = useDispatch();
  const articles = useSelector((state) => state.articles.list);
  const status = useSelector((state) => state.articles.status);
  const error = useSelector((state) => state.articles.error);
  const apiToken = useSelector((state) => state.user.user?.token);
  const { numberPage } = useParams();

  const itemsPerPage = 20;

  useEffect(() => {
    const page = numberPage ? parseInt(numberPage, 10) : 1;
    const skip = (page - 1) * itemsPerPage;
    dispatch(getArticles({ skip, apiToken }));
  }, [dispatch, numberPage, apiToken]);

  if (status === 'loading') {
    return <div></div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className={styles.articleList}>
      {articles.map((article) => (
        <Article key={article.slug} article={article} />
      ))}
    </div>
  );
}

export default ArticleList;