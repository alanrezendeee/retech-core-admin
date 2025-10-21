import api from './client';

// Admin - Stats globais
export const getAdminStats = async () => {
  const response = await api.get('/admin/stats');
  return response.data;
};

// Admin - Lista todos os tenants
export const listAllTenants = async () => {
  const response = await api.get('/admin/tenants');
  return response.data;
};

// Admin - Lista todas API keys
export const listAllAPIKeys = async () => {
  const response = await api.get('/admin/apikeys');
  return response.data;
};

// Admin - Uso da API
export const getAdminUsage = async () => {
  const response = await api.get('/admin/usage');
  return response.data;
};

// Admin - Atividade recente
export const getRecentActivity = async (limit = 20) => {
  const response = await api.get(`/admin/activity?limit=${limit}`);
  return response.data;
};

