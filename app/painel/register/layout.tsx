import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Criar Conta Grátis - Retech Core API | 1.000 Requests/Dia',
  description: 'Crie sua conta gratuita na Retech Core API e ganhe 1.000 requests/dia sem cartão de crédito. Acesso imediato a CEP, CNPJ e Geografia do Brasil.',
  openGraph: {
    title: 'Criar Conta Grátis - Retech Core API',
    description: '1.000 requests/dia grátis • Sem cartão de crédito • APIs de CEP, CNPJ e Geografia',
  },
};

export default function RegisterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

