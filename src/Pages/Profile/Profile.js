import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';

import { editProfile } from '../../store/userSlice';

import styles from './Profile.module.scss';

function Profile() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.user);
  const { status, errors } = useSelector((state) => state.user);

  const {
    register,
    handleSubmit,
    formState: { errors: formErrors },
    setValue,
  } = useForm({
    mode: 'onBlur',
  });

  useEffect(() => {
    if (user) {
      setValue('username', user.username || '');
      setValue('email', user.email || '');
      setValue('avatar', user.image || '');
    }
  }, [user, setValue]);

  const onSubmit = async (data) => {
    const profileData = {};
    if (data.username !== user.username) profileData.username = data.username;
    if (data.email !== user.email) profileData.email = data.email;
    if (data.password) profileData.password = data.password;
    if (data.avatar !== user.image) profileData.image = data.avatar;

    try {
      await dispatch(editProfile(profileData)).unwrap();
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('Failed to update profile:', err);
    }
  };

  return (
    <div className={styles.profile}>
      <h2 className={styles.profile__title}>Edit Profile</h2>
      <form className={styles.profile__form} onSubmit={handleSubmit(onSubmit)}>
        <div className={styles.profile__block}>
          <label className={styles.profile__label} htmlFor="username">
            Username
          </label>
          <input
            className={`${styles.profile__input} ${formErrors.username ? styles.errorInput : ''}`}
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
        </div>
        <div className={styles.profile__block}>
          <label className={styles.profile__label} htmlFor="email">
            Email address
          </label>
          <input
            className={`${styles.profile__input} ${formErrors.email ? styles.errorInput : ''}`}
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
        <div className={styles.profile__block}>
          <label className={styles.profile__label} htmlFor="new_password">
            New password
          </label>
          <input
            className={`${styles.profile__input} ${formErrors.password ? styles.errorInput : ''}`}
            type="password"
            id="new_password"
            name="password"
            placeholder="New password"
            {...register('password', {
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
        <div className={styles.profile__block}>
          <label className={styles.profile__label} htmlFor="avatar">
            Avatar image (url)
          </label>
          <input
            className={`${styles.profile__input} ${formErrors.avatar ? styles.errorInput : ''}`}
            type="url"
            id="avatar"
            name="avatar"
            placeholder="Avatar image"
            {...register('avatar', {
              pattern: {
                value: /^(ftp|http|https):\/\/[^ "]+$/,
                message: 'Invalid URL',
              },
            })}
          />
          {formErrors.avatar && <p className={`${styles.error} ${styles.errorMessage}`}>{formErrors.avatar.message}</p>}
        </div>
        {status === 'loading'}
        {errors && Object.keys(errors).length > 0 && (
          <ul>
            {Object.entries(errors).map(([key, value]) => (
              <li key={key}>
                {key}: {value}
              </li>
            ))}
          </ul>
        )}
        <button
          className={styles.profile__button}
          type="submit"
          disabled={status === 'loading' || Object.keys(formErrors).length > 0}
        >
          Save
        </button>
      </form>
    </div>
  );
}

export default Profile;
