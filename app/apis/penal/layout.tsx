import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'API de Artigos Penais - Consulta Completa do Código Penal | Retech Core',
  description: 'API de artigos penais brasileiros (Código Penal + Lei de Contravenções). Mais de 80 artigos completos com estrutura hierárquica. Ideal para autocomplete e sistemas jurídicos. Cache permanente para máxima performance.',
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
    description: 'Mais de 80 artigos penais brasileiros com estrutura hierárquica. Ideal para autocomplete e sistemas jurídicos.',
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

