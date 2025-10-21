'use client';

import { useEffect, useState } from 'react';
import { useRequireAuth } from '@/lib/hooks/use-auth';
import PainelLayout from '@/components/layouts/painel-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { getMyAPIKeys, createMyAPIKey, deleteMyAPIKey } from '@/lib/api/tenant';

export default function PainelAPIKeysPage() {
  const { isReady } = useRequireAuth('TENANT_USER');
  const [apikeys, setApikeys] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [showCreate, setShowCreate] = useState(false);
  const [newKeyName, setNewKeyName] = useState('');
  const [createdKey, setCreatedKey] = useState<string | null>(null);

  useEffect(() => {
    if (isReady) {
      loadAPIKeys();
    }
  }, [isReady]);

  const loadAPIKeys = async () => {
    try {
      const data = await getMyAPIKeys();
      setApikeys(data.apikeys || []);
    } catch (error) {
      console.error('Erro ao carregar API keys:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    if (!newKeyName.trim()) return;

    try {
      setCreating(true);
      const data = await createMyAPIKey(newKeyName);
      setCreatedKey(data.key);
      setNewKeyName('');
      setShowCreate(false);
      loadAPIKeys();
    } catch (error) {
      console.error('Erro ao criar API key:', error);
      alert('Erro ao criar API key');
    } finally {
      setCreating(false);
    }
  };

  const handleDelete = async (keyId: string) => {
    if (!confirm('Tem certeza que deseja revogar esta API key?')) return;

    try {
      await deleteMyAPIKey(keyId);
      loadAPIKeys();
    } catch (error) {
      console.error('Erro ao deletar API key:', error);
      alert('Erro ao revogar API key');
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('API Key copiada!');
  };

  if (!isReady || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <PainelLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Minhas API Keys</h1>
            <p className="text-slate-500 mt-1">
              Gerencie suas chaves de acesso à API
            </p>
          </div>
          <Button
            className="bg-gradient-to-r from-blue-600 to-purple-600"
            onClick={() => setShowCreate(!showCreate)}
          >
            + Nova API Key
          </Button>
        </div>

        {/* Formulário de criação */}
        {showCreate && (
          <Card className="border-blue-200 bg-blue-50/50">
            <CardHeader>
              <CardTitle>Criar Nova API Key</CardTitle>
              <CardDescription>
                Dê um nome para identificar onde será usada
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="keyName">Nome da API Key</Label>
                  <Input
                    id="keyName"
                    placeholder="Ex: App Mobile, Site Produção, etc"
                    value={newKeyName}
                    onChange={(e) => setNewKeyName(e.target.value)}
                    disabled={creating}
                  />
                </div>
                <div className="flex space-x-2">
                  <Button
                    onClick={handleCreate}
                    disabled={creating || !newKeyName.trim()}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                  >
                    {creating ? 'Criando...' : 'Criar API Key'}
                  </Button>
                  <Button variant="outline" onClick={() => setShowCreate(false)}>
                    Cancelar
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Key criada (mostrar apenas uma vez) */}
        {createdKey && (
          <Card className="border-green-200 bg-green-50/50">
            <CardHeader>
              <CardTitle className="text-green-700">✅ API Key Criada!</CardTitle>
              <CardDescription className="text-green-600">
                Copie agora! Esta chave não será mostrada novamente.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2">
                <Input
                  value={createdKey}
                  readOnly
                  className="font-mono bg-white"
                />
                <Button
                  onClick={() => copyToClipboard(createdKey)}
                  variant="outline"
                >
                  Copiar
                </Button>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="mt-2"
                onClick={() => setCreatedKey(null)}
              >
                Fechar
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Lista de keys */}
        <Card>
          <CardHeader>
            <CardTitle>Suas API Keys</CardTitle>
            <CardDescription>
              {apikeys.length} chave(s) ativa(s)
            </CardDescription>
          </CardHeader>
          <CardContent>
            {apikeys.length === 0 ? (
              <div className="text-center py-12 text-slate-500">
                <p className="text-lg mb-2">Você ainda não tem API keys</p>
                <p className="text-sm mb-4">
                  Crie sua primeira chave para começar a usar a API
                </p>
                <Button
                  onClick={() => setShowCreate(true)}
                  className="bg-gradient-to-r from-blue-600 to-purple-600"
                >
                  + Criar Primeira API Key
                </Button>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Key ID</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Expira em</TableHead>
                    <TableHead>Criada em</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {apikeys.map((key: any) => (
                    <TableRow key={key.keyId}>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <code className="text-xs bg-slate-100 px-2 py-1 rounded">
                            {key.keyId}
                          </code>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyToClipboard(key.keyId)}
                          >
                            📋
                          </Button>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={key.revoked ? "destructive" : "default"}>
                          {key.revoked ? 'Revogada' : 'Ativa'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-slate-500">
                        {new Date(key.expiresAt).toLocaleDateString('pt-BR')}
                      </TableCell>
                      <TableCell className="text-sm text-slate-500">
                        {new Date(key.createdAt).toLocaleDateString('pt-BR')}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDelete(key.keyId)}
                          disabled={key.revoked}
                        >
                          Revogar
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </PainelLayout>
  );
}

