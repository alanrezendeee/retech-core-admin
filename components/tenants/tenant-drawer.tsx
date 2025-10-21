'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Loader2, Save, X } from 'lucide-react';

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

interface TenantDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (tenant: Partial<Tenant>) => Promise<void>;
  tenant?: Tenant | null;
  isLoading?: boolean;
}

export function TenantDrawer({ 
  isOpen, 
  onClose, 
  onSave, 
  tenant, 
  isLoading = false 
}: TenantDrawerProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    purpose: '',
    active: true,
  });

  // Atualizar formData quando tenant mudar
  React.useEffect(() => {
    if (tenant) {
      setFormData({
        name: tenant.name || '',
        email: tenant.email || '',
        company: tenant.company || '',
        purpose: tenant.purpose || '',
        active: tenant.active ?? true,
      });
    } else {
      setFormData({
        name: '',
        email: '',
        company: '',
        purpose: '',
        active: true,
      });
    }
  }, [tenant]);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await onSave(formData);
      onClose();
    } catch (error) {
      console.error('Erro ao salvar tenant:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="right" className="w-full sm:max-w-[540px] p-0">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="px-8 pt-8 pb-6 border-b bg-white">
            <SheetTitle className="text-2xl font-semibold text-slate-900 mb-2">
              {tenant ? 'Editar Tenant' : 'Novo Tenant'}
            </SheetTitle>
            <SheetDescription className="text-slate-600 text-base">
              {tenant 
                ? 'Atualize as informações do tenant'
                : 'Preencha os dados para criar um novo tenant'
              }
            </SheetDescription>
          </div>

          {/* Form Content */}
          <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
            <div className="flex-1 overflow-y-auto px-8 py-8">
              <div className="space-y-8">
                {/* Nome do Tenant */}
                <div className="space-y-3">
                  <Label htmlFor="name" className="text-sm font-medium text-slate-700 block">
                    Nome do Tenant <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="Nome completo"
                    className="h-12 text-base"
                    required
                  />
                </div>

                {/* Email de Contato */}
                <div className="space-y-3">
                  <Label htmlFor="email" className="text-sm font-medium text-slate-700 block">
                    Email de Contato <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder="email@exemplo.com"
                    className="h-12 text-base"
                    required
                  />
                </div>

                {/* Nome da Empresa */}
                <div className="space-y-3">
                  <Label htmlFor="company" className="text-sm font-medium text-slate-700 block">
                    Nome da Empresa
                  </Label>
                  <Input
                    id="company"
                    value={formData.company}
                    onChange={(e) => handleInputChange('company', e.target.value)}
                    placeholder="Nome da empresa"
                    className="h-12 text-base"
                  />
                </div>

                {/* Finalidade de Uso */}
                <div className="space-y-3">
                  <Label htmlFor="purpose" className="text-sm font-medium text-slate-700 block">
                    Finalidade de Uso
                  </Label>
                  <Textarea
                    id="purpose"
                    value={formData.purpose}
                    onChange={(e) => handleInputChange('purpose', e.target.value)}
                    placeholder="Descreva para que vai usar a API..."
                    className="min-h-[100px] resize-none text-base"
                    rows={4}
                  />
                </div>

                {/* Status */}
                <div className="space-y-3 pt-2">
                  <div className="flex items-center justify-between p-5 bg-slate-50 rounded-lg border border-slate-200">
                    <div className="flex-1">
                      <Label htmlFor="active" className="text-base font-medium text-slate-900 cursor-pointer block mb-1">
                        Tenant Ativo
                      </Label>
                      <p className="text-sm text-slate-500">
                        {formData.active 
                          ? 'Pode acessar a API' 
                          : 'Não pode acessar a API'}
                      </p>
                    </div>
                    <Switch
                      id="active"
                      checked={formData.active}
                      onCheckedChange={(checked) => handleInputChange('active', checked)}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="px-8 py-6 border-t bg-slate-50">
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
                  className="flex-1 h-12 text-base font-medium bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Salvando...
                    </>
                  ) : (
                    <>
                      <Save className="w-5 h-5 mr-2" />
                      {tenant ? 'Atualizar' : 'Criar'}
                    </>
                  )}
                </Button>
              </div>
            </div>
          </form>
        </div>
      </SheetContent>
    </Sheet>
  );
}
