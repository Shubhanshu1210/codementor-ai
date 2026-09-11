import apiClient from './client';
import type { ReviewResponse, ReviewSubmitRequest } from '../types/review';

export async function submitReview(request: ReviewSubmitRequest): Promise<ReviewResponse> {
  const response = await apiClient.post<ReviewResponse>('/api/review/submit', request);
  return response.data;
}

export async function getReviewHistory(): Promise<ReviewResponse[]> {
  const response = await apiClient.get<ReviewResponse[]>('/api/review/history');
  return response.data;
}

export async function getReviewById(reviewId: number): Promise<ReviewResponse> {
  const response = await apiClient.get<ReviewResponse>(`/api/review/${reviewId}`);
  return response.data;
}
