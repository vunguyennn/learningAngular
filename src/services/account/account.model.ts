export interface Account {
  username: string;
  password: string;
}

export interface LoginRes {
  accessToken: string;
  refreshToken: string;
}

export interface refreshToken {
  refreshToken: string;
}

export const ACCESS_TOKEN = 'ACCESS_TOKEN';
export const REFRESH_TOKEN = 'REFRESH_TOKEN';
