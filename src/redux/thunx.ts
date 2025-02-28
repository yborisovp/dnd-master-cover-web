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
    return await ky.get(`${API_URL}/enemy?${queryParams}`).json<EnemyData>();
  }
);
