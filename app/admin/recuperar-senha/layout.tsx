import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Recuperar Senha Admin - Retech Core',
  description: 'Recuperação de senha para administradores do sistema Retech Core.',
};

export default function AdminRecuperarSenhaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

