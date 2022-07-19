export interface TokenPair {
  access: AccessToken;
  refresh: RefreshToken;
}
export type AccessToken = string;
export type RefreshToken = string;
export interface AuthError {
  detail: string;
}
export type UNIXTime = number;
export type ObjectWrapAccessToken = {
  access: AccessToken;
};
