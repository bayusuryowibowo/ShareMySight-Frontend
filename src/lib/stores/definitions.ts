export interface VisibilityState {
  isVisible: boolean
}

export interface AuthState {
  isLoggedIn: boolean
  access_token: string | null
}