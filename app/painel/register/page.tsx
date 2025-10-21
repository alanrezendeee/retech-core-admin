'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { register as registerAPI } from '@/lib/api/auth';
import { useAuthStore } from '@/lib/stores/auth-store';

const registerSchema = z.object({
  // Empresa/Tenant
  tenantName: z.string().min(2, 'Nome da empresa muito curto'),
  tenantEmail: z.string().email('Email inválido'),
  company: z.string().optional(),
  purpose: z.string().optional(),
  
  // Usuário
  userName: z.string().min(2, 'Nome muito curto'),
  userEmail: z.string().email('Email inválido'),
  userPassword: z.string().min(8, 'Senha deve ter no mínimo 8 caracteres'),
  confirmPassword: z.string(),
}).refine((data) => data.userPassword === data.confirmPassword, {
  message: 'Senhas não conferem',
  path: ['confirmPassword'],
});

type RegisterForm = z.infer<typeof registerSchema>;

export default function PainelRegisterPage() {
  const router = useRouter();
  const { setAuth } = useAuthStore();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1); // 1: Empresa, 2: Usuário

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterForm) => {
    try {
      setLoading(true);
      setError('');

      const response = await registerAPI({
        tenantName: data.tenantName,
        tenantEmail: data.tenantEmail,
        company: data.company,
        purpose: data.purpose,
        userName: data.userName,
        userEmail: data.userEmail,
        userPassword: data.userPassword,
      });

      // Salvar autenticação
      setAuth(response.user, response.accessToken, response.refreshToken);

      // Redirecionar para dashboard
      router.push('/painel/dashboard');
    } catch (err: any) {
      console.error('Erro no registro:', err);
      setError(err.response?.data?.detail || 'Erro ao criar conta. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-4">
      <Card className="w-full max-w-2xl shadow-xl">
        <CardHeader>
          <CardTitle className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
            Criar Conta Gratuita
          </CardTitle>
          <CardDescription>
            Comece a usar a Retech Core API em segundos
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Passo 1: Dados da Empresa */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Dados da Empresa</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="tenantName">Nome da Empresa *</Label>
                  <Input
                    id="tenantName"
                    placeholder="Minha Startup"
                    {...register('tenantName')}
                    disabled={loading}
                  />
                  {errors.tenantName && (
                    <p className="text-sm text-red-500">{errors.tenantName.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tenantEmail">Email da Empresa *</Label>
                  <Input
                    id="tenantEmail"
                    type="email"
                    placeholder="contato@startup.com"
                    {...register('tenantEmail')}
                    disabled={loading}
                  />
                  {errors.tenantEmail && (
                    <p className="text-sm text-red-500">{errors.tenantEmail.message}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="company">Razão Social (opcional)</Label>
                  <Input
                    id="company"
                    placeholder="Startup LTDA"
                    {...register('company')}
                    disabled={loading}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="purpose">Para que vai usar? (opcional)</Label>
                  <Input
                    id="purpose"
                    placeholder="App mobile, site, etc"
                    {...register('purpose')}
                    disabled={loading}
                  />
                </div>
              </div>
            </div>

            <Separator />

            {/* Passo 2: Dados do Usuário */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Seus Dados</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="userName">Seu Nome *</Label>
                  <Input
                    id="userName"
                    placeholder="João Silva"
                    {...register('userName')}
                    disabled={loading}
                  />
                  {errors.userName && (
                    <p className="text-sm text-red-500">{errors.userName.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="userEmail">Seu Email *</Label>
                  <Input
                    id="userEmail"
                    type="email"
                    placeholder="joao@startup.com"
                    {...register('userEmail')}
                    disabled={loading}
                  />
                  {errors.userEmail && (
                    <p className="text-sm text-red-500">{errors.userEmail.message}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="userPassword">Senha *</Label>
                  <Input
                    id="userPassword"
                    type="password"
                    placeholder="••••••••"
                    {...register('userPassword')}
                    disabled={loading}
                  />
                  {errors.userPassword && (
                    <p className="text-sm text-red-500">{errors.userPassword.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirmar Senha *</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="••••••••"
                    {...register('confirmPassword')}
                    disabled={loading}
                  />
                  {errors.confirmPassword && (
                    <p className="text-sm text-red-500">{errors.confirmPassword.message}</p>
                  )}
                </div>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                {error}
              </div>
            )}

            <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded text-sm">
              <strong>Plano Free incluso:</strong>
              <ul className="mt-2 space-y-1 list-disc list-inside">
                <li>1.000 requests por dia</li>
                <li>Todos os endpoints GEO</li>
                <li>Suporte via email</li>
                <li>Sem necessidade de cartão de crédito</li>
              </ul>
            </div>

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold py-6"
              disabled={loading}
            >
              {loading ? 'Criando conta...' : 'Criar Conta Gratuita'}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-slate-600">
            Já tem uma conta?{' '}
            <a href="/painel/login" className="text-indigo-600 hover:underline font-medium">
              Fazer login
            </a>
          </div>

          <div className="mt-4 text-center text-xs text-slate-500">
            Ao criar uma conta, você concorda com nossos{' '}
            <a href="/termos" className="underline">Termos de Uso</a> e{' '}
            <a href="/privacidade" className="underline">Política de Privacidade</a>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

