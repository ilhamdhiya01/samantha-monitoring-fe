export interface ApiResponse<T> {
  data: T;
  message?: string;
}

export interface ErrorResponse {
  errors?: { field: string; message: string }[];
}
