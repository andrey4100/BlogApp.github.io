import React from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom'; // Import useParams

import styles from './Home.module.scss';

import ArticleList from '../../components/ArticleList';
import MyPagination from '../../components/MyPagination';
import Error from '../../components/Error';

function Home() {
  const status = useSelector((state) => state.articles.status);
  const error = useSelector((state) => state.articles.error);
  const { numberPage } = useParams();

  return (
    <div className={styles.home}>
      <div className={styles.container}>
        {error ? (
          <div className={styles.errorContainer}>
            <Error />
          </div>
        ) : (
          <>
            <ArticleList numberPage={numberPage} />
            {status === 'loading' ? null : <MyPagination />}
          </>
        )}
      </div>
    </div>
  );
}

export default Home;