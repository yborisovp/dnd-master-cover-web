import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { RootState } from "../store";
import { ApiEnemy, EnemyData } from "../../models/enemy";
import { getEnemyAsync, getEnemyListAsync } from "../thunx";

interface EnemyState {
  apiEnemies: ApiEnemy[];
  enemy: EnemyData | null;
  loading: boolean;
  error: string | null;
}

const initialState: EnemyState = {
  apiEnemies: [],
  enemy: null,
  loading: false,
  error: null,
};

export const enemySlice = createSlice({
  name: "enemy",
  initialState,
  reducers: {
    setEnemy: (state, action: PayloadAction<EnemyData>) => {
      state.enemy = action.payload;
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
        state.enemy = action.payload;
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

export const { setEnemy } = enemySlice.actions;

// Selectors for each state property
export const selectEnemy = (state: RootState) => state.enemy.enemy;
export const selectApiEnemies = (state: RootState) => state.enemy.apiEnemies;
export const selectEnemyLoading = (state: RootState) => state.enemy.loading;
export const selectEnemyError = (state: RootState) => state.enemy.error;

export default enemySlice.reducer;
