import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'API de Artigos Penais - Consulta Completa do Código Penal | Retech Core',
  description: 'API de artigos penais brasileiros: 111 artigos de crimes que podem levar à prisão, de 10 legislações (CP, Maria da Penha, Desarmamento, LCP, ECA, CTB, CDC e Leis Especiais). Inclui formas qualificadas e agravadas. Estrutura hierárquica completa. Ideal para autocomplete e sistemas jurídicos. Cache permanente para máxima performance.',
  keywords: [
    'api codigo penal',
    'api artigos penais',
    'api crimes brasileiros',
    'api leis penais',
    'consulta artigo penal',
    'codigo penal api',
    'artigos penais brasil',
    'api juridica',
    'crimes api',
    'lei de contravenções api'
  ],
  openGraph: {
    title: 'API de Artigos Penais - Código Penal Completo',
    description: '111 artigos penais de crimes que podem levar à prisão, de 10 legislações brasileiras (incluindo Lei Maria da Penha e Estatuto do Desarmamento). Inclui formas qualificadas e agravadas. Estrutura hierárquica completa. Ideal para autocomplete e sistemas jurídicos.',
    type: 'website',
    images: [
      {
        url: '/og-api-penal.png',
        width: 1200,
        height: 630,
        alt: 'API de Artigos Penais - Retech Core',
      },
    ],
  },
  alternates: {
    canonical: 'https://core.theretech.com.br/apis/penal',
  },
};

export default function APIPenalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

