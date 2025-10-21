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
      toast.success('API key criada com sucesso!');
      
      // Mostrar a chave criada
      if (response.data.api_key) {
        toast.success(`API Key: ${response.data.api_key}`, {
          duration: 10000,
        });
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
    setShowRotateDialog(true);
  };

  const confirmRotateAPIKey = async () => {
    if (!keyToRotate) return;

    try {
      setIsSubmitting(true);
      
      const response = await api.post('/admin/apikeys/rotate', { keyId: keyToRotate.keyId });
      
      // Guardar a nova chave para exibir
      if (response.data.api_key) {
        setNewRotatedKey(response.data.api_key);
      }
      
      toast.success('API key rotacionada com sucesso!');
      await loadData();
    } catch (error) {
      console.error('Erro ao rotacionar API key:', error);
      toast.error('Erro ao rotacionar API key');
      setShowRotateDialog(false);
      setKeyToRotate(null);
    } finally {
      setIsSubmitting(false);
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
                  {apikeys.map((key) => (
                    <TableRow key={key.keyId}>
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
                          {key.scopes.map((scope) => (
                            <Badge key={scope} variant="outline" className="text-xs">
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
          setShowRotateDialog(open);
          if (!open) {
            setKeyToRotate(null);
            setNewRotatedKey(null);
          }
        }}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Rotacionar API Key</AlertDialogTitle>
              {newRotatedKey ? (
                <AlertDialogDescription>
                  Nova API Key gerada com sucesso! Por favor, copie-a agora, pois ela não será exibida novamente.
                  <div className="mt-4 p-3 bg-slate-100 rounded-md break-all font-mono text-sm">
                    {newRotatedKey}
                  </div>
                </AlertDialogDescription>
              ) : (
                <AlertDialogDescription>
                  Tem certeza que deseja rotacionar a API key &quot;{keyToRotate?.keyId}&quot;?
                  A chave antiga será revogada e uma nova será gerada.
                </AlertDialogDescription>
              )}
            </AlertDialogHeader>
            <AlertDialogFooter>
              {newRotatedKey ? (
                <>
                  <AlertDialogCancel onClick={() => {
                    navigator.clipboard.writeText(newRotatedKey);
                    toast.success('API Key copiada!');
                  }}>
                    Copiar e Fechar
                  </AlertDialogCancel>
                  <AlertDialogAction onClick={() => {
                    setShowRotateDialog(false);
                    setKeyToRotate(null);
                    setNewRotatedKey(null);
                  }}>
                    Fechar
                  </AlertDialogAction>
                </>
              ) : (
                <>
                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                  <AlertDialogAction 
                    onClick={confirmRotateAPIKey}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                  >
                    Rotacionar
                  </AlertDialogAction>
                </>
              )}
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </AdminLayout>
  );
}