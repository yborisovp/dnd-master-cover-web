import ky from "ky";

import { createAsyncThunk } from "@reduxjs/toolkit";

import { ApiEnemy, EnemyData } from "../models/enemy";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:28809";

const buildQuery = (params: Record<string, string | undefined>): string => {
  // Filter out undefined values
  const filtered = Object.entries(params).reduce((acc, [key, value]) => {
    if (value !== undefined) {
      acc[key] = value;
    }
    return acc;
  }, {} as Record<string, string>);
  return new URLSearchParams(filtered).toString();
};

export type EnemySearchRequest = {
  query: string;
  danger?: string;
  sort: string;
};

export const getEnemyListAsync = createAsyncThunk<
  ApiEnemy[],
  EnemySearchRequest
>("enemy/search", async (action) => {
  const queryParams = buildQuery({
    q: action.query,
    sort: action.sort,
    dangerLevel: action.danger,
  });

  return await ky
    .get(`${API_URL}/enemy/search?${queryParams}`)
    .json<ApiEnemy[]>();
});

export const getEnemyAsync = createAsyncThunk<EnemyData, string>(
  "enemy/get",
  async (link) => {
    const queryParams = buildQuery({ link });
    const result = await ky
      .get(`${API_URL}/enemy?${queryParams}`)
      .json<EnemyData>();
      
    result.link = "https://dnd.su/bestiary/" + link;
    return result;
  }
);

export interface FeedbackRequest {
  contactType: string;
  contactValue: string;
  message: string;
}

export interface FeedbackResponse {
  success: boolean;
  message?: string;
}

export const submitFeedback = createAsyncThunk<
  FeedbackResponse,
  FeedbackRequest
>("feedback/submit", async (data: FeedbackRequest, { rejectWithValue }) => {
  try {
    const response = await ky.post(`${API_URL}/feedback`, {
      json: data,
      timeout: 10000,
      hooks: {
        beforeError: [
          async (error) => {
            const { response } = error;
            if (response) {
              try {
                const body = await response.json<FeedbackResponse>();
                error.message = body.message || response.statusText;
              } catch (e) {
                error.message = response.statusText;
              }
            }
            return error;
          },
        ],
      },
    });

    return await response.json();
  } catch (error: any) {
    return rejectWithValue(error.message || "Failed to submit feedback");
  }
});
