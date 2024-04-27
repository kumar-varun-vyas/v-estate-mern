import { configureStore, combineReducers } from '@reduxjs/toolkit'
import useReducer from './user/userSlice'
import { persistReducer, persistStore } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import { version } from 'react'
const rootReducers = combineReducers({ user: useReducer })

const persistConfig = {
    key: 'root',
    storage,
    version: 1

}

const persistReducers = persistReducer(persistConfig, rootReducers)

export const store = configureStore({
    reducer: persistReducers,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({
        serializableCheck: false
    })
})

export const persistor = persistStore(store)