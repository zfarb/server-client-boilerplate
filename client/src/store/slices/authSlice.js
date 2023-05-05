import { createSlice } from '@reduxjs/toolkit';
import authApi from '../apis/authApi';

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        token: localStorage.getItem('token'),
        error: null
    },
    reducers: {
        signout: (state) => {
            localStorage.removeItem('token');
            state.token = null;
        }
    },
    extraReducers: (builder) => {
        builder.addMatcher(
            authApi.endpoints.signup.matchFulfilled,
            (state, { payload }) => {
                state.token = payload.token;
                state.error = null;
                localStorage.setItem('token', payload.token);
            }
        );
        builder.addMatcher(
            authApi.endpoints.signup.matchRejected,
            (state, { payload }) => {
                state.token = null;
                state.error = 'Email in use';
            }
        );
        builder.addMatcher(
            authApi.endpoints.signin.matchFulfilled,
            (state, { payload }) => {
                state.token = payload.token;
                state.error = null;
                localStorage.setItem('token', payload.token);
            }
        );
        builder.addMatcher(
            authApi.endpoints.signin.matchRejected,
            (state, { payload }) => {
                state.token = null;
                state.error = 'Invalid credentials';
            }
        );
    }
});

export const { signout } = authSlice.actions;
export const authReducer = authSlice.reducer;
