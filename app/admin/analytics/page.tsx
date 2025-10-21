'use client';

import { useEffect, useState } from 'react';
import { useRequireAuth } from '@/lib/hooks/use-auth';
import AdminLayout from '@/components/layouts/admin-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { getAdminStats, getAdminUsage } from '@/lib/api/admin';

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
        <div className="animate-spin h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Analytics</h1>
          <p className="text-slate-500 mt-1">
            Métricas e uso da API em tempo real
          </p>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Requests Hoje</CardDescription>
              <CardTitle className="text-4xl">
                {stats?.requestsToday?.toLocaleString() || 0}
              </CardTitle>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Requests Mês</CardDescription>
              <CardTitle className="text-4xl">
                {stats?.requestsMonth?.toLocaleString() || 0}
              </CardTitle>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Tenants Ativos</CardDescription>
              <CardTitle className="text-4xl">
                {stats?.activeTenants || 0}
              </CardTitle>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardDescription>API Keys Ativas</CardDescription>
              <CardTitle className="text-4xl">
                {stats?.activeAPIKeys || 0}
              </CardTitle>
            </CardHeader>
          </Card>
        </div>

        {/* Uso por Endpoint */}
        <Card>
          <CardHeader>
            <CardTitle>Top Endpoints</CardTitle>
            <CardDescription>Endpoints mais utilizados</CardDescription>
          </CardHeader>
          <CardContent>
            {usage?.byEndpoint && usage.byEndpoint.length > 0 ? (
              <div className="space-y-4">
                {usage.byEndpoint.map((item: any, index: number) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="text-2xl font-bold text-slate-400">
                        #{index + 1}
                      </div>
                      <div>
                        <div className="font-mono text-sm font-semibold">{item._id}</div>
                        <div className="text-xs text-slate-500">
                          {item.count.toLocaleString()} requests
                        </div>
                      </div>
                    </div>
                    <div className="w-48 bg-slate-200 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-full h-2"
                        style={{
                          width: `${(item.count / usage.byEndpoint[0].count) * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-slate-500 py-8">Nenhum dado de uso ainda</p>
            )}
          </CardContent>
        </Card>

        {/* Uso por Dia */}
        <Card>
          <CardHeader>
            <CardTitle>Últimos 7 Dias</CardTitle>
            <CardDescription>Requests por dia</CardDescription>
          </CardHeader>
          <CardContent>
            {usage?.byDay && usage.byDay.length > 0 ? (
              <div className="space-y-2">
                {usage.byDay.map((item: any) => (
                  <div key={item._id} className="flex items-center justify-between">
                    <span className="text-sm font-medium">{item._id}</span>
                    <span className="text-sm text-slate-600">
                      {item.count.toLocaleString()} requests
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-slate-500 py-8">Nenhum dado de uso ainda</p>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}

