import { v4 as uuidv4 } from "uuid";

/**
 * Utility function for making API calls with correlation ID for tracking issues
 */
export const apiCall = async (endpoint: string, options: RequestInit = {}) => {
  const correlationId = uuidv4();
  const headers = {
    "Content-Type": "application/json",
    "x-correlation-id": correlationId,
    ...options.headers,
  };

  const baseUrl = window.env?.VITE_API_URL || "";
  const url = baseUrl ? `${baseUrl}/api${endpoint}` : `/api${endpoint}`;

  return fetch(url, {
    ...options,
    headers,
  });
};

export default apiCall;
