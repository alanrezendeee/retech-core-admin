import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Minhas API Keys - Portal do Desenvolvedor | Retech Core',
  description: 'Gerencie suas chaves de API, crie novas, rotacione ou revogue existentes. Controle completo de autenticação.',
};

export default function APIKeysLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

