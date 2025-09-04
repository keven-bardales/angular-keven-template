// Production environment configuration
export const environment = {
  production: true,
  apiUrl: 'https://your-production-api.com/api/v1', // Update with your production API URL
  apiTimeout: 15000,
  tokenStorageKey: 'auth_tokens',
  userStorageKey: 'auth_user',
  permissionsStorageKey: 'auth_permissions',
  refreshTokenThreshold: 300000, // 5 minutes in milliseconds
  enableDevLog: false
};