'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Search, MapPin, Clock, Share2, ArrowRight, Building2, Map } from 'lucide-react';
import { toast } from 'sonner';

interface CEPResult {
  cep: string;
  logradouro: string;
  complemento?: string;
  bairro: string;
  localidade: string;
  uf: string;
  ibge?: string;
  ddd?: string;
  source: string;
}

interface SearchResponse {
  results: CEPResult[];
  count: number;
  source: string;
}

export default function BuscarCEPPage() {
  const [uf, setUf] = useState('');
  const [cidade, setCidade] = useState('');
  const [logradouro, setLogradouro] = useState('');
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<SearchResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [responseTime, setResponseTime] = useState<number | null>(null);
  const [demoApiKey, setDemoApiKey] = useState('');

  const apiBaseURL = process.env.NEXT_PUBLIC_API_URL || 'https://api-core.theretech.com.br';

  // ✅ Buscar API Key demo do backend
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

  const handleBusca = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validações
    if (!uf || !cidade || !logradouro) {
      toast.error('Preencha todos os campos obrigatórios');
      return;
    }

    if (uf.length !== 2) {
      toast.error('UF deve ter 2 caracteres (ex: SP, RJ)');
      return;
    }

    if (cidade.length < 3 || logradouro.length < 3) {
      toast.error('Cidade e logradouro devem ter no mínimo 3 caracteres');
      return;
    }

    setLoading(true);
    setError(null);
    setData(null);
    setResponseTime(null);

    const startTime = performance.now();

    try {
      const params = new URLSearchParams({
        uf: uf.toUpperCase(),
        cidade,
        logradouro,
      });

      const response = await fetch(`${apiBaseURL}/public/cep/buscar?${params}`, {
        headers: {
          'X-API-Key': demoApiKey
        }
      });
      
      const endTime = performance.now();
      setResponseTime(Math.round(endTime - startTime));

      if (!response.ok) {
        throw new Error('Nenhum CEP encontrado');
      }

      const result = await response.json();
      setData(result);
      
      toast.success(`${result.count} CEP(s) encontrado(s)!`);
    } catch (err) {
      setError('Nenhum CEP encontrado para o endereço informado.');
      toast.error('Nenhum resultado encontrado');
    } finally {
      setLoading(false);
    }
  };

  const formatCEP = (cep: string) => {
    if (cep.length !== 8) return cep;
    return `${cep.slice(0, 5)}-${cep.slice(5)}`;
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('CEP copiado!');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Map className="h-10 w-10 text-blue-600" />
            <h1 className="text-4xl font-bold text-gray-900">
              Buscar CEP por Endereço
            </h1>
          </div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Encontre o CEP a partir do endereço. Digite a rua, cidade e estado.
          </p>
        </div>

        {/* Search Form */}
        <Card className="mb-8 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              Busca Reversa de CEP
            </CardTitle>
            <CardDescription>
              Preencha os campos abaixo para encontrar o CEP correspondente
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleBusca} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="uf">UF (Estado) *</Label>
                  <Input
                    id="uf"
                    placeholder="Ex: SP"
                    value={uf}
                    onChange={(e) => setUf(e.target.value.toUpperCase())}
                    maxLength={2}
                    disabled={loading}
                    className="text-lg"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cidade">Cidade *</Label>
                  <Input
                    id="cidade"
                    placeholder="Ex: São Paulo"
                    value={cidade}
                    onChange={(e) => setCidade(e.target.value)}
                    disabled={loading}
                    className="text-lg"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="logradouro">Logradouro (Rua) *</Label>
                  <Input
                    id="logradouro"
                    placeholder="Ex: Paulista"
                    value={logradouro}
                    onChange={(e) => setLogradouro(e.target.value)}
                    disabled={loading}
                    className="text-lg"
                  />
                </div>
              </div>

              <Button
                type="submit"
                className="w-full"
                size="lg"
                disabled={loading || !demoApiKey}
              >
                {loading ? (
                  <>
                    <Clock className="mr-2 h-4 w-4 animate-spin" />
                    Buscando...
                  </>
                ) : (
                  <>
                    <Search className="mr-2 h-4 w-4" />
                    Buscar CEPs
                  </>
                )}
              </Button>
            </form>

            {/* Info */}
            <Alert className="mt-4 border-blue-200 bg-blue-50">
              <MapPin className="h-4 w-4 text-blue-600" />
              <AlertDescription className="text-blue-800">
                <strong>Dica:</strong> Quanto mais específico o logradouro, mais preciso será o resultado.
                Retorna até 50 CEPs por busca.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>

        {/* Error */}
        {error && (
          <Alert variant="destructive" className="mb-8">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Results */}
        {data && data.results.length > 0 && (
          <div className="space-y-4">
            {/* Summary */}
            <Card className="shadow-xl border-green-200 bg-green-50">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-green-900">
                      {data.count} CEP(s) Encontrado(s)
                    </h3>
                    <p className="text-sm text-green-700">
                      Busca em: {cidade}/{uf} - {logradouro}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    {responseTime && (
                      <Badge variant="outline" className="border-green-600 text-green-700">
                        <Clock className="mr-1 h-3 w-3" />
                        {responseTime}ms
                      </Badge>
                    )}
                    <Badge variant="outline" className="border-blue-600 text-blue-700">
                      {data.source}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Results Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {data.results.map((result, index) => (
                <Card key={index} className="shadow-lg hover:shadow-xl transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-2xl font-bold text-blue-600">
                        {formatCEP(result.cep)}
                      </CardTitle>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => copyToClipboard(result.cep)}
                      >
                        Copiar
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div>
                      <Label className="text-xs text-gray-500">Logradouro</Label>
                      <p className="font-medium">{result.logradouro || '-'}</p>
                    </div>
                    {result.complemento && (
                      <div>
                        <Label className="text-xs text-gray-500">Complemento</Label>
                        <p className="font-medium">{result.complemento}</p>
                      </div>
                    )}
                    <div>
                      <Label className="text-xs text-gray-500">Bairro</Label>
                      <p className="font-medium">{result.bairro || '-'}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-gray-400" />
                      <span className="font-medium">
                        {result.localidade}/{result.uf}
                      </span>
                    </div>
                    {result.ddd && (
                      <div className="pt-2 border-t">
                        <span className="text-xs text-gray-500">DDD: </span>
                        <span className="font-medium">{result.ddd}</span>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Features */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border-blue-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-blue-700">
                <Search className="h-5 w-5" />
                Busca Inteligente
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Encontra CEPs por aproximação do nome da rua, facilitando sua busca mesmo com nomes parciais.
              </p>
            </CardContent>
          </Card>

          <Card className="border-green-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-700">
                <Clock className="h-5 w-5" />
                Cache Inteligente
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Sistema de cache em duas camadas (Redis + MongoDB) garante respostas ultra-rápidas.
              </p>
            </CardContent>
          </Card>

          <Card className="border-purple-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-purple-700">
                <Building2 className="h-5 w-5" />
                Dados Oficiais
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Integrado com ViaCEP, garantindo dados atualizados e confiáveis dos Correios.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* CTA */}
        <div className="mt-12 text-center">
          <Card className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-2xl">
            <CardContent className="pt-6">
              <h3 className="text-2xl font-bold mb-2">
                Gostou da Ferramenta?
              </h3>
              <p className="text-blue-100 mb-6">
                Integre essa e outras APIs no seu projeto! Consulte a documentação e crie sua conta.
              </p>
              <div className="flex justify-center gap-4">
                <Link href="/playground">
                  <Button variant="secondary" size="lg">
                    Ver Playground Completo
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/ferramentas/consultar-cep">
                  <Button variant="outline" size="lg" className="bg-white/10 text-white border-white/20 hover:bg-white/20">
                    Consultar CEP Normal
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}



