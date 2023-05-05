import { configureStore } from '@reduxjs/toolkit';
import authApi from './apis/authApi';
import { signout, authReducer } from './slices/authSlice';
import { reducer as formReducer } from 'redux-form';

const store = configureStore({
    reducer: {
        auth: authReducer,
        [authApi.reducerPath]: authApi.reducer,
        form: formReducer
    },
    middleware: (getDefaultMiddleware) => {
        return getDefaultMiddleware().concat(authApi.middleware);
    }
});

export const { useSignupMutation, useSigninMutation } = authApi;
export { signout, store };
