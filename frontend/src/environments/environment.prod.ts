export const environment = {
  production: true,
  django: 'http://192.168.0.180',
  api: 'http://192.168.0.180/api',
  accessTokenExpireIn: 5 * 60 * 1000, // 5 mins
  refreshTokenExpireIn: 1 * 24 * 60 * 60 * 1000, // 1 days
};
