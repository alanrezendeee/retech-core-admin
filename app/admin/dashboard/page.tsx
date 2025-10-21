'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/stores/auth-store';
import AdminLayout from '@/components/layouts/admin-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function AdminDashboardPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'SUPER_ADMIN') {
      router.push('/admin/login');
    }
  }, [isAuthenticated, user, router]);

  if (!isAuthenticated) {
    return null;
  }

  // Mock data - será substituído por dados reais da API
  const stats = {
    totalTenants: 0,
    totalAPIKeys: 0,
    requestsToday: 0,
    requestsMonth: 0,
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
          <p className="text-slate-500 mt-1">
            Visão geral do sistema Retech Core API
          </p>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Total de Tenants</CardDescription>
              <CardTitle className="text-4xl">
                {stats.totalTenants}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-slate-500">
                Empresas cadastradas
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardDescription>API Keys Ativas</CardDescription>
              <CardTitle className="text-4xl">
                {stats.totalAPIKeys}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-slate-500">
                Chaves em uso
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Requests Hoje</CardDescription>
              <CardTitle className="text-4xl">
                {stats.requestsToday.toLocaleString()}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-slate-500">
                Últimas 24 horas
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Requests Mês</CardDescription>
              <CardTitle className="text-4xl">
                {stats.requestsMonth.toLocaleString()}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-slate-500">
                Mês atual
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Status do Sistema */}
        <Card>
          <CardHeader>
            <CardTitle>Status do Sistema</CardTitle>
            <CardDescription>Monitoramento em tempo real</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">API Backend</span>
                <span className="text-sm text-green-600 font-semibold">● Online</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">MongoDB</span>
                <span className="text-sm text-green-600 font-semibold">● Conectado</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Rate Limiting</span>
                <span className="text-sm text-green-600 font-semibold">● Ativo</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Próximos Passos */}
        <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
          <CardHeader>
            <CardTitle>🚀 Bem-vindo, {user?.name}!</CardTitle>
            <CardDescription>
              O admin dashboard está sendo construído. Em breve você terá:
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center space-x-2">
                <span className="text-green-600">✓</span>
                <span>Gerenciamento completo de tenants</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="text-green-600">✓</span>
                <span>Criação e revogação de API Keys</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="text-green-600">✓</span>
                <span>Analytics avançado por tenant</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="text-green-600">✓</span>
                <span>Configuração de rate limits</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="text-green-600">✓</span>
                <span>Logs de uso em tempo real</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}

