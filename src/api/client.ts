import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";

const TOKEN_KEY = "mapio_api_token";

// VITE_API_URL overrides the default backend address (same host, port 8456)
export const API_URL: string =
  import.meta.env.VITE_API_URL || `http://${location.hostname}:8456`;

export const getToken = (): string | null => localStorage.getItem(TOKEN_KEY);

let tokenPrompt: Promise<string | null> | null = null;

// A single prompt is shared by all the requests failing at the same time
export function requestToken(): Promise<string | null> {
  tokenPrompt ??= Promise.resolve()
    .then(() => {
      const token = window.prompt("API token");
      if (token) localStorage.setItem(TOKEN_KEY, token);
      return token;
    })
    .finally(() => {
      tokenPrompt = null;
    });
  return tokenPrompt;
}

export const authHeaders = (): Record<string, string> => {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const api = axios.create({ baseURL: API_URL });

api.interceptors.request.use((config) => {
  Object.assign(config.headers, authHeaders());
  return config;
});

type RetryableConfig = InternalAxiosRequestConfig & { _retried?: boolean };

api.interceptors.response.use(undefined, async (error: AxiosError) => {
  const config = error.config as RetryableConfig | undefined;
  if (error.response?.status === 401 && config && !config._retried) {
    config._retried = true;
    const sentWithCurrentToken =
      config.headers.Authorization === authHeaders().Authorization;
    if (sentWithCurrentToken) {
      localStorage.removeItem(TOKEN_KEY);
      if (!(await requestToken())) return Promise.reject(error);
    }
    return api(config);
  }
  return Promise.reject(error);
});

export interface SseHandlers {
  onOpen?: () => void;
  onEvent: (event: string, data: string) => void;
}

// fetch is used instead of EventSource because EventSource cannot send an Authorization header
export async function streamSse(
  path: string,
  handlers: SseHandlers,
  signal: AbortSignal,
): Promise<void> {
  const response = await fetch(API_URL + path, {
    headers: authHeaders(),
    signal,
  });
  if (response.status === 401) {
    localStorage.removeItem(TOKEN_KEY);
    await requestToken();
    throw new Error("unauthorized");
  }
  if (!response.ok || !response.body) {
    throw new Error(`HTTP ${response.status}`);
  }
  handlers.onOpen?.();

  const reader = response.body.pipeThrough(new TextDecoderStream()).getReader();
  let buffer = "";
  for (;;) {
    const { value, done } = await reader.read();
    if (done) return;
    buffer += value;
    let end: number;
    while ((end = buffer.indexOf("\n\n")) >= 0) {
      const block = buffer.slice(0, end);
      buffer = buffer.slice(end + 2);
      let event = "message";
      const data: string[] = [];
      for (const line of block.split("\n")) {
        if (line.startsWith("event:")) event = line.slice(6).trim();
        else if (line.startsWith("data:")) data.push(line.slice(5).trimStart());
      }
      if (data.length) handlers.onEvent(event, data.join("\n"));
    }
  }
}
