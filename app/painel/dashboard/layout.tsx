import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Dashboard - Portal do Desenvolvedor | Retech Core API',
  description: 'Acompanhe suas estatísticas de uso, gerencie API Keys e monitore o consumo de requests em tempo real.',
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

