const BASE_URL = import.meta.env.VITE_API_URL;

class ApiService {

  private getCache(key: string) {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  }

  private setCache(key: string, data: unknown) {
    localStorage.setItem(key, JSON.stringify(data));
  }

  private async request(endpoint: string, options: RequestInit = {}, useCache = false) {
    const url = `${BASE_URL}${endpoint}`;

    if (useCache && options.method === 'GET') {
      const cachedData = this.getCache(endpoint);
      if (cachedData) {
        console.log(`[Cache] Retornando datos de: ${endpoint}`);
        return cachedData;
      }
    }

    const config = {
      ...options,
      headers: {
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

      const data = await response.json();

      if (useCache) this.setCache(endpoint, data);

      return data;
    } catch (error) {
      console.error("Fetch Error:", error);
      throw error;
    }
  }

  get(endpoint: string, useCache = true, options?: RequestInit) {
    return this.request(endpoint, { ...options, method: 'GET' }, useCache);
  }

  // public post(endpoint: string, body: FormData | object) {
  //   const isFormData = body instanceof FormData;

  //   const options: RequestInit = {
  //     method: 'POST',
  //     body: isFormData ? body : JSON.stringify(body),
  //     headers: {
  //       ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
  //     }
  //   };

  //   const metrics = this.request(endpoint, options);
  //   this.setCache("metrics", metrics);

  //   return metrics;
  // }

  public uploadWithProgress(
    endpoint: string,
    formData: FormData,
    onProgress: (percent: number) => void
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ): Promise<any> {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      const url = `${BASE_URL}${endpoint}`;

      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const percent = Math.round((event.loaded * 100) / event.total);
          onProgress(percent);
        }
      };

      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          const data = JSON.parse(xhr.responseText);
          this.setCache("metrics", data);
          resolve(data);
        } else {
          const errorData = JSON.parse(xhr.responseText || '{}');
          reject({ status: xhr.status, ...errorData });
        }
      };

      xhr.onerror = () => reject(new Error("Error de red"));

      xhr.open('POST', url);
      xhr.send(formData);
    });
  }
}

export const api = new ApiService();
