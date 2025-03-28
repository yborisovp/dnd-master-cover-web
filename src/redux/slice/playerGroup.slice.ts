import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { UUID } from "crypto";
import { stat } from "fs";

interface Player {
  id: UUID;
  name: string;
}

interface PlayerGroupState {
  activeGroupNumber: number;
  groups: { [groupNumber: number]: { title: string; players: Player[] } };
  uniquePlayers: Player[];
}

const initialState: PlayerGroupState = {
  activeGroupNumber: 0,
  groups: [],
  uniquePlayers: [],
};

export const playerGroupSlice = createSlice({
  name: "enemy",
  initialState,
  reducers: {
    addPlayer: (
      state,
      action: PayloadAction<{ groupId: number; player: Player }>
    ) => {
      state.groups[action.payload.groupId].players.push(action.payload.player);
      if (!state.uniquePlayers.some((p) => p.id === action.payload.player.id)) {
        state.uniquePlayers.push(action.payload.player);
      }
    },
    removePlayer: (
      state,
      action: PayloadAction<{
        groupId: number;
        playerId: UUID;
        totalDelete?: boolean;
      }>
    ) => {
      state.groups[action.payload.groupId].players = state.groups[
        action.payload.groupId
      ].players.filter((p) => p.id !== action.payload.playerId);
      if (action.payload.totalDelete) {
        state.uniquePlayers = state.uniquePlayers.filter(
          (p) => p.id !== action.payload.playerId
        );
      }
    },
    updatePlayer: (
      state,
      action: PayloadAction<{ player: Player; updateInEachGroup?: boolean }>
    ) => {
      const updatedPlayer = action.payload.player;

      // Update the uniquePlayers array
      state.uniquePlayers = state.uniquePlayers.map((p) =>
        p.id === updatedPlayer.id ? updatedPlayer : p
      );

      // Update all instances in groups if required
      if (action.payload.updateInEachGroup) {
        // Iterate through each group in the groups object
        Object.entries(state.groups).forEach(([groupNumber, group]) => {
          state.groups[Number(groupNumber)].players = group.players.map(
            (player) =>
              player.id === updatedPlayer.id ? updatedPlayer : player
          );
        });
      }
    },
  },
});

export const { addPlayer, removePlayer, updatePlayer } =
  playerGroupSlice.actions;

// Selectors

export const selectActiveGroupPlayers = (state: RootState) =>
  state.playersGroup.groups[state.playersGroup.activeGroupNumber];

export default playerGroupSlice.reducer;
