'use client';

import { useRequireAuth } from '@/lib/hooks/use-auth';
import AdminLayout from '@/components/layouts/admin-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function AdminSettingsPage() {
  const { isReady } = useRequireAuth('SUPER_ADMIN');

  if (!isReady) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-slate-900">Configurações</h1>

        <Card>
          <CardHeader>
            <CardTitle>Configurações do Sistema</CardTitle>
            <CardDescription>Em desenvolvimento</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-slate-600">
              Configurações de rate limit, CORS, e outras opções estarão disponíveis em breve.
            </p>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}

