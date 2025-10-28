import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Buscar CEP por Endereço - Retech Core',
  description: 'Busca reversa de CEP: encontre o CEP a partir do endereço (rua, cidade, estado)',
};

export default function BuscarCEPLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

