import { configureStore } from '@reduxjs/toolkit';
import searchReducer from './features/searchSlice';
import collectionReducer from './features/collectionSlice';
import editorReducer from './features/editorSlice';

export const store = configureStore({
    reducer: {
        search: searchReducer,
        collection: collectionReducer,
        editor: editorReducer,
    }
})