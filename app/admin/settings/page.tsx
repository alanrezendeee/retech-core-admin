'use client';

import { useState, useEffect } from 'react';
import { useRequireAuth } from '@/lib/hooks/use-auth';
import AdminLayout from '@/components/layouts/admin-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Settings as SettingsIcon, Save, RefreshCw, Shield, Globe, Database, Key, AlertTriangle, Info } from 'lucide-react';
import { toast } from 'sonner';
import api from '@/lib/api/client';

interface SystemSettings {
  // Rate Limiting DEFAULT (global para novos tenants)
  defaultRateLimit: {
    requestsPerDay: number | '';
    requestsPerMinute: number | '';
  };
  // CORS
  cors: {
    enabled: boolean;
    allowedOrigins: string[];
  };
  // JWT
  jwt: {
    accessTokenTTL: number;
    refreshTokenTTL: number;
  };
  // API Info
  api: {
    version: string;
    environment: string;
    maintenance: boolean;
  };
  // Contato/Vendas
  contact?: {
    whatsapp: string;
    email: string;
    phone: string;
  };
  // Cache
  cache?: {
    enabled: boolean;
    cepTtlDays: number;
    maxSizeMb: number;
    autoCleanup: boolean;
  };
}

export default function AdminSettingsPage() {
  const { isReady } = useRequireAuth('SUPER_ADMIN');
  const [settings, setSettings] = useState<SystemSettings>({
    defaultRateLimit: {
      requestsPerDay: 1000,
      requestsPerMinute: 60,
    },
    cors: {
      enabled: true,
      allowedOrigins: ['https://core.theretech.com.br', 'http://localhost:3000', 'http://localhost:3001'],
    },
    jwt: {
      accessTokenTTL: 900, // 15 minutos
      refreshTokenTTL: 604800, // 7 dias
    },
    api: {
      version: '1.0.0',
      environment: 'development',
      maintenance: false,
    },
    contact: {
      whatsapp: '48999616679',
      email: 'suporte@theretech.com.br',
      phone: '+55 48 99961-6679',
    },
    cache: {
      enabled: true,
      cepTtlDays: 7,
      maxSizeMb: 100,
      autoCleanup: true,
    },
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isClearing, setIsClearing] = useState(false);
  const [cacheStats, setCacheStats] = useState<{
    totalCached: number;
    recentCached: number;
  } | null>(null);

  useEffect(() => {
    if (isReady) {
      loadSettings(); // Carrega settings, que por sua vez chama loadCacheStats()
    }
  }, [isReady]);

  const loadSettings = async () => {
    try {
      setIsLoading(true);
      const response = await api.get('/admin/settings');
      
      // Normalizar os dados do backend (Go usa PascalCase, frontend usa camelCase)
      const data = response.data;
      const normalized = {
        ...data,
        defaultRateLimit: {
          requestsPerDay: data.defaultRateLimit?.RequestsPerDay || data.defaultRateLimit?.requestsPerDay || 1000,
          requestsPerMinute: data.defaultRateLimit?.RequestsPerMinute || data.defaultRateLimit?.requestsPerMinute || 60,
        },
      };
      
      setSettings(normalized);
      
      // ✅ Carregar stats APÓS settings carregar com sucesso
      loadCacheStats();
    } catch (error: any) {
      console.error('Erro ao carregar configurações:', error);
      // Se não existir configuração, usa as padrões (já definidas no state)
      if (error.response?.status !== 404) {
        toast.error('Erro ao carregar configurações');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const loadCacheStats = async () => {
    try {
      const response = await api.get('/admin/cache/cep/stats');
      setCacheStats({
        totalCached: response.data.totalCached || 0,
        recentCached: response.data.recentCached || 0,
      });
    } catch (error: any) {
      console.error('Erro ao carregar stats de cache:', error);
      // Silencioso: não mostra erro ao usuário, apenas deixa stats como null
      // Se 404, o usuário provavelmente não está autenticado ainda
    }
  };

  const handleClearCache = async () => {
    if (!confirm('Tem certeza que deseja limpar todo o cache de CEP? Esta ação não pode ser desfeita.')) {
      return;
    }

    try {
      setIsClearing(true);
      const response = await api.delete('/admin/cache/cep');
      toast.success(`Cache limpo! ${response.data.deletedCount} registros removidos.`);
      loadCacheStats(); // Recarregar stats
    } catch (error) {
      console.error('Erro ao limpar cache:', error);
      toast.error('Erro ao limpar cache');
    } finally {
      setIsClearing(false);
    }
  };

  const handleSaveSettings = async () => {
    try {
      setIsSaving(true);
      
      // Garantir que valores vazios sejam convertidos para números padrão
      const requestsPerDay = settings.defaultRateLimit.requestsPerDay === '' 
        ? 1000 
        : Number(settings.defaultRateLimit.requestsPerDay);
      const requestsPerMinute = settings.defaultRateLimit.requestsPerMinute === '' 
        ? 60 
        : Number(settings.defaultRateLimit.requestsPerMinute);
      
      // Converter para o formato que o backend espera (PascalCase)
      const payload = {
        defaultRateLimit: {
          RequestsPerDay: requestsPerDay,
          RequestsPerMinute: requestsPerMinute,
        },
        cors: settings.cors,
        jwt: settings.jwt,
        api: settings.api,
        contact: settings.contact,
        cache: settings.cache,
      };
      
      await api.put('/admin/settings', payload);
      
      toast.success('Configurações salvas com sucesso!');
      
      // Recarregar para pegar timestamps atualizados
      await loadSettings();
    } catch (error: any) {
      console.error('Erro ao salvar configurações:', error);
      const errorMessage = error.response?.data?.detail || 'Erro ao salvar configurações';
      toast.error(errorMessage);
    } finally {
      setIsSaving(false);
    }
  };

  const handleInputChange = (section: keyof SystemSettings, field: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
  };

  const handleArrayChange = (section: keyof SystemSettings, field: string, value: string) => {
    const array = value.split(',').map(item => item.trim()).filter(item => item);
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: array,
      },
    }));
  };

  if (!isReady || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto"></div>
          <p className="mt-2 text-slate-600">Carregando configurações...</p>
        </div>
      </div>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600">
                <SettingsIcon className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-slate-900">Configurações</h1>
            </div>
            <p className="text-slate-500">
              Gerencie as configurações globais do sistema
            </p>
          </div>
          <Button 
            onClick={handleSaveSettings}
            disabled={isSaving}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg"
          >
            {isSaving ? (
              <>
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                Salvando...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Salvar Configurações
              </>
            )}
          </Button>
        </div>

        {/* Info Card */}
        <Card className="border-blue-200 bg-gradient-to-br from-blue-50 via-purple-50 to-blue-50">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-xl bg-blue-100">
                <Info className="w-6 h-6 text-blue-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-slate-900 mb-2">
                  ℹ️ Sobre as Configurações
                </h3>
                <div className="space-y-2 text-sm text-slate-600">
                  <p>
                    <strong>Rate Limiting DEFAULT:</strong> Define o limite padrão para novos tenants. Você pode personalizar por tenant em Tenants → Editar → Rate Limit.
                  </p>
                  <p>
                    <strong>CORS:</strong> Controla quais domínios podem acessar a API.
                  </p>
                  <p>
                    <strong>JWT:</strong> Define quanto tempo os tokens de acesso permanecem válidos.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Rate Limiting DEFAULT */}
          <Card className="border-slate-200 hover:shadow-lg transition-shadow duration-200">
            <CardHeader>
              <div className="flex items-center gap-2 mb-1">
                <div className="p-2 rounded-lg bg-purple-100">
                  <Shield className="w-5 h-5 text-purple-600" />
                </div>
                <CardTitle className="text-lg">Rate Limiting Padrão</CardTitle>
              </div>
              <CardDescription>
                Limite padrão aplicado a novos tenants
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                <p className="text-xs text-yellow-800">
                  Estes valores são aplicados apenas a <strong>novos tenants</strong>. Para alterar o limite de um tenant existente, vá em Tenants → Editar Tenant.
                </p>
              </div>

              <div className="space-y-4">
                      <div>
                        <Label htmlFor="requestsPerDay" className="text-slate-700 font-medium">
                          Requests por Dia
                        </Label>
                        <Input
                          id="requestsPerDay"
                          type="number"
                          value={settings.defaultRateLimit.requestsPerDay}
                          onChange={(e) => {
                            const value = e.target.value === '' ? '' : parseInt(e.target.value);
                            handleInputChange('defaultRateLimit', 'requestsPerDay', value);
                          }}
                          onBlur={(e) => {
                            // Aplicar valor padrão apenas ao sair do campo se estiver vazio
                            if (e.target.value === '' || parseInt(e.target.value) < 1) {
                              handleInputChange('defaultRateLimit', 'requestsPerDay', 1000);
                            }
                          }}
                          min="1"
                          max="1000000"
                          className="mt-1.5 h-11"
                        />
                        <p className="text-xs text-slate-500 mt-1">
                          Máximo de requisições por dia (recomendado: 1.000 para plano free)
                        </p>
                      </div>

                      <div>
                        <Label htmlFor="requestsPerMinute" className="text-slate-700 font-medium">
                          Requests por Minuto
                        </Label>
                        <Input
                          id="requestsPerMinute"
                          type="number"
                          value={settings.defaultRateLimit.requestsPerMinute}
                          onChange={(e) => {
                            const value = e.target.value === '' ? '' : parseInt(e.target.value);
                            handleInputChange('defaultRateLimit', 'requestsPerMinute', value);
                          }}
                          onBlur={(e) => {
                            // Aplicar valor padrão apenas ao sair do campo se estiver vazio
                            if (e.target.value === '' || parseInt(e.target.value) < 1) {
                              handleInputChange('defaultRateLimit', 'requestsPerMinute', 60);
                            }
                          }}
                          min="1"
                          max="10000"
                          className="mt-1.5 h-11"
                        />
                        <p className="text-xs text-slate-500 mt-1">
                          Máximo de requisições por minuto (recomendado: 60)
                        </p>
                      </div>
              </div>
            </CardContent>
          </Card>

          {/* CORS */}
          <Card className="border-slate-200 hover:shadow-lg transition-shadow duration-200">
            <CardHeader>
              <div className="flex items-center gap-2 mb-1">
                <div className="p-2 rounded-lg bg-green-100">
                  <Globe className="w-5 h-5 text-green-600" />
                </div>
                <CardTitle className="text-lg">CORS</CardTitle>
              </div>
              <CardDescription>
                Controle de acesso cross-origin
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                <div>
                  <Label htmlFor="corsEnabled" className="font-medium text-slate-700">CORS Ativo</Label>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Permitir requisições de outros domínios
                  </p>
                </div>
                <Switch
                  id="corsEnabled"
                  checked={settings.cors.enabled}
                  onCheckedChange={(checked) => handleInputChange('cors', 'enabled', checked)}
                />
              </div>

              <div>
                <Label htmlFor="allowedOrigins" className="text-slate-700 font-medium">
                  Origens Permitidas
                </Label>
                <Textarea
                  id="allowedOrigins"
                  value={settings.cors.allowedOrigins.join(', ')}
                  onChange={(e) => handleArrayChange('cors', 'allowedOrigins', e.target.value)}
                  placeholder="https://core.theretech.com.br, http://localhost:3000"
                  rows={4}
                  className="mt-1.5"
                />
                <p className="text-xs text-slate-500 mt-1">
                  Separe múltiplas origens com vírgula
                </p>
              </div>
            </CardContent>
          </Card>

          {/* JWT */}
          <Card className="border-slate-200 hover:shadow-lg transition-shadow duration-200">
            <CardHeader>
              <div className="flex items-center gap-2 mb-1">
                <div className="p-2 rounded-lg bg-blue-100">
                  <Key className="w-5 h-5 text-blue-600" />
                </div>
                <CardTitle className="text-lg">JWT Tokens</CardTitle>
              </div>
              <CardDescription>
                Tempo de vida dos tokens de autenticação
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="accessTokenTTL" className="text-slate-700 font-medium">
                  Access Token TTL (segundos)
                </Label>
                <Input
                  id="accessTokenTTL"
                  type="number"
                  value={settings.jwt.accessTokenTTL}
                  onChange={(e) => handleInputChange('jwt', 'accessTokenTTL', parseInt(e.target.value))}
                  min="60"
                  max="3600"
                  className="mt-1.5 h-11"
                />
                <p className="text-xs text-slate-500 mt-1">
                  Padrão: 900 segundos (15 minutos)
                </p>
              </div>

              <div>
                <Label htmlFor="refreshTokenTTL" className="text-slate-700 font-medium">
                  Refresh Token TTL (segundos)
                </Label>
                <Input
                  id="refreshTokenTTL"
                  type="number"
                  value={settings.jwt.refreshTokenTTL}
                  onChange={(e) => handleInputChange('jwt', 'refreshTokenTTL', parseInt(e.target.value))}
                  min="3600"
                  max="2592000"
                  className="mt-1.5 h-11"
                />
                <p className="text-xs text-slate-500 mt-1">
                  Padrão: 604800 segundos (7 dias)
                </p>
              </div>
            </CardContent>
          </Card>

          {/* API Info */}
          <Card className="border-slate-200 hover:shadow-lg transition-shadow duration-200">
            <CardHeader>
              <div className="flex items-center gap-2 mb-1">
                <div className="p-2 rounded-lg bg-orange-100">
                  <Database className="w-5 h-5 text-orange-600" />
                </div>
                <CardTitle className="text-lg">Informações da API</CardTitle>
              </div>
              <CardDescription>
                Status e versão do sistema
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-slate-700 font-medium">Versão</Label>
                  <div className="mt-1.5">
                    <Badge variant="outline" className="text-sm">
                      v{settings.api.version}
                    </Badge>
                  </div>
                </div>
                <div>
                  <Label className="text-slate-700 font-medium">Ambiente</Label>
                  <div className="mt-1.5">
                    <Badge 
                      variant={settings.api.environment === 'production' ? 'default' : 'secondary'}
                      className="text-sm"
                    >
                      {settings.api.environment}
                    </Badge>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                <div>
                  <Label htmlFor="maintenanceMode" className="font-medium text-slate-700">
                    Modo de Manutenção
                  </Label>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Bloqueia todas as requisições (503)
                  </p>
                </div>
                <Switch
                  id="maintenanceMode"
                  checked={settings.api.maintenance}
                  onCheckedChange={(checked) => handleInputChange('api', 'maintenance', checked)}
                />
              </div>

              {settings.api.maintenance && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold text-red-900">
                        ⚠️ API em Manutenção
                      </p>
                      <p className="text-xs text-red-700 mt-1">
                        Todas as requisições retornarão erro 503 Service Unavailable
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Contato & Vendas */}
          <Card className="border-green-200">
            <CardHeader>
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-green-100">
                  <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <div>
                  <CardTitle>Contato & Vendas</CardTitle>
                  <CardDescription>Configure informações de contato para a landing page</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="whatsapp">WhatsApp (Vendas)</Label>
                <div className="flex gap-2 items-center">
                  <span className="text-sm text-slate-500">+55</span>
                  <Input
                    id="whatsapp"
                    type="text"
                    placeholder="48999616679"
                    value={settings.contact?.whatsapp || ''}
                    onChange={(e) => handleInputChange('contact', 'whatsapp', e.target.value)}
                    className="flex-1"
                  />
                </div>
                <p className="text-xs text-slate-500">
                  Número sem espaços ou traços. Ex: 48999616679
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">E-mail de Suporte</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="suporte@theretech.com.br"
                  value={settings.contact?.email || ''}
                  onChange={(e) => handleInputChange('contact', 'email', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Telefone (Formatado)</Label>
                <Input
                  id="phone"
                  type="text"
                  placeholder="+55 48 99961-6679"
                  value={settings.contact?.phone || ''}
                  onChange={(e) => handleInputChange('contact', 'phone', e.target.value)}
                />
              </div>

              <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-start gap-2">
                  <Info className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-green-900">
                      Usado na Landing Page
                    </p>
                    <p className="text-xs text-green-700 mt-1">
                      O botão "Falar com Vendas" irá redirecionar para o WhatsApp configurado aqui
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Cache de CEP */}
          <Card className="border-blue-200">
            <CardHeader>
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-blue-100">
                  <Database className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <CardTitle>Cache de CEP</CardTitle>
                  <CardDescription>Configurações de cache para otimizar performance</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Stats do Cache */}
              {cacheStats && (
                <div className="grid grid-cols-2 gap-4 p-4 bg-blue-50 rounded-lg mb-4">
                  <div>
                    <p className="text-sm font-medium text-blue-900">Total em Cache</p>
                    <p className="text-2xl font-bold text-blue-600">{cacheStats.totalCached.toLocaleString()}</p>
                    <p className="text-xs text-blue-600">CEPs armazenados</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-blue-900">Últimas 24h</p>
                    <p className="text-2xl font-bold text-blue-600">{cacheStats.recentCached.toLocaleString()}</p>
                    <p className="text-xs text-blue-600">Novos no cache</p>
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                <div>
                  <Label htmlFor="cacheEnabled" className="font-medium text-slate-700">
                    Habilitar Cache
                  </Label>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Ativa cache global de CEP (melhora performance)
                  </p>
                </div>
                <Switch
                  id="cacheEnabled"
                  checked={settings.cache?.enabled || false}
                  onCheckedChange={(checked) => handleInputChange('cache', 'enabled', checked)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="cacheTTL">TTL do Cache (dias)</Label>
                <Input
                  id="cacheTTL"
                  type="number"
                  min="1"
                  max="365"
                  placeholder="7"
                  value={settings.cache?.cepTtlDays || 7}
                  onChange={(e) => handleInputChange('cache', 'cepTtlDays', parseInt(e.target.value) || 7)}
                />
                <p className="text-xs text-slate-500">
                  Tempo que um CEP fica em cache antes de ser revalidado (1-365 dias)
                </p>
              </div>

              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                <div>
                  <Label htmlFor="autoCleanup" className="font-medium text-slate-700">
                    Limpeza Automática
                  </Label>
                  <p className="text-xs text-slate-500 mt-0.5">
                    MongoDB remove CEPs expirados automaticamente (TTL Index)
                  </p>
                </div>
                <Switch
                  id="autoCleanup"
                  checked={settings.cache?.autoCleanup || false}
                  onCheckedChange={(checked) => handleInputChange('cache', 'autoCleanup', checked)}
                />
              </div>

              <Separator />

              <div className="space-y-2">
                <Label>Limpeza Manual</Label>
                <Button 
                  variant="destructive" 
                  className="w-full"
                  onClick={handleClearCache}
                  disabled={isClearing}
                >
                  {isClearing ? (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      Limpando...
                    </>
                  ) : (
                    <>
                      <AlertTriangle className="w-4 h-4 mr-2" />
                      Limpar Todo Cache
                    </>
                  )}
                </Button>
                <p className="text-xs text-red-600">
                  ⚠️ Remove todos os {cacheStats?.totalCached || 0} CEPs do cache. Esta ação não pode ser desfeita.
                </p>
              </div>

              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-start gap-2">
                  <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-blue-900">
                      Como funciona o cache?
                    </p>
                    <ul className="text-xs text-blue-700 mt-1 space-y-1">
                      <li>✅ Cache é <strong>compartilhado</strong> entre todos os tenants</li>
                      <li>✅ Primeira consulta: ~50ms (ViaCEP)</li>
                      <li>✅ Consultas seguintes: ~5ms (cache)</li>
                      <li>✅ Reduz 95%+ das chamadas externas</li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}
