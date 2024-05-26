import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    currentUser: null,
    error: null,
    loading: false
}

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        signInStart: (state) => {
            state.loading = true
        },
        signInSuccess: (state, action) => {
            state.currentUser = action.payload;
            state.loading = false;
            state.error = null;
        },
        signInFailuer: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },
        updateUserStart: (state) => {
            state.loading = true
        },
        updateUserSuccess: (state, action) => {
            state.currentUser = action.payload;
            state.loading = false;
            state.error = null;
        },
        updateUserFailuer: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },
        deleteUserStart: (state) => {
            state.loading = true
        },
        deleteUserSuccess: (state, action) => {
            state.currentUser = '';
            state.loading = false;
            state.error = null;
        },
        deleteUserFailuer: (state, action) => {
            state.loading = false;
            state.error = action.payload ? action.payload : '';
        },
        signoutStart: (state) => {
            state.loading = true
        },
        signoutSuccess: (state, action) => {
            state.currentUser = '';
            state.loading = false;
            state.error = null;
        },
        signoutFailuer: (state, action) => {
            state.loading = false;
            state.error = action.payload ? action.payload : '';
        }
    }
})

export const {
    signInFailuer,
    signInStart,
    signInSuccess,
    updateUserStart,
    updateUserSuccess,
    updateUserFailuer,
    deleteUserStart,
    deleteUserFailuer,
    deleteUserSuccess,
    signoutStart,
    signoutSuccess,
    signoutFailuer
} = userSlice.actions;

export default userSlice.reducer;