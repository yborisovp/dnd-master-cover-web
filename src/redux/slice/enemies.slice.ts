import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { ApiEnemy, EnemyData } from "../../models/enemy";
import { getEnemyAsync, getEnemyListAsync } from "../thunx";
import { Layout } from "react-grid-layout";
import { GridColsNumber } from "../../grid/EnemyGrid";

interface WrappedEnemyData {
  id: number;
  enemy: EnemyData;
}
interface EnemyState {
  apiEnemies: ApiEnemy[];
  activeEnemies: WrappedEnemyData[];
  layout: Layout[];
  loading: boolean;
  error: string | null;
}

const initialState: EnemyState = {
  apiEnemies: [],
  activeEnemies: [],
  layout: [],
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
        const newIndex = state.activeEnemies.length;
        const newEnemy: WrappedEnemyData = {
          id: newIndex,
          enemy: action.payload,
        };
        state.activeEnemies.push(newEnemy);
        state.layout.push({
          i: `${newIndex}`,
          x: (newIndex * 2) % GridColsNumber,
          y: 0,
          w: 10,
          h: 5,
          isBounded: true,
        });
      }
    },
    updateEnemy: (
      state,
      action: PayloadAction<{ id: number; enemy: EnemyData }>
    ) => {
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
    onLayoutChange: (state, action: PayloadAction<Layout[]>) => {
      state.layout = action.payload;
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

        const newIndex = state.activeEnemies.length;
        const newEnemy: WrappedEnemyData = {
          id: newIndex,
          enemy: action.payload,
        };
        newEnemy.enemy.name = `[${newIndex + 1}] ${newEnemy.enemy.name}`;
        state.activeEnemies.push(newEnemy);
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
export const selectLayout = (state: RootState) => state.enemy.layout;

export default enemySlice.reducer;
