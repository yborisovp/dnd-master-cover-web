import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { ApiEnemy, EnemyData } from "../../models/enemy";
import { getEnemyAsync, getEnemyListAsync } from "../thunx";

interface EnemyState {
  apiEnemies: ApiEnemy[];
  activeEnemies: EnemyData[];
  loading: boolean;
  error: string | null;
}

const initialState: EnemyState = {
  apiEnemies: [],
  activeEnemies: [],
  loading: false,
  error: null,
};

export const enemySlice = createSlice({
  name: "enemy",
  initialState,
  reducers: {
    addEnemy: (state, action: PayloadAction<EnemyData>) => {
      const existingIndex = state.activeEnemies.findIndex(
        (e) => e.id === action.payload.id
      );
      if (existingIndex === -1) {
        state.activeEnemies.push(action.payload);
      }
    },
    updateEnemy: (state, action: PayloadAction<EnemyData>) => {
      const index = state.activeEnemies.findIndex(
        (e) => e.id === action.payload.id
      );
      if (index !== -1) {
        state.activeEnemies[index] = action.payload;
      }
    },
    removeEnemy: (state, action: PayloadAction<number>) => {
      state.activeEnemies = state.activeEnemies.filter(
        (e) => e.id !== action.payload
      );
    },
  },
  extraReducers: (builder) => {
    // getEnemyAsync handlers
    builder.addCase(getEnemyAsync.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(
      getEnemyAsync.fulfilled,
      (state, action: PayloadAction<EnemyData>) => {
        state.loading = false;
        const index = state.activeEnemies.findIndex(
          (e) => e.id === action.payload.id
        );
        if (index !== -1) {
          state.activeEnemies[index] = action.payload;
        } else {
          state.activeEnemies.push(action.payload);
        }
      }
    );
    builder.addCase(getEnemyAsync.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || "Failed to fetch enemy";
      console.log("Error in getEnemyAsync:", action.error.message);
    });

    // getEnemyListAsync handlers
    builder.addCase(getEnemyListAsync.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(
      getEnemyListAsync.fulfilled,
      (state, action: PayloadAction<ApiEnemy[]>) => {
        state.loading = false;
        state.apiEnemies = action.payload;
      }
    );
    builder.addCase(getEnemyListAsync.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || "Failed to fetch enemy list";
      console.log("Error in getEnemyListAsync:", action.error.message);
    });
  },
});

export const { addEnemy, updateEnemy, removeEnemy } = enemySlice.actions;

// Selectors
export const selectActiveEnemies = (state: RootState) =>
  state.enemy.activeEnemies;
export const selectApiEnemies = (state: RootState) => state.enemy.apiEnemies;
export const selectEnemyLoading = (state: RootState) => state.enemy.loading;
export const selectEnemyError = (state: RootState) => state.enemy.error;

export default enemySlice.reducer;
