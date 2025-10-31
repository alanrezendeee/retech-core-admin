'use client';

import { useEffect, useState } from 'react';
import { useRequireAuth } from '@/lib/hooks/use-auth';
import AdminLayout from '@/components/layouts/admin-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { listAllAPIKeys, listAllTenants } from '@/lib/api/admin';
import { APIKeyDrawer } from '@/components/apikeys/apikey-drawer';
import { Plus, Key, Eye, RotateCcw, Trash2, Copy } from 'lucide-react';
import { toast } from 'sonner';
import api from '@/lib/api/client';
import { EmptyState } from '@/components/ui/empty-state';
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

interface APIKey {
  id: string;
  keyId: string;
  ownerId: string;
  scopes: string[];
  expiresAt: string;
  revoked: boolean;
  createdAt: string;
  lastUsed?: string;
}

interface Tenant {
  id: string;
  tenantId: string;
  name: string;
  email: string;
  active: boolean;
}

export default function AdminAPIKeysPage() {
  const { isReady } = useRequireAuth('SUPER_ADMIN');
  const [apikeys, setApikeys] = useState<APIKey[]>([]);
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedAPIKey, setSelectedAPIKey] = useState<APIKey | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showRevokeDialog, setShowRevokeDialog] = useState(false);
  const [showRotateDialog, setShowRotateDialog] = useState(false);
  const [keyToRevoke, setKeyToRevoke] = useState<APIKey | null>(null);
  const [keyToRotate, setKeyToRotate] = useState<APIKey | null>(null);
  const [newRotatedKey, setNewRotatedKey] = useState<string | null>(null);
  const [isRotating, setIsRotating] = useState(false); // ✅ Flag adicional para bloqueio
  const [newCreatedKey, setNewCreatedKey] = useState<string | null>(null);
  const [showCreatedKeyDialog, setShowCreatedKeyDialog] = useState(false);

  useEffect(() => {
    if (isReady) {
      loadData();
    }
  }, [isReady]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [apikeysData, tenantsData] = await Promise.all([
        listAllAPIKeys(),
        listAllTenants()
      ]);
      setApikeys(apikeysData.apikeys || []);
      setTenants(tenantsData.tenants || []);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      toast.error('Erro ao carregar dados');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAPIKey = () => {
    setSelectedAPIKey(null);
    setIsDrawerOpen(true);
  };

  const handleViewAPIKey = (apikey: APIKey) => {
    setSelectedAPIKey(apikey);
    setIsDrawerOpen(true);
  };

  const handleCreateAPIKeySubmit = async (data: { ownerId: string; scopes: string[]; days: number }) => {
    try {
      setIsSubmitting(true);
      
      const response = await api.post('/admin/apikeys', data);
      
      // Mostrar a chave criada em um dialog (não em toast)
      if (response.data.api_key) {
        setNewCreatedKey(response.data.api_key);
        setShowCreatedKeyDialog(true);
        setIsDrawerOpen(false); // Fechar drawer de criação
      }

      await loadData();
    } catch (error) {
      console.error('Erro ao criar API key:', error);
      toast.error('Erro ao criar API key');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRotateAPIKey = (key: APIKey) => {
    setKeyToRotate(key);
    setNewRotatedKey(null);
    setIsRotating(false); // ✅ Reset flag
    setShowRotateDialog(true);
  };

  const confirmRotateAPIKey = async () => {
    if (!keyToRotate) return;

    console.log('🔄 [ROTATE] Iniciando rotação...', keyToRotate.keyId);

    // ✅ Seta flag ANTES de tudo
    setIsRotating(true);
    
    try {
      setIsSubmitting(true);
      console.log('🔄 [ROTATE] isSubmitting = true, isRotating = true');
      
      const response = await api.post('/admin/apikeys/rotate', { keyId: keyToRotate.keyId });
      console.log('🔄 [ROTATE] Resposta da API:', response.data);
      
      // Guardar a nova chave para exibir NO MODAL
      if (response.data.api_key) {
        console.log('🔄 [ROTATE] Nova key recebida, setando estado...');
        setNewRotatedKey(response.data.api_key);
        console.log('🔄 [ROTATE] newRotatedKey setado:', response.data.api_key.substring(0, 20) + '...');
        
        // ✅ Modal vai trocar de conteúdo para exibir a key
        // Aguardar um pouco para garantir que o estado foi atualizado
        await new Promise(resolve => setTimeout(resolve, 100));
        console.log('🔄 [ROTATE] Aguardou 100ms para React re-render');
      } else {
        console.error('❌ [ROTATE] response.data.api_key está vazio!', response.data);
      }
      
      // Recarregar lista em background (sem fechar modal)
      console.log('🔄 [ROTATE] Recarregando lista em background...');
      loadData();
    } catch (error) {
      console.error('❌ [ROTATE] Erro ao rotacionar API key:', error);
      toast.error('Erro ao rotacionar API key');
      setShowRotateDialog(false);
      setKeyToRotate(null);
    } finally {
      setIsSubmitting(false);
      console.log('🔄 [ROTATE] isSubmitting = false, concluído!');
    }
  };

  const handleRevokeAPIKey = (key: APIKey) => {
    setKeyToRevoke(key);
    setShowRevokeDialog(true);
  };

  const confirmRevokeAPIKey = async () => {
    if (!keyToRevoke) return;

    try {
      setIsSubmitting(true);
      
      await api.post('/admin/apikeys/revoke', { keyId: keyToRevoke.keyId });
      toast.success('API key revogada com sucesso!');
      await loadData();
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

  const getTenantName = (ownerId: string) => {
    const tenant = tenants.find(t => t.tenantId === ownerId);
    return tenant ? tenant.name : ownerId;
  };

  const isExpired = (expiresAt: string) => new Date(expiresAt) < new Date();
  const isExpiringSoon = (expiresAt: string) => {
    const daysLeft = Math.ceil((new Date(expiresAt).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
    return daysLeft <= 7 && daysLeft > 0;
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
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">API Keys</h1>
            <p className="text-slate-500 mt-1">
              Gerenciar todas as chaves de acesso do sistema
            </p>
          </div>
          <Button 
            onClick={handleCreateAPIKey}
            className="bg-gradient-to-r from-blue-600 to-purple-600"
          >
            <Plus className="w-4 h-4 mr-2" />
            Nova API Key
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Key className="w-5 h-5" />
              Todas as API Keys
            </CardTitle>
            <CardDescription>
              {apikeys.length} chave(s) no sistema
            </CardDescription>
          </CardHeader>
          <CardContent>
            {apikeys.length === 0 ? (
              <EmptyState
                icon={Key}
                title="Nenhuma API key criada"
                description="Crie API keys para seus tenants acessarem a plataforma de forma segura"
                action={{
                  label: 'Criar Primeira API Key',
                  onClick: handleCreateAPIKey
                }}
              />
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Key ID</TableHead>
                    <TableHead>Tenant</TableHead>
                    <TableHead>Scopes</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Expira em</TableHead>
                    <TableHead>Criada em</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {apikeys.map((key, index) => (
                    <TableRow key={key.id || `${key.keyId}-${index}`}>
                      <TableCell className="font-mono text-xs">
                        <div className="flex items-center gap-2">
                          <span>{key.keyId}</span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyToClipboard(key.keyId)}
                          >
                            <Copy className="w-3 h-3" />
                          </Button>
                        </div>
                      </TableCell>
                      <TableCell>{getTenantName(key.ownerId)}</TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {key.scopes.map((scope, scopeIndex) => (
                            <Badge key={`${key.id || key.keyId}-scope-${scopeIndex}-${scope}`} variant="outline" className="text-xs">
                              {scope}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          <Badge variant={key.revoked ? "destructive" : "default"}>
                            {key.revoked ? 'Revogada' : 'Ativa'}
                          </Badge>
                          {isExpired(key.expiresAt) && (
                            <Badge variant="destructive">Expirada</Badge>
                          )}
                          {isExpiringSoon(key.expiresAt) && !isExpired(key.expiresAt) && (
                            <Badge variant="secondary">Expirando</Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-slate-500">
                        {new Date(key.expiresAt).toLocaleDateString('pt-BR')}
                      </TableCell>
                      <TableCell className="text-sm text-slate-500">
                        {new Date(key.createdAt).toLocaleDateString('pt-BR')}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex gap-2 justify-end">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleViewAPIKey(key)}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          {!key.revoked && (
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleRotateAPIKey(key)}
                            >
                              <RotateCcw className="w-4 h-4" />
                            </Button>
                          )}
                          {!key.revoked && (
                            <Button 
                              variant="destructive" 
                              size="sm"
                              onClick={() => handleRevokeAPIKey(key)}
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

        <APIKeyDrawer
          isOpen={isDrawerOpen}
          onClose={() => setIsDrawerOpen(false)}
          onCreate={handleCreateAPIKeySubmit}
          onRotate={handleRotateAPIKey}
          onRevoke={handleRevokeAPIKey}
          apiKey={selectedAPIKey}
          tenants={tenants.map(t => ({ id: t.id, name: t.name, tenantId: t.tenantId }))}
          isLoading={isSubmitting}
        />

        {/* Dialog de API Key Criada */}
        <AlertDialog open={showCreatedKeyDialog} onOpenChange={setShowCreatedKeyDialog}>
          <AlertDialogContent className="max-w-2xl">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-xl">
                ✅ API Key Criada com Sucesso!
              </AlertDialogTitle>
              <AlertDialogDescription asChild>
                <div className="space-y-4">
                  <div className="text-sm text-slate-700">
                    <strong className="text-green-700">🎉 Sua API Key foi gerada!</strong>{' '}
                    Copie-a agora, pois ela <strong>não será exibida novamente</strong> por questões de segurança.
                  </div>
                  
                  <div className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 rounded-lg">
                    <div className="text-xs text-slate-600 mb-2 font-semibold">SUA NOVA API KEY:</div>
                    <div className="font-mono text-sm break-all bg-white p-3 rounded border border-green-300 select-all">
                      {newCreatedKey}
                    </div>
                  </div>

                  <div className="flex items-start gap-2 p-3 bg-blue-50 border border-blue-200 rounded-lg text-xs">
                    <span className="text-blue-700">💡</span>
                    <div className="text-blue-800">
                      <strong>Dica:</strong> Guarde esta chave em um local seguro (como variáveis de ambiente).
                      Você pode rotacioná-la a qualquer momento se necessário.
                    </div>
                  </div>
                </div>
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogAction 
                onClick={() => {
                  if (newCreatedKey) {
                    navigator.clipboard.writeText(newCreatedKey);
                    toast.success('✅ API Key copiada para a área de transferência!');
                  }
                  setShowCreatedKeyDialog(false);
                  setNewCreatedKey(null);
                }}
                className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
              >
                <Copy className="w-4 h-4 mr-2" />
                Copiar e Fechar
              </AlertDialogAction>
              <AlertDialogCancel onClick={() => {
                setShowCreatedKeyDialog(false);
                setNewCreatedKey(null);
                toast.warning('⚠️ Certifique-se de ter salvo a API Key!');
              }}>
                Fechar sem Copiar
              </AlertDialogCancel>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

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
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction 
                onClick={confirmRevokeAPIKey}
                className="bg-red-600 hover:bg-red-700"
              >
                Revogar
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        <AlertDialog open={showRotateDialog} onOpenChange={(open) => {
          console.log('🔄 [MODAL] onOpenChange chamado, open:', open, 'isRotating:', isRotating, 'newRotatedKey:', !!newRotatedKey);
          // ✅ NÃO permitir fechar se estiver rotacionando OU se tiver nova key
          if (!open && !isRotating && !newRotatedKey) {
            console.log('🔄 [MODAL] ✅ Permitido fechar, limpando estados...');
            setShowRotateDialog(false);
            setKeyToRotate(null);
            setNewRotatedKey(null);
            setIsRotating(false);
          } else if (!open) {
            console.log('🔄 [MODAL] ❌ BLOQUEADO! isRotating:', isRotating, 'newRotatedKey:', !!newRotatedKey);
          }
        }}>
          <AlertDialogContent className="max-w-2xl">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-xl">
                {(() => {
                  console.log('🔄 [MODAL] Renderizando título, newRotatedKey:', newRotatedKey ? 'EXISTE' : 'NULL');
                  return newRotatedKey ? '✅ Nova API Key Gerada!' : '🔄 Rotacionar API Key';
                })()}
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
    </AdminLayout>
  );
}