/* eslint-disable no-shadow */
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

import { signIn } from '../../store/userSlice';
import styles from './Login.module.scss';

function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { status, errors } = useSelector((state) => state.user);

  const {
    register,
    handleSubmit,
    formState: { errors: formErrors },
  } = useForm({
    mode: 'onBlur',
  });

  const [formSubmitted, setFormSubmitted] = useState(false);

  const onSubmit = async (data) => {
    setFormSubmitted(true);
    try {
      await dispatch(signIn({ email: data.email, password: data.password })).unwrap();
      navigate('/');
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Login failed:', error);
    }
  };

  const hasValidationErrors = () => Object.keys(formErrors).length > 0;

  return (
    <div className={styles.login}>
      <h2 className={styles.login__title}>Sign In</h2>
      <form className={styles.login__form} onSubmit={handleSubmit(onSubmit)}>
        <div className={styles.login__block}>
          <label className={styles.login__label} htmlFor="email">
            Email address
          </label>
          <input
            className={`${styles.login__input} ${formErrors.email ? styles.errorInput : ''}`}
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
          {formErrors.email && <p className={`${styles.error} ${styles.errorMessage}`}>{formErrors.email.message}</p>}
        </div>
        <div className={styles.login__block}>
          <label className={styles.login__label} htmlFor="password">
            Password
          </label>
          <input
            className={`${styles.login__input} ${formErrors.password ? styles.errorInput : ''} ${formSubmitted && errors.incorrectPasswordOrEmail && !hasValidationErrors() ? styles.errorInput : ''}`}
            type="password"
            id="password"
            name="password"
            placeholder="Password"
            {...register('password', {
              required: 'This field is required',
            })}
          />
          {formErrors.password && <p className={`${styles.error} ${styles.errorMessage}`}>{formErrors.password.message}</p>}
          {formSubmitted && errors.incorrectPasswordOrEmail && !hasValidationErrors() && (
            <p className={`${styles.error} ${styles.errorMessage}`}>{errors.incorrectPasswordOrEmail}</p>
          )}
        </div>
        {status === 'loading'}
        <button
          className={styles.login__button}
          type="submit"
          disabled={status === 'loading' || Object.keys(formErrors).length > 0}
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