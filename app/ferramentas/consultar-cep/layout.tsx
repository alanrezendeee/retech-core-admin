import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Consultar CEP Grátis - Busca Rápida de Endereços',
  description: 'Consulte CEP gratuitamente e descubra endereços completos: logradouro, bairro, cidade, estado e DDD. Ferramenta online, sem cadastro, resposta instantânea.',
  keywords: [
    'consultar cep',
    'consultar cep gratis',
    'buscar cep',
    'buscar endereço por cep',
    'correios cep',
    'cep online',
    'busca cep',
    'consulta cep gratuita',
    'cep gratis',
    'endereço por cep'
  ],
  openGraph: {
    title: 'Consultar CEP Grátis - Busca Instantânea',
    description: 'Descubra endereços completos a partir do CEP. Gratuito, rápido e sem cadastro.',
    type: 'website',
  },
  alternates: {
    canonical: 'https://core.theretech.com.br/ferramentas/consultar-cep',
  },
};

export default function ConsultarCEPLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

