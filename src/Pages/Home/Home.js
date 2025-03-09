import React from 'react';
import { Pagination, ConfigProvider } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';

import ArticleList from '../../components/ArticleList';
import { getArticles } from '../../store/articleSlice';
import Error from '../../components/Error';

import styles from './Home.module.scss';

const Home = () => {
  const user = useSelector((state) => state.user);
  const articles = useSelector((state) => state.articles);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { numberPage: numberPageParam } = useParams();
  const numberPage = parseInt(numberPageParam || '1', 10);

  return (
    <div className={styles.home}>
      <div className={styles.container}>
        {articles.status === 'rejected' ? (
          <div className={styles.errorContainer}>
            <Error />
          </div>
        ) : (
          <>
            <ArticleList />
            {articles.articlesCount > 0 && (
              <ConfigProvider
                theme={{
                  components: {
                    Pagination: {
                      itemBg: 'rgba(0, 0, 0, 0)',
                      lineWidth: 0,
                      colorPrimaryHover: 'white',
                      colorPrimary: 'white',
                      itemActiveBg: '#1890FF',
                    },
                  },
                }}
              >
                <Pagination
                  align="center"
                  pageSize={20}
                  onChange={(pageNumber) => {
                    dispatch(getArticles({ skip: (pageNumber - 1) * 20, apiToken: user.user.token }));
                    navigate(`/page/${pageNumber}`);
                  }}
                  current={numberPage}
                  showSizeChanger={false}
                  total={articles.articlesCount}
                />
              </ConfigProvider>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Home;
