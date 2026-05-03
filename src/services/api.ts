const BASE_URL = import.meta.env.VITE_API_URL;

class ApiService {
  private async request(endpoint: string, options: RequestInit = {}) {
    const url = `${BASE_URL}${endpoint}`;

    const config = {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    };

    try {
      const response = await fetch(url, config);
      const correlationId = response.headers.get('x-correlation-id');

      if (correlationId) console.log(`Trace ID: ${correlationId}`);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw { status: response.status, ...errorData };
      }

      return await response.json();
    } catch (error) {
      console.error("Fetch Error:", error);
      throw error;
    }
  }

  get(endpoint: string, options?: RequestInit) {
    return this.request(endpoint, { ...options, method: 'GET' });
  }

  public post(endpoint: string, body: FormData | object) {
    const isFormData = body instanceof FormData;

    const options: RequestInit = {
      method: 'POST',
      body: isFormData ? body : JSON.stringify(body),
      headers: {
        ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
      }
    };

    return this.request(endpoint, options);
  }
}

export const api = new ApiService();
