'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/stores/auth-store';
import AdminLayout from '@/components/layouts/admin-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { listAllAPIKeys } from '@/lib/api/admin';

export default function AdminAPIKeysPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();
  const [apikeys, setApikeys] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'SUPER_ADMIN') {
      router.push('/admin/login');
      return;
    }

    loadAPIKeys();
  }, [isAuthenticated, user, router]);

  const loadAPIKeys = async () => {
    try {
      const data = await listAllAPIKeys();
      setApikeys(data.apikeys || []);
    } catch (error) {
      console.error('Erro ao carregar API keys:', error);
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
        <div>
          <h1 className="text-3xl font-bold text-slate-900">API Keys</h1>
          <p className="text-slate-500 mt-1">
            Gerenciar todas as chaves de acesso do sistema
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Todas as API Keys</CardTitle>
            <CardDescription>
              {apikeys.length} chave(s) no sistema
            </CardDescription>
          </CardHeader>
          <CardContent>
            {apikeys.length === 0 ? (
              <div className="text-center py-12 text-slate-500">
                <p className="text-lg mb-2">Nenhuma API key criada ainda</p>
                <p className="text-sm">
                  API keys são criadas pelos tenants ou por você
                </p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Key ID</TableHead>
                    <TableHead>Owner ID</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Expira em</TableHead>
                    <TableHead>Criada em</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {apikeys.map((key: any) => (
                    <TableRow key={key.keyId}>
                      <TableCell className="font-mono text-xs">{key.keyId}</TableCell>
                      <TableCell className="font-mono text-xs">{key.ownerId}</TableCell>
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

