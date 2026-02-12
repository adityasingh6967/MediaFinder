import { createSlice } from '@reduxjs/toolkit';
import { Flip, toast } from 'react-toastify';

const initialState = {
    items: JSON.parse(localStorage.getItem('collection')) || []
}

const collectionSlice = createSlice({
    name: 'collection',
    initialState,
    reducers: {
        addCollection: (state, action) => {
            const alreadyExist = state.items.find(item => item.id === action.payload.id);
            if (!alreadyExist) {
                state.items.push(action.payload);
                localStorage.setItem('collection', JSON.stringify(state.items));
                toast('Added to Collection!', {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: false,
                    pauseOnHover: false,
                    draggable: true,
                    progress: undefined,
                    theme: "dark",
                    transition: Flip,
                });
            } else if (alreadyExist) {
                toast('Already Exists in the Collection!', {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: false,
                    pauseOnHover: false,
                    draggable: true,
                    progress: undefined,
                    theme: "dark",
                    transition: Flip,
                });
            }
        },
        removeFromCollection: (state, action) => {
            state.items = state.items.filter(item => item.id !== action.payload.id);
            localStorage.setItem('collection', JSON.stringify(state.items));
            toast.error('Removed from Collection!', {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: false,
                pauseOnHover: false,
                draggable: true,
                progress: undefined,
                theme: "dark",
                transition: Flip,
            });
        },
        clearCollection: (state) => {
            state.items = [];
            localStorage.removeItem('collection');
        }
    }
});

export const {
    addCollection,
    removeFromCollection,
    clearCollection
} = collectionSlice.actions;

export default collectionSlice.reducer;