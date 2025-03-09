import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom'; 

import { getArticles} from '../../store/articleSlice';

import Article from '../Article';

import styles from './ArticleList.module.scss';

const ArticleList = () => {
  const user = useSelector((state) => state.user);
  const articles = useSelector((state) => state.articles);
  const dispatch = useDispatch();
  const { numberPage: numberPageParam } = useParams();
  const numberPage = parseInt(numberPageParam || '1', 10); 

  useEffect(() => {
    if (articles.status !== 'loading' && articles.status !== 'rejected') {
      dispatch(getArticles({ skip: numberPage * 20 - 20, apiToken: user.user.token }));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [numberPage, user.user.token, dispatch]);
  
    return (
        <div className={styles.articleList}>
            {articles.list.map((article) => (
                <Article key={article.slug} article={article} />
            ))}
        </div>
    );
};

export default ArticleList;
