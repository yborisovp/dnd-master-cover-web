import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "../store";

interface SettingsState {
  isOpen: boolean;
  lightMode: boolean;
}

const initialState: SettingsState = {
  isOpen: false,
  lightMode: false,
};

const settingsSlice = createSlice({
  name: "settings",
  initialState,
  reducers: {
    openModal: (state) => {
      state.isOpen = true;
    },
    closeModal: (state) => {
      state.isOpen = false;
    },
    toggleLightMode: (state) => {
      state.lightMode = !state.lightMode;
    },
  },
});

export const settingsSelector = (state: RootState) => state.settings;

export const { openModal, closeModal, toggleLightMode } = settingsSlice.actions;
export default settingsSlice.reducer;
