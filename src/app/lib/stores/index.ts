import {
  configureStore,
} from "@reduxjs/toolkit";
import visibilityReducer from "./reducers/visibility";

// create a makeStore function
export const makeStore = () => configureStore({
  reducer: {
    visibility: visibilityReducer
  },
});

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore['dispatch']
