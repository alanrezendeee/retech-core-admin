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
import { RotateCcw, Trash2, Copy, Plus } from 'lucide-react';
import { toast } from 'sonner';
import api from '@/lib/api/client';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

export default function PainelAPIKeysPage() {
  const { isReady } = useRequireAuth('TENANT_USER');
  const [apikeys, setApikeys] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [showCreate, setShowCreate] = useState(false);
  const [newKeyName, setNewKeyName] = useState('');
  const [createdKey, setCreatedKey] = useState<string | null>(null);
  const [showRevokeDialog, setShowRevokeDialog] = useState(false);
  const [showRotateDialog, setShowRotateDialog] = useState(false);
  const [keyToRevoke, setKeyToRevoke] = useState<any | null>(null);
  const [keyToRotate, setKeyToRotate] = useState<any | null>(null);
  const [newRotatedKey, setNewRotatedKey] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRotating, setIsRotating] = useState(false); // ✅ Flag adicional para bloqueio

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
      toast.success('API Key criada com sucesso!');
      loadAPIKeys();
    } catch (error) {
      console.error('Erro ao criar API key:', error);
      toast.error('Erro ao criar API key');
    } finally {
      setCreating(false);
    }
  };

  const handleRotateAPIKey = (key: any) => {
    setKeyToRotate(key);
    setNewRotatedKey(null);
    setIsRotating(false); // ✅ Reset flag
    setShowRotateDialog(true);
  };

  const confirmRotateAPIKey = async () => {
    if (!keyToRotate) return;

    // ✅ Seta flag ANTES de tudo
    setIsRotating(true);

    try {
      setIsSubmitting(true);
      
      const response = await api.post(`/me/apikeys/${keyToRotate.keyId}/rotate`);
      
      // Guardar a nova chave para exibir NO MODAL
      if (response.data.key) {
        setNewRotatedKey(response.data.key);
        // ✅ Modal vai trocar de conteúdo para exibir a key
        // Aguardar um pouco para garantir que o estado foi atualizado
        await new Promise(resolve => setTimeout(resolve, 100));
      }
      
      // Recarregar lista em background (sem fechar modal)
      loadAPIKeys();
    } catch (error: any) {
      console.error('Erro ao rotacionar API key:', error);
      if (error.response?.status === 403) {
        toast.error('Você não tem permissão para rotacionar esta key');
      } else {
        toast.error('Erro ao rotacionar API key');
      }
      setShowRotateDialog(false);
      setKeyToRotate(null);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRevokeAPIKey = (key: any) => {
    setKeyToRevoke(key);
    setShowRevokeDialog(true);
  };

  const confirmRevokeAPIKey = async () => {
    if (!keyToRevoke) return;

    try {
      setIsSubmitting(true);
      await deleteMyAPIKey(keyToRevoke.keyId);
      toast.success('API key revogada com sucesso!');
      await loadAPIKeys();
    } catch (error) {
      console.error('Erro ao revogar API key:', error);
      toast.error('Erro ao revogar API key');
    } finally {
      setIsSubmitting(false);
      setShowRevokeDialog(false);
      setKeyToRevoke(null);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copiado para a área de transferência!');
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
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            onClick={() => setShowCreate(!showCreate)}
          >
            <Plus className="w-4 h-4 mr-2" />
            Nova API Key
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
                        <div className="flex items-center gap-2">
                          <code className="text-xs bg-slate-100 px-2 py-1 rounded font-mono">
                            {key.keyId}
                          </code>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyToClipboard(key.keyId)}
                            title="Copiar Key ID"
                          >
                            <Copy className="w-3 h-3" />
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
                        <div className="flex gap-2 justify-end">
                          {!key.revoked && (
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleRotateAPIKey(key)}
                              title="Rotacionar API Key"
                            >
                              <RotateCcw className="w-4 h-4" />
                            </Button>
                          )}
                          {!key.revoked && (
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => handleRevokeAPIKey(key)}
                              title="Revogar API Key"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* AlertDialog para revogar */}
        <AlertDialog open={showRevokeDialog} onOpenChange={setShowRevokeDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Revogar API Key</AlertDialogTitle>
              <AlertDialogDescription>
                Tem certeza que deseja revogar a API key &quot;{keyToRevoke?.keyId}&quot;?
                Esta ação não pode ser desfeita e a chave deixará de funcionar imediatamente.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={isSubmitting}>Cancelar</AlertDialogCancel>
              <AlertDialogAction 
                onClick={confirmRevokeAPIKey}
                disabled={isSubmitting}
                className="bg-red-600 hover:bg-red-700"
              >
                {isSubmitting ? 'Revogando...' : 'Revogar'}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* AlertDialog para rotacionar */}
        <AlertDialog open={showRotateDialog} onOpenChange={(open) => {
          // ✅ NÃO permitir fechar se estiver rotacionando OU se tiver nova key
          if (!open && !isRotating && !newRotatedKey) {
            setShowRotateDialog(false);
            setKeyToRotate(null);
            setNewRotatedKey(null);
            setIsRotating(false);
          }
        }}>
          <AlertDialogContent className="max-w-2xl">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-xl">
                {newRotatedKey ? '✅ Nova API Key Gerada!' : '🔄 Rotacionar API Key'}
              </AlertDialogTitle>
              <AlertDialogDescription asChild>
                {newRotatedKey ? (
                  <div className="space-y-4">
                    <div className="text-sm text-slate-700">
                      <strong className="text-amber-700">⚠️ IMPORTANTE:</strong> Esta é sua nova API Key. 
                      Copie-a agora, pois ela <strong>não será exibida novamente</strong> por questões de segurança.
                    </div>
                    
                    <div className="p-4 bg-gradient-to-br from-blue-50 to-purple-50 border-2 border-blue-200 rounded-lg">
                      <div className="text-xs text-slate-600 mb-2 font-semibold">SUA NOVA API KEY:</div>
                      <div className="font-mono text-sm break-all bg-white p-3 rounded border border-blue-300 select-all">
                        {newRotatedKey}
                      </div>
                    </div>

                    <div className="flex items-start gap-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-xs">
                      <span className="text-yellow-700">💡</span>
                      <div className="text-yellow-800">
                        <strong>A chave antiga foi revogada</strong> e não funciona mais. 
                        Atualize suas aplicações com esta nova chave.
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <p className="text-sm">
                      Tem certeza que deseja rotacionar a API key?
                    </p>
                    <div className="p-3 bg-slate-100 rounded-lg border border-slate-200">
                      <div className="text-xs text-slate-600 mb-1">Key ID:</div>
                      <code className="text-sm font-mono">{keyToRotate?.keyId}</code>
                    </div>
                    <div className="flex items-start gap-2 p-3 bg-amber-50 border border-amber-200 rounded-lg text-sm">
                      <span>⚠️</span>
                      <div className="text-amber-800">
                        <strong>Atenção:</strong> A chave antiga será <strong>revogada imediatamente</strong> e 
                        uma nova chave será gerada. Aplicações usando a chave antiga deixarão de funcionar.
                      </div>
                    </div>
                  </div>
                )}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              {newRotatedKey ? (
                <>
                  <AlertDialogAction 
                    onClick={() => {
                      navigator.clipboard.writeText(newRotatedKey);
                      toast.success('✅ API Key copiada para a área de transferência!');
                      setShowRotateDialog(false);
                      setKeyToRotate(null);
                      setNewRotatedKey(null);
                      setIsRotating(false); // ✅ Limpa flag
                    }}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                  >
                    <Copy className="w-4 h-4 mr-2" />
                    Copiar e Fechar
                  </AlertDialogAction>
                  <AlertDialogCancel onClick={() => {
                    setShowRotateDialog(false);
                    setKeyToRotate(null);
                    setNewRotatedKey(null);
                    setIsRotating(false); // ✅ Limpa flag
                    toast.warning('⚠️ Certifique-se de ter salvo a API Key!');
                  }}>
                    Fechar sem Copiar
                  </AlertDialogCancel>
                </>
              ) : (
                <>
                  <AlertDialogCancel disabled={isSubmitting}>
                    Cancelar
                  </AlertDialogCancel>
                  <Button
                    onClick={(e) => {
                      e.stopPropagation(); // ✅ BLOQUEAR propagação!
                      confirmRotateAPIKey();
                    }}
                    disabled={isSubmitting}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Rotacionando...
                      </>
                    ) : (
                      <>
                        <RotateCcw className="w-4 h-4 mr-2" />
                        Sim, Rotacionar
                      </>
                    )}
                  </Button>
                </>
              )}
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </PainelLayout>
  );
}

