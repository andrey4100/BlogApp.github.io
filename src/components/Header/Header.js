import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';

import { logout } from '../../store/userSlice';
import styles from './Header.module.scss';
import profile from '../../assets/img/profile.svg';

function Header() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.user.user);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <div className={styles.header}>
      <div className={styles.container}>
        <div className={styles.header__container}>
          <Link to="/" className={styles.header__logo}>
            <h1 className={styles.header__logoTitle}>Realworld Blog</h1>
          </Link>
          <div className={styles.header__buttons}>
            {user && user.token ? (
              <>
                <Link to="/create-article" className={styles.header__createArticle}>
                  <span>Create article</span>
                </Link>
                <Link to="/profile" className={styles.header__profileLink}>
                  <div className={styles.header__profile}>
                    <p className={styles.header__username}>{user.username}</p>
                    <img className={styles.header__img} src={user.image || profile} alt="logo" />
                  </div>
                </Link>
                <button className={styles.header__logOut} type="button" onClick={handleLogout}>
                  <span>Log out</span>
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className={styles.header__signIn}>
                  <span>Sign In</span>
                </Link>
                <Link to="/register" className={styles.header__signUp}>
                  <span>Sign Up</span>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Header;
