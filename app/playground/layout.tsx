import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'API Playground - Teste Sem Cadastro',
  description: 'Teste as APIs brasileiras de CEP, CNPJ e Geografia gratuitamente, direto no navegador. Sem cadastro, sem API key. Veja o código pronto em JavaScript, Python, PHP e cURL.',
  keywords: ['playground api', 'testar api online', 'api cep online', 'testar cnpj', 'sandbox api brasil'],
  openGraph: {
    title: 'API Playground - Teste Gratuitamente',
    description: 'Teste CEP, CNPJ e Geografia sem cadastro. Veja o código pronto e copie para seu projeto.',
  },
  alternates: {
    canonical: 'https://core.theretech.com.br/playground',
  },
};

export default function PlaygroundLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

