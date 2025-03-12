/* eslint-disable no-param-reassign */
import { createSlice, createAsyncThunk, createAction } from '@reduxjs/toolkit';

// Базовый URL API, используемый во всех запросах
const apiBase = 'https://blog-platform.kata.academy/api';

// Функция: Получение начального состояния из localStorage
const getInitialState = () => {
  try {
    const user = JSON.parse(localStorage.getItem('user'));
    return {
      status: null,
      errors: {},
      user: user || {},
    };
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Ошибка при парсинге user из localStorage:', error);
    return {
      status: null,
      errors: {},
      user: {},
    };
  }
};

// Функция для регистрации пользователя.
export const signUp = createAsyncThunk('user/signUp', async (registrationData, { rejectWithValue }) => {
  try {
    const res = await fetch(`${apiBase}/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        user: registrationData,
      }),
    });

    if (res.status === 422) {
      const bodyError = await res.json();

      const errorsMessage = {};

      if (bodyError.errors.username) {
        errorsMessage.username = 'A user with this name already exists';
      }

      if (bodyError.errors.email) {
        errorsMessage.email = 'A user with this email already exists';
      }

      throw new Error(JSON.stringify(errorsMessage));
    }

    if (!res.ok) {
      throw new Error(JSON.stringify({ signUpError: 'Something went wrong' }));
    }

    const body = await res.json();

    localStorage.setItem('user', JSON.stringify(body.user));

    return body.user;
  } catch (error) {
    return rejectWithValue(JSON.parse(error.message));
  }
});

// Функция для входа пользователя.
export const signIn = createAsyncThunk('user/signIn', async (loginData, { rejectWithValue }) => {
  try {
    const res = await fetch(`${apiBase}/users/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        user: loginData,
      }),
    });

    if (res.status === 422) {
      throw new Error(JSON.stringify({ incorrectPasswordOrEmail: 'A user with this name already exists' }));
    }

    if (!res.ok) {
      throw new Error(JSON.stringify({ signInError: 'Something went wrong' }));
    }

    const body = await res.json();

    localStorage.setItem('user', JSON.stringify(body.user));

    return body.user;
  } catch (error) {
    return rejectWithValue(JSON.parse(error.message));
  }
});

// Функция, которая удаляет данные пользователя из localStorage.
export const deleteUser = createAction('user/deleteUser', () => {
  localStorage.removeItem('user');
  return {};
});

// Функция для редактирования профиля пользователя.
export const editProfile = createAsyncThunk('user/editProfile', async (editingData, { rejectWithValue, getState }) => {
  try {
    const { user } = getState();

    const res = await fetch(`${apiBase}/user`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${user.user.token}`,
      },
      body: JSON.stringify({
        user: editingData,
      }),
    });

    if (res.status === 422) {
      const bodyError = await res.json();
      return rejectWithValue(bodyError.errors);
    }

    if (!res.ok) {
      const errorData = await res.json();
      return rejectWithValue(errorData.errors);
    }

    const body = await res.json();
    localStorage.setItem('user', JSON.stringify(body.user));
    return body.user;
  } catch (error) {
    return rejectWithValue({ message: error.message });
  }
});

export const logout = createAction('user/logout');

// Управление состоянием пользователя
const userSlice = createSlice({
  name: 'user',
  initialState: getInitialState(),
  reducers: {
    put: (state, action) => {
      state.user = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(signUp.pending, (state) => {
        state.errors = {};
        state.status = 'loading';
      })
      .addCase(signUp.fulfilled, (state, action) => {
        state.status = 'resolved';
        state.user = action.payload;
      })
      .addCase(signUp.rejected, (state, action) => {
        state.status = 'rejected';
        state.errors = action.payload;
      })
      .addCase(signIn.pending, (state) => {
        state.errors = {};
        state.status = 'loading';
      })
      .addCase(signIn.fulfilled, (state, action) => {
        state.status = 'resolved';
        state.user = action.payload;
      })
      .addCase(signIn.rejected, (state, action) => {
        state.errors = action.payload;
        state.status = 'rejected';
      })
      .addCase(deleteUser, (state) => {
        state.user = {};
      })
      .addCase(editProfile.pending, (state) => {
        state.status = 'loading';
        state.errors = {};
      })
      .addCase(editProfile.fulfilled, (state, action) => {
        state.status = 'resolved';
        state.user = action.payload;
      })
      .addCase(editProfile.rejected, (state, action) => {
        state.status = 'rejected';
        state.errors = action.payload;
      })
      .addCase(logout, (state) => {
        state.user = {};
        localStorage.removeItem('user');
      });
  },
});

export const { put } = userSlice.actions;

export default userSlice.reducer;
