'use client';

import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, Zap, Shield, TrendingUp } from 'lucide-react';

export default function PrecosPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <div className="bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <Badge className="mb-4 bg-blue-600">Preços Transparentes</Badge>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Planos para Todos os Tamanhos
          </h1>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto">
            Comece grátis e escale conforme sua necessidade
          </p>
        </div>
      </div>

      {/* Planos */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {/* Free */}
          <Card className="border-2 hover:shadow-xl transition-shadow">
            <CardHeader>
              <CardTitle className="text-xl">Free</CardTitle>
              <CardDescription>Perfeito para testar e projetos pequenos</CardDescription>
              <div className="mt-4">
                <div className="text-3xl font-bold">R$ 0</div>
                <div className="text-slate-500 text-sm">/mês</div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                  <span><strong>1.000 requests/dia</strong></span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                  <span>3 APIs (CEP, CNPJ, Geografia)</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                  <span>Cache 3 camadas</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                  <span>Dashboard de uso</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                  <span>Documentação completa</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                  <span>Suporte via email</span>
                </li>
              </ul>
              <Button asChild className="w-full mt-4" variant="outline">
                <Link href="/painel/register">
                  Começar Grátis
                </Link>
              </Button>
            </CardContent>
          </Card>

          {/* Pro */}
          <Card className="border-2 border-blue-400 hover:shadow-xl transition-shadow relative">
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
              <Badge className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-3 py-1">
                Em Breve
              </Badge>
            </div>
            <CardHeader>
              <CardTitle className="text-xl">Pro</CardTitle>
              <CardDescription>Para aplicações em crescimento</CardDescription>
              <div className="mt-4">
                <div className="text-3xl font-bold">R$ 49</div>
                <div className="text-slate-500 text-sm">/mês</div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                  <span><strong>10.000 requests/dia</strong></span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                  <span>Acesso a TODAS as APIs</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                  <span>Cache prioritário</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                  <span>Dashboard avançado</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                  <span>Analytics em tempo real</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                  <span>Suporte prioritário</span>
                </li>
              </ul>
              <Button className="w-full mt-4" disabled>
                Em Breve
              </Button>
            </CardContent>
          </Card>

          {/* Business */}
          <Card className="border-4 border-purple-600 shadow-2xl relative hover:shadow-3xl transition-shadow">
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
              <Badge className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-3 py-1">
                Mais Popular
              </Badge>
            </div>
            <CardHeader>
              <CardTitle className="text-xl">Business</CardTitle>
              <CardDescription>Para empresas em crescimento</CardDescription>
              <div className="mt-4">
                <div className="text-3xl font-bold">R$ 149</div>
                <div className="text-slate-500 text-sm">/mês</div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-purple-600 flex-shrink-0 mt-0.5" />
                  <span><strong>100.000 requests/dia</strong></span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-purple-600 flex-shrink-0 mt-0.5" />
                  <span>TODAS as 36 APIs</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-purple-600 flex-shrink-0 mt-0.5" />
                  <span>Cache Redis L1 prioritário</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-purple-600 flex-shrink-0 mt-0.5" />
                  <span>APIs Premium (NF-e, Boletos)</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-purple-600 flex-shrink-0 mt-0.5" />
                  <span>Suporte WhatsApp prioritário</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-purple-600 flex-shrink-0 mt-0.5" />
                  <span>SLA de 99.5%</span>
                </li>
              </ul>
              <Button className="w-full mt-4 bg-purple-600 hover:bg-purple-700" disabled>
                Em Breve
              </Button>
            </CardContent>
          </Card>

          {/* Enterprise */}
          <Card className="border-2 border-slate-400 hover:shadow-xl transition-shadow">
            <CardHeader>
              <CardTitle className="text-xl">Enterprise</CardTitle>
              <CardDescription>Soluções personalizadas para grandes volumes</CardDescription>
              <div className="mt-4">
                <div className="text-3xl font-bold">Custom</div>
                <div className="text-slate-500 text-sm">sob consulta</div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-slate-600 flex-shrink-0 mt-0.5" />
                  <span><strong>Requests ilimitados</strong></span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-slate-600 flex-shrink-0 mt-0.5" />
                  <span>Todas as 36 APIs</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-slate-600 flex-shrink-0 mt-0.5" />
                  <span>Infraestrutura dedicada</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-slate-600 flex-shrink-0 mt-0.5" />
                  <span>White-label disponível</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-slate-600 flex-shrink-0 mt-0.5" />
                  <span>Suporte 24/7</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-slate-600 flex-shrink-0 mt-0.5" />
                  <span>SLA de 99.9%</span>
                </li>
              </ul>
              <Button asChild className="w-full mt-4" variant="outline">
                <Link href="/contato">
                  Falar com Vendas
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Status da Plataforma */}
        <div className="mt-16 max-w-4xl mx-auto">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Shield className="w-6 h-6 text-green-600" />
                <CardTitle>Status da Plataforma</CardTitle>
              </div>
              <CardDescription>Monitoramento em tempo real</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-3xl font-bold text-green-600 mb-1">99.9%</div>
                  <div className="text-sm text-slate-600">Uptime (últimos 30 dias)</div>
                </div>
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-3xl font-bold text-blue-600 mb-1">~160ms</div>
                  <div className="text-sm text-slate-600">Latência Média</div>
                  <div className="text-xs text-slate-500 mt-1">~1ms com Redis cache</div>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <div className="text-3xl font-bold text-purple-600 mb-1">3 APIs</div>
                  <div className="text-sm text-slate-600">Disponíveis Agora</div>
                  <div className="text-xs text-slate-500 mt-1">36 APIs no roadmap</div>
                </div>
              </div>
              
              <div className="mt-6 p-4 bg-slate-50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="font-semibold text-slate-700">Todos os sistemas operacionais</span>
                </div>
                <div className="text-sm text-slate-600 space-y-1">
                  <p>✅ API CEP: Operacional</p>
                  <p>✅ API CNPJ: Operacional</p>
                  <p>✅ API Geografia: Operacional</p>
                  <p>✅ Redis Cache: Operacional</p>
                  <p>✅ MongoDB: Operacional</p>
                </div>
              </div>

              <div className="mt-4 text-center">
                <p className="text-sm text-slate-500">
                  Última atualização: {new Date().toLocaleString('pt-BR')}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* FAQ Preços */}
        <div className="mt-16 max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-8">Perguntas Frequentes</h2>
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Posso mudar de plano a qualquer momento?</CardTitle>
              </CardHeader>
              <CardContent className="text-slate-600">
                Sim! Você pode fazer upgrade ou downgrade a qualquer momento. O valor é cobrado proporcionalmente.
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">O que acontece se eu exceder o limite?</CardTitle>
              </CardHeader>
              <CardContent className="text-slate-600">
                No plano Free, requests adicionais são bloqueadas até o dia seguir. Nos planos pagos, você pode configurar 
                limites maiores ou pagar por excedente (R$ 0,001 por request adicional).
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Quais as formas de pagamento?</CardTitle>
              </CardHeader>
              <CardContent className="text-slate-600">
                Aceitamos cartão de crédito, boleto e Pix. Pagamento mensal ou anual (10% de desconto).
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Tem contrato de fidelidade?</CardTitle>
              </CardHeader>
              <CardContent className="text-slate-600">
                Não! Você pode cancelar a qualquer momento. Sem multas ou taxas de cancelamento.
              </CardContent>
            </Card>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-16 text-center">
          <Card className="max-w-2xl mx-auto bg-gradient-to-r from-blue-600 to-purple-600 border-0 text-white">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold mb-4">Pronto para começar?</h3>
              <p className="text-lg text-blue-100 mb-6">
                Crie sua conta grátis e comece a integrar em minutos
              </p>
              <Button asChild size="lg" variant="secondary">
                <Link href="/painel/register">
                  Começar Grátis Agora
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

