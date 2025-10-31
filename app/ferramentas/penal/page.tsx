'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Search, Scale, Clock, Share2, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';
import FAQSchema from '@/app/components/schemas/FAQSchema';
import BreadcrumbSchema from '@/app/components/schemas/BreadcrumbSchema';

interface ArtigoPenal {
  codigo: string;
  artigo: number;
  paragrafo?: number;
  inciso?: string;
  alinea?: string;
  descricao: string;
  textoCompleto: string;
  tipo: string;
  legislacao: string;
  legislacaoNome: string;
  penaMin?: string;
  penaMax?: string;
  codigoFormatado: string;
}

export default function ConsultarPenalPage() {
  const [codigo, setCodigo] = useState('');
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<ArtigoPenal | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [responseTime, setResponseTime] = useState<number | null>(null);
  const [demoApiKey, setDemoApiKey] = useState('');

  const apiBaseURL = process.env.NEXT_PUBLIC_API_URL || 'https://api-core.theretech.com.br';

  // ✅ Buscar API Key demo do backend (mesma lógica do playground)
  useEffect(() => {
    const fetchPlaygroundConfig = async () => {
      try {
        const res = await fetch(`${apiBaseURL}/public/playground/status`, {
          cache: 'no-store',
          headers: {
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache',
            'Expires': '0'
          }
        });
        const data = await res.json();
        if (data.apiKey) {
          setDemoApiKey(data.apiKey);
        }
      } catch (error) {
        console.error('Erro ao buscar API Key demo:', error);
      }
    };
    fetchPlaygroundConfig();
  }, []);

  // ✅ Buscar código da URL query string ao carregar
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const codigoParam = params.get('codigo');
    if (codigoParam) {
      setCodigo(codigoParam);
      handleConsultaFromURL(codigoParam);
    }
  }, [demoApiKey]);

  const handleConsultaFromURL = async (codigoInput: string) => {
    if (!demoApiKey || !codigoInput) return;

    setLoading(true);
    setError(null);
    setData(null);
    setResponseTime(null);

    const startTime = performance.now();

    try {
      const response = await fetch(`${apiBaseURL}/public/penal/artigos/${codigoInput}`, {
        headers: {
          'X-API-Key': demoApiKey
        }
      });
      
      const endTime = performance.now();
      setResponseTime(Math.round(endTime - startTime));

      if (!response.ok) {
        throw new Error('Artigo não encontrado');
      }

      const result = await response.json();
      if (result.success && result.data) {
        setData(result.data);
      }
      
      // Atualizar URL sem recarregar
      window.history.replaceState(null, '', `/ferramentas/penal?codigo=${codigoInput}`);
    } catch (err) {
      setError('Artigo não encontrado. Verifique o código digitado.');
      toast.error('Artigo não encontrado');
    } finally {
      setLoading(false);
    }
  };

  const handleConsulta = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!codigo.trim()) {
      toast.error('Digite um código de artigo');
      return;
    }

    await handleConsultaFromURL(codigo.trim());
  };

  const handleShare = () => {
    const url = `${window.location.origin}/ferramentas/penal?codigo=${codigo}`;
    navigator.clipboard.writeText(url);
    toast.success('Link copiado! Compartilhe com seus amigos.');
  };

  // FAQs para schema SEO
  const faqs = [
    {
      question: "Como consultar artigos penais gratuitamente?",
      answer: "Basta digitar o código do artigo (ex: 121, 157, 155) e clicar em Consultar. A ferramenta é gratuita e não requer cadastro."
    },
    {
      question: "De onde vêm os dados dos artigos penais?",
      answer: "Utilizamos dados oficiais do Código Penal Brasileiro (CP) e Lei de Contravenções Penais (LCP), com mais de 80 artigos disponíveis. Dados fixos armazenados em cache permanente para máxima performance."
    },
    {
      question: "Qual a velocidade de resposta?",
      answer: "Os dados ficam em cache permanente no Redis, garantindo respostas extremamente rápidas. O tempo varia de acordo com sua localização, mas os dados estão sempre prontos no servidor."
    },
    {
      question: "Preciso de API Key?",
      answer: "Não! Esta é uma ferramenta pública e gratuita. Se você precisa integrar artigos penais no seu sistema, confira nossa API com 1.000 requests/dia grátis."
    }
  ];

  // Breadcrumbs para schema SEO
  const breadcrumbs = [
    { name: "Home", url: "https://core.theretech.com.br" },
    { name: "Ferramentas", url: "https://core.theretech.com.br/ferramentas" },
    { name: "Consultar Artigos Penais", url: "https://core.theretech.com.br/ferramentas/penal" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-100 py-12 px-4">
      {/* Schemas SEO */}
      <FAQSchema faqs={faqs} />
      <BreadcrumbSchema items={breadcrumbs} />
      
      <div className="container max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-4">
            <Scale className="w-8 h-8 text-red-600" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
            Consultar Artigos Penais Grátis
          </h1>
          <p className="text-xl text-slate-600 mb-2">
            Consulte artigos do Código Penal brasileiro (CP + LCP)
          </p>
          <div className="flex items-center justify-center gap-4 text-sm text-slate-500">
            <span>✅ Gratuito</span>
            <span>✅ Sem cadastro</span>
            <span>✅ Dados oficiais</span>
          </div>
        </div>

        {/* Search Card */}
        <Card className="mb-8 shadow-xl">
          <CardHeader>
            <CardTitle>Digite o código do artigo que você quer consultar</CardTitle>
            <CardDescription>Informe o número do artigo (ex: 121, 157, 155)</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleConsulta} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="codigo" className="text-lg">Código do Artigo</Label>
                <Input
                  id="codigo"
                  placeholder="121"
                  value={codigo}
                  onChange={(e) => setCodigo(e.target.value)}
                  className="text-2xl py-6 text-center font-mono"
                  autoFocus
                />
              </div>

              <Button
                type="submit"
                disabled={loading || !codigo.trim()}
                className="w-full bg-red-600 hover:bg-red-700 py-6 text-lg"
              >
                {loading ? (
                  <>
                    <span className="animate-spin mr-2">⏳</span>
                    Consultando...
                  </>
                ) : (
                  <>
                    <Search className="w-5 h-5 mr-2" />
                    Consultar Artigo
                  </>
                )}
              </Button>

              {responseTime !== null && (
                <Alert className="bg-green-50 border-green-200">
                  <Clock className="h-4 w-4 text-green-600" />
                  <AlertDescription className="text-green-800">
                    Resultado em <strong>{responseTime}ms</strong> ⚡
                  </AlertDescription>
                </Alert>
              )}
            </form>
          </CardContent>
        </Card>

        {/* Error */}
        {error && (
          <Alert variant="destructive" className="mb-8">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Result */}
        {data && (
          <Card className="mb-8 shadow-xl">
            <CardHeader className="bg-gradient-to-r from-red-600 to-orange-600 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-2xl">Artigo Encontrado!</CardTitle>
                  <CardDescription className="text-red-100">
                    {data.codigoFormatado}
                  </CardDescription>
                </div>
                <Button
                  onClick={handleShare}
                  variant="secondary"
                  size="sm"
                >
                  <Share2 className="w-4 h-4 mr-2" />
                  Compartilhar
                </Button>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div>
                  <Label className="text-sm text-slate-500">Descrição</Label>
                  <p className="text-lg font-semibold">{data.descricao}</p>
                </div>
                
                <div>
                  <Label className="text-sm text-slate-500">Texto Completo</Label>
                  <p className="text-base text-slate-700 whitespace-pre-wrap">{data.textoCompleto}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
                  <div>
                    <Label className="text-sm text-slate-500">Tipo</Label>
                    <p className="text-lg font-semibold">
                      <Badge variant="secondary">{data.tipo}</Badge>
                    </p>
                  </div>
                  
                  <div>
                    <Label className="text-sm text-slate-500">Legislação</Label>
                    <p className="text-lg font-semibold">{data.legislacaoNome}</p>
                  </div>

                  {data.penaMin && (
                    <div>
                      <Label className="text-sm text-slate-500">Pena Mínima</Label>
                      <p className="text-lg font-semibold">{data.penaMin}</p>
                    </div>
                  )}

                  {data.penaMax && (
                    <div>
                      <Label className="text-sm text-slate-500">Pena Máxima</Label>
                      <p className="text-lg font-semibold">{data.penaMax}</p>
                    </div>
                  )}
                </div>

                {data.paragrafo && (
                  <div>
                    <Label className="text-sm text-slate-500">Parágrafo</Label>
                    <p className="text-lg font-semibold">{data.paragrafo}º</p>
                  </div>
                )}

                {data.inciso && (
                  <div>
                    <Label className="text-sm text-slate-500">Inciso</Label>
                    <p className="text-lg font-semibold">{data.inciso}</p>
                  </div>
                )}

                {data.alinea && (
                  <div>
                    <Label className="text-sm text-slate-500">Alínea</Label>
                    <p className="text-lg font-semibold">{data.alinea}</p>
                  </div>
                )}
              </div>

              <div className="mt-6 pt-6 border-t">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">
                      Fonte: Cache
                    </Badge>
                    {responseTime && responseTime < 5 && (
                      <Badge variant="secondary" className="bg-green-100 text-green-800">
                        ⚡ Ultra-rápido
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card>
            <CardContent className="pt-6 text-center">
              <div className="text-3xl mb-2">⚡</div>
              <h3 className="font-semibold mb-1">Cache Permanente</h3>
              <p className="text-sm text-slate-600">Dados fixos sempre disponíveis</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6 text-center">
              <div className="text-3xl mb-2">⚖️</div>
              <h3 className="font-semibold mb-1">Dados Oficiais</h3>
              <p className="text-sm text-slate-600">Código Penal brasileiro</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6 text-center">
              <div className="text-3xl mb-2">💯</div>
              <h3 className="font-semibold mb-1">100% Gratuito</h3>
              <p className="text-sm text-slate-600">Gratuito e sem cadastro</p>
            </CardContent>
          </Card>
        </div>

        {/* CTA */}
        <Card className="bg-gradient-to-r from-red-600 to-orange-600 border-0 text-white">
          <CardContent className="p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">Precisa integrar artigos penais no seu sistema?</h2>
            <p className="text-lg mb-6 text-red-100">
              Use nossa API profissional com <strong>1.000 requests/dia gratuitos</strong>
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <Button asChild size="lg" variant="secondary">
                <Link href="/playground?api=penal">
                  Testar no Playground
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="bg-white/10 hover:bg-white/20 text-white border-white/30">
                <Link href="/painel/register">
                  Criar Conta Grátis
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* SEO Content */}
        <div className="mt-12 prose prose-slate max-w-none">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">O que são Artigos Penais?</h2>
          <p className="text-slate-600 mb-4">
            Os <strong>artigos penais</strong> são dispositivos legais que compõem o Código Penal Brasileiro (CP) 
            e a Lei de Contravenções Penais (LCP), definindo crimes e contravenções penais, suas características 
            e as penas aplicáveis. Cada artigo possui uma estrutura hierárquica que pode incluir parágrafos, 
            incisos e alíneas, permitindo uma organização detalhada das normas penais.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mb-4 mt-8">Como Consultar Artigos Penais?</h2>
          <p className="text-slate-600 mb-4">
            Consultar um artigo penal é simples: basta digitar o código do artigo (ex: 121 para Homicídio, 
            157 para Roubo, 155 para Furto) na ferramenta acima. Nossa plataforma busca automaticamente no 
            banco de dados oficial, com mais de 80 artigos disponíveis, garantindo informações precisas e 
            atualizadas sobre o artigo, incluindo descrição, texto completo, tipo, legislação e penas.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mb-4 mt-8">API de Artigos Penais para Desenvolvedores</h2>
          <p className="text-slate-600 mb-4">
            Se você é desenvolvedor e precisa integrar consulta de artigos penais no seu site, aplicativo ou sistema, 
            nossa{' '}
            <Link href="/apis/penal" className="text-red-600 hover:underline">API de Artigos Penais</Link> oferece:
          </p>
          <ul className="list-disc list-inside text-slate-600 space-y-2 mb-4">
            <li>Cache permanente no Redis para dados fixos</li>
            <li>Mais de 80 artigos do CP e LCP disponíveis</li>
            <li>Busca por texto, código, tipo e legislação</li>
            <li>1.000 requests gratuitos por dia</li>
            <li>Documentação completa com exemplos em JavaScript, Python e PHP</li>
            <li>Perfeito para autocomplete e componentes de busca</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
