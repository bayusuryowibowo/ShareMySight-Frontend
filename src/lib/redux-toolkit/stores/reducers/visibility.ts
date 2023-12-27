import { createSlice } from "@reduxjs/toolkit";
import { VisibilityState } from "../definitions";

const initialState: VisibilityState = {
    isVisible: true,
};

const visibilitySlice = createSlice({
    name: "visibility",
    initialState,
    reducers: {
        toggleVisibility: (state) => {
            state.isVisible = !state.isVisible;
        },
    },
});

// Action creators are generated for each case reducer function
export const { toggleVisibility } = visibilitySlice.actions;
export default visibilitySlice.reducer;
