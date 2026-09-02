// One source of truth for browser-to-API addresses.  Set REACT_APP_API_URL to
// the public API base (for example https://api.example.com/api) when deploying.
export const API_URL = (process.env.REACT_APP_API_URL || "http://127.0.0.1:8000/api").replace(/\/$/, "");

// A dedicated value is useful when the websocket is served by a different
// gateway.  Otherwise derive the secure websocket origin from the API URL.
const configuredWsUrl = process.env.REACT_APP_WS_URL;
const browserWsOrigin = typeof window !== "undefined"
  ? `${window.location.protocol === "https:" ? "wss" : "ws"}://${window.location.host}`
  : "ws://127.0.0.1:8000";

// Relative `/api` works behind the production Nginx proxy. For it, construct
// an absolute WebSocket origin; WebSocket does not accept a relative URL.
export const WS_URL = (configuredWsUrl
  ? (configuredWsUrl.startsWith("/") ? `${browserWsOrigin}${configuredWsUrl}` : configuredWsUrl)
  : (API_URL.startsWith("/") ? `${browserWsOrigin}${API_URL}` : API_URL.replace(/^http/, "ws"))
).replace(/\/$/, "");

export const apiUrl = (path = "") => `${API_URL}${path}`;
export const wsUrl = (path = "") => `${WS_URL}${path}`;
