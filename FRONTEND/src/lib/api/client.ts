const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "";

interface RequestOptions extends RequestInit {
  timeout?: number;
}

class ApiError extends Error {
  status: number;
  info?: unknown;

  constructor(message: string, status: number, info?: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.info = info;
  }
}

async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const url = `${BASE_URL.replace(/\/$/, "")}/${path.replace(/^\//, "")}`;
  
  const headers = new Headers(options.headers);
  if (!headers.has("Content-Type") && !(options.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }
  
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("aegis_token");
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
  }

  const { timeout = 10000, ...init } = options;
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      ...init,
      headers,
      signal: controller.signal,
    });
    
    clearTimeout(id);

    let data: unknown = null;
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      data = await response.json();
    } else {
      data = await response.text();
    }

    if (!response.ok) {
      throw new ApiError(
        typeof data === "object" && data !== null && "message" in data
          ? String((data as { message: string }).message)
          : `API request failed with status ${response.status}`,
        response.status,
        data
      );
    }

    return data as T;
  } catch (error: unknown) {
    clearTimeout(id);
    if (error instanceof Error && error.name === "AbortError") {
      throw new Error("Request timed out");
    }
    throw error;
  }
}

export const client = {
  get: <T>(path: string, options?: RequestOptions) => 
    request<T>(path, { ...options, method: "GET" }),
    
  post: <T>(path: string, body?: unknown, options?: RequestOptions) => 
    request<T>(path, { 
      ...options, 
      method: "POST", 
      body: body ? JSON.stringify(body) : undefined 
    }),
    
  put: <T>(path: string, body?: unknown, options?: RequestOptions) => 
    request<T>(path, { 
      ...options, 
      method: "PUT", 
      body: body ? JSON.stringify(body) : undefined 
    }),
    
  patch: <T>(path: string, body?: unknown, options?: RequestOptions) => 
    request<T>(path, { 
      ...options, 
      method: "PATCH", 
      body: body ? JSON.stringify(body) : undefined 
    }),
    
  delete: <T>(path: string, options?: RequestOptions) => 
    request<T>(path, { ...options, method: "DELETE" }),
};
