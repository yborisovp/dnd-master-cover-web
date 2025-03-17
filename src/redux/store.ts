import { combineReducers, configureStore } from "@reduxjs/toolkit";
import initiativeReducer from "./slice/initiative.slice";
import enemyReducer from "./slice/enemies.slice";
import settingsReducer from "./slice/settings.slice";
import feedbackReducer from "./slice/feedback.slice";

import storage from "redux-persist/lib/storage";

import { persistReducer, persistStore } from "redux-persist";
import { submitFeedback } from "./thunx";

const persistConfig = {
  key: "root",
  storage,
};

var rootReducer = combineReducers({
  initiative: initiativeReducer,
  enemy: enemyReducer,
  settings: settingsReducer,
  feedback: feedbackReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  devTools: process.env.NODE_ENV !== "production",
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [
          "persist/PERSIST",
          "persist/REHYDRATE",
          submitFeedback.typePrefix,
        ],
      },
    }),
});

export const persistor = persistStore(store);
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppStore = typeof store;
