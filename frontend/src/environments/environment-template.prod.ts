export const environment = {
    production: true,
    imageHost: 'http://${PUBLIC_IP}',
    django: 'http://${PUBLIC_IP}',
    api: 'http://${PUBLIC_IP}/api',
    accessTokenExpireIn: 5 * 60 * 1000, // 5 mins
    refreshTokenExpireIn: 1 * 24 * 60 * 60 * 1000, // 1 days
  };
  