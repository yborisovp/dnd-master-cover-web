import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { InitiativeCharacter } from "../../models/initiative";
import { getEnemyAsync } from "../thunx";
import { EnemyData } from "../../models/enemy";

type InitiativeSliceType = {
  isBattleActive: boolean;
  initiativeList: InitiativeCharacter[];
};

const initialState: InitiativeSliceType = {
  isBattleActive: false,
  initiativeList: [],
};

export const slice = createSlice({
  name: "initiative",
  initialState,
  reducers: {
    addCharacter: (state, action: PayloadAction<InitiativeCharacter>) => {
      state.initiativeList.push(action.payload);
      // Sort in descending order (highest initiative first)
      state.initiativeList.sort(
        (a, b) => (b.initiative ?? 0) - (a.initiative ?? 0)
      );
    },
    updateCharacter: (state, action: PayloadAction<InitiativeCharacter>) => {
      state.initiativeList = state.initiativeList
        .map((character) =>
          character.id !== action.payload.id
            ? character
            : { ...character, ...action.payload }
        )
        // Sort after updating
        .sort((a, b) => (b.initiative ?? 0) - (a.initiative ?? 0));
    },
    removeCharacter: (state, action: PayloadAction<{ id: string }>) => {
      state.initiativeList = state.initiativeList.filter(
        (character) => character.id !== action.payload.id
      );
      if (state.initiativeList.length === 0) {
        state.isBattleActive = false;
      }
    },
    removeCharacterByUniqueName: (state, action: PayloadAction<string>) => {
      state.initiativeList = state.initiativeList.filter(
        (character) => character.name !== action.payload
      );
      if (state.initiativeList.length === 0) {
        state.isBattleActive = false;
      }
    },
    // Rotate the initiative list so that the active (first) character goes to the end.
    rotateInitiative: (state) => {
      if (state.initiativeList.length > 0) {
        const first = state.initiativeList.shift();
        if (first) {
          state.initiativeList.push(first);
        }
      }
    },
    changeBattleState: (state) => {
      state.isBattleActive = !state.isBattleActive;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(
      getEnemyAsync.fulfilled,
      (state, action: PayloadAction<EnemyData>) => {
        state.initiativeList.push({
          id: `${state.initiativeList.length}-${action.payload.name}`,
          name: `[${state.initiativeList.length}] ${action.payload.name}`,
          type: "enemy",
        });
      }
    );
  },
});

// Action creators
export const {
  addCharacter,
  updateCharacter,
  removeCharacter,
  removeCharacterByUniqueName,
  rotateInitiative,
  changeBattleState,
} = slice.actions;

// Selector to get the initiative slice
export const selectCharacter = (state: RootState) =>
  state.initiative.initiativeList;
export const selectIsBattleActive = (state: RootState) =>
  state.initiative.isBattleActive;

export default slice.reducer;
