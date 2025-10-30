'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react';

export default function AdminRecuperarSenhaPage() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simular envio (implementar backend depois)
    setTimeout(() => {
      setSent(true);
      setLoading(false);
    }, 1000);
  };

  if (sent) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 p-4">
        <Card className="w-full max-w-md shadow-2xl">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="p-4 bg-green-100 rounded-full">
                <CheckCircle className="h-12 w-12 text-green-600" />
              </div>
            </div>
            <CardTitle className="text-2xl">Email Enviado!</CardTitle>
            <CardDescription className="text-base">
              Verifique sua caixa de entrada
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert className="bg-blue-50 border-blue-200">
              <Mail className="h-4 w-4 text-blue-600" />
              <AlertDescription className="text-blue-800">
                Enviamos um link de recuperação para <strong>{email}</strong>.
                <br />
                Verifique também a pasta de spam.
              </AlertDescription>
            </Alert>
            
            <Link href="/admin/login" className="block">
              <Button className="w-full" variant="outline">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Voltar para Login Admin
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 p-4">
      <Card className="w-full max-w-md shadow-2xl">
        <CardHeader>
          <CardTitle className="text-2xl">Recuperar Senha - Admin</CardTitle>
          <CardDescription>
            Digite seu email de administrador e enviaremos um link para redefinir sua senha
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email do Administrador</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@theretech.com.br"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Mail className="mr-2 h-4 w-4 animate-pulse" />
                  Enviando...
                </>
              ) : (
                <>
                  <Mail className="mr-2 h-4 w-4" />
                  Enviar Link de Recuperação
                </>
              )}
            </Button>

            <div className="text-center pt-4 border-t">
              <Link href="/admin/login" className="text-sm text-blue-600 hover:underline flex items-center justify-center gap-2">
                <ArrowLeft className="h-3 w-3" />
                Voltar para Login Admin
              </Link>
            </div>
          </form>

          <Alert className="mt-4 bg-amber-50 border-amber-200">
            <AlertDescription className="text-amber-800 text-sm">
              <strong>Nota:</strong> Esta funcionalidade está em desenvolvimento.
              Entre em contato pelo WhatsApp se precisar de ajuda urgente.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    </div>
  );
}





