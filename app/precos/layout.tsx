import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Planos e Preços - A partir de R$ 0/mês',
  description: 'Plano Free: R$ 0 com 1.000 requests/dia. Plano Pro: R$ 49. Business: R$ 149. Enterprise: sob consulta. Sem contrato de fidelidade. Cancele quando quiser.',
  keywords: [
    'precos api',
    'planos api',
    'api gratuita',
    'quanto custa api',
    'plano free',
    'api barata'
  ],
  openGraph: {
    title: 'Planos e Preços - Retech Core API',
    description: 'Plano Free: R$ 0 com 1.000 requests/dia | Pro: R$ 49 | Business: R$ 149',
    type: 'website',
  },
  alternates: {
    canonical: 'https://core.theretech.com.br/precos',
  },
};

export default function PrecosLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}





