'use client';

import { useRequireAuth } from '@/lib/hooks/use-auth';
import PainelLayout from '@/components/layouts/painel-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function PainelDocsPage() {
  const { isReady } = useRequireAuth('TENANT_USER');

  if (!isReady) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <PainelLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Documentação</h1>
          <p className="text-slate-500 mt-1">
            Como usar a Retech Core API
          </p>
        </div>

        {/* Quick Start */}
        <Card>
          <CardHeader>
            <CardTitle>🚀 Quick Start</CardTitle>
            <CardDescription>Comece em 3 passos</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">1. Obtenha sua API Key</h3>
              <p className="text-sm text-slate-600">
                Vá para <a href="/painel/apikeys" className="text-blue-600 underline">Minhas API Keys</a> e crie sua primeira chave de acesso.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-2">2. Faça sua primeira request</h3>
              <pre className="bg-slate-900 text-slate-100 p-4 rounded-lg text-sm overflow-x-auto">
{`curl https://core.theretech.com.br/api/geo/ufs \\
  -H "x-api-key: sua_api_key_aqui"`}
              </pre>
            </div>

            <div>
              <h3 className="font-semibold mb-2">3. Pronto! 🎉</h3>
              <p className="text-sm text-slate-600">
                Você tem acesso a todos os endpoints GEO com 1.000 requests gratuitos por dia.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Endpoints */}
        <Card>
          <CardHeader>
            <CardTitle>📡 Endpoints Disponíveis</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="font-semibold mb-3 flex items-center">
                <span className="text-2xl mr-2">🗺️</span>
                Estados (UFs)
              </h3>
              <div className="space-y-2 ml-10">
                <div className="bg-slate-50 p-3 rounded">
                  <code className="text-sm">GET /api/geo/ufs</code>
                  <p className="text-xs text-slate-600 mt-1">Lista todos os 27 estados brasileiros</p>
                </div>
                <div className="bg-slate-50 p-3 rounded">
                  <code className="text-sm">GET /api/geo/ufs/:sigla</code>
                  <p className="text-xs text-slate-600 mt-1">Busca estado por sigla (ex: PE, SP)</p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-3 flex items-center">
                <span className="text-2xl mr-2">🏙️</span>
                Municípios
              </h3>
              <div className="space-y-2 ml-10">
                <div className="bg-slate-50 p-3 rounded">
                  <code className="text-sm">GET /api/geo/municipios/:uf</code>
                  <p className="text-xs text-slate-600 mt-1">Lista municípios de um estado</p>
                </div>
                <div className="bg-slate-50 p-3 rounded">
                  <code className="text-sm">GET /api/geo/municipios?uf=PE&q=recife</code>
                  <p className="text-xs text-slate-600 mt-1">Busca municípios por nome</p>
                </div>
                <div className="bg-slate-50 p-3 rounded">
                  <code className="text-sm">GET /api/geo/municipios/id/:id</code>
                  <p className="text-xs text-slate-600 mt-1">Busca por código IBGE</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Exemplos */}
        <Card>
          <CardHeader>
            <CardTitle>💻 Exemplos de Código</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">JavaScript / Node.js</h3>
              <pre className="bg-slate-900 text-slate-100 p-4 rounded-lg text-xs overflow-x-auto">
{`const axios = require('axios');

const API_KEY = 'sua_api_key_aqui';
const BASE_URL = 'https://core.theretech.com.br/api';

// Buscar todos os estados
const estados = await axios.get(\`\${BASE_URL}/geo/ufs\`, {
  headers: { 'x-api-key': API_KEY }
});

console.log(estados.data);`}
              </pre>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Python</h3>
              <pre className="bg-slate-900 text-slate-100 p-4 rounded-lg text-xs overflow-x-auto">
{`import requests

API_KEY = "sua_api_key_aqui"
BASE_URL = "https://core.theretech.com.br/api"

# Buscar municípios de PE
response = requests.get(
    f"{BASE_URL}/geo/municipios/PE",
    headers={"x-api-key": API_KEY}
)

print(response.json())`}
              </pre>
            </div>
          </CardContent>
        </Card>

        {/* Rate Limits */}
        <Card>
          <CardHeader>
            <CardTitle>⏱️ Rate Limits</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <span className="font-medium">Plano Free:</span>
                <span className="text-slate-600">1.000 requests por dia</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-medium">Por minuto:</span>
                <span className="text-slate-600">100 requests</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-medium">Headers retornados:</span>
                <span className="font-mono text-xs">X-RateLimit-*</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Link para docs completa */}
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="pt-6">
            <p className="text-sm text-blue-900">
              📖 Documentação completa da API:{' '}
              <a
                href="http://localhost:8080/docs"
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold underline"
              >
                Ver Redoc →
              </a>
            </p>
          </CardContent>
        </Card>
      </div>
    </PainelLayout>
  );
}

