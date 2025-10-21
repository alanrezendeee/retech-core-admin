'use client';

import { useEffect, useState } from 'react';
import { useRequireAuth } from '@/lib/hooks/use-auth';
import PainelLayout from '@/components/layouts/painel-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { getMyUsage } from '@/lib/api/tenant';

export default function PainelUsagePage() {
  const { isReady } = useRequireAuth('TENANT_USER');
  const [usage, setUsage] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isReady) {
      loadUsage();
    }
  }, [isReady]);

  const loadUsage = async () => {
    try {
      const data = await getMyUsage();
      setUsage(data);
    } catch (error) {
      console.error('Erro ao carregar uso:', error);
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

  const percentageToday = usage ? (usage.requestsToday / usage.dailyLimit) * 100 : 0;

  return (
    <PainelLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Uso da API</h1>
          <p className="text-slate-500 mt-1">
            Monitore seu consumo e limites
          </p>
        </div>

        {/* Limite Atual */}
        <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0">
          <CardHeader>
            <CardTitle className="text-white">Plano Free</CardTitle>
            <CardDescription className="text-blue-100">
              {usage?.dailyLimit?.toLocaleString() || 1000} requests por dia
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Uso hoje: {usage?.requestsToday || 0} / {usage?.dailyLimit || 1000}</span>
                <span>{percentageToday.toFixed(1)}%</span>
              </div>
              <div className="w-full bg-white/20 rounded-full h-3">
                <div
                  className="bg-white rounded-full h-3 transition-all duration-500"
                  style={{ width: `${Math.min(percentageToday, 100)}%` }}
                />
              </div>
              <div className="text-sm">
                <span className="font-semibold">{usage?.remaining || 0}</span> requests restantes hoje
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Total de Requests</CardDescription>
              <CardTitle className="text-4xl">
                {usage?.totalRequests?.toLocaleString() || 0}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-slate-500">Desde o início</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Requests Hoje</CardDescription>
              <CardTitle className="text-4xl">
                {usage?.requestsToday || 0}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-green-600 font-semibold">
                {usage?.remaining || 0} restantes
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Requests Mês</CardDescription>
              <CardTitle className="text-4xl">
                {usage?.requestsMonth?.toLocaleString() || 0}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-slate-500">
                Média: {usage?.requestsMonth ? Math.round(usage.requestsMonth / 30) : 0}/dia
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Uso por Dia */}
        <Card>
          <CardHeader>
            <CardTitle>Últimos 7 Dias</CardTitle>
            <CardDescription>Histórico de requests</CardDescription>
          </CardHeader>
          <CardContent>
            {usage?.byDay && usage.byDay.length > 0 ? (
              <div className="space-y-3">
                {usage.byDay.map((item: any) => (
                  <div key={item._id}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium">{item._id}</span>
                      <span className="text-sm text-slate-600">
                        {item.count.toLocaleString()} requests
                      </span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-full h-2"
                        style={{
                          width: `${(item.count / usage.dailyLimit) * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-slate-500 py-8">Nenhum uso registrado ainda</p>
            )}
          </CardContent>
        </Card>

        {/* Endpoints mais usados */}
        <Card>
          <CardHeader>
            <CardTitle>Endpoints Mais Usados</CardTitle>
            <CardDescription>Top 10 endpoints</CardDescription>
          </CardHeader>
          <CardContent>
            {usage?.byEndpoint && usage.byEndpoint.length > 0 ? (
              <div className="space-y-3">
                {usage.byEndpoint.map((item: any, index: number) => (
                  <div key={index} className="flex items-center justify-between">
                    <div>
                      <code className="text-sm bg-slate-100 px-2 py-1 rounded">
                        {item._id}
                      </code>
                    </div>
                    <span className="text-sm text-slate-600">
                      {item.count.toLocaleString()} requests
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-slate-500 py-8">Nenhum uso registrado ainda</p>
            )}
          </CardContent>
        </Card>
      </div>
    </PainelLayout>
  );
}

