import axios from 'axios';

export function errorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as { message?: string } | undefined;
    return data?.message || error.message || 'The request failed.';
  }
  return error instanceof Error ? error.message : 'An unexpected error occurred.';
}
