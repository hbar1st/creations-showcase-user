export function setToken(token) {
  localStorage.setItem("cs-hb-jwt-2", token);
}

export function getToken() {
  return localStorage.getItem("cs-hb-jwt-2");
}

export function clearToken() {
  console.trace("clearToken");
  localStorage.removeItem("cs-hb-jwt-2");
}
