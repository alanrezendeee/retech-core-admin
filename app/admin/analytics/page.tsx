'use client';

import { useEffect, useState } from 'react';
import { useRequireAuth } from '@/lib/hooks/use-auth';
import AdminLayout from '@/components/layouts/admin-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { getAdminStats, getAdminUsage } from '@/lib/api/admin';
import { 
  Activity, 
  TrendingUp, 
  Users, 
  Key,
  BarChart3,
  Calendar,
  Hash
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { EmptyState } from '@/components/ui/empty-state';

export default function AdminAnalyticsPage() {
  const { isReady } = useRequireAuth('SUPER_ADMIN');
  const [stats, setStats] = useState<any>(null);
  const [usage, setUsage] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isReady) {
      loadData();
    }
  }, [isReady]);

  const loadData = async () => {
    try {
      const [statsData, usageData] = await Promise.all([
        getAdminStats(),
        getAdminUsage(),
      ]);
      setStats(statsData);
      setUsage(usageData);
    } catch (error) {
      console.error('Erro ao carregar analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isReady || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto"></div>
          <p className="mt-2 text-slate-600">Carregando analytics...</p>
        </div>
      </div>
    );
  }

  const kpiCards = [
    {
      title: 'Requests Hoje',
      value: stats?.requestsToday?.toLocaleString() || '0',
      description: 'Últimas 24 horas',
      icon: Activity,
      color: 'green',
    },
    {
      title: 'Requests Mês',
      value: stats?.requestsMonth?.toLocaleString() || '0',
      description: 'Mês atual',
      icon: TrendingUp,
      color: 'blue',
    },
    {
      title: 'Tenants Ativos',
      value: stats?.activeTenants || '0',
      description: 'Com API keys',
      icon: Users,
      color: 'purple',
    },
    {
      title: 'API Keys Ativas',
      value: stats?.activeAPIKeys || '0',
      description: 'Não revogadas',
      icon: Key,
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

  const hasUsageData = usage?.byEndpoint && usage.byEndpoint.length > 0;
  const hasDailyData = usage?.byDay && usage.byDay.length > 0;

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600">
              <BarChart3 className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-slate-900">Analytics</h1>
          </div>
          <p className="text-slate-500">
            Análise detalhada do uso da API e padrões de consumo
          </p>
        </div>

        {/* KPIs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {kpiCards.map((kpi, index) => {
            const Icon = kpi.icon;
            const colors = getColorClasses(kpi.color);

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
                      <p className="text-xs text-slate-500">
                        {kpi.description}
                      </p>
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
          {/* Top Endpoints */}
          <Card className="border-slate-200">
            <CardHeader>
              <div className="flex items-center gap-2 mb-1">
                <Hash className="w-5 h-5 text-blue-600" />
                <CardTitle className="text-lg">Top Endpoints</CardTitle>
              </div>
              <CardDescription>Endpoints mais utilizados</CardDescription>
            </CardHeader>
            <CardContent>
              {hasUsageData ? (
                <div className="space-y-4">
                  {usage.byEndpoint.map((item: any, index: number) => {
                    const percentage = (item.count / usage.byEndpoint[0].count) * 100;
                    const rankColors = ['text-yellow-600', 'text-slate-400', 'text-orange-600'];
                    const rankColor = rankColors[index] || 'text-slate-400';

                    return (
                      <div key={index} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className={`text-2xl font-bold ${rankColor}`}>
                              #{index + 1}
                            </div>
                            <div>
                              <div className="font-mono text-sm font-semibold text-slate-900">
                                {item._id}
                              </div>
                              <div className="text-xs text-slate-500">
                                {item.count.toLocaleString()} requests
                              </div>
                            </div>
                          </div>
                          <Badge variant="outline" className="text-xs">
                            {percentage.toFixed(0)}%
                          </Badge>
                        </div>
                        <div className="w-full bg-slate-100 rounded-full h-2">
                          <div
                            className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-full h-2 transition-all duration-300"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <EmptyState
                  icon={BarChart3}
                  title="Nenhum dado ainda"
                  description="Os endpoints mais acessados aparecerão aqui quando houver uso da API"
                />
              )}
            </CardContent>
          </Card>

          {/* Últimos 7 Dias */}
          <Card className="border-slate-200">
            <CardHeader>
              <div className="flex items-center gap-2 mb-1">
                <Calendar className="w-5 h-5 text-purple-600" />
                <CardTitle className="text-lg">Últimos 7 Dias</CardTitle>
              </div>
              <CardDescription>Requests por dia</CardDescription>
            </CardHeader>
            <CardContent>
              {hasDailyData ? (
                <div className="space-y-3">
                  {usage.byDay.map((item: any, index: number) => {
                    const maxCount = Math.max(...usage.byDay.map((d: any) => d.count));
                    const percentage = (item.count / maxCount) * 100;
                    
                    // ✅ Verificar se é hoje comparando no timezone local (Brasil)
                    const now = new Date();
                    const todayLocal = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
                    const isToday = item._id === todayLocal;
                    
                    // ✅ Formatar data de forma amigável
                    const date = new Date(item._id + 'T00:00:00');
                    const formattedDate = date.toLocaleDateString('pt-BR', {
                      day: '2-digit',
                      month: 'short'
                    });
                    
                    // ✅ Se for ontem ou hoje, mostrar relativo
                    const yesterday = new Date(now);
                    yesterday.setDate(yesterday.getDate() - 1);
                    const yesterdayLocal = `${yesterday.getFullYear()}-${String(yesterday.getMonth() + 1).padStart(2, '0')}-${String(yesterday.getDate()).padStart(2, '0')}`;
                    const isYesterday = item._id === yesterdayLocal;
                    
                    const displayDate = isToday ? 'Hoje' : isYesterday ? 'Ontem' : formattedDate;

                    return (
                      <div key={item._id} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className={`text-sm font-medium ${isToday ? 'text-blue-700' : 'text-slate-700'}`}>
                              {displayDate}
                            </span>
                            {!isToday && !isYesterday && (
                              <span className="text-xs text-slate-500">
                                ({item._id})
                              </span>
                            )}
                          </div>
                          <span className="text-sm font-semibold text-slate-900">
                            {item.count.toLocaleString()}
                          </span>
                        </div>
                        <div className="w-full bg-slate-100 rounded-full h-2">
                          <div
                            className={`rounded-full h-2 transition-all duration-300 ${
                              isToday 
                                ? 'bg-gradient-to-r from-blue-600 to-purple-600' 
                                : 'bg-slate-400'
                            }`}
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <EmptyState
                  icon={Calendar}
                  title="Nenhum histórico"
                  description="O histórico de uso dos últimos 7 dias será exibido aqui"
                />
              )}
            </CardContent>
          </Card>
        </div>

        {/* Card Informativo */}
        {!hasUsageData && !hasDailyData && (
          <Card className="border-blue-200 bg-gradient-to-br from-blue-50 via-purple-50 to-blue-50">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 shadow-lg">
                  <BarChart3 className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">
                    📊 Analytics em tempo real
                  </h3>
                  <p className="text-sm text-slate-600 mb-4">
                    Assim que sua API começar a receber requisições, você verá aqui:
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-1.5"></div>
                      <span className="text-sm text-slate-700">Rankings de endpoints mais usados</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-1.5"></div>
                      <span className="text-sm text-slate-700">Histórico de uso por dia</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-1.5"></div>
                      <span className="text-sm text-slate-700">Padrões de consumo por tenant</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-1.5"></div>
                      <span className="text-sm text-slate-700">Métricas de performance</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </AdminLayout>
  );
}
