import { useEffect } from 'react';
import { useAuthStore } from '@/lib/stores/auth-store';

export function useDebugAuth() {
  const state = useAuthStore();

  useEffect(() => {
    console.log('🔍 DEBUG AUTH STATE:', {
      isAuthenticated: state.isAuthenticated,
      hasUser: !!state.user,
      userRole: state.user?.role,
      hasAccessToken: !!state.accessToken,
      hasRefreshToken: !!state.refreshToken,
      hasHydrated: state._hasHydrated,
      localStorage: {
        accessToken: typeof window !== 'undefined' ? !!localStorage.getItem('accessToken') : null,
        user: typeof window !== 'undefined' ? !!localStorage.getItem('user') : null,
      }
    });

    // Verificar se há divergência entre localStorage e Zustand
    if (typeof window !== 'undefined' && state._hasHydrated) {
      const localToken = localStorage.getItem('accessToken');
      const localUser = localStorage.getItem('user');
      
      if (localToken && localUser && !state.isAuthenticated) {
        console.error('⚠️ DIVERGÊNCIA: localStorage tem dados mas Zustand diz não autenticado!');
        console.log('Local token:', localToken.substring(0, 20) + '...');
        console.log('Local user:', JSON.parse(localUser));
        console.log('Zustand isAuthenticated:', state.isAuthenticated);
      }
    }
  }, [state]);

  return state;
}

