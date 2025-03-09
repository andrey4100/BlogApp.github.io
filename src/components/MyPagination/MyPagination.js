import React from 'react';
import { useSelector } from 'react-redux';
import { Pagination, ConfigProvider, } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';

import styles from './MyPagination.module.scss';

function MyPagination() {
    const articlesCount = useSelector((state) => state.articles.articlesCount);
    const navigate = useNavigate();
    const { numberPage } = useParams();

    const itemsPerPage = 20;

    const onChange = (page) => {
        navigate(`/page/${page}`);
    };

    const currentPage = numberPage ? parseInt(numberPage, 10) : 1;

    return (
        <div className={styles.pagination}>
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
                current={currentPage}
                defaultCurrent={1}
                total={articlesCount}
                pageSize={itemsPerPage}
                onChange={onChange}
                showSizeChanger={false}
            />
          </ConfigProvider>
        </div>
    );
}

export default MyPagination;