import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { InitiativeCharacter } from "../../models/initiative";
import { getEnemyAsync } from "../thunx";
import { EnemyData } from "../../models/enemy";

type InitiativeSliceType = {
  initiativeList: InitiativeCharacter[];
};

const initialState: InitiativeSliceType = {
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
  },
  extraReducers: (builder) => {
    builder.addCase(
      getEnemyAsync.fulfilled,
      (state, action: PayloadAction<EnemyData>) => {
        state.initiativeList.push({
          id: `${state.initiativeList.length}`,
          name: action.payload.name,
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
  rotateInitiative,
} = slice.actions;

// Selector to get the initiative slice
export const selectCharacter = (state: RootState) => state.initiative;

export default slice.reducer;
