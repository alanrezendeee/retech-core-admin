import api from './client';

// Tenant - Minhas API Keys
export const getMyAPIKeys = async () => {
  const response = await api.get('/me/apikeys');
  return response.data;
};

// Tenant - Criar API Key
export const createMyAPIKey = async (name: string) => {
  const response = await api.post('/me/apikeys', { name });
  return response.data;
};

// Tenant - Deletar API Key
export const deleteMyAPIKey = async (keyId: string) => {
  const response = await api.delete(`/me/apikeys/${keyId}`);
  return response.data;
};

// Tenant - Meu uso
export const getMyUsage = async () => {
  const response = await api.get('/me/usage');
  return response.data;
};

