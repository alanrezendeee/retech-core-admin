'use client';

import { useEffect } from 'react';
import AdminLayout from '@/components/layouts/admin-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useRequireAuth } from '@/lib/hooks/use-auth';
import { useDebugAuth } from '@/lib/hooks/use-debug-auth';
import { 
  Users, 
  Key, 
  Activity, 
  TrendingUp, 
  CheckCircle2, 
  AlertCircle,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export default function AdminDashboardPage() {
  const { isReady, user } = useRequireAuth('SUPER_ADMIN');
  useDebugAuth(); // Debug automático

  useEffect(() => {
    console.log('🏠 Dashboard montou. isReady:', isReady, 'user:', user);
  }, [isReady, user]);

  if (!isReady) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto"></div>
          <p className="mt-2 text-slate-600">Carregando...</p>
        </div>
      </div>
    );
  }

  // Mock data - será substituído por dados reais da API
  const stats = {
    totalTenants: 0,
    totalAPIKeys: 0,
    requestsToday: 0,
    requestsMonth: 0,
    tenantsGrowth: 0, // % de crescimento
    keysGrowth: 0,
    requestsGrowth: 0,
  };

  const kpiCards = [
    {
      title: 'Total de Tenants',
      value: stats.totalTenants,
      description: 'Empresas cadastradas',
      icon: Users,
      trend: stats.tenantsGrowth,
      color: 'blue',
    },
    {
      title: 'API Keys Ativas',
      value: stats.totalAPIKeys,
      description: 'Chaves em uso',
      icon: Key,
      trend: stats.keysGrowth,
      color: 'purple',
    },
    {
      title: 'Requests Hoje',
      value: stats.requestsToday.toLocaleString(),
      description: 'Últimas 24 horas',
      icon: Activity,
      trend: stats.requestsGrowth,
      color: 'green',
    },
    {
      title: 'Requests Mês',
      value: stats.requestsMonth.toLocaleString(),
      description: 'Mês atual',
      icon: TrendingUp,
      trend: 0,
      color: 'orange',
    },
  ];

  const getColorClasses = (color: string) => {
    const colors: Record<string, { bg: string; text: string; icon: string }> = {
      blue: { bg: 'bg-blue-50', text: 'text-blue-600', icon: 'bg-blue-100' },
      purple: { bg: 'bg-purple-50', text: 'text-purple-600', icon: 'bg-purple-100' },
      green: { bg: 'bg-green-50', text: 'text-green-600', icon: 'bg-green-100' },
      orange: { bg: 'bg-orange-50', text: 'text-orange-600', icon: 'bg-orange-100' },
    };
    return colors[color] || colors.blue;
  };

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
          <p className="text-slate-500 mt-1">
            Visão geral do sistema Retech Core API
          </p>
        </div>

        {/* KPIs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {kpiCards.map((kpi, index) => {
            const Icon = kpi.icon;
            const colors = getColorClasses(kpi.color);
            const isPositive = kpi.trend > 0;
            const hasChange = kpi.trend !== 0;

            return (
              <Card key={index} className="hover:shadow-lg transition-shadow duration-200 border-slate-200">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-slate-500 mb-1">
                        {kpi.title}
                      </p>
                      <h3 className="text-3xl font-bold text-slate-900 mb-1">
                        {kpi.value}
                      </h3>
                      <div className="flex items-center gap-2">
                        <p className="text-xs text-slate-500">
                          {kpi.description}
                        </p>
                        {hasChange && (
                          <div className={`flex items-center gap-0.5 text-xs font-semibold ${
                            isPositive ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {isPositive ? (
                              <ArrowUpRight className="w-3 h-3" />
                            ) : (
                              <ArrowDownRight className="w-3 h-3" />
                            )}
                            {Math.abs(kpi.trend)}%
                          </div>
                        )}
                      </div>
                    </div>
                    <div className={`p-3 rounded-xl ${colors.icon}`}>
                      <Icon className={`w-6 h-6 ${colors.text}`} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Grid 2 colunas */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Status do Sistema */}
          <Card className="border-slate-200">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg">Status do Sistema</CardTitle>
                  <CardDescription>Monitoramento em tempo real</CardDescription>
                </div>
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                  <CheckCircle2 className="w-3 h-3 mr-1" />
                  Operacional
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                    <span className="text-sm font-medium text-slate-700">API Backend</span>
                  </div>
                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 text-xs">
                    Online
                  </Badge>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                    <span className="text-sm font-medium text-slate-700">MongoDB</span>
                  </div>
                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 text-xs">
                    Conectado
                  </Badge>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                    <span className="text-sm font-medium text-slate-700">Rate Limiting</span>
                  </div>
                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 text-xs">
                    Ativo
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Atividade Recente */}
          <Card className="border-slate-200">
            <CardHeader>
              <CardTitle className="text-lg">Atividade Recente</CardTitle>
              <CardDescription>Últimas ações no sistema</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start gap-3 p-3 rounded-lg bg-slate-50">
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                    <Users className="w-4 h-4 text-blue-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-900">Nenhuma atividade ainda</p>
                    <p className="text-xs text-slate-500 mt-0.5">Aguardando primeiros cadastros</p>
                  </div>
                  <span className="text-xs text-slate-400 flex-shrink-0">Agora</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Card de Boas-vindas */}
        <Card className="border-blue-200 bg-gradient-to-br from-blue-50 via-purple-50 to-blue-50">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 shadow-lg">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-slate-900 mb-2">
                  🚀 Bem-vindo, {user?.name}!
                </h3>
                <p className="text-sm text-slate-600 mb-4">
                  Sua plataforma está pronta. Aqui está o que você pode fazer:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-slate-700">Gerenciar tenants e desenvolvedores</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-slate-700">Criar e revogar API Keys</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-slate-700">Monitorar uso e analytics</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-slate-700">Configurar rate limits</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
