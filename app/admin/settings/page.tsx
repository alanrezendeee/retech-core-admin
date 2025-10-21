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
import { Settings, Save, RefreshCw, Shield, Globe, Database, Key } from 'lucide-react';
import { toast } from 'sonner';

interface SystemSettings {
  rateLimit: {
    enabled: boolean;
    requestsPerDay: number;
    requestsPerMinute: number;
  };
  cors: {
    enabled: boolean;
    allowedOrigins: string[];
  };
  jwt: {
    accessTokenTTL: number;
    refreshTokenTTL: number;
  };
  api: {
    version: string;
    environment: string;
    maintenance: boolean;
  };
}

export default function AdminSettingsPage() {
  const { isReady } = useRequireAuth('SUPER_ADMIN');
  const [settings, setSettings] = useState<SystemSettings>({
    rateLimit: {
      enabled: true,
      requestsPerDay: 1000,
      requestsPerMinute: 60,
    },
    cors: {
      enabled: true,
      allowedOrigins: ['https://core.theretech.com.br', 'http://localhost:3000'],
    },
    jwt: {
      accessTokenTTL: 900, // 15 minutos
      refreshTokenTTL: 604800, // 7 dias
    },
    api: {
      version: '1.0.0',
      environment: 'production',
      maintenance: false,
    },
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (isReady) {
      loadSettings();
    }
  }, [isReady]);

  const loadSettings = async () => {
    try {
      setIsLoading(true);
      // Aqui você pode carregar as configurações do backend
      // Por enquanto, vamos usar as configurações padrão
    } catch (error) {
      console.error('Erro ao carregar configurações:', error);
      toast.error('Erro ao carregar configurações');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveSettings = async () => {
    try {
      setIsSaving(true);
      
      // Aqui você pode salvar as configurações no backend
      // Por enquanto, vamos simular o salvamento
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success('Configurações salvas com sucesso!');
    } catch (error) {
      console.error('Erro ao salvar configurações:', error);
      toast.error('Erro ao salvar configurações');
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
        <div className="animate-spin h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Configurações</h1>
            <p className="text-slate-500 mt-1">
              Gerencie as configurações do sistema
            </p>
          </div>
          <Button 
            onClick={handleSaveSettings}
            disabled={isSaving}
            className="bg-gradient-to-r from-blue-600 to-purple-600"
          >
            {isSaving ? (
              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Save className="w-4 h-4 mr-2" />
            )}
            Salvar Configurações
          </Button>
        </div>

        {/* Rate Limiting */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Rate Limiting
            </CardTitle>
            <CardDescription>
              Configure os limites de requisições por API key
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="rateLimitEnabled">Rate Limiting Ativo</Label>
                <p className="text-sm text-slate-500">
                  Controla se o rate limiting está ativo
                </p>
              </div>
              <Switch
                id="rateLimitEnabled"
                checked={settings.rateLimit.enabled}
                onCheckedChange={(checked) => handleInputChange('rateLimit', 'enabled', checked)}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="requestsPerDay">Requests por Dia</Label>
                <Input
                  id="requestsPerDay"
                  type="number"
                  value={settings.rateLimit.requestsPerDay}
                  onChange={(e) => handleInputChange('rateLimit', 'requestsPerDay', parseInt(e.target.value))}
                  min="1"
                  max="100000"
                />
              </div>
              <div>
                <Label htmlFor="requestsPerMinute">Requests por Minuto</Label>
                <Input
                  id="requestsPerMinute"
                  type="number"
                  value={settings.rateLimit.requestsPerMinute}
                  onChange={(e) => handleInputChange('rateLimit', 'requestsPerMinute', parseInt(e.target.value))}
                  min="1"
                  max="1000"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* CORS */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="w-5 h-5" />
              CORS (Cross-Origin Resource Sharing)
            </CardTitle>
            <CardDescription>
              Configure quais domínios podem acessar a API
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="corsEnabled">CORS Ativo</Label>
                <p className="text-sm text-slate-500">
                  Controla se o CORS está ativo
                </p>
              </div>
              <Switch
                id="corsEnabled"
                checked={settings.cors.enabled}
                onCheckedChange={(checked) => handleInputChange('cors', 'enabled', checked)}
              />
            </div>

            <div>
              <Label htmlFor="allowedOrigins">Origens Permitidas</Label>
              <Textarea
                id="allowedOrigins"
                value={settings.cors.allowedOrigins.join(', ')}
                onChange={(e) => handleArrayChange('cors', 'allowedOrigins', e.target.value)}
                placeholder="https://core.theretech.com.br, http://localhost:3000"
                rows={3}
              />
              <p className="text-sm text-slate-500 mt-1">
                Separe múltiplas origens com vírgula
              </p>
            </div>
          </CardContent>
        </Card>

        {/* JWT */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Key className="w-5 h-5" />
              JWT (JSON Web Tokens)
            </CardTitle>
            <CardDescription>
              Configure os tempos de vida dos tokens
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="accessTokenTTL">Access Token TTL (segundos)</Label>
                <Input
                  id="accessTokenTTL"
                  type="number"
                  value={settings.jwt.accessTokenTTL}
                  onChange={(e) => handleInputChange('jwt', 'accessTokenTTL', parseInt(e.target.value))}
                  min="60"
                  max="3600"
                />
                <p className="text-sm text-slate-500 mt-1">
                  Padrão: 900 segundos (15 minutos)
                </p>
              </div>
              <div>
                <Label htmlFor="refreshTokenTTL">Refresh Token TTL (segundos)</Label>
                <Input
                  id="refreshTokenTTL"
                  type="number"
                  value={settings.jwt.refreshTokenTTL}
                  onChange={(e) => handleInputChange('jwt', 'refreshTokenTTL', parseInt(e.target.value))}
                  min="3600"
                  max="2592000"
                />
                <p className="text-sm text-slate-500 mt-1">
                  Padrão: 604800 segundos (7 dias)
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* API Info */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="w-5 h-5" />
              Informações da API
            </CardTitle>
            <CardDescription>
              Informações sobre a versão e status da API
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Versão da API</Label>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">{settings.api.version}</Badge>
                </div>
              </div>
              <div>
                <Label>Ambiente</Label>
                <div className="flex items-center gap-2">
                  <Badge variant={settings.api.environment === 'production' ? 'default' : 'secondary'}>
                    {settings.api.environment}
                  </Badge>
                </div>
              </div>
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="maintenanceMode">Modo de Manutenção</Label>
                <p className="text-sm text-slate-500">
                  Ative para colocar a API em modo de manutenção
                </p>
              </div>
              <Switch
                id="maintenanceMode"
                checked={settings.api.maintenance}
                onCheckedChange={(checked) => handleInputChange('api', 'maintenance', checked)}
              />
            </div>

            {settings.api.maintenance && (
              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-sm text-yellow-800">
                  ⚠️ A API está em modo de manutenção. Todas as requisições retornarão erro 503.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}