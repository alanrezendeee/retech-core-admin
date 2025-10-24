import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Validar CNPJ Grátis - Consulta Receita Federal',
  description: 'Valide CNPJ gratuitamente e consulte dados oficiais da Receita Federal: razão social, situação, endereço, sócios e CNAEs. Ferramenta online sem cadastro.',
  keywords: [
    'validar cnpj',
    'consultar cnpj',
    'cnpj receita federal',
    'validar cnpj receita federal',
    'consulta cnpj gratis',
    'verificar cnpj',
    'cnpj online',
    'dados cnpj',
    'situação cadastral cnpj',
    'consultar empresa cnpj'
  ],
  openGraph: {
    title: 'Validar CNPJ Grátis - Receita Federal',
    description: 'Consulte dados oficiais de empresas: razão social, situação, endereço e mais. Gratuito e sem cadastro.',
    type: 'website',
  },
  alternates: {
    canonical: 'https://core.theretech.com.br/ferramentas/validar-cnpj',
  },
};

export default function ValidarCNPJLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

