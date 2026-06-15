import axios from 'axios';

export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface ApiError {
  success: false;
  message: string;
  errors?: { field: string; message: string }[];
}

export interface ApiResponse<T> {
  success: true;
  message: string;
  data: T;
}
