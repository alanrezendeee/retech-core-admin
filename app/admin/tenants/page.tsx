'use client';

import { useEffect, useState } from 'react';
import { useRequireAuth } from '@/lib/hooks/use-auth';
import AdminLayout from '@/components/layouts/admin-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { listAllTenants } from '@/lib/api/admin';
import { TenantDrawer } from '@/components/tenants/tenant-drawer';
import { Plus, Edit, Power, Trash2, Users } from 'lucide-react';
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

interface Tenant {
  id: string;
  tenantId: string;
  name: string;
  email: string;
  company?: string;
  purpose?: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function AdminTenantsPage() {
  const { isReady } = useRequireAuth('SUPER_ADMIN');
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedTenant, setSelectedTenant] = useState<Tenant | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [tenantToDelete, setTenantToDelete] = useState<Tenant | null>(null);

  useEffect(() => {
    if (isReady) {
      loadTenants();
    }
  }, [isReady]);

  const loadTenants = async () => {
    try {
      setLoading(true);
      const data = await listAllTenants();
      setTenants(data.tenants || []);
    } catch (error) {
      console.error('Erro ao carregar tenants:', error);
      toast.error('Erro ao carregar tenants');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTenant = () => {
    setSelectedTenant(null);
    setIsDrawerOpen(true);
  };

  const handleEditTenant = (tenant: Tenant) => {
    setSelectedTenant(tenant);
    setIsDrawerOpen(true);
  };

  const handleSaveTenant = async (tenantData: Partial<Tenant>) => {
    try {
      setIsSubmitting(true);
      
      if (selectedTenant) {
        // Atualizar tenant existente
        const response = await api.put(`/admin/tenants/${selectedTenant.tenantId}`, tenantData);
        toast.success('Tenant atualizado com sucesso!');
      } else {
        // Criar novo tenant
        const response = await api.post('/admin/tenants', tenantData);
        toast.success('Tenant criado com sucesso!');
      }

      // Recarregar lista
      await loadTenants();
    } catch (error) {
      console.error('Erro ao salvar tenant:', error);
      toast.error(error instanceof Error ? error.message : 'Erro ao salvar tenant');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleTenant = async (tenant: Tenant) => {
    try {
      await api.put(`/admin/tenants/${tenant.tenantId}`, { active: !tenant.active });
      toast.success(`Tenant ${tenant.active ? 'desativado' : 'ativado'} com sucesso!`);
      await loadTenants();
    } catch (error) {
      console.error('Erro ao alterar status:', error);
      toast.error(error instanceof Error ? error.message : 'Erro ao alterar status do tenant');
    }
  };

  const handleDeleteTenant = (tenant: Tenant) => {
    // Verificar se é o tenant do SUPER_ADMIN
    if (tenant.tenantId === 'tenant-20251021145821') {
      toast.error('Não é possível deletar o tenant do SUPER_ADMIN');
      return;
    }

    setTenantToDelete(tenant);
    setShowDeleteDialog(true);
  };

  const confirmDeleteTenant = async () => {
    if (!tenantToDelete) return;

    try {
      await api.delete(`/admin/tenants/${tenantToDelete.tenantId}`);
      toast.success('Tenant deletado com sucesso!');
      await loadTenants();
    } catch (error) {
      console.error('Erro ao deletar tenant:', error);
      toast.error(error instanceof Error ? error.message : 'Erro ao deletar tenant');
    } finally {
      setShowDeleteDialog(false);
      setTenantToDelete(null);
    }
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
            <h1 className="text-3xl font-bold text-slate-900">Tenants</h1>
            <p className="text-slate-500 mt-1">
              Gerenciar todas as empresas cadastradas
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => {
                const token = localStorage.getItem('accessToken');
                console.log('🔑 Token atual:', token);
                console.log('👤 User atual:', localStorage.getItem('user'));
                toast.info(`Token: ${token ? 'Encontrado' : 'Não encontrado'}`);
              }}
            >
              Debug Token
            </Button>
            <Button 
              onClick={handleCreateTenant}
              className="bg-gradient-to-r from-blue-600 to-purple-600"
            >
              <Plus className="w-4 h-4 mr-2" />
              Novo Tenant
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              Todos os Tenants
            </CardTitle>
            <CardDescription>
              {tenants.length} tenant(s) cadastrado(s)
            </CardDescription>
          </CardHeader>
          <CardContent>
            {tenants.length === 0 ? (
              <div className="text-center py-12 text-slate-500">
                <Users className="w-12 h-12 mx-auto mb-4 text-slate-400" />
                <p className="text-lg mb-2">Nenhum tenant cadastrado ainda</p>
                <p className="text-sm mb-4">
                  Comece criando seu primeiro tenant
                </p>
                <Button 
                  onClick={handleCreateTenant}
                  className="bg-gradient-to-r from-blue-600 to-purple-600"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Criar Primeiro Tenant
                </Button>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Empresa</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Criado em</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tenants.map((tenant) => (
                    <TableRow key={tenant.id}>
                      <TableCell className="font-medium">{tenant.name}</TableCell>
                      <TableCell>{tenant.email}</TableCell>
                      <TableCell>{tenant.company || '-'}</TableCell>
                      <TableCell>
                        <Badge variant={tenant.active ? "default" : "secondary"}>
                          {tenant.active ? 'Ativo' : 'Inativo'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-slate-500">
                        {new Date(tenant.createdAt).toLocaleDateString('pt-BR')}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex gap-2 justify-end">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleEditTenant(tenant)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleToggleTenant(tenant)}
                          >
                            <Power className="w-4 h-4" />
                          </Button>
                          {tenant.tenantId !== 'tenant-20251021145821' ? (
                            <Button 
                              variant="destructive" 
                              size="sm"
                              onClick={() => handleDeleteTenant(tenant)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          ) : (
                            <Button 
                              variant="outline" 
                              size="sm"
                              disabled
                              title="Não é possível deletar o tenant do SUPER_ADMIN"
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

        <TenantDrawer
          isOpen={isDrawerOpen}
          onClose={() => setIsDrawerOpen(false)}
          onSave={handleSaveTenant}
          tenant={selectedTenant}
          isLoading={isSubmitting}
        />

        <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
              <AlertDialogDescription>
                Tem certeza que deseja deletar o tenant &quot;{tenantToDelete?.name}&quot;?
                Esta ação não pode ser desfeita e todas as API Keys associadas serão revogadas.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction 
                onClick={confirmDeleteTenant}
                className="bg-red-600 hover:bg-red-700"
              >
                Deletar
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </AdminLayout>
  );
}