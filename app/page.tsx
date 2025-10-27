'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface ContactInfo {
  whatsapp: string;
  email: string;
  phone: string;
}

export default function HomePage() {
  const [contact, setContact] = useState<ContactInfo | null>(null);

  useEffect(() => {
    // Buscar informações de contato
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
    
    fetch(`${apiUrl}/public/contact`)
      .then(res => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then(data => {
        setContact(data);
        console.log('✅ Contato carregado:', data);
      })
      .catch(err => {
        console.error('❌ Erro ao carregar contato:', err);
        // Fallback: usar valores padrão
        setContact({
          whatsapp: '48999616679',
          email: 'suporte@theretech.com.br',
          phone: '+55 48 99961-6679'
        });
      });
  }, []);

  const whatsappLink = contact?.whatsapp 
    ? `https://wa.me/55${contact.whatsapp}?text=Olá! Gostaria de saber mais sobre a Retech Core API`
    : '#';

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <div className="inline-block mb-6">
            <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center shadow-2xl mx-auto">
              <svg className="w-12 h-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
          </div>
          
          <div className="mb-4">
            <p className="text-2xl md:text-3xl font-bold text-blue-400 mb-2">The Retech Core</p>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
            O Hub Definitivo de APIs Brasileiras
          </h1>
          <p className="text-xl md:text-2xl text-slate-300 mb-4 max-w-3xl mx-auto">
            36 APIs essenciais em uma única plataforma
          </p>
          <p className="text-lg text-slate-400 mb-8 max-w-2xl mx-auto">
            ⚡ Respostas em ~160ms com cache inteligente
            <br />
            🔄 Fallback automático entre 3 fontes de dados
            <br />
            <span className="text-blue-400 font-semibold mt-2 inline-block">✅ Completo • ✅ Confiável • ✅ Rápido • 🎁 1.000 requests/dia grátis</span>
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/painel/register">
              <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white text-lg px-8 py-6 shadow-lg">
                Começar Grátis
              </Button>
            </Link>
            <Link href="/painel/login">
              <Button 
                size="lg" 
                className="text-lg px-8 py-6 border-2 border-white/30 text-white hover:bg-white/10 hover:border-white/50 bg-white/5 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all"
              >
                Fazer Login
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* APIs Disponíveis + Playground/Ferramentas */}
      <section className="py-16 bg-white border-y-4 border-indigo-100">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white text-sm px-4 py-1">
              ✨ Disponível Agora
            </Badge>
            <h2 className="text-4xl font-bold mb-4 text-slate-900">
              Comece a Usar <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">Imediatamente</span>
            </h2>
            <p className="text-lg text-slate-600 max-w-3xl mx-auto">
              Teste nossas APIs gratuitamente, sem cadastro. Veja funcionando em tempo real e copie o código pronto para seu projeto.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto mb-8">
            {/* Playground */}
            <Link href="/playground">
              <Card className="border-2 border-indigo-200 hover:border-indigo-400 hover:shadow-2xl transition-all cursor-pointer h-full group">
                <CardHeader className="text-center">
                  <div className="text-5xl mb-3 group-hover:scale-110 transition-transform">🎮</div>
                  <CardTitle className="text-xl mb-2 text-indigo-600">API Playground</CardTitle>
                  <CardDescription className="text-sm">
                    Teste <strong>CEP, CNPJ e Geografia</strong> diretamente no navegador. Sem cadastro!
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Badge className="w-full justify-center bg-indigo-100 text-indigo-800 hover:bg-indigo-200">
                    Testar Agora →
                  </Badge>
                </CardContent>
              </Card>
            </Link>

            {/* CEP Checker */}
            <Link href="/ferramentas/consultar-cep">
              <Card className="border-2 border-blue-200 hover:border-blue-400 hover:shadow-2xl transition-all cursor-pointer h-full group">
                <CardHeader className="text-center">
                  <div className="text-5xl mb-3 group-hover:scale-110 transition-transform">📮</div>
                  <CardTitle className="text-xl mb-2 text-blue-600">Consultar CEP</CardTitle>
                  <CardDescription className="text-sm">
                    Busca <strong>gratuita e ilimitada</strong> de endereços brasileiros
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Badge className="w-full justify-center bg-blue-100 text-blue-800 hover:bg-blue-200">
                    Consultar Grátis →
                  </Badge>
                </CardContent>
              </Card>
            </Link>

            {/* CNPJ Validator */}
            <Link href="/ferramentas/validar-cnpj">
              <Card className="border-2 border-emerald-200 hover:border-emerald-400 hover:shadow-2xl transition-all cursor-pointer h-full group">
                <CardHeader className="text-center">
                  <div className="text-5xl mb-3 group-hover:scale-110 transition-transform">🏢</div>
                  <CardTitle className="text-xl mb-2 text-emerald-600">Validar CNPJ</CardTitle>
                  <CardDescription className="text-sm">
                    Dados completos da <strong>Receita Federal</strong> com QSA e CNAEs
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Badge className="w-full justify-center bg-emerald-100 text-emerald-800 hover:bg-emerald-200">
                    Validar Grátis →
                  </Badge>
                </CardContent>
              </Card>
            </Link>

            {/* API CEP */}
            <Link href="/apis/cep">
              <Card className="border-2 border-purple-200 hover:border-purple-400 hover:shadow-2xl transition-all cursor-pointer h-full group">
                <CardHeader className="text-center">
                  <div className="text-5xl mb-3 group-hover:scale-110 transition-transform">⚡</div>
                  <CardTitle className="text-xl mb-2 text-purple-600">API de CEP</CardTitle>
                  <CardDescription className="text-sm">
                    <strong>3 fontes</strong> com fallback automático, cache Redis, <strong>~160ms</strong>
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Badge className="w-full justify-center bg-purple-100 text-purple-800 hover:bg-purple-200">
                    Ver Detalhes →
                  </Badge>
                </CardContent>
              </Card>
            </Link>
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto p-6 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl border border-indigo-200">
            <div className="text-center">
              <div className="text-3xl font-bold text-indigo-600">36</div>
              <div className="text-sm text-slate-600">APIs Planejadas</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600">~160ms</div>
              <div className="text-sm text-slate-600">Tempo Médio</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">1.000</div>
              <div className="text-sm text-slate-600">Requests Grátis/Dia</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-emerald-600">0</div>
              <div className="text-sm text-slate-600">Cartão Necessário</div>
            </div>
          </div>
        </div>
      </section>

      {/* Por que Retech Core */}
      <section className="py-20 bg-gradient-to-br from-blue-50 via-purple-50 to-slate-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center mb-12">
            <h2 className="text-4xl font-bold mb-6 text-slate-900">
              Por que <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">Retech Core</span>?
            </h2>
            <p className="text-lg text-slate-600">
              Você poderia consultar o IBGE, Receita Federal, e diversos outros sites públicos...
              <br />
              <strong>Ou usar uma única API moderna, rápida e confiável.</strong>
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <Card className="border-2 border-blue-200 hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="flex items-start gap-4">
                  <div className="text-4xl">🚀</div>
                  <div>
                    <CardTitle className="text-xl mb-2">Performance Otimizada</CardTitle>
                    <CardDescription className="text-base">
                      <strong className="text-slate-700">Respostas em ~160ms com cache Redis</strong>
                      <br />
                      Cache inteligente em 3 camadas + fallback automático entre fontes de dados. Processamento do servidor &lt;5ms.
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
            </Card>

            <Card className="border-2 border-purple-200 hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="flex items-start gap-4">
                  <div className="text-4xl">🎯</div>
                  <div>
                    <CardTitle className="text-xl mb-2">Tudo em um Só Lugar</CardTitle>
                    <CardDescription className="text-base">
                      <strong className="text-slate-700">Uma API, múltiplas fontes</strong>
                      <br />
                      Não perca tempo integrando 5+ APIs diferentes. CEP, CNPJ, CPF, Geografia, Dados Judiciais — tudo unificado.
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
            </Card>

            <Card className="border-2 border-green-200 hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="flex items-start gap-4">
                  <div className="text-4xl">🔒</div>
                  <div>
                    <CardTitle className="text-xl mb-2">Segurança Enterprise</CardTitle>
                    <CardDescription className="text-base">
                      <strong className="text-slate-700">API Keys + Rate Limiting + Logs</strong>
                      <br />
                      Autenticação robusta, controle de acesso, auditoria completa. Tudo que você espera de uma API profissional.
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
            </Card>

            <Card className="border-2 border-amber-200 hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="flex items-start gap-4">
                  <div className="text-4xl">📊</div>
                  <div>
                    <CardTitle className="text-xl mb-2">Dashboard Inteligente</CardTitle>
                    <CardDescription className="text-base">
                      <strong className="text-slate-700">Monitore seu uso em tempo real</strong>
                      <br />
                      Veja quantas requests você fez, quais endpoints mais usa, e gerencie suas API keys facilmente.
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* APIs Disponíveis */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-4 text-slate-900">
            O Hub Definitivo de APIs Brasileiras
          </h2>
          <p className="text-center text-slate-600 mb-12 max-w-3xl mx-auto">
            <strong>36 APIs essenciais</strong> para desenvolvedores brasileiros. Uma única integração, infinitas possibilidades.
          </p>
          
          {/* Progress Bar */}
          <div className="max-w-2xl mx-auto mb-12">
            <div className="flex items-center justify-between mb-2 text-sm">
              <span className="text-slate-600 font-medium">Progresso Geral</span>
              <span className="text-indigo-600 font-bold">25% (9/36 APIs)</span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden">
              <div className="bg-gradient-to-r from-green-500 via-blue-500 to-purple-500 h-full rounded-full transition-all duration-1000" style={{ width: '25%' }}></div>
            </div>
            <div className="grid grid-cols-4 gap-2 mt-3 text-xs text-center">
              <div>
                <div className="font-bold text-green-600">100%</div>
                <div className="text-slate-500">Fase 1</div>
              </div>
              <div>
                <div className="font-bold text-blue-600">33%</div>
                <div className="text-slate-500">Fase 2</div>
              </div>
              <div>
                <div className="font-bold text-purple-600">0%</div>
                <div className="text-slate-500">Fase 3</div>
              </div>
              <div>
                <div className="font-bold text-slate-600">0%</div>
                <div className="text-slate-500">Fase 4</div>
              </div>
            </div>
          </div>

          {/* ========================================== */}
          {/* SEÇÃO DESTAQUE: APIs DISPONÍVEIS AGORA */}
          {/* ========================================== */}
          <div className="mb-20">
            <div className="bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 border-2 border-green-300 rounded-2xl p-8 mb-8">
              <div className="text-center mb-8">
                <Badge className="bg-green-600 text-white text-base px-4 py-2 mb-4">
                  ✨ Disponível Agora
                </Badge>
                <h3 className="text-3xl font-bold text-slate-900 mb-3">
                  🚀 APIs Prontas para Uso
                </h3>
                <p className="text-slate-600 text-lg">
                  Comece a integrar <strong>agora mesmo</strong>! Estas APIs já estão em produção e prontas para receber suas requisições.
                </p>
              </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {/* CEP */}
              <Card className="border-2 border-green-400 bg-white hover:shadow-2xl transition-all duration-300 hover:scale-105">
                <CardHeader>
                  <div className="flex items-center justify-between mb-3">
                    <div className="text-4xl">📮</div>
                    <Badge className="bg-green-600 text-white">✓ Disponível</Badge>
                  </div>
                  <CardTitle className="text-xl mb-2">Busca de CEP</CardTitle>
                  <CardDescription className="text-base">
                    Consulta completa de endereços brasileiros com cache inteligente e múltiplas fontes (ViaCEP + Brasil API).
                  </CardDescription>
                  <div className="mt-4 pt-4 border-t border-green-200">
                    <p className="text-sm text-slate-600 mb-2 font-medium">Recursos:</p>
                    <ul className="text-xs text-slate-600 space-y-1">
                      <li>✓ Cache Redis (~160ms)</li>
                      <li>✓ 3 fontes com fallback</li>
                      <li>✓ Coordenadas geográficas</li>
                      <li>✓ Processamento &lt;5ms</li>
                    </ul>
                  </div>
                </CardHeader>
              </Card>

              {/* CNPJ */}
              <Card className="border-2 border-green-400 bg-white hover:shadow-2xl transition-all duration-300 hover:scale-105">
                <CardHeader>
                  <div className="flex items-center justify-between mb-3">
                    <div className="text-4xl">🏢</div>
                    <Badge className="bg-green-600 text-white">✓ Disponível</Badge>
                  </div>
                  <CardTitle className="text-xl mb-2">Consulta CNPJ</CardTitle>
                  <CardDescription className="text-base">
                    Dados completos de empresas brasileiras direto da Receita Federal com QSA e CNAEs.
                  </CardDescription>
                  <div className="mt-4 pt-4 border-t border-green-200">
                    <p className="text-sm text-slate-600 mb-2 font-medium">Recursos:</p>
                    <ul className="text-xs text-slate-600 space-y-1">
                      <li>✓ Razão social + fantasia</li>
                      <li>✓ QSA (sócios)</li>
                      <li>✓ Endereço completo</li>
                      <li>✓ Cache 30 dias</li>
                    </ul>
                  </div>
                </CardHeader>
              </Card>

              {/* Geografia */}
              <Card className="border-2 border-green-400 bg-white hover:shadow-2xl transition-all duration-300 hover:scale-105">
                <CardHeader>
                  <div className="flex items-center justify-between mb-3">
                    <div className="text-4xl">🗺️</div>
                    <Badge className="bg-green-600 text-white">✓ Disponível</Badge>
                  </div>
                  <CardTitle className="text-xl mb-2">Estados & Municípios</CardTitle>
                  <CardDescription className="text-base">
                    Dados completos de 27 estados e 5.570 municípios brasileiros com informações do IBGE.
                  </CardDescription>
                  <div className="mt-4 pt-4 border-t border-green-200">
                    <p className="text-sm text-slate-600 mb-2 font-medium">Recursos:</p>
                    <ul className="text-xs text-slate-600 space-y-1">
                      <li>✓ 27 estados + regiões</li>
                      <li>✓ 5.570 municípios</li>
                      <li>✓ Filtros por UF</li>
                      <li>✓ Dados atualizados IBGE</li>
                    </ul>
                  </div>
                </CardHeader>
              </Card>
            </div>

              <div className="text-center mt-8">
                <Link href="/painel/register">
                  <Button size="lg" className="bg-green-600 hover:bg-green-700 text-white text-lg px-8 py-6 shadow-lg">
                    Começar a Usar Agora →
                  </Button>
                </Link>
                <p className="text-sm text-slate-600 mt-3">
                  Gratuito para começar • 1.000 requests/dia • Sem cartão de crédito
                </p>
              </div>
            </div>
          </div>

          {/* ========================================== */}
          {/* ROADMAP: PRÓXIMAS APIs */}
          {/* ========================================== */}
          <div className="mb-12 text-center">
            <h3 className="text-2xl font-bold text-slate-800 mb-3">
              📅 Roadmap: Próximas APIs
            </h3>
            <p className="text-slate-600 max-w-2xl mx-auto mb-8">
              Estamos constantemente adicionando novas APIs. Veja o que está por vir e quando você pode esperar cada funcionalidade.
            </p>
          </div>
          
          {/* CATEGORIA: Dados Cadastrais & Validação */}
          <div className="mb-16">
            <h3 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-3">
              <span className="text-3xl">📋</span>
              Dados Cadastrais & Validação
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <Card className="border-2 border-purple-300 bg-purple-50/30 hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-3xl">👤</div>
                    <Badge className="bg-purple-600">Fase 3</Badge>
                  </div>
                  <CardTitle className="text-base">Validação de CPF</CardTitle>
                  <CardDescription className="text-sm">Dígitos + status Receita Federal</CardDescription>
                </CardHeader>
              </Card>

              <Card className="border-2 border-purple-300 bg-purple-50/30 hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-3xl">✉️</div>
                    <Badge className="bg-purple-600">Fase 3</Badge>
                  </div>
                  <CardTitle className="text-base">Validação de Email</CardTitle>
                  <CardDescription className="text-sm">Verifica existência (não só formato)</CardDescription>
                </CardHeader>
              </Card>

              <Card className="border-2 border-purple-300 bg-purple-50/30 hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-3xl">📱</div>
                    <Badge className="bg-purple-600">Fase 3</Badge>
                  </div>
                  <CardTitle className="text-base">Validação de Telefone</CardTitle>
                  <CardDescription className="text-sm">Número válido + operadora</CardDescription>
                </CardHeader>
              </Card>

              <Card className="border-2 border-purple-300 bg-purple-50/30 hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-3xl">📞</div>
                    <Badge className="bg-purple-600">Fase 3</Badge>
                  </div>
                  <CardTitle className="text-base">Operadora Telefone</CardTitle>
                  <CardDescription className="text-sm">Tipo de linha + portabilidade</CardDescription>
                </CardHeader>
              </Card>
            </div>
          </div>

          {/* CATEGORIA: Validação Fiscal & Compliance */}
          <div className="mb-16">
            <h3 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-3">
              <span className="text-3xl">🧾</span>
              Validação Fiscal & Compliance
              <Badge className="bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs px-2 py-1">NOVO!</Badge>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <Card className="border-2 border-purple-300 bg-purple-50/30 hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-3xl">🧾</div>
                    <Badge className="bg-purple-600">Fase 3</Badge>
                  </div>
                  <CardTitle className="text-base">Validação de NF-e</CardTitle>
                  <CardDescription className="text-sm">Consulta NF-e por chave de 44 dígitos</CardDescription>
                </CardHeader>
              </Card>

              <Card className="border-2 border-purple-300 bg-purple-50/30 hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-3xl">📜</div>
                    <Badge className="bg-purple-600">Fase 3</Badge>
                  </div>
                  <CardTitle className="text-base">Certidões (CND/CNDT)</CardTitle>
                  <CardDescription className="text-sm">Certidões negativas de débitos</CardDescription>
                </CardHeader>
              </Card>

              <Card className="border-2 border-purple-300 bg-purple-50/30 hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-3xl">🏛️</div>
                    <Badge className="bg-purple-600">Fase 3</Badge>
                  </div>
                  <CardTitle className="text-base">Compras Governamentais</CardTitle>
                  <CardDescription className="text-sm">Licitações e contratos por CNPJ</CardDescription>
                </CardHeader>
              </Card>

              {/* Premium Features */}
              <Card className="border-2 border-amber-400 bg-gradient-to-br from-amber-50 to-orange-50 hover:shadow-2xl transition-all">
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-3xl">📂</div>
                    <Badge className="bg-gradient-to-r from-amber-600 to-orange-600 text-white">Premium</Badge>
                  </div>
                  <CardTitle className="text-base">Meus Documentos Fiscais</CardTitle>
                  <CardDescription className="text-sm">
                    Sync automático de NF-e do seu CNPJ (Plano Business)
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="border-2 border-purple-400 bg-gradient-to-br from-purple-50 to-indigo-50 hover:shadow-2xl transition-all">
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-3xl">🏦</div>
                    <Badge className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white">Premium</Badge>
                  </div>
                  <CardTitle className="text-base">Meus Boletos (Open Finance)</CardTitle>
                  <CardDescription className="text-sm">
                    Dashboard unificado de boletos (Plano Business)
                  </CardDescription>
                </CardHeader>
              </Card>
            </div>
          </div>

          {/* CATEGORIA: Dados Geográficos */}
          <div className="mb-16">
            <h3 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-3">
              <span className="text-3xl">🗺️</span>
              Dados Geográficos
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <Card className="border-2 border-purple-300 bg-purple-50/30 hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-3xl">🏘️</div>
                    <Badge className="bg-purple-600">Fase 3</Badge>
                  </div>
                  <CardTitle className="text-base">Bairros por Cidade</CardTitle>
                  <CardDescription className="text-sm">Lista completa de bairros</CardDescription>
                </CardHeader>
              </Card>

              <Card className="border-2 border-slate-300 bg-slate-50/30 hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-3xl">🛣️</div>
                    <Badge className="bg-slate-600">Futuro</Badge>
                  </div>
                  <CardTitle className="text-base">Ruas por Bairro</CardTitle>
                  <CardDescription className="text-sm">Autocomplete de endereços</CardDescription>
                </CardHeader>
              </Card>

              <Card className="border-2 border-slate-300 bg-slate-50/30 hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-3xl">📍</div>
                    <Badge className="bg-slate-600">Futuro</Badge>
                  </div>
                  <CardTitle className="text-base">Coordenadas de CEPs</CardTitle>
                  <CardDescription className="text-sm">Latitude e longitude</CardDescription>
                </CardHeader>
              </Card>

              <Card className="border-2 border-slate-300 bg-slate-50/30 hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-3xl">📏</div>
                    <Badge className="bg-slate-600">Futuro</Badge>
                  </div>
                  <CardTitle className="text-base">Distância entre CEPs</CardTitle>
                  <CardDescription className="text-sm">Cálculo de rotas</CardDescription>
                </CardHeader>
              </Card>

              <Card className="border-2 border-slate-300 bg-slate-50/30 hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-3xl">📊</div>
                    <Badge className="bg-slate-600">Futuro</Badge>
                  </div>
                  <CardTitle className="text-base">Dados Demográficos</CardTitle>
                  <CardDescription className="text-sm">População, IDH, PIB por cidade</CardDescription>
                </CardHeader>
              </Card>
            </div>
          </div>

          {/* CATEGORIA: Dados Financeiros */}
          <div className="mb-16">
            <h3 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-3">
              <span className="text-3xl">💰</span>
              Dados Financeiros
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <Card className="border-2 border-blue-300 bg-blue-50/30 hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-3xl">💵</div>
                    <Badge className="bg-blue-600">Fase 2</Badge>
                  </div>
                  <CardTitle className="text-base">Cotação de Moedas</CardTitle>
                  <CardDescription className="text-sm">Dólar, Euro, Bitcoin em tempo real</CardDescription>
                </CardHeader>
              </Card>

              <Card className="border-2 border-blue-300 bg-blue-50/30 hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-3xl">🏦</div>
                    <Badge className="bg-blue-600">Fase 2</Badge>
                  </div>
                  <CardTitle className="text-base">Bancos Brasileiros</CardTitle>
                  <CardDescription className="text-sm">Códigos COMPE/ISPB</CardDescription>
                </CardHeader>
              </Card>

              <Card className="border-2 border-purple-300 bg-purple-50/30 hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-3xl">📈</div>
                    <Badge className="bg-purple-600">Fase 3</Badge>
                  </div>
                  <CardTitle className="text-base">SELIC, CDI, IPCA</CardTitle>
                  <CardDescription className="text-sm">Taxas oficiais Banco Central</CardDescription>
                </CardHeader>
              </Card>

              <Card className="border-2 border-slate-300 bg-slate-50/30 hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-3xl">🎫</div>
                    <Badge className="bg-slate-600">Futuro</Badge>
                  </div>
                  <CardTitle className="text-base">Geração de Boletos</CardTitle>
                  <CardDescription className="text-sm">Código de barras</CardDescription>
                </CardHeader>
              </Card>

              <Card className="border-2 border-slate-300 bg-slate-50/30 hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-3xl">📱</div>
                    <Badge className="bg-slate-600">Futuro</Badge>
                  </div>
                  <CardTitle className="text-base">Pix QR Code</CardTitle>
                  <CardDescription className="text-sm">Geração de QR Code estático</CardDescription>
                </CardHeader>
              </Card>
            </div>
          </div>

          {/* CATEGORIA: Transporte & Logística */}
          <div className="mb-16">
            <h3 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-3">
              <span className="text-3xl">🚚</span>
              Transporte & Logística
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <Card className="border-2 border-blue-300 bg-blue-50/30 hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-3xl">🚗</div>
                    <Badge className="bg-blue-600">Fase 2</Badge>
                  </div>
                  <CardTitle className="text-base">Tabela FIPE</CardTitle>
                  <CardDescription className="text-sm">Preços de veículos atualizados</CardDescription>
                </CardHeader>
              </Card>

              <Card className="border-2 border-purple-300 bg-purple-50/30 hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-3xl">📦</div>
                    <Badge className="bg-purple-600">Fase 3</Badge>
                  </div>
                  <CardTitle className="text-base">Cálculo de Frete</CardTitle>
                  <CardDescription className="text-sm">Correios, Jadlog, etc.</CardDescription>
                </CardHeader>
              </Card>

              <Card className="border-2 border-purple-300 bg-purple-50/30 hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-3xl">📍</div>
                    <Badge className="bg-purple-600">Fase 3</Badge>
                  </div>
                  <CardTitle className="text-base">Rastreamento</CardTitle>
                  <CardDescription className="text-sm">Código de rastreio Correios</CardDescription>
                </CardHeader>
              </Card>

              <Card className="border-2 border-purple-300 bg-purple-50/30 hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-3xl">🚙</div>
                    <Badge className="bg-purple-600">Fase 3</Badge>
                  </div>
                  <CardTitle className="text-base">Consulta de Veículos</CardTitle>
                  <CardDescription className="text-sm">Dados por placa (DENATRAN)</CardDescription>
                </CardHeader>
              </Card>
            </div>
          </div>

          {/* CATEGORIA: Utilidades Gerais */}
          <div className="mb-16">
            <h3 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-3">
              <span className="text-3xl">🔧</span>
              Utilidades Gerais
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <Card className="border-2 border-blue-300 bg-blue-50/30 hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-3xl">📅</div>
                    <Badge className="bg-blue-600">Fase 2</Badge>
                  </div>
                  <CardTitle className="text-base">Feriados Nacionais</CardTitle>
                  <CardDescription className="text-sm">Calendário completo + estaduais</CardDescription>
                </CardHeader>
              </Card>

              <Card className="border-2 border-purple-300 bg-purple-50/30 hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-3xl">📞</div>
                    <Badge className="bg-purple-600">Fase 3</Badge>
                  </div>
                  <CardTitle className="text-base">Operadora Telefone</CardTitle>
                  <CardDescription className="text-sm">Tipo de linha + portabilidade</CardDescription>
                </CardHeader>
              </Card>

              <Card className="border-2 border-slate-300 bg-slate-50/30 hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-3xl">🗓️</div>
                    <Badge className="bg-slate-600">Futuro</Badge>
                  </div>
                  <CardTitle className="text-base">Dias Úteis</CardTitle>
                  <CardDescription className="text-sm">Cálculo entre datas</CardDescription>
                </CardHeader>
              </Card>

              <Card className="border-2 border-slate-300 bg-slate-50/30 hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-3xl">🌍</div>
                    <Badge className="bg-slate-600">Futuro</Badge>
                  </div>
                  <CardTitle className="text-base">Fusos Horários</CardTitle>
                  <CardDescription className="text-sm">Por cidade/estado</CardDescription>
                </CardHeader>
              </Card>
            </div>
          </div>

          {/* CATEGORIA: Dados Governamentais & Compliance */}
          <div className="mb-16">
            <h3 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-3">
              <span className="text-3xl">🏛️</span>
              Governo & Compliance
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <Card className="border-2 border-slate-300 bg-slate-50/30 hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-3xl">⚖️</div>
                    <Badge className="bg-slate-600">Fase 4</Badge>
                  </div>
                  <CardTitle className="text-base">Dados Judiciais</CardTitle>
                  <CardDescription className="text-sm">Processos públicos (PJe + TJs)</CardDescription>
                </CardHeader>
              </Card>

              <Card className="border-2 border-slate-300 bg-slate-50/30 hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-3xl">📋</div>
                    <Badge className="bg-slate-600">Fase 4</Badge>
                  </div>
                  <CardTitle className="text-base">Portal Transparência</CardTitle>
                  <CardDescription className="text-sm">Licitações e convênios</CardDescription>
                </CardHeader>
              </Card>

              <Card className="border-2 border-slate-300 bg-slate-50/30 hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-3xl">🚫</div>
                    <Badge className="bg-slate-600">Fase 4</Badge>
                  </div>
                  <CardTitle className="text-base">CEIS/CNEP</CardTitle>
                  <CardDescription className="text-sm">Empresas inidôneas/punidas</CardDescription>
                </CardHeader>
              </Card>

              <Card className="border-2 border-slate-300 bg-slate-50/30 hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-3xl">📊</div>
                    <Badge className="bg-slate-600">Futuro</Badge>
                  </div>
                  <CardTitle className="text-base">Simples Nacional</CardTitle>
                  <CardDescription className="text-sm">Consulta de optantes</CardDescription>
                </CardHeader>
              </Card>

              <Card className="border-2 border-slate-300 bg-slate-50/30 hover:shadow-lg transition-shadow">
              <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-3xl">👔</div>
                    <Badge className="bg-slate-600">Futuro</Badge>
                  </div>
                  <CardTitle className="text-base">PEP</CardTitle>
                  <CardDescription className="text-sm">Pessoas Politicamente Expostas</CardDescription>
                </CardHeader>
              </Card>
            </div>
          </div>

          {/* Legenda */}
          <div className="max-w-4xl mx-auto">
            <Card className="border-2 border-slate-200">
              <CardContent className="pt-6">
                <div className="flex flex-wrap justify-center gap-6 text-sm">
                  <div className="flex items-center gap-2">
                    <Badge className="bg-green-600">Disponível</Badge>
                    <span className="text-slate-600">Pronto para usar agora</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-blue-600">Fase 2</Badge>
                    <span className="text-slate-600">Próximos 3 meses</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-purple-600">Fase 3</Badge>
                    <span className="text-slate-600">3-6 meses</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-slate-600">Fase 4+</Badge>
                    <span className="text-slate-600">6+ meses</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-gradient-to-r from-amber-600 to-orange-600 text-white">Premium</Badge>
                    <span className="text-slate-600">Plano Business</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="text-center mt-12">
            <p className="text-slate-600 mb-4">
              💡 <strong>Tem alguma sugestão de API?</strong> Entre em contato e ajude-nos a priorizar o roadmap!
            </p>
          </div>
        </div>
      </section>

      {/* Stack Tecnológica */}
      <section className="py-20 bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">
              Construído com <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">Tecnologia de Ponta</span>
            </h2>
            <p className="text-lg text-slate-300">
              Performance, escalabilidade e confiabilidade não são acidente. São resultado de escolhas técnicas inteligentes.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-6 max-w-6xl mx-auto mb-12">
            <Card className="bg-slate-800/50 border-slate-700 hover:bg-slate-800 transition-all">
              <CardHeader className="text-center">
                <div className="flex justify-center mb-4">
                  <img 
                    src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/go/go-original.svg" 
                    alt="Go Logo" 
                    className="w-16 h-16"
                  />
                </div>
                <CardTitle className="text-white text-lg">Go (Golang)</CardTitle>
                <CardDescription className="text-slate-400">
                  Backend ultra-rápido e eficiente
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700 hover:bg-slate-800 transition-all">
              <CardHeader className="text-center">
                <div className="flex justify-center mb-4">
                  <img 
                    src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg" 
                    alt="MongoDB Logo" 
                    className="w-16 h-16"
                  />
                </div>
                <CardTitle className="text-white text-lg">MongoDB</CardTitle>
                <CardDescription className="text-slate-400">
                  Banco de dados NoSQL escalável
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700 hover:bg-slate-800 transition-all">
              <CardHeader className="text-center">
                <div className="flex justify-center mb-4">
                  <img 
                    src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/redis/redis-original.svg" 
                    alt="Redis Logo" 
                    className="w-16 h-16"
                  />
                </div>
                <CardTitle className="text-white text-lg">Redis</CardTitle>
                <CardDescription className="text-slate-400">
                  Cache de alta performance
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700 hover:bg-slate-800 transition-all">
              <CardHeader className="text-center">
                <div className="flex justify-center mb-4">
                  <img 
                    src="https://railway.app/brand/logo-light.svg" 
                    alt="Railway Logo" 
                    className="w-16 h-16"
                  />
                </div>
                <CardTitle className="text-white text-lg">Railway</CardTitle>
                <CardDescription className="text-slate-400">
                  Deploy automatizado e escalável
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700 hover:bg-slate-800 transition-all">
              <CardHeader className="text-center">
                <div className="flex justify-center mb-4">
                  <img 
                    src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg" 
                    alt="Next.js Logo" 
                    className="w-16 h-16 invert"
                  />
                </div>
                <CardTitle className="text-white text-lg">Next.js</CardTitle>
                <CardDescription className="text-slate-400">
                  Frontend moderno e performático
                </CardDescription>
              </CardHeader>
            </Card>
          </div>

          <div className="max-w-4xl mx-auto">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white text-2xl text-center mb-6">Por que essa stack?</CardTitle>
              </CardHeader>
              <CardContent className="grid md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-4xl mb-3">⚡</div>
                  <h4 className="text-white font-semibold mb-2">Velocidade</h4>
                  <p className="text-slate-400 text-sm">
                    Go + Redis + MongoDB = ~160ms em média. Cache inteligente em 3 camadas com processamento do servidor &lt;5ms.
                  </p>
                </div>
                <div className="text-center">
                  <div className="text-4xl mb-3">📈</div>
                  <h4 className="text-white font-semibold mb-2">Escalabilidade</h4>
                  <p className="text-slate-400 text-sm">
                    MongoDB escala horizontalmente, Go gerencia milhares de conexões simultâneas com eficiência.
                  </p>
                </div>
                <div className="text-center">
                  <div className="text-4xl mb-3">🛡️</div>
                  <h4 className="text-white font-semibold mb-2">Confiabilidade</h4>
                  <p className="text-slate-400 text-sm">
                    Railway garante 99.9% de uptime, backups automáticos e deploy com zero downtime.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-20 bg-slate-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-slate-900">
            Planos e Preços
          </h2>
          
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
                    <span className="text-green-600 mt-0.5">✓</span>
                    <span><strong>1.000 requests/dia</strong></span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 mt-0.5">✓</span>
                    <span>3 APIs (CEP, CNPJ, Geografia)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 mt-0.5">✓</span>
                    <span>Cache 3 camadas</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 mt-0.5">✓</span>
                    <span>Dashboard de uso</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 mt-0.5">✓</span>
                    <span>Documentação completa</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 mt-0.5">✓</span>
                    <span>Suporte via email</span>
                  </li>
                </ul>
                <Link href="/painel/register" className="w-full">
                  <Button className="w-full mt-4" variant="outline">
                    Começar Grátis
                  </Button>
                </Link>
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
                    <span className="text-blue-600 mt-0.5">✓</span>
                    <span><strong>10.000 requests/dia</strong></span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 mt-0.5">✓</span>
                    <span>Acesso a TODAS as APIs</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 mt-0.5">✓</span>
                    <span>Cache prioritário</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 mt-0.5">✓</span>
                    <span>Dashboard avançado</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 mt-0.5">✓</span>
                    <span>Analytics em tempo real</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 mt-0.5">✓</span>
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
                    <span className="text-purple-600 mt-0.5">✓</span>
                    <span><strong>100.000 requests/dia</strong></span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-purple-600 mt-0.5">✓</span>
                    <span>TODAS as 36 APIs</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-purple-600 mt-0.5">✓</span>
                    <span>Cache Redis L1 prioritário</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-purple-600 mt-0.5">✓</span>
                    <span>APIs Premium (NF-e, Boletos)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-purple-600 mt-0.5">✓</span>
                    <span>Suporte WhatsApp prioritário</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-purple-600 mt-0.5">✓</span>
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
                    <span className="text-slate-600 mt-0.5">✓</span>
                    <span><strong>Requests ilimitados</strong></span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-slate-600 mt-0.5">✓</span>
                    <span>Todas as 36 APIs</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-slate-600 mt-0.5">✓</span>
                    <span>Infraestrutura dedicada</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-slate-600 mt-0.5">✓</span>
                    <span>White-label disponível</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-slate-600 mt-0.5">✓</span>
                    <span>Suporte 24/7</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-slate-600 mt-0.5">✓</span>
                    <span>SLA de 99.9%</span>
                  </li>
                </ul>
                <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="w-full">
                  <Button className="w-full mt-4" variant="outline">
                    Falar com Vendas
                  </Button>
                </a>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Exemplo de Código */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-4 text-slate-900">
                Integração em <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">Minutos</span>
              </h2>
              <p className="text-lg text-slate-600">
                Nossa API é RESTful, simples e bem documentada. Veja como é fácil começar:
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <Card className="border-2 border-slate-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <span className="text-2xl">📘</span>
                    Buscar Estados
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <pre className="bg-slate-950 rounded-lg p-4 text-sm text-slate-100 overflow-x-auto">
                    <code>
                      <span className="text-green-400">GET</span> https://api-core.theretech.com.br/geo/estados{'\n'}
                      {'\n'}
                      <span className="text-slate-400">// Headers</span>{'\n'}
                      <span className="text-yellow-300">X-API-Key: rtc_sua_chave_aqui</span>{'\n'}
                      {'\n'}
                      <span className="text-slate-400">// Resposta</span>{'\n'}
                      {'{'}{'\n'}
                      {'  '}<span className="text-purple-400">&quot;estados&quot;</span>: [{'\n'}
                      {'    '}{'{'}{'\n'}
                      {'      '}<span className="text-purple-400">&quot;sigla&quot;</span>: <span className="text-green-300">&quot;SP&quot;</span>,{'\n'}
                      {'      '}<span className="text-purple-400">&quot;nome&quot;</span>: <span className="text-green-300">&quot;São Paulo&quot;</span>,{'\n'}
                      {'      '}<span className="text-purple-400">&quot;regiao&quot;</span>: <span className="text-green-300">&quot;Sudeste&quot;</span>{'\n'}
                      {'    '}{'}'},{'\n'}
                      {'    '}<span className="text-slate-500">...</span>{'\n'}
                      {'  '}]{'\n'}
                      {'}'}
                    </code>
                  </pre>
                </CardContent>
              </Card>

              <Card className="border-2 border-slate-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <span className="text-2xl">📗</span>
                    JavaScript (Node.js)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <pre className="bg-slate-950 rounded-lg p-4 text-sm text-slate-100 overflow-x-auto">
                    <code>
                      <span className="text-purple-400">const</span> <span className="text-blue-300">axios</span> = <span className="text-yellow-300">require</span>(<span className="text-green-300">&apos;axios&apos;</span>);{'\n'}
                      {'\n'}
                      <span className="text-purple-400">const</span> <span className="text-blue-300">api</span> = axios.<span className="text-yellow-300">create</span>({'({'}{'\n'}
                      {'  '}<span className="text-purple-400">baseURL</span>: <span className="text-green-300">&apos;https://api-core.theretech.com.br&apos;</span>,{'\n'}
                      {'  '}<span className="text-purple-400">headers</span>: {'{'}{'\n'}
                      {'    '}<span className="text-purple-400">&apos;X-API-Key&apos;</span>: <span className="text-green-300">&apos;rtc_sua_chave&apos;</span>{'\n'}
                      {'  }'}
                      {'\n'}
                      {'});'}{'\n'}
                      {'\n'}
                      <span className="text-slate-400">// Buscar todos os estados</span>{'\n'}
                      <span className="text-purple-400">const</span> <span className="text-blue-300">estados</span> = <span className="text-purple-400">await</span> api.<span className="text-yellow-300">get</span>(<span className="text-green-300">&apos;/geo/estados&apos;</span>);{'\n'}
                      {'\n'}
                      console.<span className="text-yellow-300">log</span>(estados.<span className="text-blue-300">data</span>);
                    </code>
                  </pre>
                </CardContent>
              </Card>
            </div>

            <div className="text-center mt-8">
              <Link href={process.env.NEXT_PUBLIC_DOCS_URL || 'https://api-core.theretech.com.br/docs'} target="_blank" rel="noopener noreferrer">
                <Button variant="outline" size="lg" className="text-blue-600 border-blue-600 hover:bg-blue-50">
                  📚 Ver Documentação Completa
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Pronto para começar?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Crie sua conta gratuita agora e comece a integrar em minutos
          </p>
          <Link href="/painel/register">
            <Button size="lg" className="bg-white text-blue-600 hover:bg-slate-100 text-lg px-8 py-6">
              Criar Conta Grátis
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-white font-bold mb-4">The Retech Core</h3>
              <p className="text-sm">
                APIs de dados brasileiros de alta performance para desenvolvedores.
              </p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Produto</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href={process.env.NEXT_PUBLIC_DOCS_URL || 'https://api-core.theretech.com.br/docs'} target="_blank" className="hover:text-white">Documentação</Link></li>
                <li><Link href="/precos" className="hover:text-white">Preços</Link></li>
                <li><Link href="/status" className="hover:text-white">Status</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Empresa</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/sobre" className="hover:text-white">Sobre</Link></li>
                <li><Link href="/contato" className="hover:text-white">Contato</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/legal/termos" className="hover:text-white">Termos de Uso</Link></li>
                <li><Link href="/legal/privacidade" className="hover:text-white">Privacidade</Link></li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-slate-800 text-center text-sm space-y-2">
            <p className="text-slate-500">
              Criado por <strong className="text-white">Alan Rezende</strong>, CEO da The Retech
            </p>
            <p className="text-slate-500">
              📍 Florianópolis, SC • 📱 WhatsApp: {contact?.whatsapp ? `+55 ${contact.whatsapp}` : '+55 48 99961-6679'}
            </p>
            <p className="mt-4">&copy; 2025 The Retech. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
