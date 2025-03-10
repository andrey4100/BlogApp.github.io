/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable no-console */
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';

import { signUp } from '../../store/userSlice';

import styles from './Registration.module.scss';

function Registration() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { status, error } = useSelector((state) => state.user);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm({
    mode: 'onChange',
  });

  const password = watch('password');

  const onSubmit = async (data) => {
    try {
      await dispatch(signUp({ username: data.username, email: data.email, password: data.password })).unwrap();
      navigate('/');
      // eslint-disable-next-line no-shadow
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Registration failed:', error);
    }
  };

  return (
    <div className={styles.registration}>
      <h2 className={styles.registration__title}>Create new account</h2>
      <form className={styles.registration__form} onSubmit={handleSubmit(onSubmit)}>
        <div className={styles.registration__block}>
          <label className={styles.registration__label} htmlFor="username">
            Username
          </label>
          <input
            className={`${styles.registration__input} ${errors.username ? styles.errorInput : ''}`}
            type="text"
            id="username"
            name="username"
            placeholder="Username"
            {...register('username', {
              required: 'This field is required',
              minLength: {
                value: 3,
                message: 'Username must be at least 3 characters',
              },
              maxLength: {
                value: 20,
                message: 'Username must be no more than 20 characters',
              },
            })}
          />
          {errors.username && <p className={`${styles.error} ${styles.errorMessage}`}>{errors.username.message}</p>}
        </div>
        <div className={styles.registration__block}>
          <label className={styles.registration__label} htmlFor="email">
            Email address
          </label>
          <input
            className={`${styles.registration__input} ${errors.email ? styles.errorInput : ''}`}
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
        <div className={styles.registration__block}>
          <label className={styles.registration__label} htmlFor="password">
            Password
          </label>
          <input
            className={`${styles.registration__input} ${errors.password ? styles.errorInput : ''}`}
            type="password"
            id="password"
            name="password"
            placeholder="Password"
            {...register('password', {
              required: 'This field is required',
              minLength: {
                value: 6,
                message: 'Password must be at least 6 characters',
              },
              maxLength: {
                value: 40,
                message: 'Password must be no more than 40 characters',
              },
            })}
          />
          {errors.password && <p className={`${styles.error} ${styles.errorMessage}`}>{errors.password.message}</p>}
        </div>
        <div className={styles.registration__block}>
          <label className={styles.registration__label} htmlFor="repeat_password">
            Repeat Password
          </label>
          <input
            className={`${styles.registration__input} ${errors.repeat_password ? styles.errorInput : ''}`}
            type="password"
            id="repeat_password"
            name="repeat_password"
            placeholder="Password"
            {...register('repeat_password', {
              required: 'This field is required',
              validate: (value) => value === password || 'The passwords must match',
            })}
          />
          {errors.repeat_password && (
            <p className={`${styles.error} ${styles.errorMessage}`}>{errors.repeat_password.message}</p>
          )}
        </div>
        <div className={styles.registration__checkbox}>
          <input
            className={styles.registration__labelInput}
            type="checkbox"
            id="agree"
            name="agree"
            {...register('agree', {
              required: 'You must agree to the processing of personal information',
            })}
          />
          <label
            className={styles.registration__labelCheckbox}
            htmlFor="agree"
            onClick={() => {
              console.log('Label Clicked');
              console.log('Errors before click:', errors);
              const checkbox = document.getElementById('agree');
              console.log('Checkbox element:', checkbox);
              if (checkbox) {
                console.log('Checkbox checked state before click:', checkbox.checked);
              }
            }}
          >
            I agree to the processing of my personal information
          </label>
        </div>
        <div className={styles.registration__checkboxErrorWrapper}>
          {errors.agree && <p className={`${styles.error} ${styles.errorMessage}`}>{errors.agree.message}</p>}
        </div>
        {status === 'loading'}
        {error && <p>Error: {error}</p>}
        <button
          className={styles.registration__button}
          type="submit"
          disabled={status === 'loading' || Object.keys(errors).length > 0}
        >
          Create
        </button>
        <div className={styles.registration__footer}>
          Already have an account?{' '}
          <a className={styles.registration__link} href="/login">
            Sign In.
          </a>
        </div>
      </form>
    </div>
  );
}

export default Registration;
