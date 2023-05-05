import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const authApi = createApi({
    reducerPath: 'authApi',
    baseQuery: fetchBaseQuery({
        baseUrl: 'http://localhost:3090'
    }),
    endpoints: (builder) => {
        return {
            signup: builder.mutation({
                query: (args) => {
                    const { email, password } = args;

                    return {
                        url: '/signup',
                        method: 'POST',
                        body: {
                            email,
                            password
                        }
                    };
                },
                transformResponse: (res) => {
                    return { token: res.token };
                }
            }),
            signin: builder.mutation({
                query: (args) => {
                    const { email, password } = args;

                    return {
                        url: '/signin',
                        method: 'POST',
                        body: {
                            email,
                            password
                        }
                    };
                },
                transformResponse: (res) => {
                    return { token: res.token };
                }
            })
        };
    }
});

export default authApi;
