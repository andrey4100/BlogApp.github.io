import React, { useState, useEffect } from 'react';

import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';

import styles from './CreateArticle.module.scss';

import { createArticle, updateArticle } from '../../store/articleSlice';


function CreateArticle() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const { status, error } = useSelector((state) => state.articles);
  const apiToken = useSelector((state) => state.user.user?.token);
  const userImage = useSelector((state) => state.user.user?.image);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    mode: 'onBlur',
  });

  const [tags, setTags] = useState(['', '']);

  const handleTagChange = (index, value) => {
    const newTags = [...tags];
    newTags[index] = value;
    setTags(newTags);
  };

  const addTag = () => {
    setTags([...tags, '']);
  };

  const removeTag = (index) => {
    const newTags = [...tags];
    newTags.splice(index, 1);
    setTags(newTags);
  };

  useEffect(() => {
    const article = location.state?.article;
    if (article) {
      setValue('title', article.title);
      setValue('description', article.description);
      setValue('body', article.body);
      setTags(article.tagList || ['', '']);
    }
  }, [location.state, setValue]);

  const onSubmit = async (data) => {
    const articleData = {
      title: data.title,
      description: data.description,
      body: data.body,
      tagList: tags.filter((tag) => tag !== ''),
      author: { image: userImage },
    };

    try {
      const article = location.state?.article;
      if (article) {
        await dispatch(
          updateArticle({ apiToken, slug: article.slug, dataForUpdatingAnArticle: articleData })
        ).unwrap();
      } else {
        await dispatch(createArticle({ apiToken, dataForCreatingAnArticle: articleData })).unwrap();
      }
      navigate('/');
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('Failed to create/update article:', err);
    }
  };



  return (
    <div className={styles.container}>
      <form className={styles.createArticle} onSubmit={handleSubmit(onSubmit)}>
        <h1 className={styles.createArticle__title}>
          {location.state?.article ? 'Edit article' : 'Create new article'}
        </h1>

        <label className={styles.createArticle__label} htmlFor="title">
          Title
        </label>
        <input
          className={`${styles.createArticle__input} ${errors.title ? styles.errorInput : ''}`}
          type="text"
          id="title"
          name="title"
          placeholder="Title"
          {...register('title', {
            required: 'This field is required',
          })}
        />
        {errors.title && <p className={`${styles.error} ${styles.errorMessage}`}>{errors.title.message}</p>}

        <label className={styles.createArticle__label} htmlFor="description">
          Short description
        </label>
        <input
          className={`${styles.createArticle__input} ${errors.description ? styles.errorInput : ''}`}
          type="text"
          id="description"
          name="description"
          placeholder="Short description"
          {...register('description', {
            required: 'This field is required',
          })}
        />
        {errors.description && <p className={`${styles.error} ${styles.errorMessage}`}>{errors.description.message}</p>}

        <label className={styles.createArticle__label} htmlFor="body">
          Text
        </label>
        <textarea
          className={`${styles.createArticle__textarea} ${errors.body ? styles.errorInput : ''}`}
          id="body"
          name="body"
          placeholder="Text"
          {...register('body', {
            required: 'This field is required',
          })}
        />
        {errors.body && <p className={`${styles.error} ${styles.errorMessage}`}>{errors.body.message}</p>}

        <div className={styles.createArticle__tags}>
          <p className={styles.createArticle__tagTitle}>Tags</p>
          {tags.map((tag, index) => (
            <div className={styles.createArticle__container} key={index}>
              <input
                className={styles.createArticle__tagInput}
                type="text"
                placeholder="Tag"
                value={tag}
                onChange={(e) => handleTagChange(index, e.target.value)}
              />
              {tags.length > 1 && (
                <button className={styles.createArticle__delete} type="button" onClick={() => removeTag(index)}>
                  Delete
                </button>
              )}
              {index === tags.length - 1 && (
                <button className={styles.createArticle__add} type="button" onClick={addTag}>
                  Add tag
                </button>
              )}
            </div>
          ))}
        </div>

        <button className={styles.createArticle__send} type="submit" disabled={status === 'loading' || Object.keys(errors).length > 0}>
          {status === 'loading' ? 'Creating...' : 'Send'}
        </button>
        {error && <p className={styles.error}>{error}</p>}
      </form>
    </div>
  );
}

export default CreateArticle;