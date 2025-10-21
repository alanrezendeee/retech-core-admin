'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/stores/auth-store';
import AdminLayout from '@/components/layouts/admin-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { listAllTenants } from '@/lib/api/admin';

export default function AdminTenantsPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();
  const [tenants, setTenants] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'SUPER_ADMIN') {
      router.push('/admin/login');
      return;
    }

    loadTenants();
  }, [isAuthenticated, user, router]);

  const loadTenants = async () => {
    try {
      const data = await listAllTenants();
      setTenants(data.tenants || []);
    } catch (error) {
      console.error('Erro ao carregar tenants:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated || loading) {
    return null;
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
          <Button className="bg-gradient-to-r from-blue-600 to-purple-600">
            + Novo Tenant
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Todos os Tenants</CardTitle>
            <CardDescription>
              {tenants.length} tenant(s) cadastrado(s)
            </CardDescription>
          </CardHeader>
          <CardContent>
            {tenants.length === 0 ? (
              <div className="text-center py-12 text-slate-500">
                <p className="text-lg mb-2">Nenhum tenant cadastrado ainda</p>
                <p className="text-sm">
                  Tenants serão criados quando desenvolvedores se registrarem
                </p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Tenant ID</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Criado em</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tenants.map((tenant) => (
                    <TableRow key={tenant.tenantId}>
                      <TableCell className="font-medium">{tenant.name}</TableCell>
                      <TableCell>{tenant.email}</TableCell>
                      <TableCell className="font-mono text-xs">{tenant.tenantId}</TableCell>
                      <TableCell>
                        <Badge variant={tenant.active ? "default" : "secondary"}>
                          {tenant.active ? 'Ativo' : 'Inativo'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-slate-500">
                        {new Date(tenant.createdAt).toLocaleDateString('pt-BR')}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm">Ver Detalhes</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}

