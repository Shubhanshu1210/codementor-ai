export interface ReviewSubmitRequest {
  fileName: string;
  language: string;
  code: string;
}

export interface ReviewResponse {
  reviewId: number;
  fileName: string;
  language: string;
  bugDetection: string;
  codeSmells: string;
  performance: string;
  security: string;
  bestPractices: string;
  overallScore: number;
  message: string;
}
