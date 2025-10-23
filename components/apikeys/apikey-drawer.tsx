'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Loader2, Save, Copy, RotateCw, XCircle } from 'lucide-react';
import { toast } from 'sonner';
import { Checkbox } from '@/components/ui/checkbox';

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

interface APIKeyDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (data: { ownerId: string; scopes: string[]; days: number }) => Promise<void>;
  onRotate: (key: APIKey) => void;
  onRevoke: (key: APIKey) => void;
  apiKey?: APIKey | null;
  tenants: Array<{ id: string; name: string; tenantId: string }>;
  isLoading?: boolean;
}

const availableScopes = [
  { value: 'geo', label: '🗺️ GEO - Dados geográficos (UFs, Municípios)' },
  { value: 'cep', label: '📮 CEP - Consulta de endereços' },
  { value: 'cnpj', label: '🏢 CNPJ - Dados de empresas (Receita Federal)' },
  { value: 'all', label: '⭐ ALL - Acesso total a todas as APIs' },
];

export function APIKeyDrawer({ 
  isOpen, 
  onClose, 
  onCreate, 
  onRotate,
  onRevoke,
  apiKey, 
  tenants,
  isLoading = false 
}: APIKeyDrawerProps) {
  const [formData, setFormData] = useState({
    ownerId: '',
    scopes: ['geo'],
    days: 90,
  });

  // Resetar form quando fecha/abre
  React.useEffect(() => {
    if (!apiKey && isOpen) {
      setFormData({
        ownerId: '',
        scopes: ['geo'],
        days: 90,
      });
    }
  }, [apiKey, isOpen]);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.ownerId) {
      toast.error('Selecione um tenant');
      return;
    }

    if (formData.scopes.length === 0) {
      toast.error('Selecione pelo menos um scope');
      return;
    }

    setIsSubmitting(true);

    try {
      await onCreate(formData);
      onClose();
    } catch (error) {
      console.error('Erro ao criar API key:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: string | string[] | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const toggleScope = (scope: string) => {
    if (formData.scopes.includes(scope)) {
      handleInputChange('scopes', formData.scopes.filter(s => s !== scope));
    } else {
      handleInputChange('scopes', [...formData.scopes, scope]);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copiado para a área de transferência!');
  };

  const isExpired = apiKey ? new Date(apiKey.expiresAt) < new Date() : false;
  const daysLeft = apiKey ? Math.ceil((new Date(apiKey.expiresAt).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)) : 0;
  const isExpiringSoon = daysLeft <= 7 && daysLeft > 0;

  const getTenantName = (tenantId: string) => {
    const tenant = tenants.find(t => t.tenantId === tenantId);
    return tenant ? tenant.name : tenantId;
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="right" className="w-full sm:max-w-[540px] p-0">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="px-8 pt-8 pb-6 border-b bg-white">
            <SheetTitle className="text-2xl font-semibold text-slate-900 mb-2">
              {apiKey ? 'Detalhes da API Key' : 'Nova API Key'}
            </SheetTitle>
            <SheetDescription className="text-slate-600 text-base">
              {apiKey 
                ? 'Visualize os detalhes e gerencie esta API key'
                : 'Crie uma nova API key para um tenant'
              }
            </SheetDescription>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto px-8 py-8">
            {apiKey ? (
              // Visualizar API key existente
              <div className="space-y-8">
                {/* Key ID */}
                <div className="space-y-3">
                  <Label className="text-sm font-medium text-slate-700 block">
                    Key ID
                  </Label>
                  <div className="flex gap-2">
                    <Input
                      value={apiKey.keyId}
                      readOnly
                      className="font-mono text-sm h-12"
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyToClipboard(apiKey.keyId)}
                      className="h-12"
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {/* Status */}
                <div className="space-y-3">
                  <Label className="text-sm font-medium text-slate-700 block">
                    Status
                  </Label>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant={apiKey.revoked ? 'destructive' : 'default'} className="text-sm px-3 py-1">
                      {apiKey.revoked ? 'Revogada' : 'Ativa'}
                    </Badge>
                    {isExpired && (
                      <Badge variant="destructive" className="text-sm px-3 py-1">Expirada</Badge>
                    )}
                    {isExpiringSoon && !isExpired && (
                      <Badge variant="secondary" className="text-sm px-3 py-1">
                        Expira em {daysLeft} dia{daysLeft !== 1 ? 's' : ''}
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Tenant */}
                <div className="space-y-3">
                  <Label className="text-sm font-medium text-slate-700 block">
                    Tenant
                  </Label>
                  <Input
                    value={getTenantName(apiKey.ownerId)}
                    readOnly
                    className="h-12 text-base bg-slate-50"
                  />
                </div>

                {/* Scopes */}
                <div className="space-y-3">
                  <Label className="text-sm font-medium text-slate-700 block">
                    Permissões (Scopes)
                  </Label>
                  <div className="flex flex-wrap gap-2">
                    {apiKey.scopes.map((scope) => (
                      <Badge key={scope} variant="outline" className="text-sm px-3 py-1">
                        {scope}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Datas */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <Label className="text-sm font-medium text-slate-700 block">
                      Criada em
                    </Label>
                    <Input
                      value={new Date(apiKey.createdAt).toLocaleDateString('pt-BR')}
                      readOnly
                      className="h-12 text-base bg-slate-50"
                    />
                  </div>
                  <div className="space-y-3">
                    <Label className="text-sm font-medium text-slate-700 block">
                      Expira em
                    </Label>
                    <Input
                      value={new Date(apiKey.expiresAt).toLocaleDateString('pt-BR')}
                      readOnly
                      className="h-12 text-base bg-slate-50"
                    />
                  </div>
                </div>

                {/* Último uso */}
                {apiKey.lastUsed && (
                  <div className="space-y-3">
                    <Label className="text-sm font-medium text-slate-700 block">
                      Último uso
                    </Label>
                    <Input
                      value={new Date(apiKey.lastUsed).toLocaleString('pt-BR')}
                      readOnly
                      className="h-12 text-base bg-slate-50"
                    />
                  </div>
                )}
              </div>
            ) : (
              // Criar nova API key
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Tenant */}
                <div className="space-y-3">
                  <Label htmlFor="ownerId" className="text-sm font-medium text-slate-700 block">
                    Tenant <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={formData.ownerId}
                    onValueChange={(value) => handleInputChange('ownerId', value)}
                  >
                    <SelectTrigger className="h-14 text-base">
                      <SelectValue placeholder="Selecione um tenant" />
                    </SelectTrigger>
                    <SelectContent>
                      {tenants.map((tenant) => (
                        <SelectItem 
                          key={tenant.tenantId} 
                          value={tenant.tenantId}
                          className="h-14 cursor-pointer"
                        >
                          <div className="flex items-center gap-3">
                            <div className="h-9 w-9 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-semibold text-sm">
                              {tenant.name.substring(0, 2).toUpperCase()}
                            </div>
                            <div className="flex flex-col">
                              <span className="font-medium text-slate-900">{tenant.name}</span>
                              <span className="text-xs text-slate-500">{tenant.tenantId}</span>
                            </div>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-slate-500">
                    Selecione o tenant que terá acesso à API key
                  </p>
                </div>

                {/* Scopes */}
                <div className="space-y-3">
                  <Label className="text-sm font-medium text-slate-700 block">
                    Permissões (Scopes) <span className="text-red-500">*</span>
                  </Label>
                  <div className="space-y-3 p-4 bg-slate-50 rounded-lg border border-slate-200">
                    {availableScopes.map((scope) => (
                      <div key={scope.value} className="flex items-start space-x-3">
                        <Checkbox
                          id={scope.value}
                          checked={formData.scopes.includes(scope.value)}
                          onCheckedChange={() => toggleScope(scope.value)}
                        />
                        <div className="flex-1">
                          <label
                            htmlFor={scope.value}
                            className="text-sm font-medium text-slate-900 cursor-pointer block"
                          >
                            {scope.label}
                          </label>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Dias para expiração */}
                <div className="space-y-3">
                  <Label htmlFor="days" className="text-sm font-medium text-slate-700 block">
                    Validade (dias)
                  </Label>
                  <Input
                    id="days"
                    type="number"
                    value={formData.days}
                    onChange={(e) => handleInputChange('days', parseInt(e.target.value))}
                    placeholder="90"
                    min="1"
                    max="365"
                    className="h-12 text-base"
                  />
                  <p className="text-xs text-slate-500">
                    A chave expirará em {formData.days} dias (
                    {new Date(Date.now() + formData.days * 24 * 60 * 60 * 1000).toLocaleDateString('pt-BR')}
                    )
                  </p>
                </div>
              </form>
            )}
          </div>

          {/* Footer */}
          <div className="px-8 py-6 border-t bg-slate-50">
            {apiKey ? (
              // Ações para API key existente
              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onClose}
                  className="flex-1 h-12 text-base font-medium"
                >
                  Fechar
                </Button>
                {!apiKey.revoked && (
                  <>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => onRotate(apiKey)}
                      className="h-12 text-base font-medium"
                    >
                      <RotateCw className="w-5 h-5 mr-2" />
                      Rotacionar
                    </Button>
                    <Button
                      type="button"
                      variant="destructive"
                      onClick={() => onRevoke(apiKey)}
                      className="h-12 text-base font-medium"
                    >
                      <XCircle className="w-5 h-5 mr-2" />
                      Revogar
                    </Button>
                  </>
                )}
              </div>
            ) : (
              // Ações para criar nova API key
              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onClose}
                  disabled={isSubmitting}
                  className="flex-1 h-12 text-base font-medium"
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting || isLoading}
                  onClick={handleSubmit}
                  className="flex-1 h-12 text-base font-medium bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Criando...
                    </>
                  ) : (
                    <>
                      <Save className="w-5 h-5 mr-2" />
                      Criar API Key
                    </>
                  )}
                </Button>
              </div>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
