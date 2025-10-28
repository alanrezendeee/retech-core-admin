import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Documentação da API - Portal do Desenvolvedor | Retech Core',
  description: 'Guia completo de integração com exemplos em JavaScript, Python, PHP e cURL. Aprenda a usar a Retech Core API em minutos.',
  alternates: {
    canonical: 'https://core.theretech.com.br/painel/docs',
  },
};

export default function DocsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

