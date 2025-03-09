/* eslint-disable no-param-reassign */
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Базовый URL API, используемый во всех запросах
const apiBase = 'https://blog-platform.kata.academy/api';

// Получение списка статей
export const getArticles = createAsyncThunk('articles/getArticles', async ({ skip, apiToken }, { rejectWithValue }) => {
  try {
    const res = await fetch(`${apiBase}/articles?offset=${skip}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${apiToken}`,
      },
    });

    if (!res.ok) {
      throw new Error('Something went wrong');
    }

    const body = await res.json();

    return body;
  } catch (err) {
    return rejectWithValue(err.message);
  }
});

// Получение конкретной статьи
export const getArticle = createAsyncThunk('articles/getArticle', async ({ slug, apiToken }, { rejectWithValue }) => {
  try {
    const res = await fetch(`${apiBase}/articles/${slug}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${apiToken}`,
      },
    });

    if (!res.ok) {
      throw new Error('Something went wrong');
    }

    const body = await res.json();

    return body;
  } catch (err) {
    return rejectWithValue(err.message);
  }
});

// Функция для создания статьи
export const createArticle = createAsyncThunk(
  'articles/createArticle',
  // eslint-disable-next-line consistent-return
  async ({ apiToken, dataForCreatingAnArticle }, { rejectWithValue }) => {
    try {
      const res = await fetch(`${apiBase}/articles/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiToken}`,
        },
        body: JSON.stringify({
          article: dataForCreatingAnArticle,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        return rejectWithValue(errorData.errors || 'Something went wrong');
      }
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// Функция для обновления статьи
export const updateArticle = createAsyncThunk(
  'articles/updateArticle',
  // eslint-disable-next-line consistent-return
  async ({ apiToken, slug, dataForUpdatingAnArticle }, { rejectWithValue }) => {
    try {
      const res = await fetch(`${apiBase}/articles/${slug}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiToken}`,
        },
        body: JSON.stringify({
          article: dataForUpdatingAnArticle,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        return rejectWithValue(errorData.errors || 'Something went wrong');
      }
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// Функция для удаления статьи
export const deleteArticle = createAsyncThunk(
  'articles/deleteArticle',
  // eslint-disable-next-line consistent-return
  async ({ apiToken, slug }, { rejectWithValue }) => {
    try {
      const res = await fetch(`${apiBase}/articles/${slug}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${apiToken}`,
        },
      });

      if (!res.ok) {
        throw new Error('Something went wrong');
      }
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// Функция для добавления статьи в избранное
export const favoriteArticle = createAsyncThunk(
  'articles/favoriteArticle',
  async ({ apiToken, slug }, { rejectWithValue }) => {
    try {
      const res = await fetch(`${apiBase}/articles/${slug}/favorite`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiToken}`,
        },
      });

      if (!res.ok) {
        throw new Error('Something went wrong');
      }

      const body = await res.json();

      return body;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// Функция для удаление статьи из избранного
export const unfavoriteArticle = createAsyncThunk(
  'articles/unfavoriteArticle',
  async ({ apiToken, slug }, { rejectWithValue }) => {
    try {
      const res = await fetch(`${apiBase}/articles/${slug}/favorite`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${apiToken}`,
        },
      });

      if (!res.ok) {
        throw new Error('Something went wrong');
      }

      const body = await res.json();

      return body;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

const initialState = {
  list: [],
  status: null,
  error: null,
  articlesCount: 0,
};

const articles = createSlice({
  name: 'articles',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(favoriteArticle.fulfilled, (state, action) => {
        state.status = 'resolved';
        state.list = state.list.map((article) => {
          const item = article.slug === action.payload.article.slug;
          return item ? action.payload.article : article;
        });
      })
      .addCase(favoriteArticle.rejected, (state, action) => {
        state.status = 'rejected';
        state.error = action.payload;
      })

      .addCase(unfavoriteArticle.fulfilled, (state, action) => {
        state.status = 'resolved';
        state.list = state.list.map((article) => {
          const item = article.slug === action.payload.article.slug;
          return item ? action.payload.article : article;
        });
      })
      .addCase(unfavoriteArticle.rejected, (state, action) => {
        state.status = 'rejected';
        state.error = action.payload;
      })

      .addCase(updateArticle.pending, (state) => {
        state.error = null;
        state.status = 'loading';
      })
      .addCase(updateArticle.fulfilled, (state) => {
        state.status = 'resolved';
        state.isReRenderListOfDescription = true;
      })
      .addCase(updateArticle.rejected, (state, action) => {
        state.status = 'rejected';
        state.error = action.payload;
      })

      .addCase(createArticle.pending, (state) => {
        state.error = null;
        state.status = 'loading';
      })
      .addCase(createArticle.fulfilled, (state) => {
        state.status = 'resolved';
        state.isReRenderListOfDescription = true;
      })
      .addCase(createArticle.rejected, (state, action) => {
        state.status = 'rejected';
        state.error = action.payload;
      })

      .addCase(deleteArticle.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(deleteArticle.fulfilled, (state) => {
        state.status = 'resolved';
        state.error = null;
        state.isReRenderListOfDescription = true;
      })
      .addCase(deleteArticle.rejected, (state, action) => {
        state.status = 'rejected';
        state.error = action.payload;
      })

      .addCase(getArticles.pending, (state) => {
        state.error = null;
        state.status = 'loading';
      })
      .addCase(getArticles.fulfilled, (state, action) => {
        state.status = 'resolved';
        state.list = action.payload.articles;
        state.articlesCount = action.payload.articlesCount;
      })
      .addCase(getArticles.rejected, (state, action) => {
        state.status = 'rejected';
        state.error = action.payload;
      })

      .addCase(getArticle.pending, (state) => {
        state.error = null;
        state.status = 'loading';
      })
      .addCase(getArticle.fulfilled, (state, action) => {
        state.status = 'resolved';
        state.list = [action.payload.article];
      })
      .addCase(getArticle.rejected, (state, action) => {
        state.status = 'rejected';
        state.error = action.payload;
      });
  },
});

export default articles.reducer;
