import { createSlice } from "@reduxjs/toolkit";
import { submitFeedback } from "../thunx";

interface FeedbackState {
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: FeedbackState = {
  status: "idle",
  error: null,
};

const feedbackSlice = createSlice({
  name: "feedback",
  initialState,
  reducers: {
    resetFeedback: (state) => {
      state.status = "idle";
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(submitFeedback.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(submitFeedback.fulfilled, (state) => {
        state.status = "succeeded";
      })
      .addCase(submitFeedback.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      });
  },
});

export const { resetFeedback } = feedbackSlice.actions;
export default feedbackSlice.reducer;
