import { configureStore } from "@reduxjs/toolkit";
import visibilityReducer from "./reducers/visibility";
import authReducer from "./reducers/auth";

// create a makeStore function
export const makeStore = () =>
    configureStore({
        reducer: {
            visibility: visibilityReducer,
            auth: authReducer,
        },
    });

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
