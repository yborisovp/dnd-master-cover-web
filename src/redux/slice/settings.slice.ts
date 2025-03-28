import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";

export enum LanguageEnum {
  en = "en",
  ru = "ru",
}

interface SettingsState {
  lightMode: boolean;
  panelAtRight: boolean;
  sidebarCollapsed: boolean;
  language: LanguageEnum;
  randomOrgApiKey: string;
  useRandomOrg: boolean;
}

const initialState: SettingsState = {
  lightMode: false,
  panelAtRight: false,
  sidebarCollapsed: false,
  language: LanguageEnum.en,
  randomOrgApiKey: "",
  useRandomOrg: false,
};

const settingsSlice = createSlice({
  name: "settings",
  initialState,
  reducers: {
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
    setRandomOrgApiKey: (state, action: PayloadAction<string>) => {
      state.randomOrgApiKey = action.payload;
    },
    toggleUseRandomOrg: (state) => {
      state.useRandomOrg = !state.useRandomOrg;
    },
    setUseRandomOrg: (state, action: PayloadAction<boolean>) => {
      state.useRandomOrg = action.payload;
    },
  },
});

export const settingsSelector = (state: RootState) => state.settings;

export const {
  toggleLightMode,
  toggleViewAlign,
  toggleSideBar,
  changeLocalLanguage,
  setRandomOrgApiKey,
  toggleUseRandomOrg,
  setUseRandomOrg,
} = settingsSlice.actions;
export default settingsSlice.reducer;
