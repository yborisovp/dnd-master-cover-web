import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";

export enum LanguageEnum {
  "en",
  "ru",
}
interface SettingsState {
  isOpen: boolean;
  lightMode: boolean;
  panelAtRight: boolean;
  sidebarCollapsed: boolean;
  language: LanguageEnum;
}

const initialState: SettingsState = {
  isOpen: false,
  lightMode: false,
  panelAtRight: false,
  sidebarCollapsed: false,
  language: LanguageEnum.en,
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
    toggleViewAlign: (state) => {
      state.panelAtRight = !state.panelAtRight;
    },
    toggleSideBar: (state) => {
      state.sidebarCollapsed = !state.sidebarCollapsed;
    },
    changeLocalLanguage: (state, action: PayloadAction<LanguageEnum>) => {
      state.language = action.payload;
    },
  },
});

export const settingsSelector = (state: RootState) => state.settings;

export const {
  openModal,
  closeModal,
  toggleLightMode,
  toggleViewAlign,
  toggleSideBar,
  changeLocalLanguage,
} = settingsSlice.actions;
export default settingsSlice.reducer;
