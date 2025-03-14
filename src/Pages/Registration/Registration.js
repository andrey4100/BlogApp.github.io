/* eslint-disable no-shadow */
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

import { signUp } from '../../store/userSlice';
import styles from './Registration.module.scss';

function Registration() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { status, errors } = useSelector((state) => state.user);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors: formErrors },
  } = useForm({
    mode: 'onBlur',
  });

  const password = watch('password');
  const [formSubmitted, setFormSubmitted] = useState(false);

  const onSubmit = async (data) => {
    setFormSubmitted(true);
    try {
      await dispatch(
        signUp({ username: data.username, email: data.email, password: data.password, agree: data.agree })
      ).unwrap();
      navigate('/login');
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Registration failed:', error);
    }
  };

  const hasValidationErrors = () => Object.keys(formErrors).length > 0;

  return (
    <div className={styles.registration}>
      <h2 className={styles.registration__title}>Create new account</h2>
      <form className={styles.registration__form} onSubmit={handleSubmit(onSubmit)}>
        <div className={styles.registration__block}>
          <label className={styles.registration__label} htmlFor="username">
            Username
          </label>
          <input
            className={`${styles.registration__input} ${formErrors.username ? styles.errorInput : ''} ${formSubmitted && errors.username ? styles.errorInput : ''}`}
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
          {formErrors.username && (
            <p className={`${styles.error} ${styles.errorMessage}`}>{formErrors.username.message}</p>
          )}
          {formSubmitted && errors.username && !formErrors.username && (
            <p className={`${styles.error} ${styles.errorMessage}`}>{errors.username}</p>
          )}
        </div>
        <div className={styles.registration__block}>
          <label className={styles.registration__label} htmlFor="email">
            Email address
          </label>
          <input
            className={`${styles.registration__input} ${formErrors.email ? styles.errorInput : ''} ${formSubmitted && errors.email ? styles.errorInput : ''}`}
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
          {formSubmitted && errors.email && !formErrors.email && (
            <p className={`${styles.error} ${styles.errorMessage}`}>{errors.email}</p>
          )}
        </div>
        <div className={styles.registration__block}>
          <label className={styles.registration__label} htmlFor="password">
            Password
          </label>
          <input
            className={`${styles.registration__input} ${formErrors.password ? styles.errorInput : ''}`}
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
          {formErrors.password && (
            <p className={`${styles.error} ${styles.errorMessage}`}>{formErrors.password.message}</p>
          )}
        </div>
        <div className={styles.registration__block}>
          <label className={styles.registration__label} htmlFor="repeat_password">
            Repeat Password
          </label>
          <input
            className={`${styles.registration__input} ${formErrors.repeat_password ? styles.errorInput : ''}`}
            type="password"
            id="repeat_password"
            name="repeat_password"
            placeholder="Password"
            {...register('repeat_password', {
              required: 'This field is required',
              validate: (value) => value === password || 'The passwords must match',
            })}
          />
          {formErrors.repeat_password && (
            <p className={`${styles.error} ${styles.errorMessage}`}>{formErrors.repeat_password.message}</p>
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
          <label className={styles.registration__labelCheckbox} htmlFor="agree">
            I agree to the processing of my personal information
          </label>
        </div>
        <div className={styles.registration__checkboxErrorWrapper}>
          {formErrors.agree && <p className={`${styles.error} ${styles.errorMessage}`}>{formErrors.agree.message}</p>}
        </div>
        {status === 'loading'}
        {formSubmitted && errors.general && !hasValidationErrors() && (
          <p className={`${styles.error} ${styles.errorMessage}`}>{errors.general}</p>
        )}
        <button
          className={styles.registration__button}
          type="submit"
          disabled={status === 'loading' || Object.keys(formErrors).length > 0}
        >
          Create
        </button>
        <div className={styles.registration__footer}>
          Already have an account?
          <a className={styles.registration__link} href="/login">
            Sign In.
          </a>
        </div>
      </form>
    </div>
  );
}

export default Registration;
