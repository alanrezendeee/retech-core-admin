import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Admin - Retech Core',
  description: 'Painel administrativo Retech Core API',
};

export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

