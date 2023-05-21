export interface BaseResponse<T> {
  timestamp: Date;
  success: boolean;
  errorCode?: number;
  message?: string;
  data?: T;
  error?: any;
}
