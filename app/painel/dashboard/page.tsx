'use client';

import { useRequireAuth } from '@/lib/hooks/use-auth';
import PainelLayout from '@/components/layouts/painel-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export default function PainelDashboardPage() {
  const { isReady, user } = useRequireAuth('TENANT_USER');

  if (!isReady) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-indigo-600 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  // Mock data - será substituído por dados reais da API
  const usage = {
    requestsToday: 0,
    requestsMonth: 0,
    dailyLimit: 1000,
    monthlyLimit: 30000,
  };

  const percentageToday = (usage.requestsToday / usage.dailyLimit) * 100;

  return (
    <PainelLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">
              Bem-vindo de volta! 👋
            </h1>
            <p className="text-slate-500 mt-1">
              Gerencie suas API Keys e monitore o uso
            </p>
          </div>
          <Button className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700">
            + Nova API Key
          </Button>
        </div>

        {/* Plano Atual */}
        <Card className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white border-0">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-white">Plano Free</CardTitle>
                <CardDescription className="text-indigo-100">
                  1.000 requests por dia • Grátis para sempre
                </CardDescription>
              </div>
              <Badge className="bg-white/20 text-white border-white/30">
                Ativo
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Uso hoje: {usage.requestsToday} / {usage.dailyLimit}</span>
                <span>{percentageToday.toFixed(1)}%</span>
              </div>
              <div className="w-full bg-white/20 rounded-full h-2">
                <div
                  className="bg-white rounded-full h-2 transition-all duration-500"
                  style={{ width: `${Math.min(percentageToday, 100)}%` }}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Requests Hoje</CardDescription>
              <CardTitle className="text-4xl">{usage.requestsToday}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-green-600 font-semibold">
                {usage.dailyLimit - usage.requestsToday} restantes
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Requests Mês</CardDescription>
              <CardTitle className="text-4xl">{usage.requestsMonth}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-slate-500">
                Média: {Math.round(usage.requestsMonth / 30)} por dia
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardDescription>API Keys Ativas</CardDescription>
              <CardTitle className="text-4xl">0</CardTitle>
            </CardHeader>
            <CardContent>
              <Button variant="link" className="text-xs p-0 h-auto text-indigo-600">
                Criar primeira key →
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Getting Started */}
        <Card>
          <CardHeader>
            <CardTitle>🚀 Primeiros Passos</CardTitle>
            <CardDescription>Configure sua API em minutos</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start space-x-4">
                <div className="h-8 w-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-sm">
                  1
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-slate-900">Crie sua primeira API Key</h4>
                  <p className="text-sm text-slate-600">
                    Gere uma chave de acesso para começar a usar a API
                  </p>
                  <Button variant="link" className="p-0 h-auto mt-1">
                    Criar agora →
                  </Button>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="h-8 w-8 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center font-bold text-sm">
                  2
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-slate-900">Leia a documentação</h4>
                  <p className="text-sm text-slate-600">
                    Veja exemplos de código e endpoints disponíveis
                  </p>
                  <Button variant="link" className="p-0 h-auto mt-1">
                    Ver docs →
                  </Button>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="h-8 w-8 rounded-full bg-pink-100 text-pink-600 flex items-center justify-center font-bold text-sm">
                  3
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-slate-900">Faça sua primeira requisição</h4>
                  <p className="text-sm text-slate-600">
                    Teste os endpoints e veja a mágica acontecer!
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </PainelLayout>
  );
}

