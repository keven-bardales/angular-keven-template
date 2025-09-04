// Development environment configuration
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000/api',
  apiTimeout: 10000,
  tokenStorageKey: 'auth_tokens',
  userStorageKey: 'auth_user',
  permissionsStorageKey: 'auth_permissions',
  refreshTokenThreshold: 300000, // 5 minutes in milliseconds
  enableDevLog: true,
};
