import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/stores/auth-store';

export function useRequireAuth(requiredRole?: 'SUPER_ADMIN' | 'TENANT_USER', redirectTo?: string) {
  const router = useRouter();
  const { user, isAuthenticated, _hasHydrated } = useAuthStore();

  useEffect(() => {
    // Aguardar hydration do Zustand
    if (!_hasHydrated) {
      console.log('[useRequireAuth] Aguardando hydration...');
      return;
    }

    // Debug
    console.log('[useRequireAuth] Check:', {
      isAuthenticated,
      userRole: user?.role,
      requiredRole,
      hasHydrated: _hasHydrated,
    });

    // Se não autenticado, redirecionar
    if (!isAuthenticated) {
      console.log('[useRequireAuth] ❌ Não autenticado, redirecionando...');
      const loginPath = requiredRole === 'SUPER_ADMIN' ? '/admin/login' : '/painel/login';
      router.push(redirectTo || loginPath);
      return;
    }

    // Se requer role específica e não tem, redirecionar
    if (requiredRole && user?.role !== requiredRole) {
      console.log('[useRequireAuth] ❌ Role incorreta. Tem:', user?.role, 'Precisa:', requiredRole);
      const loginPath = requiredRole === 'SUPER_ADMIN' ? '/admin/login' : '/painel/login';
      router.push(loginPath);
      return;
    }

    console.log('[useRequireAuth] ✅ Auth OK!');
  }, [_hasHydrated, isAuthenticated, user, requiredRole, redirectTo, router]);

  // isReady é simplesmente: hydratou + autenticado + role correta
  const isReady = _hasHydrated && isAuthenticated && (!requiredRole || user?.role === requiredRole);

  return {
    isReady,
    user,
    isAuthenticated,
    hasHydrated: _hasHydrated,
  };
}

