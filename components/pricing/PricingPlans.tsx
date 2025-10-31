import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check } from 'lucide-react';

interface PlanFeature {
  text: string;
  highlight?: boolean;
}

interface PricingPlan {
  id: string;
  name: string;
  description: string;
  price: string | number;
  priceLabel: string;
  badge?: {
    text: string;
    className: string;
  };
  features: PlanFeature[];
  buttonText: string;
  buttonVariant?: 'default' | 'outline';
  buttonClassName?: string;
  buttonDisabled?: boolean;
  buttonHref?: string;
  cardClassName?: string;
  iconColor: string;
}

const plans: PricingPlan[] = [
  {
    id: 'free',
    name: 'Free',
    description: 'Perfeito para testar e projetos pequenos',
    price: 'R$ 0',
    priceLabel: '/mês',
    features: [
      { text: '1.000 requests/dia', highlight: true },
      { text: '4 APIs (CEP, CNPJ, Geografia, Penal)' },
      { text: 'Cache 3 camadas' },
      { text: 'Dashboard de uso' },
      { text: 'Documentação completa' },
      { text: 'Suporte via email' },
    ],
    buttonText: 'Começar Grátis',
    buttonVariant: 'outline',
    buttonHref: '/painel/register',
    cardClassName: 'border-2 hover:shadow-xl transition-shadow',
    iconColor: 'text-green-600',
  },
  {
    id: 'pro',
    name: 'Pro',
    description: 'Para aplicações em crescimento',
    price: 'R$ 49',
    priceLabel: '/mês',
    badge: {
      text: 'Em Breve',
      className: 'bg-gradient-to-r from-blue-600 to-purple-600 text-white',
    },
    features: [
      { text: '10.000 requests/dia', highlight: true },
      { text: 'Todas as APIs (sem premium)' },
      { text: 'Cache prioritário' },
      { text: 'Dashboard avançado' },
      { text: 'Analytics em tempo real' },
      { text: 'Suporte prioritário' },
    ],
    buttonText: 'Em Breve',
    buttonDisabled: true,
    cardClassName: 'border-2 border-blue-400 hover:shadow-xl transition-shadow relative',
    iconColor: 'text-blue-600',
  },
  {
    id: 'business',
    name: 'Business',
    description: 'Para empresas em crescimento',
    price: 'R$ 149',
    priceLabel: '/mês',
    badge: {
      text: 'Mais Popular',
      className: 'bg-gradient-to-r from-purple-600 to-pink-600 text-white',
    },
    features: [
      { text: '100.000 requests/dia', highlight: true },
      { text: 'Todas as APIs + Premium' },
      { text: 'Cache Redis L1 prioritário' },
      { text: 'APIs Premium (NF-e, Boletos, etc)' },
      { text: 'Suporte WhatsApp prioritário' },
      { text: 'SLA de 99.5%' },
    ],
    buttonText: 'Em Breve',
    buttonClassName: 'bg-purple-600 hover:bg-purple-700',
    buttonDisabled: true,
    cardClassName: 'border-4 border-purple-600 shadow-2xl relative hover:shadow-3xl transition-shadow',
    iconColor: 'text-purple-600',
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    description: 'Soluções personalizadas para grandes volumes',
    price: 'Custom',
    priceLabel: 'sob consulta',
    features: [
      { text: 'Requests ilimitados', highlight: true },
      { text: 'Todas as APIs + Premium' },
      { text: 'Infraestrutura dedicada' },
      { text: 'IP whitelisting' },
      { text: 'Suporte 24/7 dedicado' },
      { text: 'SLA de 99.9%' },
    ],
    buttonText: 'Falar com Vendas',
    buttonVariant: 'outline',
    buttonHref: 'mailto:contato@theretech.com.br',
    cardClassName: 'border-2 border-slate-400 hover:shadow-xl transition-shadow',
    iconColor: 'text-slate-600',
  },
];

interface PricingPlansProps {
  variant?: 'landing' | 'page';
}

export default function PricingPlans({ variant = 'landing' }: PricingPlansProps) {
  const CheckIcon = variant === 'page' ? Check : null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
      {plans.map((plan) => (
        <Card key={plan.id} className={plan.cardClassName}>
          {plan.badge && (
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
              <Badge className={`${plan.badge.className} px-3 py-1`}>
                {plan.badge.text}
              </Badge>
            </div>
          )}
          <CardHeader>
            <CardTitle className="text-xl">{plan.name}</CardTitle>
            <CardDescription>{plan.description}</CardDescription>
            <div className="mt-4">
              <div className="text-3xl font-bold">{plan.price}</div>
              <div className="text-slate-500 text-sm">{plan.priceLabel}</div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <ul className="space-y-2 text-sm">
              {plan.features.map((feature, index) => (
                <li key={index} className="flex items-start gap-2">
                  {variant === 'page' && CheckIcon ? (
                    <CheckIcon className={`w-4 h-4 ${plan.iconColor} flex-shrink-0 mt-0.5`} />
                  ) : (
                    <span className={`${plan.iconColor} mt-0.5`}>✓</span>
                  )}
                  <span className={feature.highlight ? 'font-semibold' : ''}>
                    {feature.text}
                  </span>
                </li>
              ))}
            </ul>
            {plan.buttonHref ? (
              <Link href={plan.buttonHref} className="w-full block">
                <Button
                  className={`w-full mt-4 ${plan.buttonClassName || ''}`}
                  variant={plan.buttonVariant}
                  disabled={plan.buttonDisabled}
                >
                  {plan.buttonText}
                </Button>
              </Link>
            ) : (
              <Button
                className={`w-full mt-4 ${plan.buttonClassName || ''}`}
                variant={plan.buttonVariant}
                disabled={plan.buttonDisabled}
              >
                {plan.buttonText}
              </Button>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

