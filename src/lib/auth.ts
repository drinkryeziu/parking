export interface AuthUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
}

export function getToken(): string | null {
  return localStorage.getItem("parking_token");
}

export function setToken(token: string): void {
  localStorage.setItem("parking_token", token);
}

export function clearToken(): void {
  localStorage.removeItem("parking_token");
  localStorage.removeItem("parking_user");
}

export function getUser(): AuthUser | null {
  const raw = localStorage.getItem("parking_user");
  return raw ? JSON.parse(raw) : null;
}

export function setUser(user: AuthUser): void {
  localStorage.setItem("parking_user", JSON.stringify(user));
}
