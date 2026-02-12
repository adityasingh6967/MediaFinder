import { createSlice } from "@reduxjs/toolkit";

const editorSlice = createSlice({
    name: 'search',
    initialState: {
        image: null,
    },
    reducers: {
        setEditorImage(state, action) {
            state.image = action.payload;
        },
        clearEditorImage(state) {
            state.image = null;
        },
    }
});

export const { setEditorImage, clearEditorImage } = editorSlice.actions;
export default editorSlice.reducer;