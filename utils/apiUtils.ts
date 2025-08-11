import { projectId } from '../utils/supabase/info';

export const apiRequest = async (
  endpoint: string,
  token: string,
  options: RequestInit = {}
): Promise<Response> => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 5000);

  try {
    const response = await fetch(
      `https://${projectId}.supabase.co/functions/v1/make-server-aff34bda${endpoint}`,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          ...options.headers
        },
        signal: controller.signal,
        ...options
      }
    );

    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    throw error;
  }
};

export const handleApiError = (error: any, context: string) => {
  console.error(`${context}:`, error);
};