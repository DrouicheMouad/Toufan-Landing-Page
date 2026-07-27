// Custom fetch wrapper for generated API client
export const customFetch = async <T>(
  url: string,
  options: RequestInit = {}
): Promise<T> => {
  // Uses VITE_API_URL in production, falls back to relative path for local dev
  const API_BASE_URL = import.meta.env.VITE_API_URL || '';

  const response = await fetch(`${API_BASE_URL}${url}`, {
    ...options,
    headers: {
      ...options.headers,
    },
  });

  if (!response.ok) {
    let errorBody: unknown;
    try {
      errorBody = await response.json();
    } catch {
      errorBody = await response.text();
    }

    throw {
      status: response.status,
      message: response.statusText,
      data: errorBody,
    };
  }

  if (response.status === 204) {
    return {} as T;
  }

  return response.json();
};

export type ErrorType<T> = {
  status: number;
  message: string;
  data: T;
};

export type BodyType<T> = T;