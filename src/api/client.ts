const BASE_URL = 'https://dummyjson.com';

export class APIError extends Error {
  constructor(
    public readonly status: number,
    message: string,
  ) {
    super(message);
    this.name = 'APIError';
  }
}

async function request<T>(path: string): Promise<T> {
  const response = await fetch(`${BASE_URL}${path}`);
  if (!response.ok) {
    throw new APIError(response.status, `HTTP ${response.status}: ${response.statusText}`);
  }
  return response.json() as Promise<T>;
}

export default request;
