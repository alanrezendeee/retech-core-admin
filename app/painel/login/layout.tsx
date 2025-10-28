import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Login - Portal do Desenvolvedor | Retech Core API',
  description: 'Faça login no portal do desenvolvedor para gerenciar suas API Keys, visualizar estatísticas de uso e acessar a documentação completa da Retech Core API.',
  openGraph: {
    title: 'Login - Portal do Desenvolvedor | Retech Core API',
    description: 'Acesse sua conta de desenvolvedor na Retech Core API',
  },
};

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

