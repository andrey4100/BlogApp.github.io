/* eslint-disable no-shadow */
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

import { signIn } from '../../store/userSlice';
import styles from './Login.module.scss';

function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { status, error } = useSelector((state) => state.user);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: 'onBlur',
  });

  const onSubmit = async (data) => {
    try {
      await dispatch(signIn({ email: data.email, password: data.password })).unwrap();
      navigate('/');
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Login failed:', error);
    }
  };

  return (
    <div className={styles.login}>
      <h2 className={styles.login__title}>Sign In</h2>
      <form className={styles.login__form} onSubmit={handleSubmit(onSubmit)}>
        <div className={styles.login__block}>
          <label className={styles.login__label} htmlFor="email">
            Email address
          </label>
          <input
            className={`${styles.login__input} ${errors.email ? styles.errorInput : ''}`}
            type="email"
            id="email"
            name="email"
            placeholder="Email address"
            {...register('email', {
              required: 'This field is required',
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: 'Invalid email address',
              },
            })}
          />
          {errors.email && <p className={`${styles.error} ${styles.errorMessage}`}>{errors.email.message}</p>}
        </div>
        <div className={styles.login__block}>
          <label className={styles.login__label} htmlFor="password">
            Password
          </label>
          <input
            className={`${styles.login__input} ${errors.password ? styles.errorInput : ''}`}
            type="password"
            id="password"
            name="password"
            placeholder="Password"
            {...register('password', {
              required: 'This field is required',
            })}
          />
          {errors.password && <p className={`${styles.error} ${styles.errorMessage}`}>{errors.password.message}</p>}
        </div>
        {status === 'loading'}
        {error && <p>Error: {error}</p>}
        <button
          className={styles.login__button}
          type="submit"
          disabled={status === 'loading' || Object.keys(errors).length > 0}
        >
          Login
        </button>
        <div className={styles.login__footer}>
          Don’t have an account?{' '}
          <a className={styles.login__link} href="/register">
            Sign Up.
          </a>
        </div>
      </form>
    </div>
  );
}

export default Login;
